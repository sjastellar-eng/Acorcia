# Development Roadmap — Source Constructor

> 3-Year Product Roadmap | Version 1.0 | March 2026

---

## Vision

Build the world's most personalized AI system for human self-understanding and goal actualization.

---

## Phase 0: Foundation (Now — Month 1)

### Goals
- Technical setup complete
- Team assembled (CEO + CTO)
- Development environment ready

### Deliverables
- [ ] GitHub repository setup with CI/CD
- [ ] Staging + Production environments on Vercel
- [ ] Supabase project + database schema created
- [ ] Design system in Figma
- [ ] Claude API access and initial prompt testing
- [ ] Stripe account + test webhooks

---

## Phase 1: MVP (Month 1–4)

### Sprint 1 (Weeks 1–2): Core Infrastructure
- Next.js 14 project setup
- Supabase auth (email + Google OAuth)
- Database schema implementation
- Basic routing and layouts
- Tailwind CSS design system

### Sprint 2 (Weeks 3–4): Discovery Session
- Chat UI component (messages, typing indicator)
- Claude API integration for question generation
- Session management (start, pause, resume, complete)
- Answer storage and context management
- Progress bar

### Sprint 3 (Weeks 5–6): Project Generation
- Analysis of session results
- Project generation prompt engineering
- Project cards UI
- Milestone + task creation
- Basic Kanban view

### Sprint 4 (Weeks 7–8): Daily Companion
- Daily check-in form and AI response
- Streak counter logic
- Email reminders (Resend)
- Progress dashboard (basic)
- Charts (Recharts)

### Sprint 5 (Week 9): Payments
- Stripe products + prices setup
- Checkout flow
- Webhook handler (subscription lifecycle)
- Paywall implementation
- Billing portal

### Sprint 6 (Weeks 10–12): Polish + Alpha
- Bug fixes across all flows
- Performance optimization
- Mobile responsive polish
- Error states and empty states
- Internal testing (10 people)
- Alpha launch (50 people)

**MVP KPIs:**
- Discovery completion rate: > 65%
- NPS: > 40
- Free → Pro conversion: > 5% (lower bar for alpha)

---

## Phase 2: v1.0 — Beta (Month 5–9)

### Major Features

**Improved AI Quality**
- A/B testing different question prompts
- Improved analysis algorithms
- Better project generation (more specific, less generic)
- AI remembers conversation history across sessions

**Insights Engine**
- Weekly AI-generated insights ("You've completed 3 milestones this week")
- Pattern detection ("You tend to work best on creative tasks")
- Monthly "Self Portrait" — AI summary of your journey

**Habit Formation**
- Streak mechanics + badges
- Weekly email digest with personalized insights
- Re-engagement flows for inactive users

**UX Improvements**
- Onboarding flow (guided first session)
- Improved project canvas (Kanban + timeline view)
- Notification system (in-app + email)
- Data export (JSON)

**Beta KPIs:**
- 500 total users
- Free → Pro: 8%
- D30 retention: 30%
- NPS: > 50
- MRR: $5,000

---

## Phase 3: v1.5 — Growth (Month 10–18)

### Accountability Partners
- Matching algorithm (based on project type + timezone)
- Partner check-in system
- Shared milestones (optional)
- Privacy controls

### Community Circles
- Small groups of 3–5 people with similar goals
- Weekly group check-in (async)
- Moderator (AI or human)
- Community guidelines + moderation

### AI Model Improvements
- Fine-tuned prompts based on 1,000+ sessions of data
- Better personalization over time
- Memory improvements (long-term user context)
- Voice input (optional)

### Growth Features
- Referral program ("Give a month, get a month")
- Public profile (optional) for sharing achievements
- Integration with major tools (Notion, Google Calendar)

**v1.5 KPIs:**
- 5,000 total users
- $8,000+ MRR
- D30 retention: 35%
- NPS: > 55

---

## Phase 4: v2.0 — B2B (Year 2)

### B2B Product
- Company admin dashboard
- Employee onboarding program
- Team analytics (aggregate, anonymized)
- HR/L&D integrations
- White-label option

### API & Partnerships
- Public API for developers
- Partnership program (coaching platforms, HR software)
- Webhook system for integrations

### Advanced AI
- Multi-modal (voice + text)
- Emotional intelligence detection
- Personalized question bank (ML-based)
- Predictive accountability ("You typically drop off here — let's prevent it")

**Year 2 KPIs:**
- 35,000 users
- $87,000 MRR
- 5 B2B clients ($25k/year avg)

---

## Phase 5: Scale (Year 3)

### International Expansion
- Spanish, German, Portuguese, Japanese localization
- Regional pricing
- Local payment methods

### AI Marketplace
- Users can create and share custom question sets
- Certified coach prompts marketplace
- Community-contributed templates

### Enterprise
- SSO, SCIM provisioning
- Enterprise security certifications (SOC 2)
- Dedicated infrastructure option
- Custom AI training on company data

**Year 3 KPIs:**
- 120,000 users
- $332,000 MRR
- 25 enterprise clients

---

## Technical Debt Budget

| Phase | Technical Debt Allocation |
|-------|--------------------------|
| MVP | Accept debt freely (speed > quality) |
| Beta | 20% of sprint capacity on debt |
| v1.5 | 25% of sprint capacity |
| Year 2+ | 30% continuous improvement |

### Known Technical Debt to Address Post-MVP
1. Extract Express backend from Next.js (when scale requires)
2. Message queue for AI API calls (prevent timeouts)
3. Full test coverage (currently minimal)
4. Database migrations tooling
5. Monitoring and alerting (beyond Sentry)

---

## Dependency Map

```
Auth ──────────────────► All features
Database Schema ───────► All features
Claude API ────────────► Discovery Session, Project Gen, Daily Companion
Stripe ────────────────► Subscription gates
Discovery Session ─────► Project Generation
Project Generation ────► Daily Companion, Dashboard
Daily Companion ───────► Insights, Streak, Community (v1.5)
Community (v1.5) ──────► B2B features (Year 2)
```
