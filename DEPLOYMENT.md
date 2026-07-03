# WorkSphere AI — Deployment Guide

Step-by-step instructions to deploy WorkSphere AI to production environments.

---

## Prerequisites

✅ **Node.js 18+** (frontend build)  
✅ **Python 3.12+** (backend)  
✅ **PostgreSQL 16+** (database)  
✅ **Docker** (optional, recommended)  
✅ **Domain with SSL** (production)  

---

## Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourorg/WorkSphereAI.git
cd WorkSphereAI
```

### 2. Frontend Development
```bash
npm install
npm run dev
# Open http://localhost:5173
```

### 3. Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL

# Start server
uvicorn app.main:app --reload
# API docs at http://localhost:8000/docs
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb worksphere_db

# Run migrations (if using Alembic)
alembic upgrade head
```

---

## Docker Deployment (Recommended)

### Full Stack with Docker Compose

```bash
# Copy environment file
cp backend/.env.example backend/.env

# Edit .env with production values
nano backend/.env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

**Services started:**
- PostgreSQL on port `5432`
- Backend API on port `8000`
- Frontend on port `5173`

### Production Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: worksphere_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    restart: always
    environment:
      DATABASE_URL: postgresql+psycopg2://${DB_USER}:${DB_PASSWORD}@db:5432/worksphere_db
      SECRET_KEY: ${SECRET_KEY}
      APP_ENV: production
      DEBUG: false
      ALLOWED_ORIGINS: ${FRONTEND_URL}
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    restart: always
    ports:
      - "80:80"
    environment:
      VITE_API_URL: ${API_URL}

volumes:
  postgres_data:
```

---

## Cloud Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend + DB)

**Frontend on Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Build frontend
npm run build

# Deploy
vercel --prod
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL` = your Railway backend URL

**Backend + Database on Railway:**
1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL service (auto-provisioned)
4. Add environment variables:
   - `DATABASE_URL` (auto-filled by Railway)
   - `SECRET_KEY` (generate: `openssl rand -hex 32`)
   - `ALLOWED_ORIGINS` (your Vercel domain)
5. Deploy

---

### Option 2: AWS (ECS + RDS)

**Architecture:**
```
CloudFront (CDN) → S3 (frontend static files)
ALB → ECS Fargate (backend containers) → RDS PostgreSQL
```

**Steps:**
1. **RDS PostgreSQL**
   - Create RDS instance (db.t4g.micro for dev)
   - Security group: allow port 5432 from ECS security group
   - Note connection string

2. **ECS Backend**
   - Create ECR repository: `worksphere-backend`
   - Build and push image:
     ```bash
     aws ecr get-login-password | docker login --username AWS --password-stdin <your-ecr-url>
     docker build -t worksphere-backend ./backend
     docker tag worksphere-backend:latest <your-ecr-url>/worksphere-backend:latest
     docker push <your-ecr-url>/worksphere-backend:latest
     ```
   - Create ECS task definition with environment variables
   - Create ECS service behind Application Load Balancer

3. **S3 + CloudFront (Frontend)**
   - Build frontend: `npm run build`
   - Upload `dist/` to S3 bucket
   - Create CloudFront distribution pointing to S3
   - Configure custom domain + ACM SSL certificate

---

### Option 3: DigitalOcean App Platform

**Single-click deployment:**
1. Push code to GitHub
2. Go to https://cloud.digitalocean.com/apps/new
3. Connect GitHub repo
4. Auto-detect:
   - Frontend (Node.js, runs `npm run build`)
   - Backend (Python, runs `uvicorn app.main:app`)
5. Add PostgreSQL database (managed)
6. Set environment variables
7. Deploy

**Cost:** ~$12/month (starter plan)

---

### Option 4: Fly.io (Global Edge Deployment)

**Backend:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Create app
flyctl launch
# Choose region, add PostgreSQL

# Set secrets
flyctl secrets set SECRET_KEY=$(openssl rand -hex 32)
flyctl secrets set ALLOWED_ORIGINS=https://your-frontend.com

# Deploy
flyctl deploy
```

**Frontend:**
```bash
# Build
npm run build

# Deploy to Cloudflare Pages or Vercel
```

---

## Environment Variables (Production)

### Backend (.env)
```bash
# App
APP_NAME=WorkSphere AI
APP_ENV=production
DEBUG=false
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/db

# Security
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# CORS
ALLOWED_ORIGINS=https://app.worksphere.ai,https://worksphere.ai

# Admin user (created on first run)
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=ChangeMe@123
ADMIN_NAME=Admin User
```

### Frontend (.env.production)
```bash
VITE_API_URL=https://api.worksphere.ai
```

---

## Database Migrations (Alembic)

```bash
cd backend

# Auto-generate migration from model changes
alembic revision --autogenerate -m "Add new columns"

# Review generated migration
nano alembic/versions/<timestamp>_add_new_columns.py

# Apply migration
alembic upgrade head

# Rollback one revision
alembic downgrade -1

# Show current version
alembic current
```

---

## SSL/HTTPS Setup

### Option A: Nginx Reverse Proxy with Let's Encrypt
```nginx
# /etc/nginx/sites-available/worksphere
server {
    listen 443 ssl http2;
    server_name app.worksphere.ai;
    
    ssl_certificate /etc/letsencrypt/live/app.worksphere.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.worksphere.ai/privkey.pem;
    
    # Frontend (static files)
    location / {
        root /var/www/worksphere/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name app.worksphere.ai;
    return 301 https://$server_name$request_uri;
}
```

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d app.worksphere.ai

# Auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
```

### Option B: Caddy (Auto HTTPS)
```caddyfile
# Caddyfile
app.worksphere.ai {
    root * /var/www/worksphere/dist
    encode gzip
    try_files {path} /index.html
    
    reverse_proxy /api/* localhost:8000
}
```

Caddy automatically obtains and renews Let's Encrypt certificates.

---

## Monitoring & Logging

### Application Logs
```bash
# View backend logs
docker-compose logs -f backend

# Tail last 100 lines
docker-compose logs --tail=100 backend

# Export logs
docker-compose logs backend > logs.txt
```

### Database Backups
```bash
# Manual backup
docker exec worksphere-db pg_dump -U worksphere worksphere_db > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i worksphere-db psql -U worksphere worksphere_db < backup_20260703.sql

# Automated daily backups (cron)
0 2 * * * docker exec worksphere-db pg_dump -U worksphere worksphere_db | gzip > /backups/worksphere_$(date +\%Y\%m\%d).sql.gz
```

### Health Checks
```bash
# Backend API
curl https://api.worksphere.ai/health

# Database
docker exec worksphere-db pg_isready -U worksphere
```

---

## Performance Tuning

### Backend
```python
# app/main.py — increase worker count
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,  # 2-4 per CPU core
        log_level="info",
    )
```

### Database Connection Pool
```python
# app/db/base.py
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=20,       # Max connections
    max_overflow=10,    # Extra connections if pool exhausted
    pool_pre_ping=True, # Verify connection before use
    echo=False,         # Disable SQL logging in prod
)
```

### Frontend Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Disable source maps in production
# vite.config.ts
build: {
  sourcemap: false,
}
```

---

## Security Checklist

- [ ] Change `SECRET_KEY` to a random 256-bit hex string
- [ ] Set `DEBUG=false` in production
- [ ] Use HTTPS everywhere (enforce with HSTS headers)
- [ ] Enable CORS only for allowed frontend domains
- [ ] Use strong database passwords (16+ chars, random)
- [ ] Disable PostgreSQL remote access (firewall to backend only)
- [ ] Set up rate limiting on auth endpoints
- [ ] Enable audit logging for sensitive operations
- [ ] Regular security updates (`apt-get update && apt-get upgrade`)
- [ ] Backup database daily (automated cron job)
- [ ] Use environment variables for all secrets (never commit)
- [ ] Review Dependabot alerts for vulnerabilities
- [ ] Set password complexity requirements in frontend forms

---

## Troubleshooting

### "502 Bad Gateway" from nginx
- Backend not running: `docker-compose ps backend`
- Check backend logs: `docker-compose logs backend`
- Verify port 8000 is accessible: `curl localhost:8000/health`

### "CORS policy" error in browser
- Add frontend domain to `ALLOWED_ORIGINS` in `.env`
- Restart backend: `docker-compose restart backend`
- Check browser console for exact blocked origin

### Database connection errors
- Verify `DATABASE_URL` format: `postgresql+psycopg2://user:pass@host:5432/db`
- Check database is running: `docker-compose ps db`
- Test connection: `psql -h localhost -U worksphere -d worksphere_db`

### "Invalid token" after login
- Ensure frontend and backend are using same `SECRET_KEY`
- Check token expiry settings (`ACCESS_TOKEN_EXPIRE_MINUTES`)
- Clear browser cookies/localStorage

---

## Scaling Recommendations

### Up to 1,000 users
- 1 backend container (2 vCPU, 4GB RAM)
- 1 PostgreSQL instance (db.t4g.small on AWS RDS)
- CDN for frontend (Cloudflare, CloudFront)

### 1,000 - 10,000 users
- 2-4 backend containers behind load balancer
- PostgreSQL with read replicas (offload analytics queries)
- Redis cache for dashboard KPIs
- Background job queue (Celery) for reports, notifications

### 10,000+ users
- Auto-scaling ECS/Kubernetes cluster (5-20 containers)
- PostgreSQL with connection pooler (PgBouncer)
- Separate microservices (auth, employees, analytics)
- Full-text search (Elasticsearch) for employee/doc search
- Real-time features via WebSocket gateway

---

## License & Support

**License:** Proprietary — see LICENSE file  
**Support:** support@worksphere.ai  
**Docs:** https://docs.worksphere.ai
