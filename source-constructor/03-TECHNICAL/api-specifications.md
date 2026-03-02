# Source Constructor (SOC) — API Specifications

**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Approved
**Owner:** Engineering Lead
**Base URL:** `https://api.sourceconstructor.com`

---

## Overview

This document specifies all REST API endpoints for the Source Constructor platform. The API follows REST conventions with JSON request and response bodies. All authenticated endpoints require a valid JWT access token issued by Supabase Auth.

### Global Conventions

**Authentication:** All protected endpoints require:
```
Authorization: Bearer <access_token>
```

**Content-Type:** All request bodies must include:
```
Content-Type: application/json
```

**Response envelope:** All responses follow the structure:
```json
{
  "data": { ... },
  "meta": { "request_id": "req_01HX..." }
}
```

**Error envelope:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message.",
    "details": [],
    "request_id": "req_01HX..."
  }
}
```

**Pagination:** List endpoints use cursor-based pagination:
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6Ii4uLiJ9",
    "has_more": true,
    "count": 20
  }
}
```

**Rate Limiting:** Rate limit headers are included on all responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1709380800
Retry-After: 60  (only on 429 responses)
```

---

## Rate Limiting Policies

| Endpoint Group | Limit | Window | Strategy |
|----------------|-------|--------|----------|
| Auth endpoints | 10 req | 15 min | Fixed window per IP |
| Discovery session start | 5 req | 1 hour | Fixed window per user |
| Session answer | 120 req | 1 hour | Sliding window per session |
| Project endpoints | 60 req | 1 min | Sliding window per user |
| Check-in submission | 10 req | 1 hour | Fixed window per user |
| Insights | 30 req | 1 min | Sliding window per user |
| General API | 200 req | 1 min | Sliding window per user |

---

## Auth Endpoints

### POST /api/auth/signup

Creates a new user account via Supabase Auth and initializes the user record.

**Authentication:** None required

**Rate limit:** 10 requests per 15 minutes per IP

**Request body:**
```json
{
  "email": "string (required, valid email, max 255 chars)",
  "password": "string (required, min 8 chars, must contain uppercase + number)",
  "name": "string (required, min 2 chars, max 100 chars)"
}
```

**Responses:**

`201 Created` — Account created; email verification sent
```json
{
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alex@example.com",
    "name": "Alex Rivera",
    "verification_required": true,
    "message": "Check your email to verify your account."
  },
  "meta": { "request_id": "req_01HX4K..." }
}
```

`400 Bad Request` — Validation error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body contains invalid fields.",
    "details": [
      { "field": "password", "issue": "Password must be at least 8 characters and contain at least one uppercase letter and one number." },
      { "field": "email", "issue": "Invalid email address." }
    ],
    "request_id": "req_01HX4K..."
  }
}
```

`409 Conflict` — Email already in use
```json
{
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email address already exists.",
    "request_id": "req_01HX4K..."
  }
}
```

`429 Too Many Requests` — Rate limit exceeded

**Example request:**
```bash
curl -X POST https://api.sourceconstructor.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@example.com",
    "password": "SecurePass1",
    "name": "Alex Rivera"
  }'
```

---

### POST /api/auth/signin

Signs in an existing user with email and password.

**Authentication:** None required

**Rate limit:** 10 requests per 15 minutes per IP

**Request body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Responses:**

`200 OK`
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "alex@example.com",
      "name": "Alex Rivera",
      "subscription_tier": "pro",
      "onboarding_completed": true
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1.Mj...",
    "expires_in": 3600
  },
  "meta": { "request_id": "req_01HX..." }
}
```

`401 Unauthorized` — Invalid credentials
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect.",
    "request_id": "req_01HX..."
  }
}
```

`403 Forbidden` — Email not verified
```json
{
  "error": {
    "code": "EMAIL_NOT_VERIFIED",
    "message": "Please verify your email address before signing in.",
    "request_id": "req_01HX..."
  }
}
```

---

### POST /api/auth/signout

Signs out the current user and invalidates the refresh token.

**Authentication:** Required

**Request body:** None

**Responses:**

`200 OK`
```json
{
  "data": { "message": "Signed out successfully." },
  "meta": { "request_id": "req_01HX..." }
}
```

`401 Unauthorized` — Token already invalid or expired

---

### GET /api/auth/me

Returns the authenticated user's profile and subscription information.

**Authentication:** Required

**Query parameters:** None

**Responses:**

`200 OK`
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "alex@example.com",
      "name": "Alex Rivera",
      "avatar_url": "https://storage.example.com/avatars/alex.jpg",
      "subscription_tier": "pro",
      "onboarding_completed": true,
      "onboarding_step": 4,
      "created_at": "2026-01-15T10:00:00Z",
      "last_active": "2026-03-02T09:30:00Z"
    },
    "profile": {
      "bio": "Product designer focused on purpose-driven work.",
      "timezone": "America/New_York",
      "locale": "en-US",
      "ai_style_preference": "balanced",
      "focus_areas": ["career", "creativity"],
      "notification_email": true,
      "notification_weekly": true
    },
    "subscription": {
      "tier": "pro",
      "status": "active",
      "current_period_end": "2026-04-02T00:00:00Z",
      "cancel_at_period_end": false
    }
  },
  "meta": { "request_id": "req_01HX..." }
}
```

---

## Discovery Session Endpoints

### POST /api/sessions/start

Initiates a new discovery session for the authenticated user. Returns the session ID and the first question from the AI.

**Authentication:** Required

**Rate limit:** 5 requests per hour per user

**Request body:**
```json
{
  "session_type": "string (optional, default: 'initial', enum: initial|reflection|pivot)",
  "context_note": "string (optional, max 500 chars — user can provide brief context before starting)"
}
```

**Business logic:**
- Free tier users: limited to 1 completed session; returns `TIER_LIMIT` if exceeded
- Abandons any existing `active` session for the user before creating a new one
- The first question is generated by Claude based on `session_type` and user profile

**Responses:**

`201 Created`
```json
{
  "data": {
    "session_id": "7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d",
    "status": "active",
    "session_type": "initial",
    "first_question": "When you imagine your life going exactly right five years from now, what does a typical Tuesday look like?",
    "turn": 1,
    "estimated_turns": 10,
    "websocket_url": "wss://api.sourceconstructor.com/ws/session/7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d",
    "ws_auth_token": "wsat_eyJ..."
  },
  "meta": { "request_id": "req_01HX..." }
}
```

`403 Forbidden` — Tier limit reached
```json
{
  "error": {
    "code": "TIER_LIMIT",
    "message": "Free accounts are limited to 1 discovery session. Upgrade to Pro for unlimited sessions.",
    "details": {
      "upgrade_url": "https://sourceconstructor.com/upgrade",
      "current_tier": "free",
      "limit": 1,
      "used": 1
    },
    "request_id": "req_01HX..."
  }
}
```

---

### POST /api/sessions/:id/answer

Submits a user's answer to the current session question via the REST API. For streaming responses, use the WebSocket connection instead. This endpoint is provided as a fallback for clients without WebSocket support.

**Authentication:** Required

**Rate limit:** 120 requests per hour per session

**Path parameters:**
- `id` (UUID) — Session ID

**Request body:**
```json
{
  "content": "string (required, min 5 chars, max 2000 chars)",
  "turn": "integer (required, must match current server-side turn count)"
}
```

**Responses:**

`200 OK` — Answer processed, next question or completion
```json
{
  "data": {
    "session_id": "7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d",
    "status": "active",
    "ai_response": "That image of building something yourself stands out. When you say 'something I built myself' — is it the act of creating it that matters, or is it more about owning the outcome, or something else entirely?",
    "turn": 2,
    "is_final_question": false
  },
  "meta": { "request_id": "req_01HX..." }
}
```

`200 OK` — Session completed
```json
{
  "data": {
    "session_id": "7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d",
    "status": "completed",
    "ai_response": "Thank you — that was a meaningful conversation. I'm now analyzing everything you've shared to identify what truly drives you...",
    "analysis_in_progress": true,
    "results_url": "/sessions/7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d/results"
  }
}
```

`404 Not Found` — Session not found or belongs to another user

`409 Conflict` — Turn number mismatch (stale request)
```json
{
  "error": {
    "code": "TURN_MISMATCH",
    "message": "Expected turn 3 but received turn 2. Refresh the session state.",
    "request_id": "req_01HX..."
  }
}
```

`410 Gone` — Session has expired
```json
{
  "error": {
    "code": "SESSION_EXPIRED",
    "message": "This session expired due to inactivity. Start a new session to continue.",
    "request_id": "req_01HX..."
  }
}
```

---

### GET /api/sessions/:id

Returns session metadata and current state. Does not return the full conversation (use `/results` for that).

**Authentication:** Required

**Path parameters:**
- `id` (UUID) — Session ID

**Responses:**

`200 OK`
```json
{
  "data": {
    "id": "7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d",
    "status": "completed",
    "session_type": "initial",
    "turn_count": 10,
    "started_at": "2026-03-02T10:00:00Z",
    "completed_at": "2026-03-02T10:25:00Z",
    "last_activity_at": "2026-03-02T10:25:00Z"
  },
  "meta": { "request_id": "req_01HX..." }
}
```

`404 Not Found`

---

### GET /api/sessions/:id/results

Returns the full analysis results of a completed session, including true desires, confidence scores, and the conversation history.

**Authentication:** Required

**Path parameters:**
- `id` (UUID) — Session ID

**Responses:**

`200 OK`
```json
{
  "data": {
    "id": "7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d",
    "status": "completed",
    "session_type": "initial",
    "turn_count": 10,
    "started_at": "2026-03-02T10:00:00Z",
    "completed_at": "2026-03-02T10:25:00Z",
    "conversation": [
      {
        "role": "assistant",
        "content": "When you imagine your life going exactly right...",
        "turn": 1,
        "timestamp": "2026-03-02T10:00:00Z"
      },
      {
        "role": "user",
        "content": "I'd be working on something I built myself...",
        "turn": 1,
        "timestamp": "2026-03-02T10:01:30Z"
      }
    ],
    "true_desires": {
      "primary_desires": [
        {
          "id": "d_001",
          "theme": "Creative Autonomy",
          "statement": "To build something that is genuinely your own...",
          "confidence": 0.91,
          "depth": "core"
        }
      ],
      "secondary_desires": [...],
      "overall_clarity_score": 0.83
    },
    "confidence_scores": {
      "overall": 0.83,
      "per_desire": { "d_001": 0.91 },
      "session_quality": {
        "answer_depth": 0.78,
        "emotional_engagement": 0.84,
        "turn_count": 10
      }
    },
    "can_generate_project": true
  },
  "meta": { "request_id": "req_01HX..." }
}
```

`404 Not Found`

`400 Bad Request` — Session not yet completed
```json
{
  "error": {
    "code": "SESSION_INCOMPLETE",
    "message": "Results are only available for completed sessions.",
    "request_id": "req_01HX..."
  }
}
```

---

### GET /api/sessions

Returns a paginated list of the authenticated user's discovery sessions.

**Authentication:** Required

**Query parameters:**
- `status` (string, optional) — Filter by status: `active|completed|abandoned|expired`
- `limit` (integer, optional, default: 10, max: 50)
- `cursor` (string, optional) — Pagination cursor from previous response

**Responses:**

`200 OK`
```json
{
  "data": [
    {
      "id": "7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d",
      "status": "completed",
      "session_type": "initial",
      "turn_count": 10,
      "overall_clarity_score": 0.83,
      "started_at": "2026-03-02T10:00:00Z",
      "completed_at": "2026-03-02T10:25:00Z"
    }
  ],
  "pagination": {
    "next_cursor": null,
    "has_more": false,
    "count": 1
  },
  "meta": { "request_id": "req_01HX..." }
}
```

---

## Projects Endpoints

### GET /api/projects

Returns the authenticated user's projects.

**Authentication:** Required

**Query parameters:**
- `status` (string, optional) — Filter: `active|paused|completed|abandoned`
- `limit` (integer, optional, default: 20, max: 50)
- `cursor` (string, optional)

**Responses:**

`200 OK`
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Build Source Constructor",
      "vision": "A platform that helps people discover what they truly want and build toward it with clarity and accountability.",
      "why": "Because you believe that most people are building toward the wrong things — not from lack of effort, but from lack of self-knowledge.",
      "status": "active",
      "color": "#1E40AF",
      "icon": "sparkles",
      "checkin_streak": 7,
      "total_checkins": 23,
      "last_checkin_at": "2026-03-01T21:00:00Z",
      "milestone_count": 5,
      "milestones_completed": 2,
      "task_count": 24,
      "tasks_completed": 11,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": { "next_cursor": null, "has_more": false, "count": 1 },
  "meta": { "request_id": "req_01HX..." }
}
```

---

### POST /api/projects

Generates a new project from a completed discovery session using Claude AI, then persists it.

**Authentication:** Required

**Rate limit:** 10 requests per hour per user (project generation is expensive)

**Request body:**
```json
{
  "session_id": "string (required UUID — must be a completed session owned by this user)",
  "name": "string (optional, max 100 chars — override AI-generated name)",
  "desire_ids": ["string"] "(optional — specific desire IDs from session to base project on)"
}
```

**Business logic:**
- Free tier: max 1 project; returns `TIER_LIMIT` if exceeded
- Pro tier: max 5 active projects
- Team tier: unlimited projects
- Calls Claude Sonnet 4.5 to generate project structure
- Creates project + milestones + initial tasks in a single transaction

**Responses:**

`201 Created`
```json
{
  "data": {
    "project": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Build Source Constructor",
      "vision": "A platform that helps people discover what they truly want...",
      "why": "Because you believe that most people are building toward the wrong things...",
      "status": "active",
      "color": "#1E40AF",
      "icon": "sparkles",
      "created_at": "2026-03-02T10:30:00Z"
    },
    "milestones": [
      {
        "id": "m1b2c3d4-e5f6-7890-abcd-ef1234567891",
        "title": "Discovery and Validation",
        "description": "Validate the core premise with 20 real users through discovery conversations.",
        "sort_order": 0,
        "target_date": "2026-04-15",
        "task_count": 5
      }
    ],
    "tasks_created": 18
  },
  "meta": { "request_id": "req_01HX..." }
}
```

`404 Not Found` — Session not found

`400 Bad Request` — Session not completed

`403 Forbidden` — Tier limit reached

---

### GET /api/projects/:id

Returns a single project with its milestones and tasks.

**Authentication:** Required

**Path parameters:**
- `id` (UUID) — Project ID

**Responses:**

`200 OK`
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Build Source Constructor",
    "vision": "A platform that helps people discover...",
    "why": "Because you believe...",
    "status": "active",
    "color": "#1E40AF",
    "icon": "sparkles",
    "checkin_streak": 7,
    "total_checkins": 23,
    "last_checkin_at": "2026-03-01T21:00:00Z",
    "target_completion": "2026-09-01",
    "created_at": "2026-01-15T10:00:00Z",
    "session_id": "7d3f8a1b-2c4e-4f5a-9b6d-1e2f3a4b5c6d",
    "milestones": [
      {
        "id": "m1b2c3d4...",
        "title": "Discovery and Validation",
        "description": "...",
        "status": "completed",
        "sort_order": 0,
        "target_date": "2026-04-15",
        "completed_at": "2026-04-10T18:00:00Z",
        "tasks": [
          {
            "id": "t1b2c3d4...",
            "title": "Recruit 20 beta users",
            "description": "...",
            "priority": "high",
            "status": "completed",
            "due_date": "2026-03-30",
            "completed_at": "2026-03-28T15:00:00Z"
          }
        ]
      }
    ]
  },
  "meta": { "request_id": "req_01HX..." }
}
```

`404 Not Found`

---

### PUT /api/projects/:id

Updates a project's metadata. Does not regenerate milestones or tasks.

**Authentication:** Required

**Path parameters:**
- `id` (UUID) — Project ID

**Request body** (all fields optional):
```json
{
  "name": "string (max 100 chars)",
  "vision": "string (max 1000 chars)",
  "why": "string (max 1000 chars)",
  "description": "string (max 2000 chars)",
  "status": "string (enum: active|paused|completed|abandoned)",
  "color": "string (valid hex color)",
  "icon": "string (valid Heroicons name)",
  "target_completion": "string (ISO 8601 date)"
}
```

**Responses:**

`200 OK` — Returns updated project object (same structure as GET /api/projects/:id)

`400 Bad Request` — Validation error

`404 Not Found`

---

### DELETE /api/projects/:id

Soft-deletes a project by setting status to `abandoned`. Hard deletion is not available via API to prevent accidental data loss.

**Authentication:** Required

**Path parameters:**
- `id` (UUID) — Project ID

**Responses:**

`200 OK`
```json
{
  "data": { "message": "Project archived successfully.", "project_id": "a1b2c3d4..." },
  "meta": { "request_id": "req_01HX..." }
}
```

`404 Not Found`

---

### GET /api/projects/:id/milestones

Returns all milestones for a project with their tasks.

**Authentication:** Required

**Path parameters:**
- `id` (UUID) — Project ID

**Query parameters:**
- `status` (string, optional) — Filter milestones by status
- `include_tasks` (boolean, optional, default: true)

**Responses:**

`200 OK`
```json
{
  "data": [
    {
      "id": "m1b2c3d4...",
      "project_id": "a1b2c3d4...",
      "title": "Discovery and Validation",
      "description": "Validate the core premise with 20 real users.",
      "sort_order": 0,
      "status": "completed",
      "target_date": "2026-04-15",
      "completed_at": "2026-04-10T18:00:00Z",
      "ai_generated": true,
      "tasks": [
        {
          "id": "t1b2c3d4...",
          "title": "Recruit 20 beta users",
          "priority": "high",
          "status": "completed",
          "due_date": "2026-03-30"
        }
      ]
    }
  ],
  "meta": { "request_id": "req_01HX..." }
}
```

---

### POST /api/projects/:id/milestones

Creates a new milestone for a project.

**Authentication:** Required

**Path parameters:**
- `id` (UUID) — Project ID

**Request body:**
```json
{
  "title": "string (required, max 200 chars)",
  "description": "string (optional, max 1000 chars)",
  "sort_order": "integer (optional, defaults to last position)",
  "target_date": "string (optional, ISO 8601 date)"
}
```

**Responses:**

`201 Created`
```json
{
  "data": {
    "id": "m2b3c4d5...",
    "project_id": "a1b2c3d4...",
    "title": "Private Beta Launch",
    "description": "Launch to first 100 paid users.",
    "sort_order": 5,
    "status": "pending",
    "target_date": "2026-07-01",
    "ai_generated": false,
    "created_at": "2026-03-02T11:00:00Z"
  },
  "meta": { "request_id": "req_01HX..." }
}
```

---

## Check-ins Endpoints

### POST /api/checkins

Submits a daily check-in for a project. Triggers an AI-generated response using Claude Haiku.

**Authentication:** Required

**Rate limit:** 10 requests per hour per user (prevents gaming streak counts)

**Request body:**
```json
{
  "project_id": "string (required UUID)",
  "checkin_date": "string (required, ISO 8601 date, e.g. '2026-03-02', must be today or yesterday)",
  "mood_score": "integer (required, 1–10)",
  "energy_score": "integer (optional, 1–10)",
  "progress_notes": "string (required, min 10 chars, max 2000 chars)",
  "wins": "string (optional, max 1000 chars)",
  "blockers": "string (optional, max 1000 chars)",
  "tasks_completed_ids": ["string"] "(optional — IDs of tasks completed today)"
}
```

**Business logic:**
- Free tier: check-in history limited to last 7 days
- Calculates streak by checking for consecutive daily check-ins for this project
- Marks specified tasks as completed in a transaction
- Generates AI response using Claude Haiku (streamed separately if WebSocket connected)

**Responses:**

`201 Created`
```json
{
  "data": {
    "checkin": {
      "id": "c1b2c3d4...",
      "project_id": "a1b2c3d4...",
      "checkin_date": "2026-03-02",
      "mood_score": 8,
      "energy_score": 7,
      "streak_count": 8,
      "tasks_completed_count": 3,
      "created_at": "2026-03-02T21:00:00Z"
    },
    "ai_response": {
      "reflection": "You mentioned feeling energized by the user research session today...",
      "encouragement": "This is the 8th day in a row — you're building real momentum.",
      "suggested_task": {
        "title": "Make and document the database architecture decision",
        "priority": "high"
      }
    },
    "streak_milestone": {
      "reached": true,
      "count": 7,
      "message": "7-day streak! You've checked in every day this week."
    }
  },
  "meta": { "request_id": "req_01HX..." }
}
```

`400 Bad Request` — Validation error or checkin_date not today/yesterday

`409 Conflict` — Check-in already exists for this date and project
```json
{
  "error": {
    "code": "CHECKIN_EXISTS",
    "message": "You've already submitted a check-in for this project today.",
    "existing_checkin_id": "c0b1c2d3...",
    "request_id": "req_01HX..."
  }
}
```

`404 Not Found` — Project not found

---

### GET /api/checkins

Returns the authenticated user's check-in history with optional filters.

**Authentication:** Required

**Query parameters:**
- `project_id` (UUID, optional) — Filter by project
- `from` (string, optional) — ISO 8601 date, start of range
- `to` (string, optional) — ISO 8601 date, end of range (defaults to today)
- `limit` (integer, optional, default: 30, max: 90)
- `cursor` (string, optional)

**Note:** Free tier users receive only the last 7 days regardless of `from` parameter.

**Responses:**

`200 OK`
```json
{
  "data": [
    {
      "id": "c1b2c3d4...",
      "project_id": "a1b2c3d4...",
      "project_name": "Build Source Constructor",
      "checkin_date": "2026-03-02",
      "mood_score": 8,
      "energy_score": 7,
      "progress_notes": "Completed the API spec document. Feeling good about the session flow.",
      "wins": "Finished the checkin endpoint spec ahead of schedule.",
      "blockers": "Still need to decide on the embedding model.",
      "tasks_completed_count": 3,
      "streak_count": 8,
      "ai_response": {
        "reflection": "...",
        "encouragement": "...",
        "suggested_task": { "title": "...", "priority": "high" }
      },
      "created_at": "2026-03-02T21:00:00Z"
    }
  ],
  "pagination": { "next_cursor": "eyJpZCI6Ii...", "has_more": true, "count": 30 },
  "meta": { "request_id": "req_01HX..." }
}
```

---

### GET /api/checkins/streak

Returns current streak data across all or a specific project.

**Authentication:** Required

**Query parameters:**
- `project_id` (UUID, optional) — Get streak for specific project; omit for overall streak

**Responses:**

`200 OK`
```json
{
  "data": {
    "current_streak": 8,
    "longest_streak": 21,
    "total_checkins": 47,
    "last_checkin_date": "2026-03-02",
    "streak_start_date": "2026-02-23",
    "check_in_today": true,
    "weekly_completion": {
      "2026-02-24": true,
      "2026-02-25": true,
      "2026-02-26": true,
      "2026-02-27": false,
      "2026-02-28": true,
      "2026-03-01": true,
      "2026-03-02": true
    },
    "mood_avg_7d": 7.4,
    "mood_avg_30d": 6.8,
    "energy_avg_7d": 6.9
  },
  "meta": { "request_id": "req_01HX..." }
}
```

---

## Insights Endpoints

### GET /api/insights

Returns AI-generated insights for the authenticated user.

**Authentication:** Required

**Rate limit:** 30 requests per minute per user

**Query parameters:**
- `type` (string, optional) — Filter by type: `pattern|milestone|weekly_review|session_complete|streak|contradiction|growth`
- `project_id` (UUID, optional) — Filter by associated project
- `is_read` (boolean, optional) — Filter by read status
- `is_pinned` (boolean, optional) — Filter by pinned status
- `limit` (integer, optional, default: 20, max: 50)
- `cursor` (string, optional)

**Responses:**

`200 OK`
```json
{
  "data": [
    {
      "id": "i1b2c3d4...",
      "type": "pattern",
      "title": "You work best when you own the entire creative process.",
      "summary": "Across 23 check-in entries, your highest energy scores correlate with autonomous work.",
      "content": {
        "headline": "You work best when you own the entire creative process.",
        "body": "Across your three discovery sessions and 23 check-in entries...",
        "data_points": [
          { "label": "Avg mood (autonomous work)", "value": 8.4 },
          { "label": "Avg mood (collaborative/approval)", "value": 6.1 }
        ],
        "actionable_suggestion": "Consider restructuring your current project...",
        "desire_connection": "d_001"
      },
      "is_read": false,
      "is_pinned": false,
      "project_id": "a1b2c3d4...",
      "project_name": "Build Source Constructor",
      "created_at": "2026-03-01T09:00:00Z"
    }
  ],
  "pagination": { "next_cursor": null, "has_more": false, "count": 1 },
  "meta": { "request_id": "req_01HX..." }
}
```

---

### PATCH /api/insights/:id

Updates insight metadata (read status, pinned status). No content update.

**Authentication:** Required

**Path parameters:**
- `id` (UUID) — Insight ID

**Request body:**
```json
{
  "is_read": "boolean (optional)",
  "is_pinned": "boolean (optional)"
}
```

**Responses:**

`200 OK`
```json
{
  "data": {
    "id": "i1b2c3d4...",
    "is_read": true,
    "is_pinned": false
  },
  "meta": { "request_id": "req_01HX..." }
}
```

---

## WebSocket Protocol

### Connection: wss://api.sourceconstructor.com/ws/session/:session_id

**Authentication:** Include `ws_auth_token` from the session start response as a query parameter:
```
wss://api.sourceconstructor.com/ws/session/{session_id}?token={ws_auth_token}
```

### Client → Server message types

| Type | Payload | Description |
|------|---------|-------------|
| `user_answer` | `{ content: string, turn: number }` | Submit answer to current question |
| `ping` | `{}` | Heartbeat to keep connection alive |
| `request_reconnect` | `{ last_turn: number }` | Re-synchronize after reconnection |

### Server → Client message types

| Type | Payload | Description |
|------|---------|-------------|
| `connected` | `{ session_id, current_state }` | Connection established |
| `ai_thinking` | `{}` | AI processing started; show indicator |
| `token` | `{ content: string }` | Streaming token chunk |
| `ai_complete` | `{ content: string }` | Full AI response complete |
| `next_question` | `{ question: string, turn: number, total: number }` | Next question ready |
| `session_complete` | `{ redirect: string }` | Session analysis done |
| `analysis_started` | `{}` | Background analysis running |
| `pong` | `{}` | Response to ping |
| `reconnected` | `{ last_turn: number, conversation_restored: boolean }` | Reconnect confirmed |
| `error` | `{ code: string, message: string, recovery: string }` | Error with recovery hint |

### WebSocket Error Codes

| Code | Description | Recovery |
|------|-------------|----------|
| `INVALID_TOKEN` | Auth token invalid or expired | Re-authenticate and get new ws_auth_token |
| `SESSION_NOT_FOUND` | Session ID not found | Start new session |
| `TURN_MISMATCH` | Turn number mismatch | Refresh state via GET /api/sessions/:id |
| `AI_ERROR` | Claude API returned error | Retry answer submission |
| `CONTENT_TOO_LONG` | Answer exceeds 2000 chars | Shorten answer |
| `PARSE_ERROR` | Message format invalid | Check message schema |

---

*This document is the authoritative API reference. Frontend and backend implementations must conform to these specifications. Breaking changes to the API require a version bump and migration period.*
