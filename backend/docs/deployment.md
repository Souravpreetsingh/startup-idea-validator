# Deployment Guide

## Environment Variables

### Backend (Render)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLIENT_URL` | Frontend URL (e.g. https://app.validatorpro.app) |
| `NODE_ENV` | `production` |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `REDIS_URL` | Redis connection string (Upstash) |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP port (587) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | From email address |

### Frontend (Vercel)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Infrastructure

- **Frontend**: Vercel (auto-deploy from main branch)
- **Backend**: Render Web Service
- **Database**: MongoDB Atlas (M10+ cluster)
- **Cache/Queue**: Upstash Redis
- **Email**: SendGrid / SMTP provider
- **AI**: Google Gemini API

## CI/CD Pipeline

```
Push to main → GitHub Actions
├── Lint & Type Check
├── Run Tests
└── Deploy
    ├── Backend → Render (webhook)
    └── Frontend → Vercel (auto)
```

## Monitoring

- Health check: `/api/health`
- Performance: `/api/admin/performance` (admin-only)
- Logs: Winston (file rotation, 5MB each, 5 files)
- Winston logs stored in `logs/` directory
