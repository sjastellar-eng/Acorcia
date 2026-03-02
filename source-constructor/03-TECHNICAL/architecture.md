# Source Constructor (SOC) — System Architecture

**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Approved
**Owner:** Engineering Lead

---

## Overview

This document describes the complete system architecture of the Source Constructor (SOC) platform. It covers the high-level component topology, detailed data flows for core user journeys, architecture decision records (ADRs), scalability planning, caching strategy, and error handling approach.

SOC follows a **modular monolith** backend architecture deployed as a single service, with clear domain boundaries that allow future extraction into microservices if required. The frontend is a **server-rendered React application** using Next.js 14 App Router. All services communicate over HTTPS, with WebSocket connections used exclusively for real-time AI response streaming.

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["Browser\n(Next.js App)"]
        Mobile["Mobile Browser\n(Responsive PWA)"]
    end

    subgraph "Edge Layer"
        CF["Cloudflare\nCDN + WAF + DNS"]
    end

    subgraph "Frontend Platform (Vercel)"
        NextApp["Next.js 14\nApp Router\n\n• Server Components\n• Client Components\n• API Routes (BFF)"]
        EdgeMW["Next.js Edge\nMiddleware\n(Auth check)"]
    end

    subgraph "Backend Platform (Railway)"
        API["Express.js API\n:3001\n\n• REST Endpoints\n• WebSocket Server\n• Auth Middleware\n• Rate Limiting"]
    end

    subgraph "Data Layer"
        PG["PostgreSQL\n(Supabase)\n\n• Primary data store\n• RLS enforced\n• Full-text search"]
        Redis["Redis\n(Upstash)\n\n• Session cache\n• Rate limit state\n• Job queue"]
        Pinecone["Pinecone\nVector DB\n\n• Insight embeddings\n• Session summaries\n• Semantic search"]
    end

    subgraph "External Services"
        Claude["Anthropic\nClaude API\n(Sonnet 4.5 / Haiku 4.5)"]
        Stripe["Stripe\nPayments + Billing"]
        Resend["Resend\nTransactional Email"]
        PostHog["PostHog\nProduct Analytics"]
        Sentry["Sentry\nError Monitoring"]
    end

    Browser --> CF
    Mobile --> CF
    CF --> NextApp
    CF --> API
    NextApp --> EdgeMW
    EdgeMW --> NextApp
    NextApp -->|"REST API calls"| API
    NextApp -->|"WebSocket upgrade"| API
    API --> PG
    API --> Redis
    API --> Pinecone
    API --> Claude
    API --> Stripe
    API --> Resend
    Browser -->|"Analytics events"| PostHog
    API -->|"Error events"| Sentry
    NextApp -->|"Error events"| Sentry
```

### Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Cloudflare | CDN caching, DDoS protection, WAF, DNS | Cloudflare Pro |
| Next.js (Vercel) | SSR/SSG pages, client-side routing, BFF API routes | Next.js 14, Vercel |
| Edge Middleware | Route protection, auth token validation at edge | Next.js Edge Runtime |
| Express API | Business logic, AI orchestration, data access | Node.js 20, Express 4 |
| PostgreSQL | Persistent relational data, RLS-enforced isolation | Supabase managed PG |
| Redis | Caching, rate limiting, lightweight job queue | Upstash serverless Redis |
| Pinecone | Vector similarity search for insight retrieval | Pinecone managed |
| Claude API | AI response generation, analysis, embeddings | Anthropic API |

---

## 2. Discovery Session Data Flow

This diagram shows the complete sequence of events when a user conducts a Discovery Session — the core product experience.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant NextApp as Next.js Frontend
    participant EdgeMW as Edge Middleware
    participant API as Express API
    participant Redis
    participant PG as PostgreSQL
    participant Claude as Claude API (Sonnet 4.5)
    participant Pinecone

    User->>Browser: Navigate to /session/new
    Browser->>EdgeMW: GET /session/new
    EdgeMW->>EdgeMW: Validate JWT from cookie
    EdgeMW-->>Browser: Redirect to /login (if invalid)
    EdgeMW-->>NextApp: Forward request (if valid)
    NextApp->>API: GET /api/auth/me
    API->>PG: SELECT user WHERE id = $userId
    PG-->>API: User record
    API-->>NextApp: User profile + subscription tier
    NextApp-->>Browser: Render session start page (SSR)

    User->>Browser: Click "Start Discovery Session"
    Browser->>API: POST /api/sessions/start
    Note over API: Validate JWT, check session limit by tier
    API->>PG: INSERT discovery_sessions (status='active')
    PG-->>API: session_id
    API->>Redis: SET session:{id} = {state} TTL=4h
    API-->>Browser: { session_id, first_question }

    Note over Browser: WebSocket connection for streaming
    Browser->>API: WebSocket upgrade /ws/session/{session_id}
    API->>API: Verify WS auth token
    API-->>Browser: WS connection established

    loop Discovery conversation (8-12 turns)
        User->>Browser: Type answer to question
        Browser->>API: WS message: { type: "answer", content: "..." }
        API->>Redis: GET session:{id} (load conversation history)
        Redis-->>API: Conversation state

        API->>Claude: POST /messages (stream: true)\nSystem prompt + conversation history + new answer
        Note over API,Claude: Streaming response begins

        loop Token streaming
            Claude-->>API: SSE token chunk
            API-->>Browser: WS message: { type: "token", content: "..." }
            Browser-->>User: Progressive text display
        end

        Claude-->>API: Stream complete + full response
        API->>API: Parse response for next question or completion signal
        API->>Redis: UPDATE session:{id} + append to conversation

        alt More questions remain
            API-->>Browser: WS message: { type: "question", content: "..." }
        else Session complete (signal detected in response)
            API-->>Browser: WS message: { type: "analysis_started" }

            Note over API: Run analysis pipeline
            API->>Claude: POST /messages (analysis prompt)\nFull conversation for true desires extraction
            Claude-->>API: Structured JSON analysis
            API->>API: Parse + validate analysis output
            API->>API: Calculate confidence scores

            API->>PG: UPDATE discovery_sessions\nSET status='completed', true_desires=$td,\nconfidence_scores=$cs, conversation=$conv

            API->>Claude: POST /messages (embedding prompt)\nSession summary for vector storage
            Claude-->>API: Session summary text

            API->>Pinecone: upsert vector { id: session_id, values: embedding, metadata: { user_id } }

            API-->>Browser: WS message: { type: "complete", session_id: "..." }
            Browser-->>User: Navigate to /session/{id}/results
        end
    end

    User->>Browser: View results page
    Browser->>API: GET /api/sessions/{id}/results
    API->>PG: SELECT discovery_sessions WHERE id=$id AND user_id=$uid
    PG-->>API: Full session with analysis
    API-->>Browser: Session results
    NextApp-->>Browser: Render results with true desires visualization
```

---

## 3. Project Generation Flow

```mermaid
flowchart TD
    Start([User clicks 'Generate Project']) --> Auth{Authenticated?}
    Auth -->|No| Login[Redirect to /login]
    Auth -->|Yes| LoadSession[Load completed session data]

    LoadSession --> FetchSession[GET /api/sessions/:id/results]
    FetchSession --> ValidateSession{Session status\n= 'completed'?}
    ValidateSession -->|No| Error1[Error: Session not complete]
    ValidateSession -->|Yes| CheckTier{Check subscription\ntier}

    CheckTier -->|Free: project limit reached| Upsell[Show upgrade modal]
    CheckTier -->|Within limits| PreparePrompt[Prepare project generation prompt]

    PreparePrompt --> BuildContext[Build context:\n- User true_desires\n- Confidence scores\n- User profile/preferences\n- Existing project titles\n  to avoid duplicates]

    BuildContext --> CallClaude[POST to Claude API\nSonnet 4.5\nProject generation prompt]
    CallClaude --> StreamResponse[Stream response to UI\nvia WebSocket]
    StreamResponse --> ParseOutput{Parse Claude output:\n- Project name\n- Vision statement\n- Why this matters\n- 4-6 Milestones\n- Initial tasks per milestone}

    ParseOutput -->|Parse error| RetryOnce{Retry count < 2?}
    RetryOnce -->|Yes| CallClaude
    RetryOnce -->|No| FallbackForm[Show manual project form\nwith pre-filled suggestions]

    ParseOutput -->|Success| ValidateOutput[Validate output schema\nwith Zod]
    ValidateOutput -->|Invalid| RetryOnce
    ValidateOutput -->|Valid| PersistProject[INSERT projects record]

    PersistProject --> PersistMilestones[INSERT project_milestones\nfor each milestone]
    PersistMilestones --> PersistTasks[INSERT tasks\nfor each milestone]
    PersistTasks --> GenerateInsight[Generate initial insight:\nPOST /api/insights\nProject meaning analysis]

    GenerateInsight --> EmbedInsight[Embed insight\nStore in Pinecone]
    EmbedInsight --> Complete[Return project_id]
    Complete --> Navigate[Navigate to /projects/:id]

    Navigate --> RenderProject[Server-side render\nproject detail page]
    RenderProject --> Done([User sees their project])
```

---

## 4. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant NextEdge as Next.js Edge Middleware
    participant SupabaseAuth as Supabase Auth
    participant API as Express API
    participant PG as PostgreSQL

    Note over Browser,PG: Email/Password Signup

    User->>Browser: Fill signup form
    Browser->>SupabaseAuth: supabase.auth.signUp({ email, password })
    SupabaseAuth->>SupabaseAuth: Create user record\nSend verification email
    SupabaseAuth-->>Browser: { user, session: null }\n(email not yet verified)
    Browser-->>User: "Check your email"

    User->>Browser: Click email verification link
    Browser->>SupabaseAuth: Token exchange (PKCE flow)
    SupabaseAuth-->>Browser: { access_token, refresh_token }
    Browser->>Browser: Store tokens in httpOnly cookies\n(via Next.js API route)

    Browser->>API: POST /api/auth/complete-signup\n(Authorization: Bearer access_token)
    API->>SupabaseAuth: Verify JWT
    SupabaseAuth-->>API: Decoded user payload
    API->>PG: INSERT users (id, email, name)\nINSERT user_profiles (user_id)
    PG-->>API: User created
    API-->>Browser: { user, onboarding_url: "/onboarding" }
    Browser-->>User: Redirect to onboarding

    Note over Browser,PG: Authenticated Request Flow

    User->>Browser: Navigate to protected page
    Browser->>NextEdge: Request with access_token cookie
    NextEdge->>NextEdge: Decode JWT (no network call)\nCheck expiry

    alt Token valid
        NextEdge-->>Browser: Forward to page
    else Token expired (access_token < 5min remaining)
        NextEdge->>SupabaseAuth: POST /auth/v1/token\n(grant_type: refresh_token)
        SupabaseAuth-->>NextEdge: New access_token + refresh_token
        NextEdge->>NextEdge: Set new tokens in cookies
        NextEdge-->>Browser: Forward to page with refreshed tokens
    else Refresh token invalid/expired
        NextEdge-->>Browser: Redirect to /login
    end

    Note over Browser,PG: OAuth (Google) Sign-In

    User->>Browser: Click "Sign in with Google"
    Browser->>SupabaseAuth: supabase.auth.signInWithOAuth({ provider: 'google' })
    SupabaseAuth-->>Browser: Redirect to Google OAuth
    User->>Browser: Grant permissions on Google
    Browser->>SupabaseAuth: Callback with authorization_code
    SupabaseAuth->>SupabaseAuth: Exchange code for tokens\nCreate/update user record
    SupabaseAuth-->>Browser: Redirect to /auth/callback with tokens
    Browser->>API: POST /api/auth/oauth-complete
    API->>PG: UPSERT users record\nCreate profile if new user
    API-->>Browser: { user, is_new_user }
    Browser-->>User: Redirect to dashboard or onboarding
```

---

## 5. Real-Time WebSocket Flow (Chat)

```mermaid
sequenceDiagram
    participant Browser
    participant WSClient as WebSocket Client
    participant NextProxy as Next.js (WS Proxy)
    participant WSServer as Express WS Server
    participant Redis
    participant Claude as Claude API

    Note over Browser,Claude: Connection Establishment

    Browser->>WSClient: Initialize WebSocket connection
    WSClient->>WSServer: WS Upgrade: /ws/session/{session_id}\nHeaders: { Authorization: "Bearer {token}" }
    WSServer->>WSServer: Validate JWT\nExtract user_id
    WSServer->>Redis: GET session:{session_id}
    Redis-->>WSServer: Session state
    WSServer->>WSServer: Verify session.user_id === token.user_id
    WSServer-->>WSClient: 101 Switching Protocols\n(WS connection open)
    WSServer->>WSClient: { type: "connected", session_id, current_state }

    Note over Browser,Claude: Message Exchange Loop

    Browser->>WSClient: User submits answer
    WSClient->>WSServer: { type: "user_answer", content: "...", turn: 3 }
    WSServer->>WSServer: Validate message schema
    WSServer->>WSServer: Sanitize content\nCheck content length (max 2000 chars)

    WSServer->>Redis: GET session:{session_id} (conversation history)
    Redis-->>WSServer: Full conversation array

    WSServer->>WSServer: Build Claude prompt:\n- System prompt\n- Conversation history\n- New user message

    WSServer->>Claude: POST /v1/messages\n{ stream: true, max_tokens: 1024 }

    WSServer->>WSClient: { type: "ai_thinking" }
    Browser-->>Browser: Show typing indicator

    loop Streaming tokens
        Claude-->>WSServer: data: { type: "content_block_delta", delta: { text: "..." } }
        WSServer-->>WSClient: { type: "token", content: "..." }
        WSClient-->>Browser: Append token to UI
    end

    Claude-->>WSServer: data: { type: "message_stop" }
    WSServer->>WSServer: Assemble full response\nParse for: next_question | complete_signal | clarification

    WSServer->>Redis: LPUSH session:{id}:history { role: "user", content: "..." }
    WSServer->>Redis: LPUSH session:{id}:history { role: "assistant", content: "..." }
    WSServer->>Redis: SET session:{id}:turn_count {n} TTL=4h

    alt More questions
        WSServer->>WSClient: { type: "ai_complete", content: "full text" }
        WSServer->>WSClient: { type: "next_question", question: "...", turn: 4, total: 10 }
    else Session complete
        WSServer->>WSClient: { type: "ai_complete", content: "closing message" }
        WSServer->>WSServer: Trigger analysis pipeline (async)
        WSServer->>WSClient: { type: "session_complete", redirect: "/sessions/{id}/results" }
    end

    Note over Browser,Claude: Heartbeat & Reconnection

    loop Every 30 seconds
        WSClient->>WSServer: { type: "ping" }
        WSServer-->>WSClient: { type: "pong" }
    end

    alt Connection dropped
        WSClient->>WSClient: Detect close event
        WSClient->>WSClient: Exponential backoff (1s, 2s, 4s, max 30s)
        WSClient->>WSServer: Reconnect with session_id
        WSServer->>Redis: GET session:{id} (restore state)
        WSServer-->>WSClient: { type: "reconnected", last_turn: 3, conversation_restored: true }
    end
```

---

## 6. Architecture Decision Records (ADRs)

### ADR-001: Monolith Backend vs Microservices

**Status:** Accepted

**Context:** Initial architecture decision on how to structure the backend. Options were: (a) monolithic Express app, (b) microservices (Auth Service, AI Service, Project Service), (c) serverless functions.

**Decision:** Monolithic Express application with clear domain separation (controllers, services, repositories by domain).

**Rationale:**
- SOC is a new product with evolving requirements; microservice boundaries are hard to define correctly before the domain is well-understood
- Monolith-first reduces operational complexity, eliminates inter-service network latency, and simplifies deployment
- Domain separation within the monolith allows extraction into services when specific scaling bottlenecks emerge
- WebSocket connections require persistent server state; serverless functions cannot maintain WebSocket connections without additional infrastructure (e.g., socket adapters)

**Consequences:** Accept potential future refactoring cost if specific services need independent scaling. Mitigated by clear module boundaries from day one.

---

### ADR-002: Supabase Auth vs Custom JWT Auth

**Status:** Accepted

**Context:** Building custom JWT auth (bcrypt passwords, refresh token rotation, OAuth) vs. using Supabase Auth as a managed service.

**Decision:** Supabase Auth for all authentication.

**Rationale:**
- Auth is a solved problem with high security stakes; custom implementations frequently contain vulnerabilities
- Supabase Auth provides: bcrypt password hashing, secure refresh token rotation, PKCE OAuth flows, magic link, MFA support
- Supabase RLS policies integrate natively with Supabase Auth user IDs, providing seamless data isolation
- Time savings estimated at 2–3 weeks of engineering time

**Consequences:** Dependency on Supabase for auth availability. Supabase's 99.9% uptime SLA is acceptable. Migration path documented if needed.

---

### ADR-003: REST vs GraphQL

**Status:** Accepted

**Context:** API communication protocol between frontend and backend.

**Decision:** RESTful API with JSON payloads.

**Rationale:**
- SOC's data requirements are well-defined and do not require flexible ad-hoc querying (GraphQL's primary advantage)
- REST endpoints are simpler to implement, document, test, and secure
- HTTP caching is straightforward with REST; GraphQL's POST-based queries cannot be CDN-cached
- Rate limiting per endpoint is simpler with REST
- Future mobile clients (iOS, Android) work naturally with REST

**Consequences:** Some over-fetching in list endpoints. Mitigated with response field filtering via `?fields=` query parameter on high-traffic endpoints.

---

### ADR-004: WebSockets vs Server-Sent Events for AI Streaming

**Status:** Accepted

**Context:** Real-time AI token streaming mechanism.

**Decision:** Native WebSockets (`ws` library) over Server-Sent Events (SSE).

**Rationale:**
- SOC's session protocol is bidirectional (client sends answers, server streams AI responses); SSE is unidirectional (server → client only)
- WebSockets enable future features: collaborative sessions, real-time accountability pair notifications
- `ws` library is lightweight and well-maintained without the overhead of Socket.IO
- WebSocket connections are maintained on Railway's persistent server environment (not serverless)

**Consequences:** WebSocket state must be handled carefully with reconnection logic. Addressed in the connection management layer with Redis-backed state persistence.

---

### ADR-005: Pinecone vs pgvector for Vector Storage

**Status:** Accepted

**Context:** Vector similarity search for insight retrieval and long-term user memory.

**Decision:** Pinecone for vector storage, with pgvector as a future migration option.

**Rationale:**
- Pinecone provides a fully managed, dedicated vector index optimized for ANN (Approximate Nearest Neighbor) search
- pgvector requires careful index tuning (HNSW parameters) and dedicated Postgres resources to maintain query performance at high vector counts
- Pinecone's metadata filtering by `user_id` is straightforward and performant
- At SOC's scale (~10k users, ~500k vectors), Pinecone's Standard plan is cost-effective

**Consequences:** Additional service dependency. Pinecone's free tier limitations require plan upgrade at scale. Migration to pgvector documented as a future cost optimization path.

---

## 7. Scalability Plan

### Current State (0–1,000 users)
- Single Express.js instance on Railway (1 vCPU, 2GB RAM)
- Single Supabase project (Free → Pro as needed)
- Single Upstash Redis instance
- Pinecone Free tier (1 index)
- All services in same Railway project

### Phase 1: Early Growth (1,000–10,000 users)
**Trigger:** API response times consistently above 200ms P95, or CPU usage above 70% sustained

**Actions:**
- Scale Railway instance to 2 vCPU, 4GB RAM
- Enable Railway horizontal scaling (2 replicas) with sticky WebSocket sessions (session affinity by `session_id` hash)
- Upgrade Supabase to Pro ($25/month); enable connection pooling via PgBouncer
- Implement Redis-based response caching for frequently accessed endpoints (`GET /api/projects`, `GET /api/insights`)
- Upgrade Pinecone to Standard plan

**Expected capacity:** 10k active users, 500 concurrent WebSocket connections

### Phase 2: Scaling (10,000–50,000 users)
**Trigger:** Database CPU consistently above 60%, or query P95 above 100ms

**Actions:**
- Introduce read replica in Supabase for read-heavy queries (project lists, insights, check-in history)
- Separate WebSocket server from REST API server; deploy WebSocket service as dedicated Railway service
- Implement API response caching at Cloudflare edge for public/shared endpoints
- Extract AI orchestration into dedicated service with its own scaling profile
- Implement database query result caching (Redis) for expensive aggregations (streak counts, mood averages)
- Introduce message queue (Redis Streams or dedicated Bull queue) for async operations (email sending, insight generation, embedding updates)

**Expected capacity:** 50k active users, 2,500 concurrent WebSocket connections

### Phase 3: Enterprise Scale (50,000–100,000 users)
**Trigger:** Infrastructure costs approach $5,000/month or performance degradation in specific regions

**Actions:**
- Evaluate self-hosted PostgreSQL vs. Supabase Team plan
- Multi-region deployment: primary in US-East, replica in EU-West (GDPR compliance) and Asia-Pacific
- Implement global load balancing via Cloudflare Workers
- Consider extracting to microservices: Auth Service, AI Orchestration Service, Notification Service
- Implement CDN-level API response caching for non-personalized content
- Redis Cluster for distributed caching across regions
- Evaluate replacing Pinecone with self-hosted Weaviate or Qdrant at cost threshold

**Expected capacity:** 100k active users, 10,000 concurrent WebSocket connections

---

## 8. Caching Strategy

### Cache Layers

| Layer | Technology | TTL | Scope | Purpose |
|-------|-----------|-----|-------|---------|
| Browser | HTTP Cache-Control | Varies | Per user | Static assets, immutable files |
| CDN (Cloudflare) | Cache API | 1hr–24hr | Global | Marketing pages, static assets |
| Next.js | `next/cache` | 5min–1hr | Per route | Server component data fetching |
| Application (Redis) | Upstash | 30min–4hr | Per user | Session state, user data |
| Database query | PgBouncer | N/A | Connection pool | Connection reuse |

### Cache Key Design

```
user:{user_id}:profile          — User profile data, TTL 1hr
user:{user_id}:projects         — Project list, TTL 30min
user:{user_id}:streak           — Current streak, TTL 1hr
session:{session_id}            — Active session state, TTL 4hr
session:{session_id}:history    — Conversation history list, TTL 4hr
insights:{user_id}:recent       — Recent insights list, TTL 2hr
rate_limit:{ip}:{endpoint}      — Rate limit counter, TTL per policy
```

### Cache Invalidation Rules

- **User profile:** Invalidate on `PUT /api/users/profile`
- **Project list:** Invalidate on project CREATE, UPDATE, DELETE
- **Session state:** Invalidate on session COMPLETE or ABANDON
- **Streak:** Invalidate on check-in submission
- **Insights:** Invalidate on new insight generation

### AI Prompt Caching

Static portions of system prompts (persona definition, output format instructions) are stored in Redis with a 24-hour TTL. Only the dynamic portions (conversation history, user-specific context) are assembled per request, reducing per-request prompt construction time by ~30ms.

---

## 9. Error Handling Approach

### Error Classification

```
1. User Errors (4xx)       — Invalid input, unauthorized, not found
2. External Service Errors — Claude API unavailable, Stripe webhook failure
3. Infrastructure Errors   — Database connection lost, Redis timeout
4. Application Bugs        — Unexpected null, type mismatch
```

### Error Response Format

All API errors return a consistent JSON structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Answer content must not exceed 2000 characters.",
    "details": [
      {
        "field": "content",
        "issue": "String must contain at most 2000 character(s)"
      }
    ],
    "request_id": "req_01HX..."
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body failed schema validation |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Authenticated but lacks permission |
| `NOT_FOUND` | 404 | Resource does not exist or belongs to another user |
| `RATE_LIMITED` | 429 | Too many requests; Retry-After header included |
| `TIER_LIMIT` | 403 | Feature not available on current subscription tier |
| `SESSION_EXPIRED` | 410 | Discovery session has expired (>4 hours since last activity) |
| `AI_UNAVAILABLE` | 503 | Claude API is unreachable; retry with backoff |
| `INTERNAL_ERROR` | 500 | Unexpected server error; logged to Sentry |

### Retry and Circuit Breaker Strategy

**Claude API calls:**
- Retry on 529 (overloaded) and 5xx errors: 3 attempts, exponential backoff (1s, 2s, 4s)
- Circuit breaker: open after 5 consecutive failures within 60 seconds
- Fallback: queue the operation for retry, return a graceful degraded response to the user
- If circuit open: return cached response if available, otherwise `AI_UNAVAILABLE` error

**Database operations:**
- Connection pool via PgBouncer handles transient connection failures
- Retry on `ECONNRESET`, `ECONNREFUSED`: 2 attempts, 500ms delay
- All mutations wrapped in try/catch with explicit rollback

**Redis operations:**
- Redis failures are non-blocking for read operations (fail open, read from database)
- Redis failures for write operations (rate limit) are logged but do not block requests (conservative: allow the request)

### Frontend Error Boundaries

```
Root Error Boundary    — catches all uncaught errors, shows global error page
├── Layout Boundary    — isolates navigation from content errors
├── Dashboard Boundary — catches dashboard widget errors independently
├── Session Boundary   — catches session-specific errors
└── Project Boundary   — catches project view errors
```

Each boundary reports to Sentry and shows a contextual recovery UI ("Something went wrong — [Try Again] or [Go to Dashboard]").

### WebSocket Error Handling

- Connection errors → automatic reconnection with exponential backoff (max 5 attempts)
- Message parse errors → log to Sentry, send `{ type: "error", code: "PARSE_ERROR" }` to client
- Claude API error during streaming → send `{ type: "error", code: "AI_ERROR", recovery: "retry" }` to client
- Session state corruption → restore from PostgreSQL (Redis as secondary), notify user of minor delay

---

*Architecture diagrams should be regenerated whenever significant topology changes are made. Use Mermaid Live Editor (mermaid.live) to preview diagram changes before committing.*
