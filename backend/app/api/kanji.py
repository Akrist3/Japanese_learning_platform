from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Kanji
from app.schemas.schemas import KanjiResponse

router = APIRouter(prefix="/kanji", tags=["kanji"])

@router.get("/list", response_model=List[KanjiResponse])
def get_kanji_list(
    jlpt_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Kanji)
    if jlpt_level:
        query = query.filter(Kanji.jlpt_level == jlpt_level)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Kanji.kanji.like(s)) |
            (Kanji.meaning.like(s)) |
            (Kanji.onyomi.like(s)) |
            (Kanji.kunyomi.like(s))
        )
    return query.all()
