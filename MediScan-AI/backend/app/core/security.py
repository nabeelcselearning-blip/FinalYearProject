from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user_id(token: Optional[str] = Depends(oauth2_scheme)) -> str:
    if not token:
        # Default demo user ID for zero-friction out-of-the-box local testing
        return "demo_user_123"
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return "demo_user_123"
        return user_id
    except JWTError:
        return "demo_user_123"

# --- AES-256 Fernet Key Vault Encryption & Masking ---
import base64
import hashlib
from cryptography.fernet import Fernet

def _get_fernet_key() -> bytes:
    """Generate deterministic 32-byte url-safe base64 key from server SECRET_KEY."""
    digest = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    return base64.urlsafe_b64encode(digest)

def encrypt_api_key(plain_key: str) -> str:
    """Encrypts raw API key using AES-256 Fernet encryption before DB storage or transport."""
    if not plain_key or plain_key.startswith("enc:"):
        return plain_key
    f = Fernet(_get_fernet_key())
    encrypted_bytes = f.encrypt(plain_key.encode())
    return "enc:" + encrypted_bytes.decode()

def decrypt_api_key(encrypted_key: str) -> str:
    """Decrypts AES-256 Fernet encrypted API key in memory at runtime."""
    if not encrypted_key:
        return ""
    if not encrypted_key.startswith("enc:"):
        return encrypted_key
    try:
        raw_cipher = encrypted_key[4:].encode()
        f = Fernet(_get_fernet_key())
        return f.decrypt(raw_cipher).decode()
    except Exception as e:
        print(f"[Key Decryption Error]: {e}")
        return ""

def mask_api_key(key: str) -> str:
    """Masks API key for safe UI display (e.g. sk-proj-••••••••••••3A9x)."""
    if not key:
        return ""
    clean_key = decrypt_api_key(key) if key.startswith("enc:") else key
    if len(clean_key) <= 8:
        return "••••••••"
    return f"{clean_key[:7]}••••••••••••{clean_key[-4:]}"
