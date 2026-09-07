from sqlalchemy.orm import Session
from app.models.models import Flashcard, UserMistake, ExamResult, UserProgress

def calculate_user_mastery(db: Session, user_id: int) -> dict:
    """
    Calculates overall and topic-by-topic mastery percentages.
    """
    # Flashcard stats
    total_flashcards = db.query(Flashcard).filter(Flashcard.user_id == user_id).count()
    mastered_cards = db.query(Flashcard).filter(
        Flashcard.user_id == user_id, 
        Flashcard.repetition >= 3
    ).count()
    
    flashcard_mastery = round((mastered_cards / total_flashcards * 100), 1) if total_flashcards > 0 else 0.0

    # User mistakes count
    unreviewed_mistakes = db.query(UserMistake).filter(
        UserMistake.user_id == user_id,
        UserMistake.reviewed == False
    ).count()

    # Exam accuracy
    latest_exam = db.query(ExamResult).filter(ExamResult.user_id == user_id).order_by(ExamResult.completed_at.desc()).first()
    exam_accuracy = latest_exam.percentage if latest_exam else 0.0

    # Topic breakdowns
    hiragana_mastery = 100.0 if flashcard_mastery > 20 else flashcard_mastery * 4
    katakana_mastery = 100.0 if flashcard_mastery > 40 else max(0, (flashcard_mastery - 20) * 4)
    n5_vocab_mastery = min(100.0, flashcard_mastery * 1.5)
    particles_mastery = max(30.0, 100.0 - (unreviewed_mistakes * 5))
    verb_conjugation_mastery = max(20.0, 100.0 - (unreviewed_mistakes * 8))

    # Compile weak areas
    weak_topics = []
    if unreviewed_mistakes > 0:
        mistake_topics = db.query(UserMistake.topic).filter(UserMistake.user_id == user_id, UserMistake.reviewed == False).distinct().all()
        weak_topics = [t[0] for t in mistake_topics]
    
    if not weak_topics:
        if particles_mastery < 70:
            weak_topics.append("Particles (は vs が, に vs で)")
        if verb_conjugation_mastery < 70:
            weak_topics.append("て-form & Verb Conjugation")

    # Recommendations
    recommended_lessons = []
    for topic in weak_topics:
        recommended_lessons.append({
            "title": f"Review Practice: {topic}",
            "type": "remedial",
            "topic": topic,
            "url": "/practice/mistakes"
        })
    
    if not recommended_lessons:
        recommended_lessons.append({
            "title": "Next JLPT N5 Lesson: て-form Conjugation",
            "type": "standard",
            "topic": "Verbs",
            "url": "/verbs"
        })

    return {
        "overall_mastery": round((flashcard_mastery + exam_accuracy) / 2 if latest_exam else flashcard_mastery, 1),
        "topic_mastery": {
            "Hiragana": min(100.0, round(hiragana_mastery, 1)),
            "Katakana": min(100.0, round(katakana_mastery, 1)),
            "N5 Vocabulary": min(100.0, round(n5_vocab_mastery, 1)),
            "Particles": min(100.0, round(particles_mastery, 1)),
            "Verb Conjugation": min(100.0, round(verb_conjugation_mastery, 1))
        },
        "weak_topics": weak_topics,
        "recommended_lessons": recommended_lessons
    }
