from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import UserMistake, User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/mistakes", tags=["mistakes"])

@router.get("/my")
def get_user_mistakes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(UserMistake).filter(UserMistake.user_id == current_user.id).order_by(UserMistake.created_at.desc()).all()

@router.post("/review/{mistake_id}")
def mark_mistake_reviewed(mistake_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mistake = db.query(UserMistake).filter(UserMistake.id == mistake_id, UserMistake.user_id == current_user.id).first()
    if not mistake:
        raise HTTPException(status_code=404, detail="Mistake log not found")
    mistake.reviewed = True
    db.commit()
    return {"status": "success", "reviewed": True}
