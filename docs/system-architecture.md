# System Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend (Vercel)"
        Next[Next.js 16 App]
        TW[Tailwind CSS v4]
        RC[Recharts Charts]
    end

    subgraph "Backend (Render)"
        API[Express REST API]
        Auth[JWT Auth Middleware]
        Val[Zod Validation]
        Perf[Performance Monitor]
    end

    subgraph "Database Layer"
        DB[(MongoDB Atlas)]
        idx[Indexes & Aggregations]
    end

    subgraph "Cache & Queue (Upstash Redis)"
        Cache[Redis Cache - 24h TTL]
        Q1[Analysis Queue]
        Q2[Email Queue]
        Q3[Export Queue]
    end

    subgraph "AI Layer"
        Gemini[Google Gemini 2.0 Flash]
        Prompt[Prompt Engineering]
        Fallback[Fallback Logic]
    end

    subgraph "External Services"
        SMTP[SMTP Provider]
        CDN[Vercel CDN]
    end

    Next -->|HTTP REST| API
    API -->|Mongoose ODM| DB
    API -->|ioredis| Cache
    API -->|BullMQ| Q1
    API -->|BullMQ| Q2
    API -->|BullMQ| Q3
    API -->|Gemini SDK| Gemini
    Q1 -->|Worker| Gemini
    Q2 -->|Worker| SMTP
    Q3 -->|Worker| PDF[PDFKit]
    Auth -->|JWT Verify| API
    Val -->|Schema Check| API
    Perf -->|Metrics| API
    DB --> idx
    Next -->|Static Assets| CDN
```

## Request Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Next as Next.js
    participant API as Express API
    participant Mid as Middleware
    participant AI as Gemini AI
    participant DB as MongoDB
    participant Cache as Redis

    User->>Browser: Type URL
    Browser->>Next: HTTP Request
    Next->>Next: SSR/SSG Render
    
    alt Authenticated Route
        Next->>API: API Call with JWT
        API->>Mid: Performance Monitor
        Mid->>Mid: Rate Limiter
        Mid->>Mid: Sanitize Input
        Mid->>Mid: Verify JWT
        Mid->>Mid: Log Activity
        Mid->>API: Proceed
        API->>Cache: Check Cache
        alt Cache Hit
            Cache-->>API: Return Cached
        else Cache Miss
            API->>DB: Query Data
            DB-->>API: Return Data
            API->>Cache: Set Cache (24h)
        end
        API-->>Next: JSON Response
        Next-->>Browser: Rendered Page
    end
```

## AI Request Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant App as Next.js
    participant API as Express
    participant Queue as BullMQ
    participant Worker
    participant Gemini
    participant DB as MongoDB
    participant Cache as Redis

    User->>App: Submit Idea
    App->>API: POST /analysis/generate
    
    alt Queues Enabled
        API->>Queue: Add Job
        Queue->>Worker: Process Async
        API-->>App: 202 Accepted
        Worker->>Gemini: Send Prompt
        Gemini-->>Worker: AI Response
        Worker->>Worker: Parse & Validate
        Worker->>DB: Save Analysis
        Worker->>Cache: Cache Result
        Worker->>Queue: Trigger Email
    else Queues Disabled (Inline)
        API->>Gemini: Send Prompt
        Gemini-->>API: AI Response
        API->>API: Parse & Validate
        API->>DB: Save Analysis
        API->>Cache: Cache Result
        API-->>App: 200 Complete
    end
    
    App-->>User: Show Results
```

## Security Architecture

```mermaid
graph LR
    Client[Client Browser]
    CDN[Vercel CDN]
    WAF[Helmet Headers]
    CORS[CORS Policy]
    RL[Rate Limiter]
    San[Input Sanitizer]
    Auth[JWT Auth]
    API[API Handler]

    Client -->|HTTPS| CDN
    CDN -->|Proxy| WAF
    WAF --> CORS
    CORS --> RL
    RL --> San
    San --> Auth
    Auth --> API

    RL -->|200 req/15min| API
    RL -->|10 req/15min| AuthEP[/api/auth]
    RL -->|20 req/h| AnalysisEP[/api/analysis]
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production"
        V[Vercel - Frontend]
        R[Render - Backend]
        MA[(MongoDB Atlas)]
        UR[(Upstash Redis)]
    end

    subgraph "CI/CD Pipeline"
        GH[GitHub]
        LA[Lint & TypeCheck]
        T[Tests]
        DB[Deploy Backend]
        DF[Deploy Frontend]
    end

    GH -->|Push to main| LA
    LA --> T
    T --> DB
    T --> DF
    DB -->|Webhook| R
    DF -->|Vercel CLI| V

    R --> MA
    R --> UR
    V -->|API Calls| R
```
