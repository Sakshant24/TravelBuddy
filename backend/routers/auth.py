"""
TravelBuddy — Authentication Router (/auth)

Handles:
- POST /auth/register (Email & Password Sign Up)
- POST /auth/login    (Email & Password Sign In)
- POST /auth/google   (Google OAuth sign-in & JWT token issuance)
- POST /auth/refresh  (Access token refresh via valid refresh token)
- POST /auth/logout   (Refresh token revocation)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from sqlalchemy import func

from auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
    verify_google_token,
    verify_refresh_token,
    revoke_refresh_token,
)
from dependencies import get_db
from models import (
    GoogleAuthRequest,
    RefreshTokenRequest,
    TokenResponse,
    User,
    UserOut,
    UserRegisterRequest,
    UserLoginRequest,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new user using email & password.
    Hashes password using bcrypt and stores user in PostgreSQL.
    Returns JWT access token + refresh token.
    """
    email_clean = payload.email.strip().lower()
    
    # Check if user already exists (case-insensitive lookup)
    user = db.query(User).filter(func.lower(User.email) == email_clean).first()
    if user:
        if user.password_hash:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists. Please log in.",
            )
        # If user signed in via Google earlier but didn't have password, set password
        user.password_hash = hash_password(payload.password)
        if payload.name and not user.name:
            user.name = payload.name
        db.commit()
        db.refresh(user)
    else:
        # Create new user
        name = payload.name or email_clean.split("@")[0]
        avatar = f"https://api.dicebear.com/7.x/avataaars/svg?seed={email_clean}"
        user = User(
            email=email_clean,
            name=name,
            picture_url=avatar,
            password_hash=hash_password(payload.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Issue JWT tokens
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token(db, user_id=str(user.id))

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates user using email & password.
    Verifies bcrypt password hash stored in PostgreSQL.
    Returns JWT access token + refresh token.
    """
    email_clean = payload.email.strip().lower()
    
    user = db.query(User).filter(func.lower(User.email) == email_clean, User.is_active == True).first()
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Issue JWT tokens
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token(db, user_id=str(user.id))

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/google", response_model=TokenResponse)
async def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticates user with Google OAuth token, creates or updates the user record,
    and returns JWT access token + refresh token.
    """
    if not payload.google_access_token and not payload.google_id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="google_access_token or google_id_token must be provided",
        )

    try:
        google_user = await verify_google_token(
            access_token=payload.google_access_token,
            id_token=payload.google_id_token,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

    email = google_user["email"].strip().lower()
    sub = google_user.get("sub")
    name = google_user.get("name")
    picture = google_user.get("picture")

    # Find or create User in DB
    user = db.query(User).filter(func.lower(User.email) == email).first()
    if not user:
        user = User(
            email=email,
            name=name,
            picture_url=picture,
            google_id=sub,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update profile fields if changed
        updated = False
        if sub and not user.google_id:
            user.google_id = sub
            updated = True
        if name and user.name != name:
            user.name = name
            updated = True
        if picture and user.picture_url != picture:
            user.picture_url = picture
            updated = True
        
        if updated:
            db.commit()
            db.refresh(user)

    # Issue access and refresh tokens
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token(db, user_id=str(user.id))

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token_endpoint(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Exchanges a valid refresh token for a fresh access token.
    """
    db_refresh_token = verify_refresh_token(db, payload.refresh_token)
    if not db_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user = db.query(User).filter(User.id == db_refresh_token.user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with token not found",
        )

    # Issue new access token
    new_access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=payload.refresh_token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/logout")
def logout_endpoint(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Revokes the provided refresh token.
    """
    success = revoke_refresh_token(db, payload.refresh_token)
    return {"message": "Successfully logged out", "success": success}
