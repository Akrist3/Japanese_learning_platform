from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Kana
from app.schemas.schemas import KanaResponse

router = APIRouter(prefix="/kana", tags=["kana"])

@router.get("/list", response_model=List[KanaResponse])
def get_kana_list(
    type: Optional[str] = Query(None, description="hiragana or katakana"),
    category: Optional[str] = Query(None, description="base, dakuten, handakuten, combination"),
    db: Session = Depends(get_db)
):
    query = db.query(Kana)
    if type:
        query = query.filter(Kana.type == type)
    if category:
        query = query.filter(Kana.category == category)
    return query.all()
