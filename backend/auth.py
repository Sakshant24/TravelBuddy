"""
TravelBuddy — Authentication & JWT Module

Handles:
1. Google OAuth token verification (server-side verification with Google servers)
2. JWT Access Token creation & verification
3. Database-backed Refresh Token management (creation, verification, revocation)
"""

import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

import httpx
from jose import JWTError, jwt
from sqlalchemy.orm import Session

import bcrypt

from models import RefreshToken, User

# Secrets and JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "travelbuddy_secret_jwt_key_super_secure_change_in_prod_2026")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


def hash_password(password: str) -> str:
    """Hashes plain text password using bcrypt with 72-byte truncation safety."""
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain text password against bcrypt hash."""
    if not hashed_password:
        return False
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False


async def verify_google_token(access_token: Optional[str] = None, id_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Verifies a Google OAuth token directly with Google's API endpoints.
    Accepts either access_token or id_token.
    Returns user info dict: {"email": ..., "sub": ..., "name": ..., "picture": ...}
    Raises ValueError if verification fails.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            if access_token:
                # Verify access_token against userinfo endpoint
                resp = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                if resp.status_code == 200:
                    data = resp.json()
                    if "email" in data:
                        return {
                            "email": data["email"],
                            "sub": data.get("sub"),
                            "name": data.get("name"),
                            "picture": data.get("picture"),
                        }
            
            if id_token:
                # Verify id_token against tokeninfo endpoint
                resp = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
                if resp.status_code == 200:
                    data = resp.json()
                    if "email" in data:
                        return {
                            "email": data["email"],
                            "sub": data.get("sub"),
                            "name": data.get("name"),
                            "picture": data.get("picture"),
                        }
    except httpx.HTTPError as err:
        print(f"[AUTH ERROR] Failed to connect to Google OAuth servers: {err}")
        raise ValueError(f"Google token verification network error: {err}")

    raise ValueError("Invalid Google authentication token")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a short-lived JWT access token containing the specified claims.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token(db: Session, user_id: str) -> str:
    """
    Generates a secure random refresh token, stores it in the database, and returns it.
    """
    token_str = secrets.token_urlsafe(64)
    expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    db_refresh_token = RefreshToken(
        user_id=user_id,
        token=token_str,
        expires_at=expires_at,
        is_revoked=False
    )
    db.add(db_refresh_token)
    db.commit()
    db.refresh(db_refresh_token)
    return token_str


def verify_refresh_token(db: Session, token_str: str) -> Optional[RefreshToken]:
    """
    Looks up a refresh token in the DB, verifying it is active, non-revoked, and non-expired.
    """
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == token_str,
        RefreshToken.is_revoked == False
    ).first()

    if not db_token:
        return None

    # Check expiry
    if db_token.expires_at.tzinfo is None:
        token_exp = db_token.expires_at.replace(tzinfo=timezone.utc)
    else:
        token_exp = db_token.expires_at

    if datetime.now(timezone.utc) > token_exp:
        # Mark expired token as revoked
        db_token.is_revoked = True
        db.commit()
        return None

    return db_token


def revoke_refresh_token(db: Session, token_str: str) -> bool:
    """
    Revokes a refresh token in the DB.
    """
    db_token = db.query(RefreshToken).filter(RefreshToken.token == token_str).first()
    if db_token:
        db_token.is_revoked = True
        db.commit()
        return True
    return False
