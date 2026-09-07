from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app.models.models import Flashcard, Vocabulary, Kanji, Grammar, User, UserProgress
from app.schemas.schemas import SRSReviewRequest
from app.services.auth_service import get_current_user
from app.services.srs_engine import calculate_sm2

router = APIRouter(prefix="/flashcards", tags=["flashcards"])

@router.get("/due")
def get_due_flashcards(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cards = db.query(Flashcard).filter(
        Flashcard.user_id == current_user.id,
        Flashcard.next_review_date <= datetime.utcnow()
    ).all()

    # If user has fewer than 5 due cards, auto-populate new cards from Vocab/Kanji
    if len(cards) < 5:
        existing_vocab_ids = [c.item_id for c in db.query(Flashcard).filter(Flashcard.user_id == current_user.id, Flashcard.item_type == "vocab").all()]
        new_vocabs = db.query(Vocabulary).filter(~Vocabulary.id.in_(existing_vocab_ids)).limit(5 - len(cards)).all()
        
        for v in new_vocabs:
            fc = Flashcard(user_id=current_user.id, item_type="vocab", item_id=v.id)
            db.add(fc)
        db.commit()
        
        cards = db.query(Flashcard).filter(
            Flashcard.user_id == current_user.id,
            Flashcard.next_review_date <= datetime.utcnow()
        ).all()

    # Enrich cards with item details
    results = []
    for c in cards:
        item_details = None
        if c.item_type == "vocab":
            v = db.query(Vocabulary).filter(Vocabulary.id == c.item_id).first()
            if v:
                item_details = {
                    "word": v.word, "kanji": v.kanji, "hiragana": v.hiragana,
                    "romaji": v.romaji, "meaning": v.meaning, "example": v.example_sentence,
                    "translation": v.example_translation
                }
        elif c.item_type == "kanji":
            k = db.query(Kanji).filter(Kanji.id == c.item_id).first()
            if k:
                item_details = {
                    "word": k.kanji, "meaning": k.meaning, "onyomi": k.onyomi,
                    "kunyomi": k.kunyomi, "mnemonic": k.mnemonic
                }
        
        if item_details:
            results.append({
                "flashcard_id": c.id,
                "item_type": c.item_type,
                "item_id": c.item_id,
                "repetition": c.repetition,
                "interval": c.interval,
                "ease_factor": c.ease_factor,
                "details": item_details
            })
    return results

@router.post("/review")
def review_flashcard(
    req: SRSReviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(
        Flashcard.user_id == current_user.id,
        Flashcard.item_type == req.item_type,
        Flashcard.item_id == req.item_id
    ).first()

    if not card:
        card = Flashcard(user_id=current_user.id, item_type=req.item_type, item_id=req.item_id)
        db.add(card)

    sm2 = calculate_sm2(req.quality, card.repetition, card.interval, card.ease_factor)
    
    card.repetition = sm2["repetition"]
    card.interval = sm2["interval"]
    card.ease_factor = sm2["ease_factor"]
    card.next_review_date = sm2["next_review_date"]
    card.last_reviewed = datetime.utcnow()
    card.state = "review" if sm2["repetition"] > 0 else "learning"

    # Reward XP for review
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    earned_xp = 15 if req.quality >= 3 else 5
    if progress:
        progress.xp += earned_xp
        # Level up every 100 XP
        progress.level = max(1, (progress.xp // 100) + 1)
        
    db.commit()

    return {
        "status": "success",
        "earned_xp": earned_xp,
        "next_review_days": sm2["interval"],
        "repetition": card.repetition
    }
