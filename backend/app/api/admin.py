from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Vocabulary, Kanji, Grammar, Verb, Resource
from app.services.auth_service import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats")
def get_admin_dashboard_stats(admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count(),
        "total_vocabulary": db.query(Vocabulary).count(),
        "total_kanji": db.query(Kanji).count(),
        "total_grammar": db.query(Grammar).count(),
        "total_verbs": db.query(Verb).count(),
        "total_resources": db.query(Resource).count()
    }

@router.post("/vocabulary")
def add_vocabulary_item(data: dict, admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    vocab = Vocabulary(**data)
    db.add(vocab)
    db.commit()
    db.refresh(vocab)
    return vocab

@router.delete("/vocabulary/{vocab_id}")
def delete_vocabulary_item(vocab_id: int, admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    vocab = db.query(Vocabulary).filter(Vocabulary.id == vocab_id).first()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary item not found")
    db.delete(vocab)
    db.commit()
    return {"status": "success", "deleted_id": vocab_id}

@router.post("/kanji")
def add_kanji_item(data: dict, admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    kanji = Kanji(**data)
    db.add(kanji)
    db.commit()
    db.refresh(kanji)
    return kanji

@router.delete("/kanji/{kanji_id}")
def delete_kanji_item(kanji_id: int, admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    kanji = db.query(Kanji).filter(Kanji.id == kanji_id).first()
    if not kanji:
        raise HTTPException(status_code=404, detail="Kanji item not found")
    db.delete(kanji)
    db.commit()
    return {"status": "success", "deleted_id": kanji_id}
