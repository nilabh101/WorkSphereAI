# Leave requests router — CRUD, approve, reject, cancel
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.db.base import get_db
from app.models import LeaveRequest, User
from app.schemas import LeaveRequestCreate, LeaveRequestResponse
from app.deps import get_current_user, manager_or_above
from app.core.exceptions import NotFoundError, ForbiddenError

router = APIRouter(prefix="/leave", tags=["Leave"])


@router.get("", response_model=List[LeaveRequestResponse])
def list_leave_requests(
    status: str = Query(None),
    employee_id: int = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List leave requests — managers see all, employees see their own"""
    query = db.query(LeaveRequest)
    
    if current_user.role.value == "employee":
        # Employees only see their own leave requests
        if current_user.employee:
            query = query.filter(LeaveRequest.employee_id == current_user.employee.id)
        else:
            return []
    
    if employee_id:
        query = query.filter(LeaveRequest.employee_id == employee_id)
    
    if status:
        query = query.filter(LeaveRequest.status == status)
    
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=LeaveRequestResponse)
def create_leave_request(
    payload: LeaveRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a leave request"""
    if not current_user.employee:
        raise ForbiddenError("No employee record linked to this user")
    
    leave = LeaveRequest(
        employee_id=current_user.employee.id,
        **payload.dict(),
        status="pending",
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave


@router.patch("/{id}/approve")
def approve_leave(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager_or_above),
):
    """Approve a leave request"""
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == id).first()
    if not leave:
        raise NotFoundError("Leave request", id)
    
    leave.status = "approved"
    leave.approver_id = current_user.id
    leave.approved_at = datetime.utcnow()
    db.commit()
    return {"success": True, "message": "Leave approved"}


@router.patch("/{id}/reject")
def reject_leave(
    id: int,
    reason: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager_or_above),
):
    """Reject a leave request"""
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == id).first()
    if not leave:
        raise NotFoundError("Leave request", id)
    
    leave.status = "rejected"
    leave.notes = reason
    leave.approver_id = current_user.id
    db.commit()
    return {"success": True, "message": "Leave rejected"}


@router.patch("/{id}/cancel")
def cancel_leave(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancel a leave request"""
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == id).first()
    if not leave:
        raise NotFoundError("Leave request", id)
    
    # Only the requester or a manager can cancel
    if leave.employee_id != getattr(current_user.employee, 'id', None) and \
       current_user.role.value not in ("hr_manager", "superadmin", "dept_manager"):
        raise ForbiddenError()
    
    leave.status = "cancelled"
    db.commit()
    return {"success": True, "message": "Leave cancelled"}
