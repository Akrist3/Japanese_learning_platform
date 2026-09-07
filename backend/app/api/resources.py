from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Resource

router = APIRouter(prefix="/resources", tags=["resources"])

@router.get("/list")
def get_open_resources(db: Session = Depends(get_db)):
    return db.query(Resource).all()
