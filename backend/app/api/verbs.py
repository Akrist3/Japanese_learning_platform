from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Verb, UserMistake
from app.schemas.schemas import VerbResponse, ConjugationRequest
from app.services.verb_engine import conjugate_verb, check_conjugation
from app.services.auth_service import get_current_user, User

router = APIRouter(prefix="/verbs", tags=["verbs"])

@router.get("/list", response_model=List[VerbResponse])
def get_verb_list(
    jlpt_level: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Verb)
    if jlpt_level:
        query = query.filter(Verb.jlpt_level == jlpt_level)
    return query.all()

@router.get("/conjugate/{verb_id}")
def get_verb_conjugations(verb_id: int, db: Session = Depends(get_db)):
    verb = db.query(Verb).filter(Verb.id == verb_id).first()
    if not verb:
        raise HTTPException(status_code=404, detail="Verb not found")
    forms = conjugate_verb(verb.dictionary_form, verb.verb_group)
    return {
        "verb": verb,
        "conjugations": forms
    }

@router.post("/practice/check")
def verify_user_conjugation(
    req: ConjugationRequest, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verb = db.query(Verb).filter(Verb.dictionary_form == req.dictionary_form).first()
    verb_group = verb.verb_group if verb else "godan"
    
    result = check_conjugation(req.dictionary_form, verb_group, req.target_form, req.user_answer)
    
    # Auto-log mistake if incorrect
    if not result["correct"]:
        mistake = UserMistake(
            user_id=current_user.id,
            topic="Verb Conjugation",
            question_text=f"Conjugate '{req.dictionary_form}' into {req.target_form} form",
            user_answer=req.user_answer,
            correct_answer=result["expected"],
            explanation=f"Target form '{req.target_form}' for {verb_group} verb should be '{result['expected']}'."
        )
        db.add(mistake)
        db.commit()

    return result
