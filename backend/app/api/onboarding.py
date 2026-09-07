from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import OnboardingUpdate, UserResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

@router.post("/submit", response_model=UserResponse)
def submit_onboarding(data: OnboardingUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.current_jlpt = data.current_jlpt
    current_user.target_jlpt = data.target_jlpt
    current_user.target_exam_date = data.target_exam_date
    current_user.daily_goal_minutes = data.daily_goal_minutes
    current_user.preferred_style = data.preferred_style
    
    db.commit()
    db.refresh(current_user)
    return current_user
