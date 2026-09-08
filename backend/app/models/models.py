from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, default="user")  # "user", "admin"
    avatar_url = Column(String, default="/avatars/default.png")
    
    current_jlpt = Column(String, default="N5")
    target_jlpt = Column(String, default="N3")
    target_exam_date = Column(String, nullable=True)
    daily_goal_minutes = Column(Integer, default=20)
    preferred_style = Column(String, default="visual")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    progress = relationship("UserProgress", back_populates="user", uselist=False, cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    flashcards = relationship("Flashcard", back_populates="user", cascade="all, delete-orphan")
    mistakes = relationship("UserMistake", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    exam_results = relationship("ExamResult", back_populates="user", cascade="all, delete-orphan")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    streak_count = Column(Integer, default=0)
    last_active_date = Column(String, nullable=True)  # YYYY-MM-DD
    romaji_mode = Column(String, default="full")  # "full", "intermediate", "off"

    user = relationship("User", back_populates="progress")

class RoadmapMissionProgress(Base):
    __tablename__ = "roadmap_mission_progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    mission_id = Column(
        String,
        nullable=False,
        index=True
    )

    completed = Column(
        Boolean,
        default=False,
        nullable=False
    )

    xp_earned = Column(
        Integer,
        default=0,
        nullable=False
    )

    completed_at = Column(
        DateTime,
        nullable=True
    )

    user = relationship("User")

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dark_mode = Column(Boolean, default=False)
    sound_effects = Column(Boolean, default=True)
    email_notifications = Column(Boolean, default=True)
    study_reminders = Column(Boolean, default=True)
    leaderboard_opt_out = Column(Boolean, default=False)

    user = relationship("User", back_populates="settings")


class Kana(Base):
    __tablename__ = "kana"

    id = Column(Integer, primary_key=True, index=True)
    character = Column(String, nullable=False, index=True)
    romaji = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "hiragana" or "katakana"
    category = Column(String, default="base")  # "base", "dakuten", "handakuten", "combination"
    stroke_count = Column(Integer, default=1)
    mnemonic = Column(Text, nullable=True)
    audio_url = Column(String, nullable=True)


class Vocabulary(Base):
    __tablename__ = "vocabulary"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, nullable=False, index=True)
    kanji = Column(String, nullable=True)
    hiragana = Column(String, nullable=False)
    romaji = Column(String, nullable=False)
    meaning = Column(String, nullable=False)
    part_of_speech = Column(String, default="noun")
    jlpt_level = Column(String, default="N5", index=True)
    example_sentence = Column(Text, nullable=True)
    example_translation = Column(Text, nullable=True)
    audio_url = Column(String, nullable=True)
    frequency = Column(Integer, default=1)
    category = Column(String, default="general")


class Kanji(Base):
    __tablename__ = "kanji"

    id = Column(Integer, primary_key=True, index=True)
    kanji = Column(String, nullable=False, unique=True, index=True)
    meaning = Column(String, nullable=False)
    onyomi = Column(String, nullable=False)
    kunyomi = Column(String, nullable=False)
    jlpt_level = Column(String, default="N5", index=True)
    grade = Column(Integer, default=1)
    stroke_count = Column(Integer, default=1)
    mnemonic = Column(Text, nullable=True)
    example_words_json = Column(Text, nullable=True)  # JSON string array of {word, reading, meaning}


class Grammar(Base):
    __tablename__ = "grammar"

    id = Column(Integer, primary_key=True, index=True)
    point = Column(String, nullable=False, index=True)
    meaning = Column(String, nullable=False)
    formation = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    jlpt_level = Column(String, default="N5", index=True)
    example_sentences_json = Column(Text, nullable=True)  # JSON string array of {japanese, english}
    similar_grammar = Column(String, nullable=True)
    common_mistakes = Column(Text, nullable=True)


class Verb(Base):
    __tablename__ = "verbs"

    id = Column(Integer, primary_key=True, index=True)
    dictionary_form = Column(String, nullable=False, index=True)
    kanji = Column(String, nullable=True)
    meaning = Column(String, nullable=False)
    verb_group = Column(String, nullable=False)  # "godan", "ichidan", "irregular"
    jlpt_level = Column(String, default="N5", index=True)


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_type = Column(String, nullable=False)  # "vocab", "kanji", "grammar"
    item_id = Column(Integer, nullable=False)
    repetition = Column(Integer, default=0)
    interval = Column(Integer, default=1)  # in days
    ease_factor = Column(Float, default=2.5)
    next_review_date = Column(DateTime, default=datetime.utcnow)
    last_reviewed = Column(DateTime, default=datetime.utcnow)
    state = Column(String, default="new")  # "new", "learning", "review"

    user = relationship("User", back_populates="flashcards")


class UserMistake(Base):
    __tablename__ = "user_mistakes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    question_text = Column(Text, nullable=False)
    user_answer = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    reviewed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mistakes")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, default="general")
    icon = Column(String, default="🏆")
    xp_reward = Column(Integer, default=50)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")


class ReadingPassage(Base):
    __tablename__ = "reading_passages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    jlpt_level = Column(String, default="N5")
    passage_japanese = Column(Text, nullable=False)
    passage_translation = Column(Text, nullable=False)
    vocab_highlights_json = Column(Text, nullable=True)
    questions_json = Column(Text, nullable=False)


class ListeningExercise(Base):
    __tablename__ = "listening_exercises"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    jlpt_level = Column(String, default="N5")
    audio_text = Column(Text, nullable=False)  # For TTS generation
    transcript = Column(Text, nullable=False)
    translation = Column(Text, nullable=False)
    question = Column(Text, nullable=False)
    options_json = Column(Text, nullable=False)
    correct_option = Column(Integer, nullable=False)


class MockExam(Base):
    __tablename__ = "mock_exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    jlpt_level = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=60)
    total_questions = Column(Integer, default=20)
    questions_json = Column(Text, nullable=False)  # JSON array of exam questions


class ExamResult(Base):
    __tablename__ = "exam_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mock_exam_id = Column(Integer, ForeignKey("mock_exams.id"), nullable=False)
    score = Column(Integer, nullable=False)
    max_score = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    time_spent_seconds = Column(Integer, default=0)
    section_scores_json = Column(Text, nullable=False)
    weak_areas_json = Column(Text, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="exam_results")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    resource_type = Column(String, default="website")
    language = Column(String, default="Japanese/English")
    jlpt_level = Column(String, default="All")
    license = Column(String, default="Open / Free")
    source = Column(String, default="Official / Public")
