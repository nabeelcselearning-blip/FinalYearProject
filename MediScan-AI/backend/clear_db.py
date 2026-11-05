import os
from app.core.database import SessionLocal
from app.models.database import Report, Biomarker, ChatHistory

def clear_all_data():
    db = SessionLocal()
    try:
        db.query(Biomarker).delete()
        db.query(Report).delete()
        db.query(ChatHistory).delete()
        db.commit()
        print("Successfully wiped all reports, biomarkers, and dummy data!")
    except Exception as e:
        db.rollback()
        print(f"Error wiping data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_all_data()

