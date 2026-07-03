# Unit and API tests for authentication
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.base import Base, get_db
from app.models import User, UserRole
from app.core.security import hash_password, verify_password, create_access_token, decode_token

# ─── Test Database Setup ──────────────────────────────────────────────────────
SQLITE_URL = "sqlite:///./test.db"
test_engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=test_engine)
    # Create test user
    db = TestSession()
    user = User(
        email="test@worksphere.ai",
        hashed_password=hash_password("test123"),
        role=UserRole.HR_MANAGER,
    )
    db.add(user)
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


# ─── Security Unit Tests ──────────────────────────────────────────────────────

class TestPasswordHashing:
    def test_hash_and_verify(self):
        plain = "SecurePass@123"
        hashed = hash_password(plain)
        assert hashed != plain
        assert verify_password(plain, hashed)
    
    def test_wrong_password_fails(self):
        hashed = hash_password("correctPassword")
        assert not verify_password("wrongPassword", hashed)


class TestJWTTokens:
    def test_create_and_decode_access_token(self):
        token = create_access_token(subject=42, extra={"role": "hr_manager"})
        payload = decode_token(token)
        assert payload["sub"] == "42"
        assert payload["type"] == "access"
        assert payload["role"] == "hr_manager"
    
    def test_invalid_token_raises(self):
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc:
            decode_token("definitely.not.valid")
        assert exc.value.status_code == 401


# ─── Auth API Tests ───────────────────────────────────────────────────────────

class TestLoginEndpoint:
    def test_login_success(self):
        resp = client.post("/api/v1/auth/login", json={
            "email": "test@worksphere.ai",
            "password": "test123",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_wrong_password(self):
        resp = client.post("/api/v1/auth/login", json={
            "email": "test@worksphere.ai",
            "password": "wrongpass",
        })
        assert resp.status_code == 401
    
    def test_login_nonexistent_user(self):
        resp = client.post("/api/v1/auth/login", json={
            "email": "nobody@worksphere.ai",
            "password": "any",
        })
        assert resp.status_code == 401
    
    def test_login_invalid_email_format(self):
        resp = client.post("/api/v1/auth/login", json={
            "email": "not-an-email",
            "password": "pass",
        })
        assert resp.status_code == 422


class TestProtectedEndpoints:
    def _get_token(self) -> str:
        resp = client.post("/api/v1/auth/login", json={
            "email": "test@worksphere.ai",
            "password": "test123",
        })
        return resp.json()["access_token"]
    
    def test_me_with_valid_token(self):
        token = self._get_token()
        resp = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 200
        assert resp.json()["email"] == "test@worksphere.ai"
    
    def test_me_without_token(self):
        resp = client.get("/api/v1/auth/me")
        assert resp.status_code == 401
    
    def test_me_with_invalid_token(self):
        resp = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"},
        )
        assert resp.status_code == 401
