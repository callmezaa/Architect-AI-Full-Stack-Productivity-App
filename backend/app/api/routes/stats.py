from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Task, User
from app.api.routes.auth import get_current_user
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/productivity")
async def get_productivity_stats(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Calculate basic productivity stats for the current user."""
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).all()
    total = len(tasks)
    completed = len([t for t in tasks if t.is_completed])
    
    score = round((completed / total * 100)) if total > 0 else 0
    
    return {
        "score": score,
        "completed": completed,
        "total": total,
        "saved_hours": round(completed * 1.5, 1) # Mock logic: 1.5h saved per task
    }

@router.get("/activity")
async def get_activity_stats(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Return activity trend data (last 7 days)."""
    # Simple mock for activity trend since we don't have a complex event log yet
    return {
        "trend": [30, 45, 35, 70, 50, 85, 75], # Matches the Home Page chart default
        "days": ["M", "T", "W", "T", "F", "S", "S"]
    }
