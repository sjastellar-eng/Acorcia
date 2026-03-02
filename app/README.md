# Source Constructor — App Scaffold

Full-stack monorepo for the Source Constructor (SOC) SaaS platform.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL via Prisma ORM |
| AI | Anthropic Claude (claude-sonnet-4-6 / claude-haiku-4-5) |
| Auth | JWT access tokens + refresh token rotation |
| Payments | Stripe subscriptions + billing portal |
| Cache | Upstash Redis |
| Email | Resend |
| Analytics | PostHog |

## Structure

```
app/
├── apps/
│   ├── api/          # Express.js REST API (port 4000)
│   └── web/          # Next.js 14 frontend (port 3000)
├── packages/
│   ├── types/        # Shared TypeScript interfaces
│   └── database/     # Prisma schema + client singleton
├── .env.example      # Required environment variables
├── package.json      # pnpm workspaces root
├── pnpm-workspace.yaml
└── turbo.json        # Turborepo build pipeline
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (or a Supabase project)
- Anthropic API key
- Stripe account (test keys for dev)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in all required values in .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | 64-char random string for signing access tokens |
| `JWT_REFRESH_SECRET` | 64-char random string for refresh tokens |
| `ANTHROPIC_API_KEY` | From console.anthropic.com |
| `STRIPE_SECRET_KEY` | From Stripe dashboard (test: `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | From Stripe CLI or dashboard |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Monthly Pro price ID |
| `NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID` | Annual price ID |
| `UPSTASH_REDIS_REST_URL` | From Upstash console |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash console |
| `RESEND_API_KEY` | From resend.com |
| `NEXT_PUBLIC_API_URL` | API base URL (dev: `http://localhost:4000`) |

### 3. Set up the database

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema to database (dev)
# or
pnpm db:migrate    # Run migrations (production)
```

### 4. Run in development

```bash
pnpm dev
```

This starts:
- API at http://localhost:4000
- Web at http://localhost:3000

### Stripe webhooks (dev)

```bash
stripe listen --forward-to localhost:4000/api/billing/webhook
```

## Key API Routes

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me

POST   /api/sessions              # Create discovery session
GET    /api/sessions
GET    /api/sessions/:id
POST   /api/sessions/:id/message  # SSE streaming

POST   /api/projects              # Create from session draft
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id/tasks/:taskId
GET    /api/projects/:id/stats

GET    /api/checkins/:projectId/today
POST   /api/checkins/:projectId/start
POST   /api/checkins/:checkinId/complete

POST   /api/billing/checkout
POST   /api/billing/portal
POST   /api/billing/webhook       # Stripe webhook (raw body)
```

## Application Flow

```
1. User registers / logs in
2. Starts a Discovery Session (25-35 min AI conversation)
   - 5 phases: Context → Values → Desires → Constraints → Synthesis
   - AI streams responses token-by-token via SSE
3. Session completes → AI generates ProjectDraft
4. User confirms → Project created with phases, milestones, tasks
5. Daily Check-In: AI companion greets user, user logs progress
6. Insights page tracks patterns, streaks, weekly completion
```

## Deployment

### API (Railway / Fly.io / Render)

```bash
cd apps/api
pnpm build
pnpm start
```

### Web (Vercel)

```bash
# Set all NEXT_PUBLIC_* env vars in Vercel dashboard
# Deploy from apps/web/
```

### Database migrations

```bash
pnpm db:migrate
```

## Development Notes

- The API uses `express-async-errors` so all async errors bubble to the global error handler
- Streaming uses SSE (`text/event-stream`) — keep proxies/load balancers configured for long-lived connections
- Refresh tokens are single-use with rotation — compromised tokens are automatically invalidated
- The Stripe webhook handler requires the raw body (configured in `app.ts` before `express.json()`)
