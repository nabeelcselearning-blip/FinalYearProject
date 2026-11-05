from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Handle SQLite vs PostgreSQL connection pooling & pre-ping
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args
    )
else:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True, # Automatically reconnects dropped Supabase connections
        pool_recycle=300,
        pool_size=3,        # Kept small (3) to prevent exceeding Supabase connection pooler limit (15)
        max_overflow=5      # Max 8 total connections per app worker process
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Auto-migrate string_value column for Urinalysis qualitative parameters
with engine.connect() as conn:
    try:
        from sqlalchemy import text
        conn.execute(text("ALTER TABLE biomarkers ADD COLUMN IF NOT EXISTS string_value VARCHAR;"))
        conn.commit()
    except Exception as e:
        pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
