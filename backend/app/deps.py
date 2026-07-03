# FastAPI dependencies — current user, RBAC guards
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.core.security import decode_token, get_token_from_request
from app.models import User, UserRole


def get_current_user(
    token: str = Depends(get_token_from_request),
    db: Session = Depends(get_db),
) -> User:
    payload = decode_token(token)
    
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")
    
    return user


def require_role(*roles: UserRole):
    """Dependency factory — restricts access to specific roles"""
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[r.value for r in roles]}",
            )
        return current_user
    return dependency


# Convenience role guards
def admin_only(user: User = Depends(require_role(UserRole.SUPER_ADMIN))) -> User:
    return user

def hr_or_admin(user: User = Depends(require_role(UserRole.SUPER_ADMIN, UserRole.HR_MANAGER))) -> User:
    return user

def manager_or_above(user: User = Depends(require_role(
    UserRole.SUPER_ADMIN, UserRole.HR_MANAGER, UserRole.DEPT_MANAGER
))) -> User:
    return user
