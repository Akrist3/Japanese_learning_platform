from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db

router = APIRouter(prefix="/reading", tags=["reading"])

@router.get("/list")
def get_reading_passages(jlpt_level: Optional[str] = None, db: Session = Depends(get_db)):
    passages = [
        {
            "id": 1,
            "title": "わたしの日常 (My Daily Routine)",
            "jlpt_level": "N5",
            "passage_japanese": "わたしは毎朝６時に起きます。朝ご飯にパンと卵を食べます。７時半に家を出て、電車で大学へ行きます。大学で日本語と歴史を勉強します。図書館で本を読むのが好きです。",
            "passage_translation": "I wake up at 6 AM every morning. I eat bread and eggs for breakfast. I leave home at 7:30 and go to university by train. At university, I study Japanese and history. I like reading books at the library.",
            "vocab_highlights": [
                {"word": "毎朝", "reading": "まいあさ", "meaning": "every morning"},
                {"word": "歴史", "reading": "れきし", "meaning": "history"}
            ],
            "questions": [
                {
                    "question": "この人は朝ご飯に何を食べますか。",
                    "options": ["ご飯と魚", "パンと卵", "ラーメン", "果物"],
                    "correct_option": 1
                },
                {
                    "question": "どうやって大学へ行きますか。",
                    "options": ["バスで", "歩いて", "電車で", "車で"],
                    "correct_option": 2
                }
            ]
        },
        {
            "id": 2,
            "title": "日本の四季 (Japan's Four Seasons)",
            "jlpt_level": "N4",
            "passage_japanese": "日本には春、夏、秋、冬の四季があります。春には桜が咲き、たくさんの人が花見を楽しみに公園へ行きます。夏は蒸し暑いですが、各地で祭りや花火大会が開かれます。",
            "passage_translation": "Japan has four distinct seasons: spring, summer, autumn, and winter. In spring, cherry blossoms bloom, and many people go to parks to enjoy hanami (flower viewing). Summer is humid, but festivals and fireworks displays are held nationwide.",
            "vocab_highlights": [
                {"word": "四季", "reading": "しき", "meaning": "four seasons"},
                {"word": "桜", "reading": "さくら", "meaning": "cherry blossom"},
                {"word": "蒸し暑い", "reading": "むしあつい", "meaning": "hot and humid"}
            ],
            "questions": [
                {
                    "question": "春の人々は何を楽しみますか。",
                    "options": ["スキー", "花見", "水泳", "紅葉"],
                    "correct_option": 1
                }
            ]
        }
    ]
    return passages
