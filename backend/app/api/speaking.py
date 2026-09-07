from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/speaking", tags=["speaking"])

class SpeakingEvaluationRequest(BaseModel):
    target_sentence: str
    user_transcript: str

@router.get("/prompts")
def get_speaking_prompts():
    return [
        {"id": 1, "prompt": "自己紹介をしてください。", "target_japanese": "はじめまして、私の名前はアクリストです。よろしくお願いします。", "english": "Nice to meet you, my name is Akrist. Pleased to meet you."},
        {"id": 2, "prompt": "注文する", "target_japanese": "すみません、水を二つください。", "english": "Excuse me, two waters please."},
        {"id": 3, "prompt": "道を聞く", "target_japanese": "駅はどこにありますか。", "english": "Where is the station?"}
    ]

@router.post("/evaluate")
def evaluate_speaking(req: SpeakingEvaluationRequest):
    target_clean = req.target_sentence.replace(" ", "").replace("、", "").replace("。", "")
    user_clean = req.user_transcript.replace(" ", "").replace("、", "").replace("。", "")

    if not user_clean:
        return {"accuracy_score": 0, "feedback": "No speech detected. Please try again into the microphone."}

    # Match character overlap
    matched_chars = sum(1 for c in user_clean if c in target_clean)
    score = min(100, int((matched_chars / max(1, len(target_clean))) * 100))

    feedback = "Excellent pronunciation!" if score >= 80 else "Good attempt! Keep practicing your pitch and rhythm."

    return {
        "target": req.target_sentence,
        "recognized": req.user_transcript,
        "accuracy_score": score,
        "feedback": feedback
    }
