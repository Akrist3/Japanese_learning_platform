from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, UserMistake
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/placement", tags=["placement"])


# =========================================================
# PLACEMENT TEST QUESTION BANK
# =========================================================

QUESTIONS = [

    # =====================================================
    # N5 FOUNDATION
    # =====================================================

    {
        "id": "n5-kana-1",
        "level": "N5",
        "skill": "Kana",
        "question": "What is the reading of あ?",
        "options": ["a", "i", "u", "o"],
        "correct_option": 0,
        "explanation": "あ is read as 'a'."
    },

    {
        "id": "n5-vocab-1",
        "level": "N5",
        "skill": "Vocabulary",
        "question": "What does ねこ mean?",
        "options": ["Dog", "Cat", "Bird", "Fish"],
        "correct_option": 1,
        "explanation": "ねこ means cat."
    },

    {
        "id": "n5-grammar-1",
        "level": "N5",
        "skill": "Grammar",
        "question": "私は学生___。",
        "options": [
            "です",
            "ます",
            "でしたら",
            "ません"
        ],
        "correct_option": 0,
        "explanation": "です is used to form a polite nominal sentence."
    },

    {
        "id": "n5-kanji-1",
        "level": "N5",
        "skill": "Kanji",
        "question": "What does 日 mean?",
        "options": [
            "Moon",
            "Sun / Day",
            "Water",
            "Fire"
        ],
        "correct_option": 1,
        "explanation": "日 commonly means sun or day."
    },


    # =====================================================
    # N4
    # =====================================================

    {
        "id": "n4-vocab-1",
        "level": "N4",
        "skill": "Vocabulary",
        "question": "What does 約束 mean?",
        "options": [
            "Promise",
            "Problem",
            "Travel",
            "Meeting place"
        ],
        "correct_option": 0,
        "explanation": "約束 means promise or appointment/agreement depending on context."
    },

    {
        "id": "n4-grammar-1",
        "level": "N4",
        "skill": "Grammar",
        "question": "昨日、映画を___。",
        "options": [
            "見ます",
            "見ました",
            "見るです",
            "見てです"
        ],
        "correct_option": 1,
        "explanation": "見ました is the polite past form of 見る."
    },

    {
        "id": "n4-reading-1",
        "level": "N4",
        "skill": "Reading",
        "question": "「毎朝七時に起きて、朝ご飯を食べます。」 What does the person do at 7?",
        "options": [
            "Goes to school",
            "Eats lunch",
            "Wakes up",
            "Goes to sleep"
        ],
        "correct_option": 2,
        "explanation": "七時に起きて means wakes up at seven."
    },


    # =====================================================
    # N3
    # =====================================================

    {
        "id": "n3-grammar-1",
        "level": "N3",
        "skill": "Grammar",
        "question": "雨が降っている___、出かけなければならない。",
        "options": [
            "のに",
            "ので",
            "ながら",
            "ほど"
        ],
        "correct_option": 0,
        "explanation": "のに expresses contrast: despite / although."
    },

    {
        "id": "n3-vocab-1",
        "level": "N3",
        "skill": "Vocabulary",
        "question": "What does 必要 mean?",
        "options": [
            "Necessary",
            "Dangerous",
            "Convenient",
            "Famous"
        ],
        "correct_option": 0,
        "explanation": "必要 means necessary or need."
    },

    {
        "id": "n3-reading-1",
        "level": "N3",
        "skill": "Reading",
        "question": "「健康のために、毎日30分歩くようにしています。」 Why does the person walk every day?",
        "options": [
            "For their health",
            "For their job",
            "To meet friends",
            "To study Japanese"
        ],
        "correct_option": 0,
        "explanation": "健康のために means for the sake of health."
    },


    # =====================================================
    # N2
    # =====================================================

    {
        "id": "n2-grammar-1",
        "level": "N2",
        "skill": "Grammar",
        "question": "彼は忙しい___、毎日運動している。",
        "options": [
            "にもかかわらず",
            "にしたがって",
            "につれて",
            "において"
        ],
        "correct_option": 0,
        "explanation": "にもかかわらず means despite / nevertheless."
    },

    {
        "id": "n2-vocab-1",
        "level": "N2",
        "skill": "Vocabulary",
        "question": "What does 影響 mean?",
        "options": [
            "Influence / Effect",
            "Opportunity",
            "Environment",
            "Purpose"
        ],
        "correct_option": 0,
        "explanation": "影響 means influence or effect."
    },


    # =====================================================
    # N1
    # =====================================================

    {
        "id": "n1-grammar-1",
        "level": "N1",
        "skill": "Grammar",
        "question": "彼の説明は、到底納得できる___ものではない。",
        "options": [
            "ような",
            "ように",
            "ほど",
            "わけ"
        ],
        "correct_option": 0,
        "explanation": "ようなものではない expresses that something is not at all of the kind that can be accepted."
    },
]


# =========================================================
# LEVEL ORDER
# =========================================================

LEVEL_ORDER = [
    "N5",
    "N4",
    "N3",
    "N2",
    "N1"
]


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def get_level_index(level: str) -> int:
    return LEVEL_ORDER.index(level)


def get_next_level(level: str) -> str:
    index = get_level_index(level)

    if index >= len(LEVEL_ORDER) - 1:
        return "N1"

    return LEVEL_ORDER[index + 1]


def get_previous_level(level: str) -> str:
    index = get_level_index(level)

    if index <= 0:
        return "N5"

    return LEVEL_ORDER[index - 1]


def get_questions_for_level(level: str):
    return [
        question
        for question in QUESTIONS
        if question["level"] == level
    ]


def get_question_by_id(question_id: str):
    for question in QUESTIONS:
        if question["id"] == question_id:
            return question

    return None


def sanitize_question(question):
    """
    Important:
    Never send correct_option or explanation
    when starting the test.
    """

    return {
        "id": question["id"],
        "level": question["level"],
        "skill": question["skill"],
        "question": question["question"],
        "options": question["options"],
    }


# =========================================================
# START PLACEMENT TEST
# =========================================================

@router.get("/start")
def start_placement_test(
    current_user: User = Depends(get_current_user)
):
    """
    Start the placement test.

    Questions are sent without the correct answer.
    """

    if not QUESTIONS:
        raise HTTPException(
            status_code=500,
            detail="Placement question bank is empty."
        )

    return {
        "title": "Japanese Placement Test",

        "description": (
            "Let's find your current Japanese level."
        ),

        "minimum_questions": 8,

        "maximum_questions": 15,

        "max_mistakes": 5,

        "consecutive_mistakes_to_stop": 3,

        "questions": [
            sanitize_question(question)
            for question in QUESTIONS
        ]
    }


# =========================================================
# CHECK ONE ANSWER
# =========================================================

@router.post("/answer")
def check_placement_answer(
    data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check one placement-test answer.

    The correct answer is kept on the backend.
    """

    question_id = data.get("question_id")
    answer = data.get("answer")

    if not question_id:
        raise HTTPException(
            status_code=400,
            detail="Question ID is required."
        )

    if answer is None:
        raise HTTPException(
            status_code=400,
            detail="Answer is required."
        )

    question = get_question_by_id(question_id)

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Placement question not found."
        )

    try:
        answer_index = int(answer)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail="Answer must be a valid option index."
        )

    if (
        answer_index < 0
        or answer_index >= len(question["options"])
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid answer option."
        )

    is_correct = (
        answer_index == question["correct_option"]
    )

    # -----------------------------------------------------
    # Save incorrect answer
    # -----------------------------------------------------

    if not is_correct:

        mistake = UserMistake(
            user_id=current_user.id,
            topic=f"Placement Test - {question['skill']}",
            question_text=question["question"],
            user_answer=question["options"][answer_index],
            correct_answer=question["options"][
                question["correct_option"]
            ],
            explanation=question.get(
                "explanation",
                "Review this topic."
            )
        )

        db.add(mistake)
        db.commit()

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {
        "correct": is_correct,

        "question_id": question_id,

        "level": question["level"],

        "skill": question["skill"],

        "correct_answer": question["options"][
            question["correct_option"]
        ],

        "explanation": question.get(
            "explanation",
            ""
        )
    }


# =========================================================
# SUBMIT COMPLETE PLACEMENT TEST
# =========================================================

@router.post("/submit")
def submit_placement_test(
    data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculate the final placement result.

    Answers should be:

    {
        "question_id": option_index
    }
    """

    answers = data.get("answers", {})

    if not answers:
        raise HTTPException(
            status_code=400,
            detail="No placement test answers submitted."
        )

    question_map = {
        question["id"]: question
        for question in QUESTIONS
    }

    total = 0
    correct = 0
    mistakes = 0

    # -----------------------------------------------------
    # Level statistics
    # -----------------------------------------------------

    level_stats = {
        "N5": {
            "correct": 0,
            "total": 0
        },
        "N4": {
            "correct": 0,
            "total": 0
        },
        "N3": {
            "correct": 0,
            "total": 0
        },
        "N2": {
            "correct": 0,
            "total": 0
        },
        "N1": {
            "correct": 0,
            "total": 0
        },
    }

    # -----------------------------------------------------
    # Skill statistics
    # -----------------------------------------------------

    skill_stats = {}

    # -----------------------------------------------------
    # Evaluate all answered questions
    # -----------------------------------------------------

    for question_id, user_answer in answers.items():

        question = question_map.get(question_id)

        if not question:
            continue

        total += 1

        level = question["level"]
        skill = question["skill"]

        level_stats[level]["total"] += 1

        if skill not in skill_stats:
            skill_stats[skill] = {
                "correct": 0,
                "total": 0
            }

        skill_stats[skill]["total"] += 1

        # -------------------------------------------------
        # Convert answer to integer
        # -------------------------------------------------

        try:
            answer_index = int(user_answer)
        except (ValueError, TypeError):
            answer_index = -1

        # -------------------------------------------------
        # Check answer
        # -------------------------------------------------

        is_correct = (
            answer_index ==
            question["correct_option"]
        )

        if is_correct:

            correct += 1

            level_stats[level]["correct"] += 1

            skill_stats[skill]["correct"] += 1

        else:

            mistakes += 1

    # -----------------------------------------------------
    # Validate
    # -----------------------------------------------------

    if total == 0:
        raise HTTPException(
            status_code=400,
            detail="No valid placement questions found."
        )

    # -----------------------------------------------------
    # Determine starting level
    # -----------------------------------------------------

    starting_level = "N5"

    for level in LEVEL_ORDER:

        stats = level_stats[level]

        if stats["total"] == 0:
            continue

        percentage = (
            stats["correct"] /
            stats["total"]
        ) * 100

        # 70% required to demonstrate the level.
        if percentage >= 70:

            starting_level = level

        else:

            # Stop moving upward once a level
            # is not demonstrated.
            break

    # -----------------------------------------------------
    # Determine weak skills
    # -----------------------------------------------------

    weak_skills = []

    for skill, stats in skill_stats.items():

        if stats["total"] == 0:
            continue

        percentage = (
            stats["correct"] /
            stats["total"]
        ) * 100

        if percentage < 70:
            weak_skills.append(skill)

    # -----------------------------------------------------
    # Update user's current level
    # -----------------------------------------------------

    current_user.current_jlpt = starting_level

    db.commit()

    # -----------------------------------------------------
    # Overall accuracy
    # -----------------------------------------------------

    percentage = round(
        (correct / total) * 100,
        1
    )

    # -----------------------------------------------------
    # Final response
    # -----------------------------------------------------

    return {
        "completed": True,

        "questions_answered": total,

        "correct": correct,

        "mistakes": mistakes,

        "percentage": percentage,

        "accuracy": percentage,

        "starting_level": starting_level,

        "target_level": current_user.target_jlpt,

        "level_stats": level_stats,

        "skill_stats": skill_stats,

        "weak_skills": weak_skills,

        "next_action": (
            f"Begin your personalized "
            f"{starting_level} roadmap."
        )
    }