from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Grammar
from app.schemas.schemas import GrammarResponse

router = APIRouter(prefix="/grammar", tags=["grammar"])

@router.get("/list", response_model=List[GrammarResponse])
def get_grammar_list(
    jlpt_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Grammar)
    if jlpt_level:
        query = query.filter(Grammar.jlpt_level == jlpt_level)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Grammar.point.like(s)) |
            (Grammar.meaning.like(s)) |
            (Grammar.explanation.like(s))
        )
    return query.all()
