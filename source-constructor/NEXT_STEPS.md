# Source Constructor (SOC) — Next Steps

**Action Plan: Next 90 Days**
**Date:** March 2026
**Version:** 1.0

---

## Overview

This document outlines the concrete action plan for the next 90 days. All milestones are time-boxed and owned. The goal of this period: **launch a private beta with 100 users and achieve first revenue.**

---

## Phase 1: Foundation (Days 1–30)

### Week 1–2: Core Team

| Task | Owner | Status |
|------|-------|--------|
| Finalize technical co-founder offer | CEO | ⬜ |
| Begin design hire process (part-time contractor) | CEO | ⬜ |
| Set up legal entity (Delaware C-Corp) | CEO + Legal | ⬜ |
| Open business bank account | CEO | ⬜ |
| Sign Anthropic API agreement + DPA | Engineering | ⬜ |
| Set up development environment (Railway, Supabase, Vercel) | Engineering | ⬜ |

### Week 2–4: MVP Build Sprint

| Task | Owner | Priority |
|------|-------|----------|
| Implement user authentication (email + OAuth) | Engineering | P0 |
| Build Discovery Session UI (chat interface) | Engineering + Design | P0 |
| Integrate Claude API for session conversations | Engineering | P0 |
| Implement session summary + project generation | Engineering | P0 |
| Build basic project canvas (view + tasks) | Engineering | P0 |
| Set up Stripe subscription infrastructure | Engineering | P0 |
| Implement daily check-in flow | Engineering | P1 |
| Deploy to production (Vercel + Railway) | Engineering | P0 |

**Month 1 Exit Criteria:**
- [ ] Working MVP with discovery session, project generation, and basic check-ins
- [ ] 5 internal test users completing end-to-end flow
- [ ] Zero critical security vulnerabilities
- [ ] Core conversion funnel instrumented with PostHog

---

## Phase 2: Private Beta (Days 31–60)

### Beta Launch Strategy

**Target:** 50–100 beta users from warm network

**Channels:**
1. Founder's personal LinkedIn/Twitter announcement
2. Direct outreach to 50 pre-qualified contacts matching primary personas
3. IndieHackers build-in-public thread
4. Product Hunt upcoming page (collect emails pre-launch)
5. Partner communities: career coaching Discord servers, indie maker Slack groups

**Beta User Profile:**
- Matches Alex or Maria persona (see `06-RESEARCH/user-personas.md`)
- Has expressed interest in clarity / side projects in past 6 months
- Available for user interviews post-session

### Beta Feedback Loop

| Activity | Frequency | Owner |
|----------|-----------|-------|
| User interviews (20 min each) | 3/week | CEO |
| NPS survey (in-app, post session 1) | Ongoing | Auto |
| Weekly beta user feedback call | Weekly | CEO |
| Bug triage meeting | 3x/week | Engineering |
| Feature prioritization review | Bi-weekly | Product |

**Month 2 Exit Criteria:**
- [ ] 100 beta users onboarded
- [ ] 70%+ activation rate (complete first Discovery Session)
- [ ] NPS > 35 from beta users
- [ ] 3 critical bug fixes shipped
- [ ] At least 1 user pays voluntarily (early conversion signal)

---

## Phase 3: First Revenue (Days 61–90)

### Public Launch Preparation

**Pre-Launch (Days 61–75):**

| Task | Owner |
|------|-------|
| Launch landing page (see `05-MARKETING/landing-page.html`) | Design + Engineering |
| Set up Product Hunt launch assets | Marketing |
| Prepare content calendar (see `05-MARKETING/content-calendar.md`) | Marketing |
| Record and edit demo video (90 seconds) | CEO + Design |
| Set up email sequences (welcome, onboarding drip) | Marketing |
| Launch referral program | Engineering |
| Finalize pricing page | Product |
| Conduct penetration test | External vendor |

**Launch Day (Day 76):**

- [ ] Product Hunt launch (7:01 AM Pacific)
- [ ] Twitter/LinkedIn announcement from founder + team
- [ ] Activate beta users as supporters (ask for PH upvotes, testimonials)
- [ ] Email waitlist (collected via landing page)
- [ ] IndieHackers launch post
- [ ] Hacker News Show HN post

**Post-Launch (Days 77–90):**

| Activity | Goal |
|----------|------|
| 1:1 calls with top 20 beta users | Testimonials + referrals |
| Content marketing: 2 long-form posts | SEO + credibility |
| Active community engagement (IH, Reddit, Twitter) | Word of mouth |
| Weekly paid conversion follow-ups to active free users | Revenue |

**Month 3 Exit Criteria:**
- [ ] 50 paying users
- [ ] MRR ≥ $950
- [ ] 3 press / community mentions
- [ ] NPS > 40

---

## Investor Pipeline (Parallel Track)

| Activity | Timeline |
|----------|---------|
| Finalize investment documents (SAFE, pitch deck) | Month 1 |
| Soft outreach to 20 target angels | Month 1–2 |
| Formal fundraising conversations | Month 2–3 |
| First term sheet / commitment | Month 3 |

**Target Investors:**
- Angels: Operators from B2C SaaS, productivity tools, edtech
- Micro-VCs: $25–100k check size, pre-seed stage
- Strategic angels: Coaches, therapists with audience access

---

## Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI response quality doesn't feel natural enough | Medium | High | Extensive prompt engineering + human review of 50 sessions |
| Low session completion rate (users drop mid-session) | Medium | High | A/B test session length and question structure in Month 2 |
| Generated projects feel generic | Medium | High | Fine-tune generation prompt with beta feedback |
| Slow user acquisition | Low-Medium | Medium | Pre-built warm network of 200+ interested contacts |
| Anthropic API reliability / cost | Low | Medium | Monitor costs weekly; implement usage caps |
| Legal / privacy concerns (sensitive data) | Low | High | Privacy policy + GDPR compliance done (see `07-LEGAL/`) |

---

## Success Metrics Dashboard

Track weekly in team standup:

| Metric | Week 4 | Week 8 | Week 12 |
|--------|--------|--------|---------|
| Registered users | 50 | 150 | 400 |
| Paying users | 0 | 5 | 50 |
| MRR | $0 | $95 | $950 |
| Activation rate | >60% | >65% | >70% |
| D7 retention | >40% | >45% | >50% |
| NPS | >30 | >35 | >40 |
| Weekly sessions started | 10 | 40 | 100 |

---

## Owners & Accountability

| Role | Person | Focus |
|------|--------|-------|
| CEO | [Founder] | Product vision, fundraising, partnerships |
| CTO | [Technical Co-founder] | Engineering, architecture, security |
| Head of Design | [Contract designer] | UI/UX, brand |
| Growth | [Part-time] | Content, community, acquisition |

---

*Document Owner: CEO | Review: Weekly in team standup*
