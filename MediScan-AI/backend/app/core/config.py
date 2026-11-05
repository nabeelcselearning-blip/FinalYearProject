import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediScan AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "mediscan_secret_key_change_in_production_32bytes_long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # AI Provider Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")

    PRIMARY_MODEL: str = os.getenv("PRIMARY_MODEL", "openai/gpt-oss-120b")
    FAST_MODEL: str = os.getenv("FAST_MODEL", "openai/gpt-oss-120b")
    VISION_MODEL: str = os.getenv("VISION_MODEL", "qwen/qwen3.6-27b")
    FALLBACK_MODELS: list[str] = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
    
    # Database & Storage
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mediscan.db")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Upload limits
    MAX_UPLOAD_SIZE_MB: int = 15
    ALLOWED_EXTENSIONS: set[str] = {"pdf", "png", "jpg", "jpeg", "webp", "bmp"}

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
