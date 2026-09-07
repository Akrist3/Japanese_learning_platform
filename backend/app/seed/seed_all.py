from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.models import (
    User, UserProgress, UserSettings, Kana, Vocabulary, Kanji, Grammar, Verb,
    Achievement, MockExam, Resource
)
from app.services.auth_service import get_password_hash
from app.seed.hiragana_data import HIRAGANA_DATA
from app.seed.katakana_data import KATAKANA_DATA
from app.seed.vocab_data import VOCABULARY_DATA
from app.seed.kanji_data import KANJI_DATA
from app.seed.grammar_data import GRAMMAR_DATA
from app.seed.verb_data import VERB_DATA
from app.seed.exam_data import EXAM_DATA
from app.seed.resources_data import RESOURCE_DATA

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Seed Admin User if not exists
        admin = db.query(User).filter(User.email == "admin@japanese.com").first()
        if not admin:
            admin = User(
                email="admin@japanese.com",
                username="admin",
                password_hash=get_password_hash("admin123"),
                role="admin",
                current_jlpt="N1",
                target_jlpt="N1"
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

            admin_progress = UserProgress(user_id=admin.id, level=50, xp=10000, streak_count=30)
            admin_settings = UserSettings(user_id=admin.id)
            db.add(admin_progress)
            db.add(admin_settings)

        # Seed Learner User if not exists
        learner = db.query(User).filter(User.email == "learner@japanese.com").first()
        if not learner:
            learner = User(
                email="learner@japanese.com",
                username="Akrist Learner",
                password_hash=get_password_hash("learner123"),
                role="user",
                current_jlpt="N5",
                target_jlpt="N3",
                daily_goal_minutes=20
            )
            db.add(learner)
            db.commit()
            db.refresh(learner)

            learner_progress = UserProgress(user_id=learner.id, level=3, xp=350, streak_count=7)
            learner_settings = UserSettings(user_id=learner.id)
            db.add(learner_progress)
            db.add(learner_settings)

        # Seed Hiragana & Katakana
        if db.query(Kana).count() == 0:
            for item in HIRAGANA_DATA + KATAKANA_DATA:
                db.add(Kana(**item))
            print(f"Seeded {len(HIRAGANA_DATA + KATAKANA_DATA)} Kana entries.")

        # Seed Vocabulary
        if db.query(Vocabulary).count() == 0:
            for item in VOCABULARY_DATA:
                db.add(Vocabulary(**item))
            print(f"Seeded {len(VOCABULARY_DATA)} Vocabulary entries.")

        # Seed Kanji
        if db.query(Kanji).count() == 0:
            for item in KANJI_DATA:
                db.add(Kanji(**item))
            print(f"Seeded {len(KANJI_DATA)} Kanji entries.")

        # Seed Grammar
        if db.query(Grammar).count() == 0:
            for item in GRAMMAR_DATA:
                db.add(Grammar(**item))
            print(f"Seeded {len(GRAMMAR_DATA)} Grammar points.")

        # Seed Verbs
        if db.query(Verb).count() == 0:
            for item in VERB_DATA:
                db.add(Verb(**item))
            print(f"Seeded {len(VERB_DATA)} Verb entries.")

        # Seed Mock Exams
        if db.query(MockExam).count() == 0:
            for item in EXAM_DATA:
                db.add(MockExam(**item))
            print(f"Seeded {len(EXAM_DATA)} Mock Exams.")

        # Seed Resources
        if db.query(Resource).count() == 0:
            for item in RESOURCE_DATA:
                db.add(Resource(**item))
            print(f"Seeded {len(RESOURCE_DATA)} Resources.")

        # Seed System Achievements
        achievements_data = [
            {"code": "FIRST_LESSON", "title": "First Step", "description": "Completed your very first Japanese lesson!", "icon": "🌱", "xp_reward": 50},
            {"code": "HIRAGANA_MASTER", "title": "Hiragana Master", "description": "Mastered all 46 basic Hiragana characters!", "icon": "あ", "xp_reward": 200},
            {"code": "KATAKANA_EXPLORER", "title": "Katakana Explorer", "description": "Learned all basic Katakana characters!", "icon": "ア", "xp_reward": 200},
            {"code": "VOCAB_100", "title": "Vocabulary Apprentice", "description": "Learned 100 Japanese words!", "icon": "📚", "xp_reward": 300},
            {"code": "KANJI_50", "title": "Kanji Student", "description": "Mastered 50 Kanji characters!", "icon": "漢", "xp_reward": 300},
            {"code": "STREAK_7", "title": "Week On Fire", "description": "Maintained a 7-day study streak!", "icon": "🔥", "xp_reward": 150},
            {"code": "STREAK_30", "title": "Monthly Warrior", "description": "Maintained a 30-day study streak!", "icon": "🏆", "xp_reward": 500},
            {"code": "N5_PASSED", "title": "JLPT N5 Ready", "description": "Passed an N5 Mock Exam with over 70%!", "icon": "🎯", "xp_reward": 500}
        ]

        if db.query(Achievement).count() == 0:
            for ach in achievements_data:
                db.add(Achievement(**ach))
            print(f"Seeded {len(achievements_data)} Achievements.")

        db.commit()
        print("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
