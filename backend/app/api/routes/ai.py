from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_services import AIService

router = APIRouter()
ai_service = AIService()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    status: str = "success"

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Endpoint for AI Assistant.
    """
    try:
        response_text = await ai_service.get_chat_response(request.message)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks/suggestions")
async def get_task_suggestions():
    """
    Endpoint for AI-generated task suggestions.
    """
    try:
        suggestions = await ai_service.generate_task_suggestions()
        return {"suggestions": suggestions}
    except Exception as e:
        return {"suggestions": [{"id": "0", "title": "Error", "subtitle": "Gagal memuat saran AI", "type": "alert", "action": "NONE"}]}
