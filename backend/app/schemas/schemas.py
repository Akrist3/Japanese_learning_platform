from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class OnboardingUpdate(BaseModel):
    current_jlpt: str
    target_jlpt: str
    target_exam_date: Optional[str] = None
    daily_goal_minutes: int
    preferred_style: str

class UserResponse(UserBase):
    id: int
    role: str
    avatar_url: str
    current_jlpt: str
    target_jlpt: str
    target_exam_date: Optional[str] = None
    daily_goal_minutes: int
    preferred_style: str
    created_at: datetime

    class Config:
        from_attributes = True

# Progress Schemas
class ProgressResponse(BaseModel):
    level: int
    xp: int
    streak_count: int
    last_active_date: Optional[str]
    romaji_mode: str

    class Config:
        from_attributes = True

# Kana Schema
class KanaResponse(BaseModel):
    id: int
    character: str
    romaji: str
    type: str
    category: str
    stroke_count: int
    mnemonic: Optional[str]
    audio_url: Optional[str]

    class Config:
        from_attributes = True

# Vocabulary Schema
class VocabularyResponse(BaseModel):
    id: int
    word: str
    kanji: Optional[str]
    hiragana: str
    romaji: str
    meaning: str
    part_of_speech: str
    jlpt_level: str
    example_sentence: Optional[str]
    example_translation: Optional[str]
    audio_url: Optional[str]
    frequency: int
    category: str

    class Config:
        from_attributes = True

# Kanji Schema
class KanjiResponse(BaseModel):
    id: int
    kanji: str
    meaning: str
    onyomi: str
    kunyomi: str
    jlpt_level: str
    grade: int
    stroke_count: int
    mnemonic: Optional[str]
    example_words_json: Optional[str]

    class Config:
        from_attributes = True

# Grammar Schema
class GrammarResponse(BaseModel):
    id: int
    point: str
    meaning: str
    formation: str
    explanation: str
    jlpt_level: str
    example_sentences_json: Optional[str]
    similar_grammar: Optional[str]
    common_mistakes: Optional[str]

    class Config:
        from_attributes = True

# Verb Schema
class VerbResponse(BaseModel):
    id: int
    dictionary_form: str
    kanji: Optional[str]
    meaning: str
    verb_group: str
    jlpt_level: str

    class Config:
        from_attributes = True

# Verb Conjugation Practice Schema
class ConjugationRequest(BaseModel):
    dictionary_form: str
    target_form: str
    user_answer: str

# SRS Review Request
class SRSReviewRequest(BaseModel):
    item_type: str
    item_id: int
    quality: int  # 0: Again, 3: Hard, 4: Good, 5: Easy

# AI Prompt Schema
class AITutorRequest(BaseModel):
    query: str
    context: Optional[str] = None
    mode: str = "explain"  # "explain", "check_sentence", "roleplay"

# Exam Submission Schema
class ExamSubmission(BaseModel):
    mock_exam_id: int
    answers: Dict[str, Any]
    time_spent_seconds: int
