# Centralized error handling — custom exceptions and FastAPI exception handlers
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


class WorkSphereError(Exception):
    """Base application error"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(WorkSphereError):
    def __init__(self, resource: str, id: int | str):
        super().__init__(f"{resource} with id '{id}' not found", status_code=404)


class ConflictError(WorkSphereError):
    def __init__(self, message: str):
        super().__init__(message, status_code=409)


class ForbiddenError(WorkSphereError):
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, status_code=403)


class ValidationError(WorkSphereError):
    def __init__(self, message: str):
        super().__init__(message, status_code=422)


# ─── Exception Handlers ───────────────────────────────────────────────────────

def _error_response(status_code: int, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "error": message},
    )


async def worksphere_exception_handler(request: Request, exc: WorkSphereError) -> JSONResponse:
    return _error_response(exc.status_code, exc.message)


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = []
    for err in exc.errors():
        loc = " → ".join(str(x) for x in err["loc"] if x != "body")
        errors.append(f"{loc}: {err['msg']}")
    return _error_response(status.HTTP_422_UNPROCESSABLE_ENTITY, "; ".join(errors))


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return _error_response(500, "Internal server error — please try again")
