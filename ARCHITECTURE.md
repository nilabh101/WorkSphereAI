# WorkSphere AI — System Architecture

> Production-ready enterprise workforce management platform with AI-powered fatigue monitoring, shift planning, and RBAC.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│  React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST + JWT Bearer
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY / CORS                        │
│                 FastAPI 0.115 + Uvicorn                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Router  │  │ Employee API │  │ Analytics API│  ...│
│  └──────────────┘  └──────────────┘  └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│              Business Logic + RBAC Guards                   │
│           SQLAlchemy ORM + Pydantic Validation              │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL
                       ↓
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL 16 (Primary DB)                    │
│  users | employees | shifts | leave_requests | audit_logs  │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Stack
- **React 18.3.1** — UI library
- **Vite 6.3.5** — build tool (instant HMR, optimized prod bundle)
- **TypeScript** — type safety
- **Tailwind CSS 4** — utility-first styling
- **shadcn/ui + Radix UI** — accessible component primitives
- **Recharts** — charts & data visualization
- **Lucide React** — icons

### File Organization (Feature-Sliced Design)
```
src/
├── app/
│   ├── App.tsx                     # Root — auth, routing, layout shell
│   └── components/ui/              # 50+ shadcn components
├── components/shared/              # Shared across features
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   ├── KpiCard.tsx
│   ├── ProgressBar.tsx
│   └── SectionHeader.tsx
├── features/                       # Feature-sliced screens
│   ├── dashboard/DashboardScreen.tsx
│   ├── employees/EmployeeProfileScreen.tsx
│   ├── shifts/ShiftPlannerScreen.tsx
│   ├── leave-ot/LeaveOTScreen.tsx
│   ├── ai-insights/AIInsightsScreen.tsx
│   ├── analytics/AnalyticsScreen.tsx
│   ├── heatmap/HeatmapScreen.tsx
│   ├── notifications/NotificationsScreen.tsx
│   ├── audit/AuditLogsScreen.tsx
│   ├── rbac/RBACScreen.tsx
│   └── settings/SettingsScreen.tsx
├── data/index.ts                   # Mock data + API integration layer
├── types/index.ts                  # Shared TS interfaces
└── styles/                         # Global CSS, Tailwind theme
```

### State Management
- **Local state** — `useState` for component-level state
- **Server state** (when integrated) — TanStack Query (React Query)
- **Auth state** (when integrated) — Zustand store + cookies

### Routing Strategy
Current: State-based page switching (`useState<Page>`)  
Recommended: Migrate to React Router v7 for proper URL routing, deep links, and back-button support.

---

## Backend Architecture

### Stack
- **FastAPI 0.115** — async web framework
- **SQLAlchemy 2.0** — ORM with declarative models
- **PostgreSQL 16** — relational database
- **Pydantic v2** — request/response validation
- **python-jose** — JWT tokens
- **passlib + bcrypt** — password hashing
- **Alembic** — database migrations

### Layered Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (FastAPI Routers)                       │
│  - Receive HTTP requests                                    │
│  - Parse & validate with Pydantic                           │
│  - Invoke service/business logic                            │
│  - Return JSON responses                                    │
├─────────────────────────────────────────────────────────────┤
│  SERVICE LAYER (Business Logic)                             │
│  - Complex workflows (shift conflict detection, fatigue)    │
│  - RBAC enforcement (role guards, permission checks)        │
│  - Audit logging                                            │
├─────────────────────────────────────────────────────────────┤
│  DATA ACCESS LAYER (SQLAlchemy ORM)                         │
│  - Models (User, Employee, Shift, LeaveRequest...)          │
│  - CRUD operations                                          │
│  - Relationships & joins                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                                      │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema Highlights
- **users** — auth + roles (superadmin, hr_manager, dept_manager, employee)
- **employees** — profile, department, fatigue/wellness scores, attendance rate
- **shifts** — scheduling, conflict flags, status (scheduled/completed/cancelled)
- **leave_requests** — CRUD + approval workflow (pending → approved/rejected)
- **audit_logs** — immutable trail (user, action, target, timestamp, IP)

**Relationships:**
- users 1:1 employees (optional for non-employee users)
- employees N:1 departments
- employees 1:N shifts
- employees 1:N leave_requests

**Indexes:**
- Primary keys (id columns)
- Unique constraints (user.email, employee.employee_code, dept.code)
- Foreign key indexes automatically created
- Date indexes on shifts, audit_logs for time-based queries

---

## Authentication & Authorization

### JWT Flow
1. Client sends `POST /api/v1/auth/login` with email + password
2. Backend validates credentials, generates:
   - **Access token** (60 min expiry) — short-lived, used for all API calls
   - **Refresh token** (30 days expiry) — long-lived, used to get new access tokens
3. Client stores tokens (cookies or localStorage)
4. Client includes access token in `Authorization: Bearer <token>` header
5. On 401 response, client uses refresh token to get new access token via `POST /api/v1/auth/refresh`

### RBAC Implementation
- **Roles**: `superadmin`, `hr_manager`, `dept_manager`, `employee`
- **Role guards** (deps.py): `require_role(*roles)`, `admin_only()`, `hr_or_admin()`, `manager_or_above()`
- Permission matrix checked at route level via dependency injection

Example:
```python
@router.post("/employees", dependencies=[Depends(hr_or_admin)])
def create_employee(...):
    # Only HR managers or admins can create employees
```

### Security Best Practices
✅ Passwords hashed with bcrypt (12 rounds)  
✅ JWT signed with HMAC-SHA256 (configurable algorithm)  
✅ Token expiry enforced (access: 60min, refresh: 30d)  
✅ CORS restricted to allowed origins only  
✅ SQL injection prevented (SQLAlchemy parameterized queries)  
✅ Input validation via Pydantic (type coercion, constraints)  

🔧 **TODO (Production)**:
- Rate limiting on auth endpoints (e.g., 5 login attempts per IP per minute)
- Refresh token rotation (invalidate after use)
- Token blacklist for immediate logout
- HTTPS enforcement
- CSRF protection for cookie-based auth

---

## API Design Principles

### RESTful Resource Naming
- Plural nouns for collections: `/employees`, `/shifts`, `/leave-requests`
- Resource IDs in path: `/employees/{id}`
- Actions as HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Sub-resource actions: `PATCH /leave/{id}/approve`

### Response Format
```json
{
  "data": { ... },         // Single resource or array
  "message": "Success",    // Optional message
  "total": 150,            // For paginated lists
  "page": 1,
  "size": 20
}
```

Error responses:
```json
{
  "success": false,
  "error": "Employee with id '42' not found"
}
```

### Pagination
- Query params: `?page=1&size=20&sort_by=created_at&sort_order=desc`
- Response includes `total`, `page`, `size`

### Filtering & Search
- `/employees?search=john&department_id=3&status=active`

---

## Data Flow Examples

### 1. Login Flow
```
Client                     Backend                    Database
  │                          │                          │
  ├─ POST /auth/login ───────┤                          │
  │  {email, password}        │                          │
  │                           ├─ Query user by email ───┤
  │                           │                          │
  │                           ├─ Verify password         │
  │                           ├─ Generate JWT tokens     │
  │                           │                          │
  │  ←─── {access, refresh} ─┤                          │
  │                           │                          │
```

### 2. Approve Leave Request (with RBAC)
```
Client                     Backend                    Database
  │                          │                          │
  ├─ PATCH /leave/7/approve ┤                          │
  │  Bearer: <token>         │                          │
  │                           ├─ Decode JWT, get user   │
  │                           ├─ Check role ≥ manager   │
  │                           │  (RBAC guard)            │
  │                           ├─ Update leave.status ───┤
  │                           ├─ Set approver_id ────────┤
  │                           ├─ Create audit log ───────┤
  │                           │                          │
  │  ←─── {success: true} ───┤                          │
```

### 3. Dashboard KPI Aggregation
```
Client                     Backend                    Database
  │                          │                          │
  ├─ GET /analytics/dashboard ┤                         │
  │  Bearer: <token>          │                         │
  │                            ├─ Decode JWT, get user  │
  │                            ├─ Check role ≥ HR       │
  │                            ├─ COUNT(*) employees ───┤
  │                            ├─ COUNT WHERE fatigue>70 ┤
  │                            ├─ AVG attendance_rate ──┤
  │                            ├─ COUNT pending leaves ─┤
  │                            │                         │
  │  ←─── {total: 150, ...} ──┤                         │
```

---

## Deployment Architecture (Production)

```
┌──────────────────────────────────────────────────────────────┐
│                      CLOUD PROVIDER                          │
│  (AWS / Azure / GCP / DigitalOcean / Fly.io)                │
├──────────────────────────────────────────────────────────────┤
│  Load Balancer / Reverse Proxy (nginx / Caddy / AWS ALB)   │
│  ├─ HTTPS termination                                        │
│  ├─ Rate limiting                                            │
│  └─ Static file serving (frontend build)                    │
├──────────────────────────────────────────────────────────────┤
│  Application Servers (Docker containers / ECS / K8s)        │
│  ├─ Backend API (uvicorn workers × N)                       │
│  └─ Frontend (served as static files)                       │
├──────────────────────────────────────────────────────────────┤
│  Managed Database (AWS RDS / Supabase / Railway)            │
│  └─ PostgreSQL with automated backups + read replicas       │
├──────────────────────────────────────────────────────────────┤
│  Object Storage (S3 / Cloudflare R2)                        │
│  └─ Employee avatars, report PDFs                           │
├──────────────────────────────────────────────────────────────┤
│  Monitoring & Logging                                        │
│  ├─ Application logs (Datadog / Loki / CloudWatch)          │
│  ├─ Error tracking (Sentry)                                 │
│  └─ Metrics (Prometheus + Grafana)                          │
└──────────────────────────────────────────────────────────────┘
```

### Recommended Services
- **Frontend hosting**: Vercel, Netlify, Cloudflare Pages (CDN + auto SSL)
- **Backend hosting**: Fly.io, Railway, AWS ECS, GCP Cloud Run
- **Database**: Supabase, Neon, AWS RDS PostgreSQL
- **Secrets**: AWS Secrets Manager, HashiCorp Vault
- **CI/CD**: GitHub Actions, GitLab CI

---

## Performance Considerations

### Backend Optimizations
- **Connection pooling** — SQLAlchemy pool (default 5 connections, configurable)
- **Query optimization** — Use joins, avoid N+1 queries, add indexes
- **Pagination** — Limit result sets (default 20, max 100)
- **Caching** (future) — Redis for dashboard stats, user sessions
- **Async endpoints** (future) — FastAPI async def for I/O-bound ops

### Frontend Optimizations
- **Code splitting** — Vite auto-splits by route
- **Tree shaking** — Vite removes unused imports
- **Lazy loading** — Load charts/heavy components on-demand
- **Memoization** — `useMemo`/`useCallback` for expensive computations
- **Image optimization** — Use WebP, lazy load with `loading="lazy"`

---

## Scalability

### Horizontal Scaling
- **Stateless API** — All state in DB or JWT, no in-memory sessions
- **Load balancing** — Distribute traffic across N API replicas
- **Database read replicas** — Offload read queries for analytics

### Vertical Scaling
- Increase DB instance size (CPU/RAM) for complex aggregations
- Increase API worker count (`uvicorn --workers 4`)

---

## Monitoring & Observability

### Logs
- Structured JSON logs (timestamp, level, message, context)
- Centralized aggregation (Datadog, Loki, CloudWatch)
- Log levels: DEBUG (dev), INFO (prod), WARNING, ERROR

### Metrics
- Request rate (req/sec)
- Response time (p50, p95, p99)
- Error rate (5xx responses)
- Database connection pool usage
- JWT token generation/validation time

### Alerts
- Error rate > 1% for 5 minutes
- API response time p95 > 2s for 5 minutes
- Database connection pool exhausted

---

## Security Threat Model

| Threat | Mitigation |
|---|---|
| SQL injection | Parameterized queries (SQLAlchemy) |
| XSS | React auto-escapes JSX, CSP headers |
| CSRF | SameSite cookies + CORS checks |
| Password brute force | Rate limiting on `/auth/login` |
| Token theft | Short-lived access tokens, HTTPS only |
| Unauthorized access | RBAC guards, JWT validation |
| Mass assignment | Pydantic schemas with explicit fields |

---

## Testing Strategy

### Backend
- **Unit tests** — Core logic (password hashing, JWT, RBAC)
- **Integration tests** — API endpoints with test database
- **E2E tests** (future) — Playwright for critical user flows

### Frontend
- **Component tests** — React Testing Library for shared components
- **E2E tests** (future) — Playwright for login → dashboard → leave approval flow

---

## Future Enhancements

### High Priority
- [ ] Real-time notifications (WebSockets / SSE)
- [ ] AI fatigue prediction model (ML integration)
- [ ] Advanced shift conflict resolution
- [ ] Mobile app (React Native)

### Medium Priority
- [ ] Payroll integration (third-party APIs)
- [ ] Biometric attendance (face recognition)
- [ ] Multi-language support (i18n)
- [ ] Dark/light theme toggle (persistent)

### Low Priority
- [ ] Slack/Teams bot for leave approvals
- [ ] Voice commands (AI assistant)
- [ ] Shift swap marketplace

---

## License
Proprietary — All rights reserved. Contact for licensing inquiries.
