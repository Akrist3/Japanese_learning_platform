from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Vocabulary
from app.schemas.schemas import VocabularyResponse

router = APIRouter(prefix="/vocabulary", tags=["vocabulary"])

@router.get("/list", response_model=List[VocabularyResponse])
def get_vocabulary(
    jlpt_level: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Vocabulary)
    if jlpt_level:
        query = query.filter(Vocabulary.jlpt_level == jlpt_level)
    if category:
        query = query.filter(Vocabulary.category == category)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Vocabulary.word.like(s)) | 
            (Vocabulary.hiragana.like(s)) | 
            (Vocabulary.romaji.like(s)) | 
            (Vocabulary.meaning.like(s))
        )
    return query.all()
