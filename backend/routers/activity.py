from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(
    prefix="/activity",
    tags=["Activity Logs"]
)

@router.get("/", response_model=List[schemas.ActivityLogResponse])
def get_activity_logs(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(auth.get_current_admin_user)
):
    """
    Retrieve activity logs. Only accessible by admins.
    """
    logs = db.query(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).offset(skip).limit(limit).all()
    return logs

@router.get("/me", response_model=List[schemas.ActivityLogResponse])
def get_my_activity_logs(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    Retrieve activity logs for the current user.
    """
    logs = db.query(models.ActivityLog).filter(models.ActivityLog.user_id == current_user.id).order_by(models.ActivityLog.timestamp.desc()).offset(skip).limit(limit).all()
    return logs
