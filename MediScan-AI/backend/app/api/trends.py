from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.database import Report
from app.schemas.reports import HealthTrendPoint

router = APIRouter(prefix="/trends", tags=["Health Trends"])

@router.get("/", response_model=List[HealthTrendPoint])
@router.get("", response_model=List[HealthTrendPoint])
def get_health_trends(
    environment: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    query = db.query(Report).filter(Report.user_id == user_id)
    if environment:
        target_env = environment.strip().lower()
        if target_env == "production":
            query = query.filter((Report.environment == "production") | (Report.environment == None))
        else:
            query = query.filter(Report.environment == target_env)
    reports = query.order_by(Report.upload_date.asc()).all()
    
    # Track date counts to avoid duplicate identical X-axis labels on same-day uploads
    date_counts: dict[str, int] = {}
    
    # First pass: count date string occurrences
    for r in reports:
        d_str = r.upload_date.strftime("%b %d, %Y")
        date_counts[d_str] = date_counts.get(d_str, 0) + 1

    date_seen: dict[str, int] = {}
    trend_points = []
    for r in reports:
        bm_map = {b.canonical_name: b.value for b in r.biomarkers}
        base_date = r.upload_date.strftime("%b %d, %Y")
        
        if date_counts[base_date] > 1:
            date_seen[base_date] = date_seen.get(base_date, 0) + 1
            display_date = f"{base_date} (#{date_seen[base_date]})"
        else:
            display_date = base_date

        trend_points.append(HealthTrendPoint(
            report_id=r.id,
            date=display_date,
            health_score=r.overall_health_score,
            risk_category=r.health_risk_category,
            biomarkers=bm_map
        ))

    return trend_points
