# Pydantic schemas — request/response models
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional
from app.models import UserRole


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    id: int
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ─── Employee Schemas ─────────────────────────────────────────────────────────

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    department_id: Optional[int] = None
    job_title: Optional[str] = None
    status: str = "active"


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    department_id: Optional[int] = None
    job_title: Optional[str] = None
    status: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int
    employee_code: str
    fatigue_score: float
    wellness_score: float
    attendance_rate: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# ─── Leave Schemas ────────────────────────────────────────────────────────────

class LeaveRequestCreate(BaseModel):
    leave_type: str
    start_date: datetime
    end_date: datetime
    days: int
    reason: str


class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: int
    leave_type: str
    start_date: datetime
    end_date: datetime
    days: int
    status: str
    reason: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ─── Generic ──────────────────────────────────────────────────────────────────

class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[dict] = None
