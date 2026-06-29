# AI Workflow Documentation

## AI Services Overview

```mermaid
graph TB
    subgraph "Gemini AI Integration"
        direction TB
        Prompt[Prompt Engineering]
        Timeout[30s Timeout]
        Parse[JSON Sanitization]
        Val[Validation & Fallback]
    end

    subgraph "AI Services"
        ANA[aiAnalysisService.ts]
        CHAT[aiChatService.ts]
        COMP[competitorService.ts]
        PITCH[pitchService.ts]
        PRES[presentationService.ts]
        INV[investorService.ts]
        MENT[mentorService.ts]
        TREND[trendService.ts]
        TASK[taskService.ts]
    end

    subgraph "Output Types"
        Score[Idea Score 0-100]
        SWOT[SWOT Analysis]
        COMPO[Competitors]
        REV[Revenue Models]
        SLIDE[12 Slides]
        MENTOR[Mentor Match]
    end

    Gemini --> Prompt
    Prompt --> ANA
    Prompt --> CHAT
    Prompt --> COMP
    Prompt --> PITCH
    Prompt --> PRES
    Prompt --> INV
    Prompt --> MENT
    Prompt --> TREND
    Prompt --> TASK

    ANA --> Score
    ANA --> SWOT
    ANA --> COMPO
    ANA --> REV
    CHAT --> |Context-aware| Response[Natural Language]
    PRES --> SLIDE
    MENT --> MENTOR
```

## Prompt Strategy

```mermaid
graph LR
    subgraph "System Prompt Components"
        Role["Role Definition"]
        Task["Task Description"]
        Struct["Output Structure"]
        Format["JSON Schema"]
    end

    subgraph "Generation Process"
        Build[Build Prompt]
        Send[Send to Gemini]
        Receive[Receive Response]
        Clean[Clean Markdown]
        Parse[JSON Parse]
        Validate[Validate Fields]
        Fallback[Fallback Object]
    end

    Role --> Build
    Task --> Build
    Struct --> Build
    Format --> Build
    Build --> Send
    Send --> Receive
    Receive --> Clean
    Clean --> Parse
    Parse --> Validate
    Validate -->|Pass| Return[Return Result]
    Validate -->|Fail| Fallback
    Fallback --> Return
```

## Analysis Prompt Example

```text
You are a startup analyst. Analyze this idea:

Startup: "AI-Powered Recipe Generator"
Industry: "Food Tech"
Description: "..."
Target Audience: "Health-conscious consumers..."
Business Model: "Freemium with subscription"

Return ONLY valid JSON (no markdown):
{
  "ideaScore": 0-100,
  "marketDemand": "string",
  "competition": "string",
  "competitors": [{ "name": "", "strengths": "", "weaknesses": "" }],
  "swot": { "strengths": [], "weaknesses": [], ... },
  "revenueSuggestions": [],
  "growthStrategy": "",
  "mvpRoadmap": [],
  "successProbability": 0-100
}
```

## JSON Sanitization Pipeline

```mermaid
flowchart TB
    A[Raw AI Response] --> B[Remove markdown fences]
    B --> C[Trim whitespace]
    C --> D[Extract JSON boundaries]
    D --> E[Remove trailing commas]
    E --> F[Parse JSON]
    F --> G{Valid JSON?}
    G -->|Yes| H[Validate required fields]
    G -->|No| I[Return fallback object]
    H --> J{All fields present?}
    J -->|Yes| K[Return parsed data]
    J -->|No| I
```

## Context-Aware Chat

```mermaid
flowchart TB
    subgraph "Context Building"
        A[User Message] --> B[Fetch chat history]
        B --> C[Fetch user memory]
        C --> D[Fetch recent ideas]
        D --> E[Build context prompt]
    end

    subgraph "Safety & Fallback"
        E --> F[Send to Gemini]
        F --> G{Response OK?}
        G -->|Yes| H[Extract text]
        G -->|No| I[Return fallback reply]
        H --> J{Contains unsafe?}
        J -->|Yes| K[Filter & replace]
        J -->|No| L[Return reply]
        K --> L
    end

    subgraph "Persistence"
        L --> M[Save to ChatHistory]
        M --> N[Return to client]
    end
```

## Error Handling Strategy

```mermaid
graph TB
    subgraph "Error Categories"
        T[Timeout > 30s]
        J[JSON Parse Error]
        V[Validation Error]
        S[Safety Filter Triggered]
        R[Rate Limited]
    end

    subgraph "Fallback Chain"
        F1[Return fallback object]
        F2[Log error to Winston]
        F3[Return partial results]
        F4[Notify monitoring]
    end

    T --> F1
    J --> F1
    V --> F3
    S --> F2
    R --> F4

    F1 --> F2
    F3 --> F2
```

## Cache & Queue Strategy

```mermaid
graph LR
    subgraph "Cache TTLs"
        A["Analysis: 24h"]
        B["Chat: 1h"]
        C["Idea: 1h"]
        D["Dashboard: 5min"]
        E["Competitor: 1h"]
    end

    subgraph "Queue Retries"
        QA["Analysis Queue: 3 retries, exponential"]
        QE["Email Queue: 3 retries, exponential"]
        QX["Export Queue: 2 retries, fixed"]
    end

    subgraph "Cache Invalidation"
        I1["Re-analysis → clear analysis cache"]
        I2["Idea update → clear idea cache"]
        I3["New analysis → clear dashboard cache"]
    end

    A --> I1
    C --> I2
    D --> I3
```
