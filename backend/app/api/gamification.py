from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List
from app.database import get_db
from app.models.models import User, UserProgress, Achievement, UserAchievement
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/gamification", tags=["gamification"])

@router.post("/earn-xp")
def add_user_xp(xp_amount: int, action: str = "lesson", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)

    old_level = progress.level
    progress.xp += xp_amount
    new_level = max(1, (progress.xp // 100) + 1)
    progress.level = new_level

    # Update streak
    today_str = date.today().isoformat()
    if progress.last_active_date != today_str:
        progress.streak_count += 1
        progress.last_active_date = today_str

    db.commit()

    return {
        "user_id": current_user.id,
        "xp_gained": xp_amount,
        "total_xp": progress.xp,
        "level": new_level,
        "leveled_up": new_level > old_level,
        "streak_count": progress.streak_count
    }

@router.get("/achievements")
def get_user_achievements(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    all_achievements = db.query(Achievement).all()
    unlocked_ids = [ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()]

    result = []
    for ach in all_achievements:
        result.append({
            "id": ach.id,
            "code": ach.code,
            "title": ach.title,
            "description": ach.description,
            "icon": ach.icon,
            "xp_reward": ach.xp_reward,
            "unlocked": ach.id in unlocked_ids
        })
    return result

@router.get("/daily-quests")
def get_daily_quests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Standard 5 daily missions generator
    quests = [
        {"id": 1, "title": "Learn 10 Vocabulary Words", "target": 10, "current": 7, "reward_xp": 50, "completed": False},
        {"id": 2, "title": "Review 20 Flashcards", "target": 20, "current": 20, "reward_xp": 50, "completed": True},
        {"id": 3, "title": "Complete 1 Grammar Lesson", "target": 1, "current": 1, "reward_xp": 40, "completed": True},
        {"id": 4, "title": "Practice 5 Kanji", "target": 5, "current": 3, "reward_xp": 30, "completed": False},
        {"id": 5, "title": "Complete 1 Listening Exercise", "target": 1, "current": 0, "reward_xp": 30, "completed": False}
    ]
    return {
        "date": date.today().isoformat(),
        "quests": quests,
        "total_reward_bonus": 100
    }
