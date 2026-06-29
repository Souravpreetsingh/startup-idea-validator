# AI Startup Idea Validator — Architecture Document

## System Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │────▶│   Express    │────▶│   MongoDB    │
│   Frontend   │     │   Backend    │     │   Atlas      │
│  (Vercel)    │◀────│  (Render)    │◀────│              │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                    ┌───────┴───────┐
                    │    Redis      │
                    │  (Upstash)    │
                    ├───────────────┤
                    │ • Cache       │
                    │ • BullMQ      │
                    └───────────────┘
                            │
                    ┌───────┴───────┐
                    │   Gemini AI   │
                    │    (Google)   │
                    └───────────────┘
```

## Database Schema

```
User
├── _id, fullName, email, password (bcrypt)
├── startupExperience, industryInterest
└── profileImage

StartupIdea
├── _id, userId → User
├── title, description, industry
├── targetAudience, budget, businessModel
├── problemStatement, expectedSolution
└── timestamps

AnalysisResult
├── _id, ideaId → StartupIdea (unique)
├── userId → User
├── ideaScore (0-100), successProbability (0-100)
├── marketDemand, competition
├── competitors[{name, strengths, weaknesses}]
├── swot{strengths, weaknesses, opportunities, threats}
├── revenueSuggestions[], growthStrategy, mvpRoadmap[]
└── createdAt

CompetitorInsight
├── _id, ideaId → StartupIdea (unique)
├── userId → User
├── competitors[{name, funding, strengths[], weaknesses[], ...}]
├── marketPosition
└── generatedAt

IdeaVersion
├── _id, ideaId → StartupIdea
├── userId → User
├── version (incrementing)
├── snapshot (full idea fields)
├── changes[{field, oldValue, newValue}]
└── createdAt

Task
├── _id, userId → User
├── title, description, status, priority
├── deadline, completedAt
└── timestamps

Team / TeamMember / TeamInvite
├── teams with roles (owner, admin, member)
└── invite by email with accept/decline

ChatHistory
├── _id, userId → User
└── messages[{role, content, timestamp}]

UserMemory
├── _id, userId → User
├── previousIdeas[], interactions[]
└── preferences{}

ActivityLog
├── _id, userId → User
├── action, resource, details, ip
└── timestamp

UserBadge
├── _id, userId → User
├── badgeId, name, description, icon
└── earnedAt

Favorite
├── _id, userId → User
└── ideaId → StartupIdea
```

## API Flow

```
Client → /api/auth/signup → JWT → Store in localStorage
Client → /api/auth/login  → JWT → Store in localStorage
Client → /api/ideas (POST) → Create idea → Auto-save version
Client → /api/analysis/generate → Gemini AI → Store result → Cache
Client → /api/chat → Gemini AI → Context-aware response
Client → /api/export/:ideaId → PDFKit → PDF download
Client → /api/competitors/:id/analyze → Gemini AI → Competitor Insight
Client → /api/pitch/:ideaId → Gemini AI → Pitch deck
Client → /api/investor/:ideaId → Gemini AI → Investor match
Client → /api/trends → DB aggregation + Gemini AI → Market trends
```

## Authentication Flow

```
1. User submits credentials
2. Server validates with Zod
3. Password hashed with bcrypt (12 rounds)
4. JWT signed with HS256 (7d expiry)
5. Token stored in localStorage
6. Axios interceptor adds Bearer token
7. 401 response → auto-redirect to /login
```

## AI Request Lifecycle

```
1. User creates StartupIdea
2. POST /api/analysis/generate → BullMQ queue
3. Worker picks up job → calls Gemini API
4. Response parsed, validated, sanitized
5. AnalysisResult saved to MongoDB
6. Cached in Redis (24h TTL)
7. Email notification queued
8. Badge check triggered
9. Activity logged
```

## Caching Strategy

| Cache Key | TTL | Invalidation |
|-----------|-----|-------------|
| `vp:analysis:{ideaId}` | 24h | On re-analysis |
| `vp:chat:{userId}:{sessionId}` | 1h | On new message |
| `vp:idea:{ideaId}` | 1h | On update/delete |
| `vp:dashboard:{userId}` | 5min | On new analysis |

## Queue Architecture

| Queue | Concurrency | Retries | Purpose |
|-------|-------------|---------|---------|
| `analysis` | 2 | 3 | AI analysis generation |
| `email` | 5 | 3 | Email notifications |
| `export` | 2 | 2 | PDF generation |

## Performance Monitoring

- Response time tracking per endpoint
- Slow query detection (>100ms)
- Memory usage snapshots
- P95/P99 latency calculation
- Status code distribution
- Accessible at `/api/admin/performance`
