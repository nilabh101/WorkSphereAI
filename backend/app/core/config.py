# Core configuration — environment variables and app settings
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App
    APP_NAME: str = "WorkSphere AI API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Database
    DATABASE_URL: str = "postgresql+psycopg2://worksphere:password@localhost:5432/worksphere_db"
    
    # Auth
    SECRET_KEY: str = "change-me-to-a-random-256-bit-hex-string-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # First Admin
    ADMIN_EMAIL: str = "admin@worksphere.ai"
    ADMIN_PASSWORD: str = "Admin@123"
    ADMIN_NAME: str = "Arjun Sharma"
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
