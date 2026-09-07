from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.services.auth_service import get_current_user
from app.services.adaptive_engine import calculate_user_mastery

router = APIRouter(prefix="/jlpt", tags=["jlpt"])

@router.get("/mastery")
def get_jlpt_mastery(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return calculate_user_mastery(db, current_user.id)

@router.get("/study-plan")
def get_study_plan(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    target = current_user.target_jlpt or "N3"
    exam_date = current_user.target_exam_date or "2026-12-06"
    daily_min = current_user.daily_goal_minutes or 20

    plan = [
        {"week": 1, "topic": "Basics & Hiragana / Katakana Refresher", "focus": "Kana & Sound Rules", "daily_minutes": daily_min},
        {"week": 2, "topic": f"{target} Core Vocabulary (First 50 Words)", "focus": "Vocab & Audio Pronunciation", "daily_minutes": daily_min},
        {"week": 3, "topic": f"{target} Kanji & Radical Mnemonics", "focus": "Kanji Stroke Practice", "daily_minutes": daily_min},
        {"week": 4, "topic": f"{target} Essential Grammar & Particles", "focus": "Particle Comparison (は vs が)", "daily_minutes": daily_min},
        {"week": 5, "topic": "Verb Conjugation Mastery Trainer", "focus": "て-form, Passive, Potential", "daily_minutes": daily_min},
        {"week": 6, "topic": "Reading Passages & Vocabulary Lookup", "focus": "Furigana Toggle Reading", "daily_minutes": daily_min},
        {"week": 7, "topic": "Listening Comprehension & Dictation", "focus": "Audio Speed Practice", "daily_minutes": daily_min},
        {"week": 8, "topic": "Full JLPT Mock Exam & Weakness Revision", "focus": "Timed Diagnostic Test", "daily_minutes": daily_min + 15}
    ]
    return {
        "target_level": target,
        "target_exam_date": exam_date,
        "daily_goal_minutes": daily_min,
        "weekly_schedule": plan
    }
