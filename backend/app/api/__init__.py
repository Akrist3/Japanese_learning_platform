from fastapi import APIRouter
from app.api import (
    auth, onboarding, user, kana, vocabulary, kanji, grammar, verbs,
    flashcards, gamification, jlpt, exams, listening, reading, speaking,
    dictionary, ai_tutor, mistakes, resources, admin
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(onboarding.router)
api_router.include_router(user.router)
api_router.include_router(kana.router)
api_router.include_router(vocabulary.router)
api_router.include_router(kanji.router)
api_router.include_router(grammar.router)
api_router.include_router(verbs.router)
api_router.include_router(flashcards.router)
api_router.include_router(gamification.router)
api_router.include_router(jlpt.router)
api_router.include_router(exams.router)
api_router.include_router(listening.router)
api_router.include_router(reading.router)
api_router.include_router(speaking.router)
api_router.include_router(dictionary.router)
api_router.include_router(ai_tutor.router)
api_router.include_router(mistakes.router)
api_router.include_router(resources.router)
api_router.include_router(admin.router)
