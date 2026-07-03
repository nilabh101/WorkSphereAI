# Analytics router — dashboard stats, fatigue, staffing, compliance
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.base import get_db
from app.models import Employee, Shift, LeaveRequest, User
from app.deps import hr_or_admin

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
def dashboard_stats(
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """Aggregate KPI stats for the dashboard"""
    total = db.query(func.count(Employee.id)).scalar() or 0
    active = db.query(func.count(Employee.id)).filter(Employee.status == "active").scalar() or 0
    pending_leaves = db.query(func.count(LeaveRequest.id)).filter(LeaveRequest.status == "pending").scalar() or 0
    
    return {
        "total_employees": total,
        "active_employees": active,
        "high_fatigue_count": db.query(func.count(Employee.id)).filter(Employee.fatigue_score >= 70).scalar() or 0,
        "avg_attendance": db.query(func.avg(Employee.attendance_rate)).scalar() or 0.0,
        "compliance_score": 87.3,  # TODO: calculate from compliance table
        "shift_coverage": 91.4,    # TODO: calculate from shift assignments
        "pending_leaves": pending_leaves,
        "burnout_risk_count": db.query(func.count(Employee.id)).filter(Employee.fatigue_score >= 80).scalar() or 0,
    }


@router.get("/fatigue")
def fatigue_overview(
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """Fatigue distribution across the organization"""
    rows = db.query(Employee.first_name, Employee.last_name, Employee.fatigue_score).all()
    return {
        "employees": [
            {"name": f"{r.first_name} {r.last_name}", "score": r.fatigue_score}
            for r in rows
        ]
    }


@router.get("/staffing")
def staffing_coverage(
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """Staffing coverage by department"""
    return {
        "data": [
            {"dept": "Engineering", "required": 52, "actual": 49},
            {"dept": "Operations",  "required": 38, "actual": 28},
            {"dept": "Security",    "required": 24, "actual": 22},
            {"dept": "HR",          "required": 18, "actual": 18},
            {"dept": "Finance",     "required": 15, "actual": 14},
        ]
    }


@router.get("/heatmap")
def workload_heatmap(
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """Weekly workload heatmap data"""
    return {
        "data": [
            {"team": "Engineering", "Mon": 72, "Tue": 78, "Wed": 81, "Thu": 75, "Fri": 68, "Sat": 35, "Sun": 28},
            {"team": "Operations",  "Mon": 88, "Tue": 91, "Wed": 87, "Thu": 93, "Fri": 85, "Sat": 72, "Sun": 65},
            {"team": "Security",    "Mon": 62, "Tue": 65, "Wed": 68, "Thu": 71, "Fri": 64, "Sat": 82, "Sun": 85},
            {"team": "HR",          "Mon": 45, "Tue": 48, "Wed": 52, "Thu": 47, "Fri": 41, "Sat": 15, "Sun": 12},
            {"team": "ICU",         "Mon": 95, "Tue": 89, "Wed": 92, "Thu": 96, "Fri": 90, "Sat": 88, "Sun": 85},
        ]
    }
