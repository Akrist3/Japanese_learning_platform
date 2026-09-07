from fastapi import APIRouter, Depends
from app.schemas.schemas import AITutorRequest
from app.services.ai_service import generate_ai_tutor_response

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/tutor")
async def ask_ai_tutor(req: AITutorRequest):
    return await generate_ai_tutor_response(req.query, req.context or "", req.mode)
