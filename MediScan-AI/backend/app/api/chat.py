from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.database import ChatHistory
from app.schemas.reports import ChatRequest, ChatResponse
from app.services.groq_ai_service import generate_chat_response, get_token_usage_stats

router = APIRouter(prefix="/chat", tags=["AI Health Assistant"])

@router.get("/token-usage")
@router.get("/token-usage/")
def get_ai_token_usage():
    """Get cumulative AI token consumption metrics across all LLM operations."""
    return get_token_usage_stats()

@router.post("/", response_model=ChatResponse)
def ask_ai_health_assistant(
    chat_req: ChatRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    # Save user message
    u_msg = ChatHistory(user_id=user_id, role="user", content=chat_req.message)
    db.add(u_msg)

    # Retrieve chat history for context
    history = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.created_at.desc()).limit(6).all()
    formatted_msgs = [{"role": h.role, "content": h.content} for h in reversed(history)]
    if not formatted_msgs or formatted_msgs[-1]["content"] != chat_req.message:
        formatted_msgs.append({"role": "user", "content": chat_req.message})

    # Generate response via Groq
    reply = generate_chat_response(formatted_msgs)

    # Save assistant message
    a_msg = ChatHistory(user_id=user_id, role="assistant", content=reply)
    db.add(a_msg)
    db.commit()

    return ChatResponse(reply=reply)
