from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.models.models import ListeningAttempt, UserProgress
from app.services.auth_service import get_current_user
from app.database import get_db

from datetime import datetime
router = APIRouter(prefix="/listening", tags=["listening"])


# ============================================================
# N5 LISTENING QUESTION BANK
# ============================================================

LISTENING_EXERCISES = [

    {
        "id": 1,
        "title": "At the Train Station",
        "jlpt_level": "N5",
        "topic": "Transportation",

        "audio_text":
            "すみません、東京駅行きの電車は何番ホームですか。"
            "三番ホームですよ。ありがとうございます。",

        "transcript":
            "A: すみません、東京駅行きの電車は何番ホームですか。\n"
            "B: 三番ホームですよ。\n"
            "A: ありがとうございます。",

        "translation":
            "A: Excuse me, which platform is the train for Tokyo Station?\n"
            "B: Platform 3.\n"
            "A: Thank you very much.",

        "question": "東京駅行きの電車は何番ホームですか。",

        "options": [
            "一番ホーム",
            "二番ホーム",
            "三番ホーム",
            "四番ホーム"
        ],

        "correct_option": 2,

        "dictation_answer":
            "三番ホームですよ。",

        "hint":
            "Listen carefully for the platform number."
    },

    {
        "id": 2,
        "title": "Convenience Store",
        "jlpt_level": "N5",
        "topic": "Shopping",

        "audio_text":
            "いらっしゃいませ。お弁当とお茶ですね。"
            "お弁当を温めますか。はい、お願いします。",

        "transcript":
            "A: いらっしゃいませ。お弁当とお茶ですね。\n"
            "A: お弁当を温めますか。\n"
            "B: はい、お願いします。",

        "translation":
            "A: Welcome. A bento and tea, right?\n"
            "A: Shall I heat the bento?\n"
            "B: Yes, please.",

        "question": "店員は何をすると言いましたか。",

        "options": [
            "お茶を冷やす",
            "お弁当を温める",
            "袋を大きくする",
            "お金を返す"
        ],

        "correct_option": 1,

        "dictation_answer":
            "お弁当を温めますか。",

        "hint":
            "Listen for what the store employee asks about the bento."
    },

    {
        "id": 3,
        "title": "Morning Plans",
        "jlpt_level": "N5",
        "topic": "Daily Life",

        "audio_text":
            "明日は何時に起きますか。"
            "七時に起きます。それから、八時に学校へ行きます。",

        "transcript":
            "A: 明日は何時に起きますか。\n"
            "B: 七時に起きます。\n"
            "B: それから、八時に学校へ行きます。",

        "translation":
            "A: What time will you wake up tomorrow?\n"
            "B: I will wake up at 7.\n"
            "B: Then, I will go to school at 8.",

        "question": "明日は何時に起きますか。",

        "options": [
            "六時",
            "七時",
            "八時",
            "九時"
        ],

        "correct_option": 1,

        "dictation_answer":
            "七時に起きます。",

        "hint":
            "The wake-up time comes before the school time."
    },

    {
        "id": 4,
        "title": "Weather and Umbrella",
        "jlpt_level": "N5",
        "topic": "Weather",

        "audio_text":
            "今日は雨が降りますか。"
            "午後から雨が降るそうですよ。"
            "じゃあ、傘を持っていきます。",

        "transcript":
            "A: 今日は雨が降りますか。\n"
            "B: 午後から雨が降るそうですよ。\n"
            "A: じゃあ、傘を持っていきます。",

        "translation":
            "A: Will it rain today?\n"
            "B: I hear it will rain from the afternoon.\n"
            "A: Then I will take an umbrella.",

        "question": "雨はいつから降るそうですか。",

        "options": [
            "朝から",
            "昼から",
            "午後から",
            "夜から"
        ],

        "correct_option": 2,

        "dictation_answer":
            "午後から雨が降るそうですよ。",

        "hint":
            "Listen for the time expression before 雨が降る."
    },

    {
        "id": 5,
        "title": "Ordering Lunch",
        "jlpt_level": "N5",
        "topic": "Food",

        "audio_text":
            "ご注文はお決まりですか。"
            "はい、カレーライスを一つと、水を一つお願いします。",

        "transcript":
            "A: ご注文はお決まりですか。\n"
            "B: はい、カレーライスを一つと、水を一つお願いします。",

        "translation":
            "A: Have you decided on your order?\n"
            "B: Yes, one curry rice and one water, please.",

        "question": "何を注文しましたか。",

        "options": [
            "ラーメンとお茶",
            "カレーライスと水",
            "カレーライスとコーヒー",
            "パンと水"
        ],

        "correct_option": 1,

        "dictation_answer":
            "カレーライスを一つと、水を一つお願いします。",

        "hint":
            "There are two things in the order."
    },

    {
        "id": 6,
        "title": "Finding a Classroom",
        "jlpt_level": "N5",
        "topic": "School",

        "audio_text":
            "すみません、教室はどこですか。"
            "二階です。階段を上がって、右の部屋です。",

        "transcript":
            "A: すみません、教室はどこですか。\n"
            "B: 二階です。\n"
            "B: 階段を上がって、右の部屋です。",

        "translation":
            "A: Excuse me, where is the classroom?\n"
            "B: It is on the second floor.\n"
            "B: Go up the stairs; it is the room on the right.",

        "question": "教室はどこにありますか。",

        "options": [
            "一階の左",
            "一階の右",
            "二階の左",
            "二階の右"
        ],

        "correct_option": 3,

        "dictation_answer":
            "二階です。",

        "hint":
            "Listen for both the floor and direction."
    },

    {
        "id": 7,
        "title": "Phone Call",
        "jlpt_level": "N5",
        "topic": "Communication",

        "audio_text":
            "もしもし、田中さんですか。"
            "いいえ、山田です。田中さんは今いません。",

        "transcript":
            "A: もしもし、田中さんですか。\n"
            "B: いいえ、山田です。\n"
            "B: 田中さんは今いません。",

        "translation":
            "A: Hello, is this Mr. Tanaka?\n"
            "B: No, this is Yamada.\n"
            "B: Mr. Tanaka is not here right now.",

        "question": "電話に出た人は誰ですか。",

        "options": [
            "田中さん",
            "山田さん",
            "佐藤さん",
            "鈴木さん"
        ],

        "correct_option": 1,

        "dictation_answer":
            "山田です。",

        "hint":
            "The speaker corrects the caller's guess."
    },

    {
        "id": 8,
        "title": "Weekend Plans",
        "jlpt_level": "N5",
        "topic": "Free Time",

        "audio_text":
            "土曜日、何をしますか。"
            "友達と映画を見ます。"
            "日曜日は家で勉強します。",

        "transcript":
            "A: 土曜日、何をしますか。\n"
            "B: 友達と映画を見ます。\n"
            "B: 日曜日は家で勉強します。",

        "translation":
            "A: What will you do on Saturday?\n"
            "B: I will watch a movie with a friend.\n"
            "B: On Sunday, I will study at home.",

        "question": "土曜日に何をしますか。",

        "options": [
            "家で勉強します",
            "友達と映画を見ます",
            "買い物をします",
            "学校へ行きます"
        ],

        "correct_option": 1,

        "dictation_answer":
            "友達と映画を見ます。",

        "hint":
            "Compare Saturday with Sunday."
    },

    {
        "id": 9,
        "title": "At the Library",
        "jlpt_level": "N5",
        "topic": "Places",

        "audio_text":
            "この本を借りたいです。"
            "学生ですか。はい。"
            "じゃあ、学生証を見せてください。",

        "transcript":
            "A: この本を借りたいです。\n"
            "B: 学生ですか。\n"
            "A: はい。\n"
            "B: じゃあ、学生証を見せてください。",

        "translation":
            "A: I would like to borrow this book.\n"
            "B: Are you a student?\n"
            "A: Yes.\n"
            "B: Then please show me your student ID.",

        "question": "何を見せますか。",

        "options": [
            "本",
            "財布",
            "学生証",
            "パスポート"
        ],

        "correct_option": 2,

        "dictation_answer":
            "学生証を見せてください。",

        "hint":
            "Listen to the final request."
    },

    {
        "id": 10,
        "title": "Buying a Gift",
        "jlpt_level": "N5",
        "topic": "Shopping",

        "audio_text":
            "これはいくらですか。"
            "千五百円です。"
            "じゃあ、これをください。",

        "transcript":
            "A: これはいくらですか。\n"
            "B: 千五百円です。\n"
            "A: じゃあ、これをください。",

        "translation":
            "A: How much is this?\n"
            "B: 1,500 yen.\n"
            "A: Then, I'll take this, please.",

        "question": "これはいくらですか。",

        "options": [
            "五百円",
            "千円",
            "千五百円",
            "二千円"
        ],

        "correct_option": 2,

        "dictation_answer":
            "千五百円です。",

        "hint":
            "Listen carefully to the price."
    },

    {
        "id": 11,
        "title": "Taking the Bus",
        "jlpt_level": "N5",
        "topic": "Transportation",

        "audio_text":
            "このバスは駅へ行きますか。"
            "はい、行きます。"
            "でも、次のバスのほうが早いですよ。",

        "transcript":
            "A: このバスは駅へ行きますか。\n"
            "B: はい、行きます。\n"
            "B: でも、次のバスのほうが早いですよ。",

        "translation":
            "A: Does this bus go to the station?\n"
            "B: Yes, it does.\n"
            "B: But the next bus is faster.",

        "question": "どのバスのほうが早いですか。",

        "options": [
            "このバス",
            "次のバス",
            "昨日のバス",
            "電車"
        ],

        "correct_option": 1,

        "dictation_answer":
            "次のバスのほうが早いですよ。",

        "hint":
            "Listen for the comparison using ほうが."
    },

    {
        "id": 12,
        "title": "After Class",
        "jlpt_level": "N5",
        "topic": "School",

        "audio_text":
            "授業のあと、何をしますか。"
            "図書館で宿題をします。"
            "それから、家へ帰ります。",

        "transcript":
            "A: 授業のあと、何をしますか。\n"
            "B: 図書館で宿題をします。\n"
            "B: それから、家へ帰ります。",

        "translation":
            "A: What will you do after class?\n"
            "B: I will do my homework at the library.\n"
            "B: Then I will go home.",

        "question": "授業のあと、何をしますか。",

        "options": [
            "家で寝ます",
            "図書館で宿題をします",
            "友達と映画を見ます",
            "学校で昼ご飯を食べます"
        ],

        "correct_option": 1,

        "dictation_answer":
            "図書館で宿題をします。",

        "hint":
            "Listen for the first activity after class."
    }
]


# ============================================================
# API
# ============================================================

from fastapi import HTTPException
from pydantic import BaseModel
import json

from app.models.models import ListeningAttempt


class ListeningAttemptRequest(BaseModel):
    exercise_id: int
    selected_option: int | None = None
    replay_count: int = 0
    dictation_answer: str | None = None


@router.get("/list")
def get_listening_exercises(
    jlpt_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Return listening exercises.

    Optional:
        ?jlpt_level=N5
    """

    if jlpt_level:
        level = jlpt_level.upper()

        return [
            exercise
            for exercise in LISTENING_EXERCISES
            if exercise["jlpt_level"] == level
        ]

    return LISTENING_EXERCISES


@router.post("/attempt")
def submit_listening_attempt(
    attempt_data: ListeningAttemptRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # --------------------------------------------------------
    # Find exercise
    # --------------------------------------------------------

    exercise = next(
        (
            exercise
            for exercise in LISTENING_EXERCISES
            if exercise["id"] == attempt_data.exercise_id
        ),
        None
    )

    if exercise is None:
        raise HTTPException(
            status_code=404,
            detail="Listening exercise not found"
        )

    # --------------------------------------------------------
    # Check multiple-choice answer
    # --------------------------------------------------------

    correct = (
        attempt_data.selected_option is not None
        and attempt_data.selected_option
        == exercise["correct_option"]
    )

    # --------------------------------------------------------
    # Check dictation
    # --------------------------------------------------------

    dictation_correct = False

    if attempt_data.dictation_answer:

        user_dictation = (
            attempt_data.dictation_answer
            .strip()
            .replace(" ", "")
            .replace("　", "")
            .replace("。", "")
            .replace("、", "")
            .replace("！", "")
            .replace("？", "")
            .replace("!", "")
            .replace("?", "")
        )

        correct_dictation = (
            exercise["dictation_answer"]
            .strip()
            .replace(" ", "")
            .replace("　", "")
            .replace("。", "")
            .replace("、", "")
            .replace("！", "")
            .replace("？", "")
            .replace("!", "")
            .replace("?", "")
        )

        dictation_correct = (
            user_dictation == correct_dictation
        )

    # --------------------------------------------------------
    # Check whether this is the user's first attempt
    # --------------------------------------------------------

    previous_attempt = (
        db.query(ListeningAttempt)
        .filter(
            ListeningAttempt.user_id == current_user.id,
            ListeningAttempt.exercise_id
            == attempt_data.exercise_id
        )
        .first()
    )

    first_attempt = previous_attempt is None

    # --------------------------------------------------------
    # Calculate XP
    # --------------------------------------------------------

    xp_earned = 0

    if first_attempt:
        if correct:
            xp_earned += 10

        if dictation_correct:
            xp_earned += 5

    # --------------------------------------------------------
    # Save listening attempt
    # --------------------------------------------------------

    db_attempt = ListeningAttempt(
        user_id=current_user.id,
        exercise_id=attempt_data.exercise_id,
        selected_option=attempt_data.selected_option,
        correct=correct,
        first_attempt=first_attempt,
        replay_count=attempt_data.replay_count,
        dictation_answer=attempt_data.dictation_answer,
        dictation_correct=dictation_correct,
        xp_earned=xp_earned
    )

    db.add(db_attempt)

    # --------------------------------------------------------
    # Get / create user progress
    # --------------------------------------------------------

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == current_user.id
        )
        .first()
    )

    if not progress:
        progress = UserProgress(
            user_id=current_user.id
        )
        db.add(progress)
        db.flush()

    # --------------------------------------------------------
    # Update XP
    # --------------------------------------------------------

    old_level = progress.level

    progress.xp += xp_earned

    progress.level = max(
        1,
        (progress.xp // 100) + 1
    )

    # --------------------------------------------------------
    # Update streak
    # --------------------------------------------------------

    today_str = datetime.now().date().isoformat()

    if progress.last_active_date != today_str:
        progress.streak_count += 1
        progress.last_active_date = today_str

    # --------------------------------------------------------
    # Commit everything together
    # --------------------------------------------------------

    db.commit()

    db.refresh(db_attempt)
    db.refresh(progress)

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "attempt_id": db_attempt.id,
        "exercise_id": exercise["id"],

        "correct": correct,
        "correct_option": exercise["correct_option"],

        "dictation_correct": dictation_correct,

        "xp_earned": xp_earned,
        "total_xp": progress.xp,

        "level": progress.level,
        "leveled_up": progress.level > old_level,

        "streak_count": progress.streak_count,

        "replay_count": attempt_data.replay_count,
        "first_attempt": first_attempt
    }