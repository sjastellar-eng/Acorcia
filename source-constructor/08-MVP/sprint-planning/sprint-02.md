# Sprint 02 — Project Generation + Daily Companion

**Sprint Duration:** 2 weeks (Week 3–4 of MVP Development)
**Sprint Goal:** AI-generated projects from Discovery Session, Daily Check-in working, Stripe payments integrated

---

## Sprint Backlog

### ⚡ Project Generation (14 points)

| Ticket | Description | Points | Priority |
|--------|-------------|--------|----------|
| PG-01 | Project generation API (Claude integration) | 4 | P0 |
| PG-02 | Project cards UI (name, vision, why, roadmap) | 3 | P0 |
| PG-03 | Milestone + task CRUD | 3 | P0 |
| PG-04 | Project selection flow (choose 1-2 from generated) | 2 | P0 |
| PG-05 | Manual project editing | 2 | P1 |

### 📅 Daily Check-in (8 points)

| Ticket | Description | Points | Priority |
|--------|-------------|--------|----------|
| CI-01 | Check-in form UI (mood, notes, next step) | 2 | P0 |
| CI-02 | Claude API integration for check-in response | 2 | P0 |
| CI-03 | Streak calculation logic | 2 | P0 |
| CI-04 | Email reminder (Resend integration) | 2 | P1 |

### 💳 Payments (6 points)

| Ticket | Description | Points | Priority |
|--------|-------------|--------|----------|
| PAY-01 | Stripe products + prices setup | 1 | P0 |
| PAY-02 | Checkout flow integration | 2 | P0 |
| PAY-03 | Webhook handler (subscription events) | 2 | P0 |
| PAY-04 | Paywall (Pro features gating) | 1 | P0 |

**Total Sprint Points: 28**

---

## Definition of Done

- [ ] After Discovery Session, user sees 2–3 generated projects
- [ ] Projects have: name, vision, why, 3-month roadmap, 3 first tasks
- [ ] User can complete daily check-in in < 3 minutes
- [ ] Streak counter updates correctly
- [ ] Stripe Checkout works end-to-end (test cards)
- [ ] Free tier paywall correctly blocks Pro features
- [ ] Subscription status visible in settings

---

## Project Generation Prompt Strategy

```typescript
const PROJECT_GENERATION_PROMPT = `
Based on this user's Discovery Session results, generate 2-3 personalized projects.

User's True Desires:
{true_desires}

Conversation highlights:
{session_highlights}

For each project, provide:
1. Name (concise, inspiring)
2. Vision statement (1-2 sentences, personal and specific)
3. Why this is RIGHT for THIS person (connect to their desires)
4. 3-month roadmap (4 milestones with dates)
5. First 3 actionable tasks (specific, doable this week)
6. Category: CAREER / MASTERY / CREATIVITY / RELATIONSHIPS / HEALTH

Make projects:
- Specific to the person (use their words and context)
- Realistic but ambitious
- Varied in scope (one smaller, one bigger)
- Connected to their TRUE desires, not surface-level goals

Return as JSON array.`;
```

---

## Stripe Integration Checklist

- [ ] Create products in Stripe Dashboard: Free, Pro ($19/mo), Coach ($79/mo)
- [ ] Set up webhook endpoint: /api/webhooks/stripe
- [ ] Handle events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
- [ ] Store subscription status in users table
- [ ] Test with Stripe test cards: 4242 4242 4242 4242

---

## Sprint Retrospective Template

**What went well:**
-

**What didn't go well:**
-

**What to improve next sprint:**
-

**Velocity:** XX/28 points completed
