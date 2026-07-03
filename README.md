# WorkSphere AI

Enterprise-grade AI-powered workforce management platform — shift planning, fatigue monitoring, leave management, attendance, RBAC, and analytics.

---

## Architecture

```
WorkSphereAI/
├── src/                          # React (Vite) frontend — main app
│   ├── app/
│   │   ├── App.tsx               # Root component, auth + layout shell
│   │   └── components/ui/        # shadcn/ui component library
│   ├── components/shared/        # Shared components (Avatar, Badge, KpiCard...)
│   ├── data/index.ts             # Mock data (replace with API hooks)
│   ├── features/                 # Feature-sliced screens
│   │   ├── ai-insights/          # AI fatigue risk recommendations
│   │   ├── analytics/            # Executive analytics dashboard
│   │   ├── audit/                # Immutable audit logs
│   │   ├── dashboard/            # Main KPI overview
│   │   ├── employees/            # Employee profiles + management
│   │   ├── heatmap/              # Workforce workload heatmap
│   │   ├── leave-ot/             # Leave & overtime requests
│   │   ├── notifications/        # Notification center
│   │   ├── rbac/                 # Roles & permissions
│   │   ├── settings/             # App & org settings
│   │   └── shifts/               # Weekly shift planner
│   ├── types/index.ts            # Shared TypeScript types
│   └── styles/                   # Global CSS + Tailwind theme
│
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py               # FastAPI app, CORS, middleware
│   │   ├── models.py             # SQLAlchemy ORM models
│   │   ├── schemas.py            # Pydantic request/response schemas
│   │   ├── deps.py               # Auth dependencies, RBAC guards
│   │   ├── core/
│   │   │   ├── config.py         # Settings via pydantic-settings
│   │   │   ├── security.py       # JWT, password hashing
│   │   │   ├── logging.py        # Structured logging
│   │   │   └── exceptions.py     # Custom exceptions + handlers
│   │   ├── db/
│   │   │   └── base.py           # SQLAlchemy engine + session
│   │   └── routers/
│   │       ├── auth.py           # POST /auth/login, refresh, me
│   │       ├── employees.py      # GET/POST/PUT/DELETE /employees
│   │       ├── leave.py          # Leave CRUD + approve/reject
│   │       └── analytics.py      # Dashboard stats, heatmap, fatigue
│   ├── tests/
│   │   └── test_auth.py          # Unit + API tests for auth
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile                # Backend container
│   └── .env.example              # Environment template
│
├── docker-compose.yml            # Full stack orchestration
├── frontend/                     # Next.js app (API client + types)
│   └── src/lib/api.ts            # Axios API client (ready for use)
└── guidelines/
    └── Guidelines.md             # Design & coding guidelines
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, TypeScript, Tailwind CSS 4 |
| UI Library | shadcn/ui, Radix UI, Recharts, Lucide React |
| Backend | FastAPI 0.115, Python 3.12 |
| ORM | SQLAlchemy 2.0, Alembic |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Validation | Pydantic v2 (backend), Zod (frontend) |
| API Client | Axios with interceptors |
| Container | Docker + docker-compose |

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@worksphere.ai | admin123 |
| HR Manager | hr@worksphere.ai | hr123 |
| Dept Manager | manager@worksphere.ai | mgr123 |
| Employee | emp@worksphere.ai | emp123 |

---

## Quick Start

### Frontend only (no backend needed)

The frontend runs fully with mock data — no backend required to view all features.

```bash
npm install
npm run dev
# Open http://localhost:5173
```

### Full stack with Docker

```bash
# Copy and configure environment
cp backend/.env.example backend/.env

# Start all services (db + backend + frontend)
docker-compose up -d

# View logs
docker-compose logs -f backend
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc

### Backend only (development)

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate        # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your DB credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

---

## API Reference

Base URL: `http://localhost:8000/api/v1`

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login with email + password |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout |

### Employees
| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | List employees (filter, paginate) |
| POST | `/employees` | Create employee |
| GET | `/employees/{id}` | Get employee |
| PUT | `/employees/{id}` | Update employee |
| DELETE | `/employees/{id}` | Delete employee |

### Leave
| Method | Endpoint | Description |
|---|---|---|
| GET | `/leave` | List leave requests |
| POST | `/leave` | Submit leave request |
| PATCH | `/leave/{id}/approve` | Approve leave |
| PATCH | `/leave/{id}/reject` | Reject leave |
| PATCH | `/leave/{id}/cancel` | Cancel leave |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/dashboard` | KPI stats |
| GET | `/analytics/fatigue` | Fatigue overview |
| GET | `/analytics/staffing` | Staffing coverage |
| GET | `/analytics/heatmap` | Workload heatmap |

Full interactive documentation at `/docs` (Swagger UI).

---

## RBAC — Roles & Permissions

| Permission | Super Admin | HR Manager | Dept Manager | Employee |
|---|:---:|:---:|:---:|:---:|
| View all employees | ✅ | ✅ | ✅ | ❌ |
| Edit employee records | ✅ | ✅ | ❌ | ❌ |
| Approve leave | ✅ | ✅ | ✅ | ❌ |
| Approve overtime | ✅ | ✅ | ✅ | ❌ |
| View analytics | ✅ | ✅ | ❌ | ❌ |
| Export reports | ✅ | ✅ | ❌ | ❌ |
| Edit shifts | ✅ | ✅ | ✅ | ❌ |
| RBAC management | ✅ | ❌ | ❌ | ❌ |
| Submit leave request | ✅ | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ | ✅ |

---

## Database Schema (ER Summary)

```
users (id, email, hashed_password, role, is_active, created_at)
    ↓ 1:1
employees (id, user_id→users, employee_code, first_name, last_name,
           email, phone, department_id→departments, job_title, status,
           hire_date, fatigue_score, wellness_score, attendance_rate)
    ↓ 1:N                              ↓ 1:N
shifts (id, employee_id, department_id,    leave_requests (id, employee_id,
        date, start_time, end_time,                        leave_type, start_date,
        shift_type, hours, status,                         end_date, days, status,
        has_conflict, notes)                               reason, approver_id)

departments (id, name, code, head_id→employees, employee_count)

audit_logs (id, user_id, action, resource_type, resource_id,
            details, ip_address, created_at)
```

---

## Running Tests

```bash
cd backend
pip install pytest pytest-asyncio
pytest tests/ -v
```

---

## Feature Screens

| Screen | Route (state) | Status |
|---|---|---|
| Dashboard | `dashboard` | ✅ Complete |
| Employees | `employees` | ✅ Complete |
| Shift Planner | `shifts` | ✅ Complete |
| Leave & OT | `leave` | ✅ Complete |
| AI Insights | `ai-insights` | ✅ Complete |
| Analytics | `analytics` | ✅ Complete |
| Heatmap | `heatmap` | ✅ Complete |
| Notifications | `notifications` | ✅ Complete |
| Audit Logs | `audit` | ✅ Complete |
| RBAC | `roles` | ✅ Complete |
| Settings | `settings` | ✅ Complete |
| Departments | `departments` | 🔧 Placeholder |
| Attendance | `attendance` | 🔧 Placeholder |
| Payroll | `payroll` | 🔧 Placeholder |

---

## Environment Variables

See `backend/.env.example` for all variables with descriptions.

Critical production settings:
- `SECRET_KEY` — change to a random 256-bit hex string
- `DATABASE_URL` — PostgreSQL connection string
- `ALLOWED_ORIGINS` — comma-separated list of allowed frontend origins

---

## Deployment Checklist

- [ ] Set strong `SECRET_KEY` (minimum 32 chars, random)
- [ ] Use a managed PostgreSQL instance (AWS RDS, Supabase, etc.)
- [ ] Run `alembic upgrade head` before first start
- [ ] Set `DEBUG=false` and `APP_ENV=production`
- [ ] Configure HTTPS (reverse proxy: nginx/Caddy)
- [ ] Set up log aggregation (Datadog, Loki, etc.)
- [ ] Enable database connection pooling (PgBouncer)
- [ ] Configure rate limiting on auth endpoints
