# API Request/Response Examples

## Authentication

### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "startupExperience": "beginner",
  "industryInterest": "AI/ML"
}

Response 201:
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "665a1b2c3d4e5f6a7b8c9d0e",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "startupExperience": "beginner",
      "industryInterest": "AI/ML"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## Startup Ideas

### Create
```http
POST /api/ideas
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "AI-Powered Recipe Generator",
  "description": "An app that generates personalized recipes using AI based on dietary restrictions, available ingredients, and health goals.",
  "industry": "Food Tech",
  "targetAudience": "Health-conscious consumers aged 25-45",
  "budget": "$50,000",
  "businessModel": "Freemium with subscription"
}

Response 201:
{
  "success": true,
  "data": { "idea": { ... } }
}
```

## AI Analysis

### Generate Analysis
```http
POST /api/analysis/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "ideaId": "665a1b2c3d4e5f6a7b8c9d0e"
}

Response 200:
{
  "success": true,
  "data": {
    "analysis": {
      "ideaScore": 78,
      "successProbability": 65,
      "marketDemand": "High demand in the health-tech space...",
      "competition": "Moderate competition with 3-5 major players...",
      "swot": { "strengths": [...], "weaknesses": [...], ... },
      "revenueSuggestions": [...],
      "growthStrategy": "...",
      "mvpRoadmap": [...]
    }
  }
}
```

## AI Chat

### Send Message
```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "What are the key risks for my AI recipe app?",
  "chatId": "optional-existing-chat-id"
}

Response 200:
{
  "success": true,
  "data": {
    "reply": "Based on your analysis, the key risks include...",
    "chatId": "665a1b2c3d4e5f6a7b8c9d0e"
  }
}
```

## Competitor Intelligence
```http
POST /api/competitors/:ideaId/analyze
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "competitors": [
      {
        "name": "RecipeBot",
        "funding": "$12M Series A",
        "strengths": ["Large user base", "Strong brand"],
        "weaknesses": ["Limited dietary options", "No personalization"],
        "marketPosition": "market leader",
        "pricingStrategy": "freemium",
        "estimatedUserBase": "2M+"
      }
    ],
    "marketPosition": "Differentiated by AI personalization..."
  }
}
```

## Teams

### Invite Member
```http
POST /api/teams/:teamId/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "collaborator@example.com"
}

Response 201:
{
  "success": true,
  "data": { "invite": { ... } }
}
```

## Public Share
```http
POST /api/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "analysisId": "665a1b2c3d4e5f6a7b8c9d0e"
}

Response 201:
{
  "success": true,
  "data": {
    "token": "aB3xK9mW2pQr",
    "url": "/share/aB3xK9mW2pQr"
  }
}
```
