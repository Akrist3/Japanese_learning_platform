from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Vocabulary, Kanji

router = APIRouter(prefix="/dictionary", tags=["dictionary"])

@router.get("/search")
def search_dictionary(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    s = f"%{q}%"
    
    vocabs = db.query(Vocabulary).filter(
        (Vocabulary.word.like(s)) |
        (Vocabulary.hiragana.like(s)) |
        (Vocabulary.romaji.like(s)) |
        (Vocabulary.meaning.like(s))
    ).limit(20).all()

    kanjis = db.query(Kanji).filter(
        (Kanji.kanji.like(s)) |
        (Kanji.meaning.like(s)) |
        (Kanji.onyomi.like(s)) |
        (Kanji.kunyomi.like(s))
    ).limit(10).all()

    return {
        "query": q,
        "vocabulary_count": len(vocabs),
        "kanji_count": len(kanjis),
        "vocabulary_results": vocabs,
        "kanji_results": kanjis
    }
