import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import ListeningExercise
from app.services.audio_service import get_audio_info

router = APIRouter(prefix="/listening", tags=["listening"])

@router.get("/list")
def get_listening_exercises(jlpt_level: Optional[str] = None, db: Session = Depends(get_db)):
    exercises = [
        {
            "id": 1,
            "title": "Daily Station Dialogue",
            "jlpt_level": "N5",
            "audio_text": "すみません、東京駅行きの電車はどのホームですか。３番ホームですよ。ありがとうございます。",
            "transcript": "A: すみません、東京駅行きの電車はどのホームですか。\nB: ３番ホームですよ。\nA: ありがとうございます。",
            "translation": "A: Excuse me, which platform is the train for Tokyo Station?\nB: Platform 3.\nA: Thank you very much.",
            "question": "東京駅行きの電車は何番ホームですか。",
            "options": ["１番ホーム", "２番ホーム", "３番ホーム", "４番ホーム"],
            "correct_option": 2
        },
        {
            "id": 2,
            "title": "Shopping at a Convenience Store",
            "jlpt_level": "N5",
            "audio_text": "いらっしゃいませ。お弁当とお茶ですね。温めますか。はい、お願いします。",
            "transcript": "A: いらっしゃいませ。お弁当とお茶ですね。温めますか。\nB: はい、お願いします。",
            "translation": "A: Welcome! A bento and green tea. Shall I heat it up?\nB: Yes, please.",
            "question": "店員は何を尋ねましたか。",
            "options": ["お箸の数", "袋の有無", "お弁当の温め", "値段の支払い"],
            "correct_option": 2
        }
    ]
    return exercises
