# Source Constructor (SOC) — Technical Stack

**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Approved
**Owner:** Engineering Lead

---

## Overview

This document defines the complete technology stack for the Source Constructor (SOC) AI platform. Every technology choice is deliberate, justified by technical merit, cost efficiency, and alignment with the platform's core goal: helping users discover their authentic ambitions through AI-guided sessions and structured project management.

The stack prioritizes:
1. **Developer velocity** — ship fast without sacrificing quality
2. **Cost predictability** — avoid runaway infrastructure costs at early scale
3. **Type safety** — reduce runtime errors through end-to-end TypeScript
4. **Observability** — know what's happening in production at all times
5. **AI-first architecture** — built from the ground up to integrate LLM capabilities

---

## 1. Frontend

### 1.1 Next.js 14

**Chosen version:** 14.2.x (App Router, stable)

**Why chosen:**
- **App Router** provides first-class support for React Server Components (RSC), enabling server-side data fetching without prop drilling, which is essential for the project dashboard and discovery session views
- **Streaming SSR** allows the AI chat interface to progressively render as tokens arrive, delivering perceived performance improvements over traditional SPA approaches
- **Built-in API routes** allow lightweight BFF (Backend for Frontend) patterns without a separate proxy server, used for auth token exchange and Stripe webhook handling
- **Image optimization** via `next/image` reduces LCP times critical for onboarding retention
- **Turbopack** (in dev mode) cuts hot reload times to under 500ms, improving developer experience meaningfully over Webpack
- **Vercel integration** is native and zero-config — deploys happen automatically on merge to main
- **Edge Runtime** support enables running auth middleware at the CDN edge for sub-10ms response times on protected routes

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| Remix | Excellent DX but smaller ecosystem, fewer hosting options, less mature edge support as of early 2026 |
| Vite + React SPA | No SSR means poor initial page load for cold visitors; SEO is secondary concern but discoverability matters for marketing pages |
| Nuxt.js (Vue) | Team has stronger React expertise; hiring pool deeper for React |
| SvelteKit | Compelling performance story but insufficient ecosystem maturity for rapid feature development |

**Cost implications:** Free for build tooling. Deployment costs covered under Vercel section.

---

### 1.2 React 18

**Why chosen:**
- **Concurrent rendering** enables the `useTransition` hook to keep the UI responsive during heavy state updates (e.g., when the AI generates a full project breakdown)
- **Suspense boundaries** allow granular loading states without complex conditional rendering logic
- **`use` hook** (React 18.3+) enables direct promise consumption in components, simplifying data fetching patterns with RSC
- The SOC chat interface leverages `startTransition` to prevent input lag while AI response streaming updates state

**Rejected alternatives:** React 19 (RC stage at time of decision, awaiting stable release). Migration path is documented in the roadmap.

---

### 1.3 Tailwind CSS 3.4

**Why chosen:**
- **Utility-first** approach eliminates the context-switching cost of maintaining separate stylesheet files, which accelerates iteration speed by an estimated 30–40% based on team experience
- **JIT compilation** means zero unused CSS in production — bundle size stays lean regardless of how many utilities are used in development
- **Design token integration** — Tailwind's `theme.extend` maps directly to the SOC design token system (colors, spacing, typography), ensuring consistency between design and code
- **Component co-location** — styles live alongside markup, making component extraction and deletion trivial
- `tailwind-merge` and `clsx` handle conditional class composition without specificity conflicts
- **Dark mode** support via `class` strategy aligns with the user preference detection approach

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| CSS Modules | Excellent scoping, but verbose, slower to write, requires more context switching |
| Styled Components / Emotion | Runtime CSS-in-JS introduces performance overhead; React 18 RSC incompatible with runtime CSS-in-JS |
| Stitches | Abandoned by maintainers in 2023 |
| UnoCSS | Compelling alternative but less tooling support and team familiarity |

**Cost implications:** Free, open source.

---

### 1.4 Zustand 4.x

**Why chosen:**
- **Minimal boilerplate** — a Zustand store requires ~5 lines vs ~50 lines for equivalent Redux slice
- **No Provider wrapping** — stores are module-level singletons, simplifying component trees and eliminating context re-render cascades
- **Devtools integration** works with Redux DevTools Extension, preserving debugging capability
- **Selective subscriptions** via `useStore(state => state.slice)` prevent unnecessary re-renders, critical for the real-time chat interface where frequent updates occur
- **Middleware support** — Zustand's `persist` middleware handles localStorage sync for user preferences and draft session state without custom code
- **Immer integration** via `immer` middleware enables mutable-style state updates for complex nested objects like conversation history

**State management scope:**
- `sessionStore` — active discovery session state, conversation history, current question
- `projectStore` — project list, selected project, milestone/task cache
- `uiStore` — sidebar open/closed, toast queue, modal state
- `userStore` — current user profile, subscription tier, onboarding progress

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| Redux Toolkit | Excellent for large teams with strict conventions; overkill complexity for this codebase size |
| Jotai | Atomic model is elegant but harder to reason about for connected session state |
| Valtio | Proxy-based reactivity is clever but harder to debug |
| React Context + useReducer | Sufficient for simple cases but causes excessive re-renders at SOC's state complexity level |

**Cost implications:** Free, open source.

---

### 1.5 React Hook Form 7.x + Zod 3.x

**Why chosen:**
- **React Hook Form** uses uncontrolled inputs with ref-based validation, resulting in zero re-renders during typing — critical for the discovery session answer input where smooth UX directly impacts engagement
- **Zod** provides TypeScript-first schema validation that generates types automatically, eliminating the need to define types and validation rules separately
- **Integration** between the two libraries is official and robust via `@hookform/resolvers/zod`
- Zod schemas are **reused** between frontend validation and backend request parsing (same schema imported in Express route handlers), ensuring consistent validation rules
- **Error messages** are co-located with schema definitions, making i18n preparation straightforward

**Key schemas:**
- `signupSchema` — email, password strength, name validation
- `sessionAnswerSchema` — text content, max length, sanitization
- `projectUpdateSchema` — partial update validation
- `checkinSchema` — mood score range, notes length, date validation

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| Formik | Controlled inputs cause re-renders on every keystroke; slower than RHF |
| Yup | Similar capability to Zod but TypeScript inference is weaker; Zod's `.infer<>` is superior |
| Valibot | Emerging alternative with smaller bundle; less mature ecosystem |

**Cost implications:** Free, open source.

---

### 1.6 Recharts 2.x

**Why chosen:**
- **React-native** — built specifically for React, uses SVG and standard React patterns rather than imperative D3 mutations
- **Responsive containers** handle dynamic layout without custom resize observers
- **Composable API** allows mixing chart primitives (Line, Bar, Area) in a single chart, needed for the dashboard's progress visualization combining streaks, mood trends, and milestone completion rates
- **Sufficient for v1 scope** — SOC does not require complex data visualizations that would justify D3's learning curve

**Charts used in SOC:**
- `LineChart` — mood score trends over time (daily check-in view)
- `BarChart` — weekly activity/streak visualization
- `RadarChart` — multi-dimension progress across project goals
- `AreaChart` — overall engagement trend on dashboard

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| D3.js | Extremely powerful but imperative API conflicts with React's declarative model; significant learning curve |
| Victory | Less actively maintained, smaller community |
| Chart.js | Canvas-based, harder to customize styling to match design system; less React-friendly |
| Nivo | Beautiful but bundle size is large; more than SOC needs |

**Cost implications:** Free, open source.

---

### 1.7 Framer Motion 11.x

**Why chosen:**
- **Declarative animations** integrate with React's component lifecycle; components animate in/out automatically via `AnimatePresence`
- **Layout animations** handle smooth DOM reordering without explicit keyframe calculation — used when task lists reorder by priority
- **Gesture support** enables swipe-to-complete on mobile for task items and check-in flows
- **Variants system** allows defining animation states at the design token level, keeping animation definitions consistent across the application
- **Performance** — uses the WAAPI (Web Animations API) where available, falling back to rAF, ensuring 60fps on modern devices

**Animation use cases in SOC:**
- Page transitions between dashboard, sessions, and project views
- Chat message appearance (staggered fade-in + slide)
- Project card hover states and selection animations
- Milestone completion celebration micro-animations
- Onboarding step transitions

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| React Spring | Physics-based approach is elegant but harder to coordinate with sequential UI flows |
| CSS transitions only | Insufficient for complex coordinated animations like the discovery session flow |
| GSAP | Imperative API; license costs for some plugins; React integration requires adapters |

**Cost implications:** Free for web use, open source.

---

## 2. Backend

### 2.1 Node.js 20 LTS

**Why chosen:**
- **LTS stability** — Node.js 20 entered long-term support, guaranteeing security patches through April 2026, with active development extending further
- **Native fetch API** — no longer requires `node-fetch` polyfill; aligns server-side HTTP with browser APIs for code sharing
- **ESM support** is stable and performant in Node 20, enabling tree-shaking and cleaner module semantics
- **Performance improvements** — V8 engine updates in Node 20 deliver ~15–20% throughput improvements over Node 18 on I/O-bound workloads
- **Alignment with frontend** — same language (TypeScript/JavaScript) across stack enables code sharing for validation schemas, types, and utility functions
- **Worker Threads** — available for CPU-intensive operations like report generation without blocking the event loop

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| Bun | Significantly faster runtime but ecosystem compatibility issues remain; production battle-testing insufficient as of this decision |
| Deno | Interesting security model but npm compatibility, while improved, introduces subtle edge cases |
| Python (FastAPI) | Excellent for ML workloads but team expertise in Node; language split increases cognitive overhead |
| Go | Best raw performance but longest time to productivity for the current team |

**Cost implications:** Free, open source. Runs on Railway instances (see Infrastructure section).

---

### 2.2 Express.js 4.x

**Why chosen:**
- **Industry standard** — Express is the most widely understood Node.js framework; virtually every Node.js developer has Express experience, minimizing onboarding time
- **Minimal core** — Express does not prescribe architecture, allowing SOC to structure middleware, routers, and controllers according to domain needs
- **Middleware ecosystem** — `helmet`, `cors`, `express-rate-limit`, `express-validator`, `morgan` are all first-class Express middlewares with years of production use
- **Predictable request lifecycle** — Express's sequential middleware chain is easy to reason about for security reviews
- **Mature** — Express's stability means no breaking changes that would require emergency migrations

**Architecture pattern:** Controllers → Services → Repositories (clean separation of HTTP concerns, business logic, and data access)

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| Fastify | Marginally faster than Express but team familiarity advantage outweighs performance delta for I/O-bound API workloads |
| NestJS | Excellent for large teams with strict conventions; Angular-style decorators add abstraction overhead for a focused product like SOC |
| Hono | Promising edge-first framework; ecosystem less mature for this feature set |
| tRPC | Compelling type-safe RPC, but WebSocket support and REST compatibility (for mobile clients later) is smoother with REST |

**Cost implications:** Free, open source.

---

### 2.3 RESTful API + WebSockets

**REST** is used for all standard CRUD operations: user management, project operations, check-ins, and insights retrieval. REST is appropriate because:
- Resources map cleanly to HTTP semantics
- Standard HTTP tooling (curl, Postman, browser DevTools) works without additional setup
- Caching at CDN and application layer is straightforward

**WebSockets** (via `ws` library + custom implementation over Express) are used exclusively for:
- Real-time streaming of AI responses during discovery sessions
- Live check-in AI response streaming
- Future: real-time accountability pair notifications (v1.5)

**Protocol decision:** Native WebSockets over Socket.IO because Socket.IO's fallback transport layers add overhead that is unnecessary for modern browsers. The WebSocket connection is authenticated via a short-lived token exchanged immediately after upgrade.

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| GraphQL | Flexibility is valuable for complex query patterns but adds resolver complexity, N+1 query risks, and a larger attack surface for a v1 product |
| gRPC | Excellent for service-to-service communication; browser support requires grpc-web proxy; overkill for this architecture |
| Server-Sent Events (SSE) | Viable for unidirectional streaming (AI responses) but WebSockets enables bidirectional communication needed for future features |

---

## 3. Database

### 3.1 PostgreSQL via Supabase

**Why chosen:**
- **PostgreSQL** is the world's most feature-complete open-source relational database, with JSONB support bridging structured and semi-structured data needs
- **Supabase** provides managed PostgreSQL with:
  - **Row Level Security (RLS)** — Supabase's RLS policies enforce data isolation at the database level, providing defense-in-depth beyond application-layer authorization
  - **Realtime subscriptions** — native Postgres publication/subscription mechanism for live dashboard updates
  - **Auth integration** — Supabase Auth handles JWT issuance, refresh token rotation, and OAuth provider integration, eliminating custom auth infrastructure
  - **Dashboard** — built-in SQL editor, schema visualizer, and log viewer accelerate development and debugging
  - **pgvector extension** — enables native vector search for future semantic search features within the application
  - **Automatic backups** — daily PITR (point-in-time recovery) included on Pro plan

**Data model strengths for SOC:**
- JSONB columns store conversation history, true_desires analysis, and AI response payloads without requiring schema migrations as the AI output format evolves
- Relational structure enforces referential integrity between users → sessions → projects → milestones → tasks
- PostgreSQL's full-text search handles project and task search without an external search service

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| MongoDB | Document model fits JSONB use cases but lacks transactional integrity across collections; PostgreSQL handles both relational and document patterns |
| PlanetScale (MySQL) | No JSONB; vitess sharding is impressive but unnecessary at SOC's scale; branching workflow is appealing but not a differentiator |
| Firebase Firestore | Real-time sync is compelling but query limitations are severe; no complex joins; vendor lock-in concern |
| Neon | Excellent serverless Postgres option; Supabase chosen for the integrated auth and RLS ecosystem |

**Cost implications:**
- Supabase Free tier: 500MB database, 50MB file storage, 2GB bandwidth — sufficient for development and early beta
- Supabase Pro ($25/month): 8GB database, 100GB storage, 250GB bandwidth, PITR — appropriate from launch through ~10k users
- Supabase Team ($599/month): considered at 50k+ users; evaluate vs. self-hosted at that stage

---

### 3.2 Redis (via Upstash)

**Why chosen:**
- **Session caching** — active discovery sessions are cached in Redis with a 4-hour TTL, reducing database reads during multi-turn conversations by ~95%
- **Rate limiting** — sliding window rate limiting implemented with Redis atomic operations (`INCR` + `EXPIRE`) across API routes
- **AI prompt cache** — frequently-used system prompts and static context blocks are cached, reducing tokens sent to Claude API
- **Job queuing** — lightweight queue for background jobs (insight generation, weekly summary emails) using Redis lists
- **Upstash** chosen for serverless Redis: pay-per-request pricing, global replication, REST API support for edge functions, zero infrastructure management

**Cache invalidation strategy:**
- User data: invalidated on profile update, TTL 1 hour
- Session data: invalidated on session completion, TTL 4 hours
- Project data: invalidated on any project mutation, TTL 30 minutes
- Rate limit windows: natural expiry per rate limit policy

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| Memcached | Simpler but lacks persistence, pub/sub, and atomic operations needed for rate limiting |
| DynamoDB (as cache) | AWS-specific; latency and cost structure less suited for high-frequency small reads |
| In-memory cache (node-cache) | Per-instance cache doesn't work with horizontally scaled backend; invalidation is impossible across instances |

**Cost implications:**
- Upstash Free: 10,000 requests/day — sufficient for development
- Upstash Pay-as-you-go: $0.2 per 100k requests — predictable at scale; estimated $15–50/month at launch

---

### 3.3 Pinecone Vector Database

**Why chosen:**
- **Semantic search** across the user's discovery session history and insights requires vector similarity search that relational databases cannot perform efficiently at scale
- **Insight retrieval** — when generating new insights, relevant past insights are retrieved by semantic similarity, enabling coherent longitudinal AI analysis
- **Long-term memory** — user's goals, values, and patterns extracted across sessions are embedded and stored, enabling the AI to reference them without sending full history to the API (context window management)
- **Pinecone** provides:
  - Managed vector index with no infrastructure overhead
  - Metadata filtering (filter by `user_id` for user-scoped search)
  - Namespaces for logical separation of index types
  - REST and client SDK access

**Index structure:**
- `soc-user-insights` namespace: embeddings of extracted insights (model: `text-embedding-3-small` via OpenAI, or Claude's planned embedding endpoint)
- `soc-session-summaries` namespace: compressed session summary embeddings for longitudinal context
- Dimension: 1536 (text-embedding-3-small), metadata: `{ user_id, session_id, type, created_at }`

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| pgvector (PostgreSQL extension) | Excellent for lower scale; Pinecone chosen for dedicated indexing performance and simpler operations at high vector count |
| Weaviate | More complex deployment; self-hosted option adds infrastructure burden |
| Chroma | Best for local/embedded use; cloud offering less mature than Pinecone |
| Qdrant | Strong technical contender; Pinecone's managed offering and ecosystem integrations narrowly win |

**Cost implications:**
- Pinecone Free: 1 index, 100k vectors — sufficient for beta with up to ~1k users
- Pinecone Standard ($70/month): unlimited indexes, 5M vectors — appropriate through 20k users
- Evaluate pod-based pricing at higher vector counts

---

## 4. AI / ML

### 4.1 Anthropic Claude Sonnet 4.5 API

**Why chosen:**
- **Context quality** — Claude's training emphasizes nuanced understanding of human intent, which is directly aligned with SOC's core purpose of identifying "true desires" beneath surface-level goals
- **Long context window** — 200k token context window allows SOC to include full conversation history, user profile, and past sessions in a single request without truncation
- **Instruction following** — Claude demonstrates superior structured output compliance compared to alternatives, critical for JSON-formatted analysis responses
- **Safety alignment** — Anthropic's Constitutional AI training makes Claude less likely to produce harmful outputs in the sensitive context of personal goal-setting and accountability
- **Streaming support** — Server-sent events streaming from the Claude API enables real-time token delivery to the frontend, improving perceived response time from seconds to immediate

**Model selection within Anthropic's lineup:**
- **Sonnet 4.5** chosen over Haiku 4.5 (quality threshold for discovery analysis exceeds what Haiku reliably delivers) and Opus 4.5 (cost would be 5x higher; Sonnet performs equivalently on SOC's structured prompt tasks in internal evaluations)
- **Haiku 4.5** is used for lightweight tasks: simple acknowledgment messages, tag extraction, and check-in brief responses where cost optimization is viable

**Rejected alternatives:**

| Alternative | Reason Rejected |
|-------------|-----------------|
| OpenAI GPT-4o | Strong competitor; Claude's instruction following and context quality evaluated as superior for SOC's specific prompting patterns |
| Google Gemini 1.5 Pro | Excellent multimodal capabilities; text-only quality evaluated as slightly below Claude Sonnet for structured analysis |
| Llama 3 (self-hosted) | Cost elimination is compelling; operational overhead of self-hosting LLMs + quality gap makes this unsuitable for v1; revisit at scale |
| Mistral | Best cost-performance for general tasks; quality on nuanced emotional/goal analysis falls short |

**Cost implications:**
- Claude Sonnet 4.5: $3/MTok input, $15/MTok output (approximate)
- Average discovery session: ~8,000 input tokens, ~2,000 output tokens across all turns ≈ $0.054 per session
- Average daily check-in (Haiku): ~1,500 input tokens, ~500 output tokens ≈ $0.002 per check-in
- Estimated monthly AI cost at 1,000 active users with 2 sessions + 15 check-ins each: ~$138 + $30 = ~$168/month
- At 10,000 users: ~$1,680/month — manageable within subscription revenue

---

## 5. Infrastructure

### 5.1 Vercel (Frontend Hosting)

**Why chosen:**
- **Zero-config Next.js deployment** — Vercel built Next.js; the integration is first-party and requires no configuration
- **Edge Network** — 100+ PoPs globally; static assets and edge-rendered pages served in <50ms worldwide
- **Preview deployments** — every PR gets a unique preview URL, enabling design/QA review before merge without any additional tooling
- **Analytics** — Vercel's built-in Web Analytics provides Core Web Vitals tracking without a separate analytics SDK
- **Environment management** — development, staging, and production environment variables managed via Vercel dashboard with automatic branch targeting

**Cost implications:**
- Vercel Pro: $20/month/user, ~$60/month for 3-person team
- Bandwidth included in Pro plan covers estimated usage through 50k monthly visitors
- Evaluate Enterprise at 500k+ monthly visitors

---

### 5.2 Railway (Backend Hosting)

**Why chosen:**
- **Simplicity** — Railway deploys from a Dockerfile or Nixpacks buildpack; zero DevOps configuration
- **Persistent services** — unlike serverless functions, Railway runs persistent Node.js servers, enabling WebSocket connections without connection overhead
- **Private networking** — backend service communicates with Redis and other Railway services over private network with zero egress cost
- **Automatic scaling** — Railway handles horizontal scaling within the same region; multi-region available on Enterprise
- **Deployment model** — Railway deploys from the same GitHub repository via GitHub Actions, maintaining a consistent CI/CD pipeline

**Cost implications:**
- Railway Hobby: $5/month base + usage ($0.000463/vCPU-second, $0.000231/GB-second RAM)
- Estimated 2 vCPU, 4GB RAM service: ~$50–80/month
- Staging environment: ~$20–30/month
- Scale to 4 vCPU, 8GB RAM at ~5k concurrent users: ~$120–160/month

---

### 5.3 Cloudflare (CDN + Security)

**Why chosen:**
- **DDoS protection** — Cloudflare's network absorbs volumetric attacks before they reach origin servers; included in all plans
- **WAF (Web Application Firewall)** — managed ruleset blocks OWASP Top 10 attack patterns at the edge
- **Bot management** — reduces scraping and credential stuffing against the auth endpoints
- **DNS management** — Cloudflare DNS is among the fastest globally, improving time to first byte for new visitors
- **Rate limiting** at CDN layer provides a first line of defense before requests reach the application rate limiter

**Cost implications:**
- Cloudflare Pro: $20/month — includes WAF rules, analytics, and bot fight mode
- Cloudflare Business: $200/month — adds custom WAF rules; evaluate at launch based on threat profile

---

### 5.4 Sentry (Error Monitoring)

**Why chosen:**
- **End-to-end error tracking** across frontend (React error boundaries + automatic uncaught exception capture) and backend (Express error middleware)
- **Source maps** enable seeing original TypeScript source in stack traces rather than minified code
- **Performance monitoring** — distributed tracing links frontend errors to backend API calls, enabling root cause analysis across the stack
- **Alerts** — Slack integration notifies on first occurrence of new error types and spike detection

**Cost implications:**
- Sentry Developer: Free (5k errors/month) — for development and early beta
- Sentry Team: $26/month — 50k errors/month, 7-day retention; appropriate for launch through ~5k users
- Sentry Business: $80/month — evaluate at higher scale

---

### 5.5 PostHog (Product Analytics)

**Why chosen:**
- **Self-hostable** — PostHog offers a cloud option but can be self-hosted for complete data ownership (GDPR advantage)
- **Feature flags** — enables gradual rollout and A/B testing without a separate service (LaunchDarkly replacement)
- **Session recording** — privacy-respecting session replay helps identify UX friction in the onboarding flow
- **Funnels and cohorts** — tracks conversion from signup → discovery session → project creation → daily retention
- **Event autocapture** — reduces instrumentation burden; custom events added for key SOC actions (session started, project generated, check-in completed)

**Key events tracked:**
- `user_signed_up`, `onboarding_step_completed`, `discovery_session_started`, `discovery_session_completed`
- `project_generated`, `milestone_created`, `task_completed`
- `checkin_submitted`, `streak_milestone_reached`
- `subscription_started`, `subscription_cancelled`

**Cost implications:**
- PostHog Cloud: Free up to 1M events/month — sufficient through ~5k active users
- PostHog Scale: $0.00031/event above 1M — predictable pricing

---

### 5.6 Resend (Transactional Email)

**Why chosen:**
- **React Email integration** — email templates are written as React components, enabling design system reuse and TypeScript type safety in templates
- **Deliverability** — Resend is built by former Sendgrid engineers focused on deliverability; SPF/DKIM setup is automatic
- **Simple API** — single function call to send templated email, no complex SMTP configuration
- **Webhooks** — delivery, open, and bounce events enable engagement tracking and bounce management

**Email types:**
- Welcome email (onboarding Day 0)
- Discovery session completion summary
- Weekly project progress digest
- Milestone completion congratulation
- Streak reminder (accountability feature)
- Password reset / magic link

**Cost implications:**
- Resend Free: 3,000 emails/month, 100/day — sufficient for early beta
- Resend Pro: $20/month for 50,000 emails — appropriate from launch through ~10k users

---

### 5.7 Stripe (Payments)

**Why chosen:**
- **Industry standard** — Stripe handles compliance (PCI DSS Level 1), fraud detection, and global payment methods
- **Subscription management** — Stripe Billing handles metered billing, trial periods, upgrades/downgrades, and proration automatically
- **Webhook reliability** — Stripe retries webhook delivery; SOC processes payment events to update subscription records
- **Customer portal** — Stripe's hosted customer portal handles plan changes and payment method updates without custom UI

**Subscription tiers (SOC):**
- Free tier: 1 discovery session, 1 project, 7-day check-in history
- Pro ($15/month): unlimited sessions, 5 projects, full history, AI insights
- Team ($49/month): Pro features + accountability pairs, shared projects (v1.5)

**Cost implications:**
- Stripe fees: 2.9% + $0.30 per transaction (standard); 0.5% + Billing subscription fee
- At $15/month Pro, effective fee: ~$0.74 per subscription/month
- Revenue goal: cover infrastructure costs ($300–500/month) at ~400 Pro subscribers

---

## 6. DevOps

### 6.1 GitHub Actions (CI/CD)

**Pipeline stages:**

```
Push to feature branch:
  └── Lint (ESLint + TypeScript check) [~2min]
  └── Unit tests (Vitest) [~3min]
  └── Build check [~4min]

Pull Request to main:
  └── All above +
  └── Integration tests [~5min]
  └── E2E tests (Playwright, subset) [~8min]
  └── Preview deployment (Vercel + Railway staging) [~6min]
  └── Lighthouse CI check [~3min]

Merge to main:
  └── All tests +
  └── Production deployment [~8min]
  └── E2E smoke tests against production [~5min]
  └── Sentry release creation [~1min]
  └── Slack notification [~30sec]
```

**Environment strategy:**
- `development` — local dev with `.env.local`
- `preview` — per-PR environments, uses staging databases and test Stripe keys
- `staging` — persistent environment matching production configuration; used for final QA
- `production` — live environment; deployments require passing all pipeline stages

### 6.2 Playwright (E2E Testing)

**Why chosen:**
- **Multi-browser** — tests run on Chromium, Firefox, and WebKit with a single API
- **Auto-waiting** — Playwright waits for elements to be actionable before interacting, eliminating flaky `sleep()` calls
- **Network interception** — enables testing AI response scenarios without hitting the Claude API (mock responses)
- **Trace viewer** — failed test recordings include screenshots, network logs, and console output for debugging

**Test coverage targets:**
- Critical user flows: signup, onboarding, discovery session, project creation, daily check-in
- Payment flows: subscription start, upgrade, cancellation
- Edge cases: expired sessions, API errors, offline behavior

**Cost implications:** Free, open source. GitHub Actions compute for E2E: ~$20–40/month depending on run frequency.

---

## 7. Development Tools

### 7.1 TypeScript 5.x

End-to-end TypeScript across frontend (Next.js), backend (Express), and shared packages. TypeScript configuration uses `strict: true` with additional strictness options enabled. Shared types package (`packages/types`) exports domain models used by both frontend and backend.

### 7.2 ESLint + Prettier

- ESLint with `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-config-next`
- Prettier for formatting with consistent 2-space indentation, single quotes, trailing commas
- `lint-staged` + `husky` run linting on staged files pre-commit
- ESLint runs in CI with `--max-warnings 0` to prevent warning accumulation

### 7.3 Vitest

**Why chosen over Jest:**
- Native ESM support — no transformation configuration required
- 10–20x faster cold start than Jest in the SOC test suite
- Compatible with Jest API — minimal migration effort if Jest was used previously
- Integrates with Vite's module resolution for accurate import behavior

**Test coverage targets:**
- Services layer: 90% coverage (business logic)
- API routes: 80% coverage (integration tests with `supertest`)
- Utility functions: 100% coverage
- React components: 70% coverage (critical paths)

### 7.4 pnpm

**Why chosen over npm/yarn:**
- **Disk efficiency** — content-addressable storage means packages shared across projects; CI cache is more effective
- **Strict node_modules** — pnpm prevents phantom dependency access, avoiding runtime errors from undeclared dependencies
- **Workspace support** — monorepo workspaces for `apps/web`, `apps/api`, and `packages/types`, `packages/ui`
- **Speed** — pnpm install is 2–3x faster than npm in clean CI environments

**Monorepo structure:**
```
source-constructor/
├── apps/
│   ├── web/          (Next.js frontend)
│   └── api/          (Express backend)
├── packages/
│   ├── types/        (shared TypeScript types)
│   ├── ui/           (shared React components)
│   └── validation/   (shared Zod schemas)
├── pnpm-workspace.yaml
└── package.json
```

---

## 8. Cost Summary

| Service | Free Tier | Launch (~1k users) | Growth (~10k users) |
|---------|-----------|-------------------|---------------------|
| Vercel | Yes | $60/month (Pro) | $60/month |
| Railway | $5/month | $60–80/month | $120–160/month |
| Supabase | Yes | $25/month (Pro) | $25/month |
| Upstash Redis | Yes | $15–50/month | $50–150/month |
| Pinecone | Yes | $70/month | $70/month |
| Cloudflare | Yes | $20/month (Pro) | $20/month |
| Sentry | Yes | $26/month | $80/month |
| PostHog | Yes | $0 | $0–50/month |
| Resend | Yes | $20/month | $20–60/month |
| Stripe | N/A | 2.9%+$0.30/tx | 2.9%+$0.30/tx |
| Claude API | N/A | ~$168/month | ~$1,680/month |
| GitHub Actions | Yes | $20–40/month | $40–80/month |
| **Total (excl. Stripe/Claude)** | | **~$320/month** | **~$500/month** |
| **Total (incl. Claude est.)** | | **~$488/month** | **~$2,180/month** |

**Break-even analysis:** At $15/month Pro subscription, ~33 Pro subscribers cover the $488/month infrastructure cost at launch. At 10k users with 15% Pro conversion (1,500 subscribers): $22,500/month revenue vs. ~$2,180/month infrastructure = healthy margin.

---

*This document should be reviewed and updated at each major version milestone or when evaluating significant technology changes.*
