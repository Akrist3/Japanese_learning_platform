import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from app.database import get_db
from app.models.models import MockExam, ExamResult, User, UserMistake, UserProgress
from app.schemas.schemas import ExamSubmission
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/exams", tags=["exams"])

@router.get("/list")
def get_mock_exams(jlpt_level: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(MockExam)
    if jlpt_level:
        query = query.filter(MockExam.jlpt_level == jlpt_level)
    return query.all()

@router.get("/{exam_id}")
def get_mock_exam_detail(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(MockExam).filter(MockExam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Mock Exam not found")
    
    questions = json.loads(exam.questions_json)
    # Hide correct answers from client during active test
    sanitized_questions = []
    for q in questions:
        q_copy = q.copy()
        q_copy.pop("correct_option", None)
        q_copy.pop("explanation", None)
        sanitized_questions.append(q_copy)

    return {
        "id": exam.id,
        "title": exam.title,
        "jlpt_level": exam.jlpt_level,
        "duration_minutes": exam.duration_minutes,
        "total_questions": exam.total_questions,
        "questions": sanitized_questions
    }

@router.post("/submit")
def submit_mock_exam(
    submission: ExamSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exam = db.query(MockExam).filter(MockExam.id == submission.mock_exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Mock exam not found")

    questions = json.loads(exam.questions_json)
    score = 0
    max_score = len(questions)
    
    section_stats = {}
    weak_areas = []

    for q in questions:
        q_id = str(q["id"])
        user_choice = submission.answers.get(q_id)
        section = q.get("section", "General")
        
        if section not in section_stats:
            section_stats[section] = {"correct": 0, "total": 0}
        section_stats[section]["total"] += 1

        is_correct = (user_choice is not None) and (int(user_choice) == q["correct_option"])
        if is_correct:
            score += 1
            section_stats[section]["correct"] += 1
        else:
            # Auto log mistake
            opt_str = str(user_choice) if user_choice is not None else "No answer"
            correct_text = q["options"][q["correct_option"]]
            mistake = UserMistake(
                user_id=current_user.id,
                topic=f"JLPT {exam.jlpt_level} - {section}",
                question_text=q["question"],
                user_answer=opt_str,
                correct_answer=correct_text,
                explanation=q.get("explanation", "Review this section.")
            )
            db.add(mistake)

    percentage = round((score / max_score) * 100, 1) if max_score > 0 else 0.0

    # Calculate section percentages & weak areas
    section_scores = {}
    for sec, stat in section_stats.items():
        sec_pct = round((stat["correct"] / stat["total"]) * 100, 1) if stat["total"] > 0 else 0.0
        section_scores[sec] = sec_pct
        if sec_pct < 70.0:
            weak_areas.append(sec)

    exam_result = ExamResult(
        user_id=current_user.id,
        mock_exam_id=exam.id,
        score=score,
        max_score=max_score,
        percentage=percentage,
        time_spent_seconds=submission.time_spent_seconds,
        section_scores_json=json.dumps(section_scores),
        weak_areas_json=json.dumps(weak_areas)
    )
    db.add(exam_result)

    # Award XP for exam completion
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    if progress:
        progress.xp += int(percentage * 2)  # up to 200 XP
        progress.level = max(1, (progress.xp // 100) + 1)

    db.commit()

    return {
        "result_id": exam_result.id,
        "score": score,
        "max_score": max_score,
        "percentage": percentage,
        "time_spent_seconds": submission.time_spent_seconds,
        "section_scores": section_scores,
        "weak_areas": weak_areas,
        "earned_xp": int(percentage * 2)
    }

@router.get("/results/my")
def get_my_exam_results(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    results = db.query(ExamResult).filter(ExamResult.user_id == current_user.id).order_by(ExamResult.completed_at.desc()).all()
    out = []
    for r in results:
        exam = db.query(MockExam).filter(MockExam.id == r.mock_exam_id).first()
        out.append({
            "id": r.id,
            "exam_title": exam.title if exam else "JLPT Practice Exam",
            "jlpt_level": exam.jlpt_level if exam else "N5",
            "score": r.score,
            "max_score": r.max_score,
            "percentage": r.percentage,
            "time_spent_seconds": r.time_spent_seconds,
            "section_scores": json.loads(r.section_scores_json),
            "weak_areas": json.loads(r.weak_areas_json),
            "completed_at": r.completed_at
        })
    return out
