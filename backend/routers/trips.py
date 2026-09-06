"""
TravelBuddy — Trips Router (/trips & /api/v1/generate-trip)

Handles:
- POST /api/v1/generate-trip  (AI trip generation via LangGraph workflow)
- POST /trips                 (Save trip — protected by JWT, assigned to authenticated user)
- GET /trips                  (List current user's trips — protected by JWT)
- GET /trips/{trip_id}        (Get trip details — protected, owner or public check)
- DELETE /trips/{trip_id}     (Soft delete trip — protected, requires ownership)
"""

import time
import uuid as _uuid
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import User, Trip, ApiLog, TripPayload, GenerateTripRequest
from auth import verify_google_token

router = APIRouter(tags=["Trips"])


@router.post("/trips")
def save_trip(
    payload: TripPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Saves or updates a trip for the authenticated user.
    """
    sel = payload.userSelection or {}
    dest_raw = sel.get("destination", {})
    destination = dest_raw.get("label", str(dest_raw)) if isinstance(dest_raw, dict) else str(dest_raw)
    no_of_days = int(sel.get("noOfDays", 1))
    traveler = sel.get("traveler", "")
    budget = sel.get("budget", "")

    # Check if existing trip id provided (if UUID)
    trip = None
    if payload.id:
        try:
            uid = _uuid.UUID(payload.id)
            trip = db.query(Trip).filter(Trip.id == uid, Trip.user_id == current_user.id).first()
        except ValueError:
            pass

    if trip:
        trip.destination = destination
        trip.no_of_days = no_of_days
        trip.traveler = traveler
        trip.budget = budget
        trip.user_selection = payload.userSelection
        trip.trip_data = payload.tripData
    else:
        trip = Trip(
            user_id=current_user.id,
            destination=destination,
            no_of_days=no_of_days,
            traveler=traveler,
            budget=budget,
            user_selection=payload.userSelection,
            trip_data=payload.tripData,
        )
        db.add(trip)

    db.commit()
    db.refresh(trip)
    print(f"[DB] Trip saved for user {current_user.email} with UUID: {trip.id}")
    return {
        "id": str(trip.id),
        "userEmail": current_user.email,
        "userSelection": trip.user_selection,
        "tripData": trip.trip_data,
        "success": True
    }


@router.get("/trips")
def get_user_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns all non-deleted trips created by the currently authenticated user.
    """
    trips = (
        db.query(Trip)
        .filter(Trip.user_id == current_user.id, Trip.is_deleted == False)
        .order_by(Trip.created_at.desc())
        .all()
    )
    return [
        {
            "id": str(t.id),
            "userEmail": current_user.email,
            "userSelection": t.user_selection,
            "tripData": t.trip_data,
        }
        for t in trips
    ]


@router.get("/trips/{trip_id}")
def get_single_trip(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves a single trip. Checks ownership.
    """
    try:
        uid = _uuid.UUID(trip_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid trip ID format")

    trip = db.query(Trip).filter(Trip.id == uid, Trip.is_deleted == False).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Verify ownership (or public access if public)
    if trip.user_id != current_user.id and not trip.is_public:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to view this trip"
        )

    owner = db.query(User).filter(User.id == trip.user_id).first()
    return {
        "id": str(trip.id),
        "userEmail": owner.email if owner else current_user.email,
        "userSelection": trip.user_selection,
        "tripData": trip.trip_data,
    }


@router.delete("/trips/{trip_id}")
def delete_trip(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Soft-deletes a trip. Requires authenticated user to be the owner of the trip.
    """
    try:
        uid = _uuid.UUID(trip_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid trip ID format")

    trip = db.query(Trip).filter(Trip.id == uid, Trip.is_deleted == False).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Critical Security Check: User must own the trip
    if trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own trips"
        )

    trip.is_deleted = True
    db.commit()
    print(f"[DB] Trip soft-deleted by owner {current_user.email}: {trip_id}")
    return {"success": True, "id": trip_id}