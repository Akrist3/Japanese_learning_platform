from datetime import datetime
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, UserMistake, RoadmapMissionProgress
from app.services.auth_service import get_current_user


router = APIRouter(
    prefix="/roadmap",
    tags=["roadmap"]
)


# =========================================================
# JLPT LEVEL ORDER
# =========================================================

LEVEL_ORDER = [
    "N5",
    "N4",
    "N3",
    "N2",
    "N1"
]


# =========================================================
# ROADMAP MISSION DATABASE
# =========================================================

MISSIONS = {

    "N5": [

        {
            "id": "n5-01",
            "title": "Start Speaking Japanese",
            "purpose": "Introduce yourself and understand basic Japanese sentences.",
            "skills": ["Grammar", "Vocabulary", "Speaking"],
            "path": "/grammar",
            "xp": 100,
            "type": "foundation"
        },

        {
            "id": "n5-02",
            "title": "Build Your Core Vocabulary",
            "purpose": "Learn the most useful beginner Japanese words.",
            "skills": ["Vocabulary", "Recall"],
            "path": "/vocabulary?jlpt_level=N5",
            "xp": 120,
            "type": "vocabulary"
        },

        {
            "id": "n5-03",
            "title": "Master Basic Grammar",
            "purpose": "Learn how particles and basic sentence structures work.",
            "skills": ["Grammar", "Sentence Building"],
            "path": "/grammar",
            "xp": 150,
            "type": "grammar"
        },

        {
            "id": "n5-04",
            "title": "Strengthen Your Kanji",
            "purpose": "Recognize and understand essential beginner kanji.",
            "skills": ["Kanji", "Vocabulary"],
            "path": "/kanji",
            "xp": 150,
            "type": "kanji"
        },

        {
            "id": "n5-05",
            "title": "Read Your First Japanese Stories",
            "purpose": "Use vocabulary and grammar to understand short Japanese passages.",
            "skills": ["Reading", "Grammar", "Kanji"],
            "path": "/reading",
            "xp": 170,
            "type": "reading"
        },

        {
            "id": "n5-06",
            "title": "Train Your Japanese Listening",
            "purpose": "Recognize common Japanese phrases when spoken.",
            "skills": ["Listening", "Vocabulary"],
            "path": "/listening",
            "xp": 170,
            "type": "listening"
        },

        {
            "id": "n5-07",
            "title": "Use Japanese Verbs",
            "purpose": "Talk about actions using common Japanese verb forms.",
            "skills": ["Grammar", "Speaking"],
            "path": "/verbs",
            "xp": 180,
            "type": "verbs"
        },

        {
            "id": "n5-08",
            "title": "N5 Mastery Challenge",
            "purpose": "Test your complete N5 foundation.",
            "skills": [
                "Grammar",
                "Vocabulary",
                "Kanji",
                "Reading",
                "Listening"
            ],
            "path": "/jlpt",
            "xp": 300,
            "type": "challenge"
        }
    ],

    "N4": [

        {
            "id": "n4-01",
            "title": "Expand Your Japanese",
            "purpose": "Move beyond basic sentences and express more complex ideas.",
            "skills": ["Grammar", "Vocabulary"],
            "path": "/grammar",
            "xp": 200,
            "type": "foundation"
        },

        {
            "id": "n4-02",
            "title": "Build N4 Vocabulary",
            "purpose": "Learn the vocabulary needed for everyday intermediate situations.",
            "skills": ["Vocabulary", "Recall"],
            "path": "/vocabulary?jlpt_level=N4",
            "xp": 200,
            "type": "vocabulary"
        },

        {
            "id": "n4-03",
            "title": "Strengthen N4 Kanji",
            "purpose": "Improve your ability to recognize kanji in real sentences.",
            "skills": ["Kanji", "Reading"],
            "path": "/kanji",
            "xp": 220,
            "type": "kanji"
        },

        {
            "id": "n4-04",
            "title": "Read Longer Japanese",
            "purpose": "Understand longer passages and everyday written Japanese.",
            "skills": ["Reading", "Kanji", "Vocabulary"],
            "path": "/reading",
            "xp": 220,
            "type": "reading"
        },

        {
            "id": "n4-05",
            "title": "Understand Natural Japanese",
            "purpose": "Improve listening comprehension using more natural Japanese.",
            "skills": ["Listening", "Vocabulary"],
            "path": "/listening",
            "xp": 220,
            "type": "listening"
        },

        {
            "id": "n4-06",
            "title": "N4 Mastery Challenge",
            "purpose": "Prove that you can use your N4 knowledge in context.",
            "skills": [
                "Grammar",
                "Vocabulary",
                "Kanji",
                "Reading",
                "Listening"
            ],
            "path": "/jlpt",
            "xp": 350,
            "type": "challenge"
        }
    ],

    "N3": [

        {
            "id": "n3-01",
            "title": "Enter Intermediate Japanese",
            "purpose": "Understand grammar and vocabulary beyond beginner Japanese.",
            "skills": ["Grammar", "Vocabulary"],
            "path": "/grammar",
            "xp": 250,
            "type": "foundation"
        },

        {
            "id": "n3-02",
            "title": "Build N3 Vocabulary",
            "purpose": "Develop the vocabulary needed for intermediate Japanese.",
            "skills": ["Vocabulary", "Recall"],
            "path": "/vocabulary?jlpt_level=N3",
            "xp": 250,
            "type": "vocabulary"
        },

        {
            "id": "n3-03",
            "title": "Read Real Japanese",
            "purpose": "Understand articles and longer Japanese passages.",
            "skills": ["Reading", "Kanji", "Vocabulary"],
            "path": "/reading",
            "xp": 280,
            "type": "reading"
        },

        {
            "id": "n3-04",
            "title": "Understand Japanese at Normal Speed",
            "purpose": "Improve your ability to understand spoken Japanese.",
            "skills": ["Listening", "Vocabulary"],
            "path": "/listening",
            "xp": 280,
            "type": "listening"
        },

        {
            "id": "n3-05",
            "title": "Speak With More Confidence",
            "purpose": "Use intermediate grammar and vocabulary when expressing yourself.",
            "skills": ["Speaking", "Grammar"],
            "path": "/speaking",
            "xp": 300,
            "type": "speaking"
        },

        {
            "id": "n3-06",
            "title": "N3 Mastery Challenge",
            "purpose": "Test your ability to understand Japanese in realistic contexts.",
            "skills": [
                "Grammar",
                "Vocabulary",
                "Reading",
                "Listening",
                "Speaking"
            ],
            "path": "/jlpt",
            "xp": 400,
            "type": "challenge"
        }
    ],

    "N2": [

        {
            "id": "n2-01",
            "title": "Advanced Japanese Grammar",
            "purpose": "Understand complex grammar and subtle differences in meaning.",
            "skills": ["Grammar", "Reading"],
            "path": "/grammar",
            "xp": 300,
            "type": "grammar"
        },

        {
            "id": "n2-02",
            "title": "Build Advanced Vocabulary",
            "purpose": "Learn vocabulary used in formal and complex situations.",
            "skills": ["Vocabulary", "Recall"],
            "path": "/vocabulary?jlpt_level=N2",
            "xp": 300,
            "type": "vocabulary"
        },

        {
            "id": "n2-03",
            "title": "Read Complex Japanese",
            "purpose": "Understand longer and more difficult written Japanese.",
            "skills": ["Reading", "Kanji"],
            "path": "/reading",
            "xp": 320,
            "type": "reading"
        },

        {
            "id": "n2-04",
            "title": "Advanced Listening",
            "purpose": "Understand natural conversations and more difficult audio.",
            "skills": ["Listening"],
            "path": "/listening",
            "xp": 320,
            "type": "listening"
        },

        {
            "id": "n2-05",
            "title": "N2 Mastery Challenge",
            "purpose": "Demonstrate advanced Japanese comprehension.",
            "skills": [
                "Grammar",
                "Vocabulary",
                "Kanji",
                "Reading",
                "Listening"
            ],
            "path": "/jlpt",
            "xp": 450,
            "type": "challenge"
        }
    ],

    "N1": [

        {
            "id": "n1-01",
            "title": "Master Advanced Grammar",
            "purpose": "Understand sophisticated grammar and subtle expressions.",
            "skills": ["Grammar", "Reading"],
            "path": "/grammar",
            "xp": 350,
            "type": "grammar"
        },

        {
            "id": "n1-02",
            "title": "Master Japanese Vocabulary",
            "purpose": "Understand sophisticated vocabulary across different contexts.",
            "skills": ["Vocabulary", "Recall"],
            "path": "/vocabulary?jlpt_level=N1",
            "xp": 350,
            "type": "vocabulary"
        },

        {
            "id": "n1-03",
            "title": "Master Difficult Japanese Texts",
            "purpose": "Read complex and abstract Japanese prose.",
            "skills": ["Reading", "Kanji"],
            "path": "/reading",
            "xp": 400,
            "type": "reading"
        },

        {
            "id": "n1-04",
            "title": "Understand Native-Level Japanese",
            "purpose": "Follow difficult Japanese audio and natural speech.",
            "skills": ["Listening"],
            "path": "/listening",
            "xp": 400,
            "type": "listening"
        },

        {
            "id": "n1-05",
            "title": "N1 Final Challenge",
            "purpose": "Put your complete Japanese knowledge to the test.",
            "skills": [
                "Grammar",
                "Vocabulary",
                "Kanji",
                "Reading",
                "Listening"
            ],
            "path": "/jlpt",
            "xp": 1000,
            "type": "challenge"
        }
    ]
}


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def level_index(level: str) -> int:
    """
    Return the numerical position of a JLPT level.
    """

    try:
        return LEVEL_ORDER.index(level)
    except ValueError:
        return 0


def levels_between(start: str, target: str) -> List[str]:
    """
    Return all JLPT levels from starting level
    up to target level.
    """

    start_index = level_index(start)
    target_index = level_index(target)

    if start_index > target_index:
        return [start]

    return LEVEL_ORDER[start_index:target_index + 1]


def calculate_weak_skills(
    skill_stats: Dict[str, Any]
) -> List[str]:
    """
    Find skills below 70% accuracy.
    """

    weak_skills = []

    for skill, stats in skill_stats.items():

        total = stats.get("total", 0)
        correct = stats.get("correct", 0)

        if total == 0:
            continue

        accuracy = (correct / total) * 100

        if accuracy < 70:
            weak_skills.append(skill)

    return weak_skills


def add_personalized_missions(
    missions: List[Dict[str, Any]],
    weak_skills: List[str]
) -> List[Dict[str, Any]]:

    personalized = []

    for mission in missions:

        mission_copy = mission.copy()

        matching_skills = [
            skill
            for skill in mission["skills"]
            if skill in weak_skills
        ]

        if matching_skills:
            mission_copy["priority"] = "high"
            mission_copy["focus_skills"] = matching_skills
        else:
            mission_copy["priority"] = "normal"
            mission_copy["focus_skills"] = []

        personalized.append(mission_copy)

    # NOTE: intentionally no reordering here.
    # Priority/focus_skills are still attached above so the frontend
    # can highlight weak-skill missions, but the curriculum sequence
    # (n5-01 -> n5-02 -> n5-03 -> ...) must stay intact for sequential
    # unlocking to make sense.

    return personalized


# =========================================================
# GET PERSONALIZED ROADMAP
# =========================================================

@router.get("")
def get_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate a personalized continuous roadmap.

    The roadmap is based on:

    - Current JLPT level
    - Target JLPT level
    - Placement-test weaknesses

    The roadmap is NOT permanently tied to the
    placement test. Later we can add real progress
    and mastery data.
    """

    current_level = (
        current_user.current_jlpt
        or "N5"
    )

    target_level = (
        current_user.target_jlpt
        or "N3"
    )

    # -----------------------------------------------------
    # Make sure target is not below current level
    # -----------------------------------------------------

    if level_index(target_level) < level_index(current_level):

        target_level = current_level

    # -----------------------------------------------------
    # Get levels learner needs to complete
    # -----------------------------------------------------

    roadmap_levels = levels_between(
        current_level,
        target_level
    )

    # -----------------------------------------------------
    # Currently we don't have placement skill data
    # stored directly on User.
    #
    # We will add this later.
    # -----------------------------------------------------

    # -----------------------------------------------------
    # Analyze user's placement-test mistakes
    # -----------------------------------------------------

    placement_mistakes = (
        db.query(UserMistake)
        .filter(
            UserMistake.user_id == current_user.id,
            UserMistake.topic.like("Placement Test - %")
        )
        .all()
    )

    weak_skill_counts = {}

    for mistake in placement_mistakes:
        skill = mistake.topic.replace(
            "Placement Test - ",
            ""
        )

        weak_skill_counts[skill] = (
                weak_skill_counts.get(skill, 0) + 1
        )

    # -----------------------------------------------------
    # Determine weak skills
    # -----------------------------------------------------

    weak_skills = sorted(
        weak_skill_counts.keys(),
        key=lambda skill: weak_skill_counts[skill],
        reverse=True
    )

    # -----------------------------------------------------
    # Build missions
    # -----------------------------------------------------

    roadmap = []

    mission_number = 1

    for level in roadmap_levels:

        level_missions = MISSIONS.get(
            level,
            []
        )

        personalized_missions = add_personalized_missions(
            level_missions,
            weak_skills
        )

        for mission in personalized_missions:

            mission_copy = mission.copy()

            mission_copy["number"] = mission_number
            mission_copy["level"] = level

            roadmap.append(
                mission_copy
            )

            mission_number += 1

    # -----------------------------------------------------
    # Determine mission status (completed / active / locked)
    #
    # Walk the roadmap in order:
    #   - already completed  -> "completed"
    #   - first not-yet-done -> "active"
    #   - everything after   -> "locked"
    # -----------------------------------------------------

    completed_records = (
        db.query(RoadmapMissionProgress)
        .filter(
            RoadmapMissionProgress.user_id == current_user.id,
            RoadmapMissionProgress.completed.is_(True)
        )
        .all()
    )

    completed_ids = {
        record.mission_id
        for record in completed_records
    }

    found_active = False

    for mission in roadmap:

        if mission["id"] in completed_ids:
            mission["status"] = "completed"

        elif not found_active:
            mission["status"] = "active"
            found_active = True

        else:
            mission["status"] = "locked"

    # -----------------------------------------------------
    # Return response
    # -----------------------------------------------------

    return {
        "current_level": current_level,

        "target_level": target_level,

        "weak_skills": weak_skills,

        "total_missions": len(roadmap),

        "missions": roadmap
    }


# =========================================================
# COMPLETE ROADMAP MISSION
# =========================================================

@router.post("/mission/{mission_id}/complete")
def complete_mission(
    mission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a roadmap mission as completed.

    The user receives the mission XP only once.
    """

    # -----------------------------------------------------
    # Find mission in roadmap database
    # -----------------------------------------------------

    mission = None

    for level_missions in MISSIONS.values():

        for item in level_missions:

            if item["id"] == mission_id:
                mission = item
                break

        if mission:
            break

    # -----------------------------------------------------
    # Mission doesn't exist
    # -----------------------------------------------------

    if mission is None:
        raise HTTPException(
            status_code=404,
            detail="Mission not found"
        )

    # -----------------------------------------------------
    # Prevent skipping missions
    # -----------------------------------------------------

    current_level = current_user.current_jlpt or "N5"
    target_level = current_user.target_jlpt or "N3"

    if level_index(target_level) < level_index(current_level):
        target_level = current_level

    roadmap_levels = levels_between(
        current_level,
        target_level
    )

    ordered_missions = []

    for level in roadmap_levels:
        ordered_missions.extend(MISSIONS.get(level, []))

    # Find the position of the requested mission
    mission_index = next(
        (
            index
            for index, item in enumerate(ordered_missions)
            if item["id"] == mission_id
        ),
        None
    )

    if mission_index is None:
        raise HTTPException(
            status_code=404,
            detail="Mission is not part of your current roadmap"
        )

    # Get previous missions
    previous_missions = ordered_missions[:mission_index]

    if previous_missions:

        previous_ids = [
            item["id"]
            for item in previous_missions
        ]

        completed_previous = (
            db.query(RoadmapMissionProgress)
            .filter(
                RoadmapMissionProgress.user_id == current_user.id,
                RoadmapMissionProgress.mission_id.in_(previous_ids),
                RoadmapMissionProgress.completed.is_(True)
            )
            .count()
        )

        if completed_previous != len(previous_missions):

            next_required = next(
                item
                for item in previous_missions
                if item["id"] not in {
                    record.mission_id
                    for record in db.query(RoadmapMissionProgress)
                    .filter(
                        RoadmapMissionProgress.user_id == current_user.id,
                        RoadmapMissionProgress.mission_id.in_(previous_ids),
                        RoadmapMissionProgress.completed.is_(True)
                    )
                    .all()
                }
            )

            raise HTTPException(
                status_code=400,
                detail=f"Complete {next_required['id']} before attempting this mission."
            )

    # -----------------------------------------------------
    # Check if already completed
    # -----------------------------------------------------

    existing_progress = (
        db.query(RoadmapMissionProgress)
        .filter(
            RoadmapMissionProgress.user_id == current_user.id,
            RoadmapMissionProgress.mission_id == mission_id
        )
        .first()
    )

    if existing_progress and existing_progress.completed:

        return {
            "success": True,
            "message": "Mission already completed",
            "mission_id": mission_id,
            "xp_earned": 0
        }

    # -----------------------------------------------------
    # Create or update progress
    # -----------------------------------------------------

    if existing_progress:

        progress = existing_progress

    else:

        progress = RoadmapMissionProgress(
            user_id=current_user.id,
            mission_id=mission_id
        )

        db.add(progress)

    # -----------------------------------------------------
    # Mark mission completed
    # -----------------------------------------------------

    progress.completed = True
    progress.xp_earned = mission["xp"]
    progress.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(progress)

    # -----------------------------------------------------
    # Award XP to user's gamification progress
    # -----------------------------------------------------

    if current_user.progress:

        current_user.progress.xp += mission["xp"]

        db.commit()

    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return {
        "success": True,
        "message": "Mission completed successfully",
        "mission_id": mission_id,
        "mission_title": mission["title"],
        "xp_earned": mission["xp"]
    }