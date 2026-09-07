from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, UserProgress, UserSettings, Achievement, UserAchievement
from app.schemas.schemas import UserResponse, ProgressResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/progress", response_model=ProgressResponse)
def get_user_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress

@router.put("/romaji-mode")
def update_romaji_mode(mode: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if mode not in ["full", "intermediate", "off"]:
        raise HTTPException(status_code=400, detail="Invalid romaji mode")
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    if progress:
        progress.romaji_mode = mode
        db.commit()
    return {"status": "success", "romaji_mode": mode}

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    results = db.query(User.username, User.avatar_url, UserProgress.level, UserProgress.xp, UserProgress.streak_count)\
        .join(UserProgress, User.id == UserProgress.user_id)\
        .order_by(UserProgress.xp.desc())\
        .limit(50)\
        .all()
    
    leaderboard = [
        {
            "rank": idx + 1,
            "username": r[0],
            "avatar_url": r[1],
            "level": r[2],
            "xp": r[3],
            "streak": r[4]
        }
        for idx, r in enumerate(results)
    ]
    return leaderboard
