# Employees router — CRUD operations
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db
from app.models import Employee, User
from app.schemas import EmployeeResponse, EmployeeCreate, EmployeeUpdate
from app.deps import hr_or_admin
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=List[EmployeeResponse])
def list_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    department_id: int = Query(None),
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """List all employees with optional filters"""
    query = db.query(Employee)
    
    if search:
        query = query.filter(
            (Employee.first_name.ilike(f"%{search}%")) |
            (Employee.last_name.ilike(f"%{search}%")) |
            (Employee.email.ilike(f"%{search}%"))
        )
    
    if department_id:
        query = query.filter(Employee.department_id == department_id)
    
    employees = query.offset(skip).limit(limit).all()
    return employees


@router.get("/{id}", response_model=EmployeeResponse)
def get_employee(
    id: int,
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """Get single employee by ID"""
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise NotFoundError("Employee", id)
    return emp


@router.post("", response_model=EmployeeResponse)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """Create a new employee"""
    emp = Employee(**payload.dict(), employee_code=f"WS{id(payload)}")
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


@router.put("/{id}", response_model=EmployeeResponse)
def update_employee(
    id: int,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """Update employee details"""
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise NotFoundError("Employee", id)
    
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(emp, key, value)
    
    db.commit()
    db.refresh(emp)
    return emp


@router.delete("/{id}")
def delete_employee(
    id: int,
    db: Session = Depends(get_db),
    _: User = Depends(hr_or_admin),
):
    """Delete employee (soft delete recommended in production)"""
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise NotFoundError("Employee", id)
    
    db.delete(emp)
    db.commit()
    return {"success": True, "message": "Employee deleted"}
