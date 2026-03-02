# MVP Scope — Source Constructor

> Definition of MVP | What's in, what's out, and why

---

## MVP Philosophy

> "The MVP is not the smallest possible product. It's the smallest product that proves the core value hypothesis."

**Core Value Hypothesis:** "If we help users discover their true desires through an AI dialogue, they will understand themselves better AND be more motivated to act — because the plan comes from within, not from outside."

**MVP must prove:**
1. Users can complete a Discovery Session and feel the "aha moment"
2. AI-generated projects feel relevant and inspiring (not generic)
3. At least 8% of users are willing to pay for continued access

---

## MVP Scope: IN

### Feature 1: Discovery Session ✅ MUST HAVE

**What's in:**
- 20-question adaptive AI dialogue
- Real-time response (typewriter effect)
- Progress bar
- Session saves automatically
- Results screen: 3–5 true desires with explanations
- Ability to retake session after 30 days

**Technical requirements:**
- Claude Sonnet 4.5 API integration
- Full session stored in DB (conversation + results)
- Session can be paused and resumed (within 24h)

**Success metric:** 65% completion rate

---

### Feature 2: Project Generation ✅ MUST HAVE

**What's in:**
- AI generates 2–3 project suggestions based on session results
- Each project has: name, vision statement, 3-month roadmap, first 3 tasks
- User selects 1–2 projects to track
- Manual editing of project name and vision

**Technical requirements:**
- Generation API call after session completion
- Projects stored in DB
- Simple Kanban view for tasks

**Success metric:** 70% of users who complete session generate a project

---

### Feature 3: Daily Check-in ✅ MUST HAVE

**What's in:**
- Daily prompt (pushed at user's preferred time or on login)
- 3 questions: "What did you do today?", "How close to your goal?", "What's next?"
- AI responds with encouragement + suggestion
- Streak counter (days in a row)

**Technical requirements:**
- Simple form + AI response
- Streak calculation
- Email reminder (Resend)

**Success metric:** 40% of users do at least 1 check-in per week

---

### Feature 4: Progress Dashboard ✅ MUST HAVE

**What's in:**
- Active projects list
- Task completion view
- Streak display
- "Your journey" — days since first session
- Basic charts (completion % per project)

**Technical requirements:**
- Simple aggregations from tasks + checkins tables
- Recharts for visualization

---

### Feature 5: Authentication & Accounts ✅ MUST HAVE

**What's in:**
- Email + password registration
- Google OAuth
- Magic link login (Supabase Auth)
- Profile (name, timezone, preferred notification time)
- Account deletion

---

### Feature 6: Subscription & Payments ✅ MUST HAVE

**What's in:**
- Free tier: 1 Discovery Session, 1 project, 7 check-ins
- Pro tier: Unlimited sessions, 5 projects, unlimited check-ins
- Stripe Checkout integration
- Billing portal (Stripe Customer Portal)
- Subscription status in app

---

## MVP Scope: OUT (Not building for v1.0)

| Feature | Why deferred |
|---------|-------------|
| Voice input | Complex, not core to value prop |
| Community / Accountability Partners | Needs critical mass; v1.5 |
| Sharing sessions publicly | Privacy risk without careful design |
| Mobile app (iOS/Android) | Web first; PWA as compromise |
| B2B/Team features | Year 2 focus |
| Advanced analytics (patterns over time) | Need more data first |
| Third-party integrations (Notion, Slack) | Nice-to-have, not core |
| Gamification (badges, levels) | v1.5 |
| Multiple languages | English first |
| Custom AI personas | Complex; not core |
| PDF exports | v1.5 |
| Coach marketplace | Year 2 |

---

## Definition of Done for MVP

The MVP is complete when:

- [ ] A new user can sign up, complete Discovery Session, and see their results in < 30 minutes
- [ ] AI-generated projects feel personalized (not templated)
- [ ] User can complete a daily check-in in < 3 minutes
- [ ] Stripe subscription works end-to-end (signup → charge → access)
- [ ] Paywall correctly gates Pro features
- [ ] Works on Chrome, Safari, Firefox (desktop + mobile)
- [ ] No critical bugs in core flows
- [ ] Discovery Session completion rate > 60% in testing
- [ ] NPS from 10 test users > 40

---

## Timeline

| Week | Milestone |
|------|-----------|
| 1–2 | Project setup, auth, DB schema |
| 3–4 | Discovery Session UI + AI integration |
| 5–6 | Project Generation Engine |
| 7–8 | Daily Check-in + Dashboard |
| 9 | Stripe payments |
| 10 | Polish, testing, bug fixes |
| 11 | Internal testing (10 users) |
| 12 | Alpha launch (50 users) |

---

## Tech Stack for MVP

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 14 + Tailwind | Fast, SSR, Vercel deploys |
| Backend | Next.js API Routes | Simple for MVP (no separate server) |
| Database | Supabase (Postgres) | Auth + DB + RLS in one |
| AI | Claude Sonnet 4.5 | Best for dialogue, 200k context |
| Payments | Stripe | Industry standard |
| Hosting | Vercel | Free tier generous, instant deploys |
| Email | Resend | Simple API, good deliverability |

*For MVP, use Next.js API Routes instead of separate Express server — simplifies deployment*

---

## Risk Register for MVP

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| AI responses feel generic | High | High | Extensive prompt testing with 20+ users |
| Sessions too long (users drop off) | Medium | High | Progress bar, can pause, A/B test length |
| Stripe integration bugs | Low | High | Test in sandbox with 10 scenarios |
| Claude API rate limits | Low | Medium | Error handling + retry logic |
| Discovery Session questions repetitive | Medium | Medium | Build 200+ question bank with categories |
