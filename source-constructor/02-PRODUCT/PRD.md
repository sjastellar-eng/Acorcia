# Product Requirements Document
# Source Constructor (SOC) — AI-Powered Life & Career Design Platform

**Document Version:** 1.0
**Status:** Draft — Under Review
**Last Updated:** 2026-03-02
**Owner:** Product Team
**Reviewers:** Engineering Lead, Design Lead, CEO

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Jobs To Be Done (JTBD)](#4-jobs-to-be-done)
5. [Value Proposition](#5-value-proposition)
6. [Competitive Landscape](#6-competitive-landscape)
7. [Product Principles](#7-product-principles)
8. [Success Metrics & KPIs](#8-success-metrics--kpis)
9. [Feature Overview](#9-feature-overview)
10. [Feature 1: Discovery Session (P0)](#10-feature-1-discovery-session-p0)
11. [Feature 2: Project Generation Engine (P0)](#11-feature-2-project-generation-engine-p0)
12. [Feature 3: Daily AI Companion (P1)](#12-feature-3-daily-ai-companion-p1)
13. [Feature 4: Progress Tracking (P1)](#13-feature-4-progress-tracking-p1)
14. [Feature 5: Accountability Partners (P2 — v1.5)](#14-feature-5-accountability-partners-p2--v15)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [User Flows](#16-user-flows)
17. [Onboarding Flow](#17-onboarding-flow)
18. [Discovery to Project Flow](#18-discovery-to-project-flow)
19. [Daily Check-In Flow](#19-daily-check-in-flow)
20. [Monetization & Pricing](#20-monetization--pricing)
21. [Activation Metrics](#21-activation-metrics)
22. [Engagement Metrics](#22-engagement-metrics)
23. [Retention Metrics](#23-retention-metrics)
24. [Release Plan](#24-release-plan)
25. [Risks & Mitigations](#25-risks--mitigations)
26. [Open Questions](#26-open-questions)
27. [Appendix: Glossary](#27-appendix-glossary)

---

## 1. Product Vision

**Vision Statement:**
Source Constructor (SOC) is the AI system that helps people discover what they truly want, design projects around those desires, and build consistent momentum — one day at a time.

**North Star:**
Every user arrives knowing something is missing. Every user leaves knowing what to build next and how to start.

**Mission:**
To close the gap between "I know something needs to change" and "I know exactly what I'm doing and why." SOC achieves this through structured AI-facilitated discovery, personalized project design, and daily companionship that adapts to the user's evolving state.

**Long-Term Vision (3–5 Years):**
SOC becomes the trusted AI operating system for personal growth — not a productivity tool, not a journaling app, but the intelligent partner that people return to at every major life transition: career pivots, creative launches, relationship decisions, health transformations. The platform accumulates a longitudinal understanding of each user, enabling increasingly precise guidance over time.

---

## 2. Problem Statement

### The Core Problem

Millions of people experience a persistent gap between their current reality and a vague but powerful sense that something needs to change. They feel stuck, overwhelmed, or directionless — not because they lack ambition, but because they lack clarity about what specifically they want and a concrete path to get there.

Existing tools fail this group:

- **Productivity apps** (Notion, Todoist, Linear) assume you already know what to build. They optimize execution, not direction.
- **Journaling apps** (Day One, Reflectly) provide a container for thoughts but no structured analysis or forward momentum.
- **Coaching** is expensive ($150–$500/session), inaccessible, and dependent on human availability.
- **Goal-setting frameworks** (OKRs, SMART goals) are cognitively demanding and require prior clarity that most users don't have.
- **Therapy** addresses emotional processing but rarely produces concrete life projects or execution plans.

### The Opportunity

The user arrives in a state of vague dissatisfaction. They need:

1. A safe, non-judgmental space to explore what they actually want
2. A structured process that surfaces hidden desires and fears
3. Concrete project proposals that translate insight into action
4. Consistent daily support to maintain momentum
5. A sense of progress and accountability

SOC addresses all five needs through AI, making sophisticated life design available to anyone with a smartphone.

---

## 3. Target Users

### Primary Target Segment: Transition-Phase Professionals

**Age:** 26–42
**Geography:** English-speaking markets (US, UK, Canada, Australia) + Russian-speaking markets (Russia, Germany, Israel)
**Income:** $40,000–$120,000 USD equivalent
**Education:** University-educated
**Work Context:** Knowledge workers — product managers, developers, marketers, designers, consultants, educators

**Defining Characteristics:**
- Employed but questioning their career direction
- Have attempted self-improvement tools but abandoned them within 3 weeks
- Intellectually curious; will engage deeply if the tool feels meaningful
- Value authenticity over performance optimization
- Willing to pay for quality experiences that feel personalized
- Not looking for more productivity — looking for direction

### Secondary Target Segment: Creative Launchers

**Age:** 24–38
**Context:** Side project builders, aspiring entrepreneurs, creative professionals
**Defining Need:** Have ideas but can't prioritize; start many things, finish few
**Differentiator from Primary:** Less existential crisis, more decision paralysis and execution accountability

### Excluded Segments (v1.0)

- Users in acute mental health crisis (refer to professional care)
- Enterprise / B2B use cases
- Users under 18
- Users seeking purely entertainment or passive content consumption

---

## 4. Jobs To Be Done

### Primary JTBD

**Job 1 — The Clarity Job:**
"When I feel stuck and can't articulate what I want, I want an intelligent conversation that helps me understand my actual desires, so that I stop wasting time on goals that aren't truly mine."

**Job 2 — The Direction Job:**
"When I have vague ideas about changing something in my life, I want a structured process that produces concrete, meaningful projects I can actually start, so that I move from thinking to doing."

**Job 3 — The Momentum Job:**
"When I've committed to a goal, I want daily support that keeps me honest and adapts to how I'm actually feeling, so that I don't lose momentum the way I do with other tools."

**Job 4 — The Reflection Job:**
"When I've been on a journey for several weeks, I want to see patterns in my progress and behavior, so that I can understand myself better and make smarter decisions."

**Job 5 — The Belonging Job (v1.5):**
"When I'm working toward something meaningful, I want to share that journey with a small group of people who get it, so that I feel less alone and more accountable."

### Functional vs. Emotional vs. Social Dimensions

| Dimension | What the user says | What the user needs |
|-----------|-------------------|---------------------|
| Functional | "I need to figure out my next career move" | A structured discovery process + concrete project |
| Emotional | "I feel lost and like I'm wasting time" | Validation, safety, non-judgment, momentum |
| Social | "I don't know who to talk to about this" | A witness to their journey; accountability |

---

## 5. Value Proposition

**For:** Transition-phase professionals who feel stuck and directionless
**Who:** Have tried productivity tools, journaling, and goal frameworks but abandoned them
**SOC is:** An AI-powered personal design platform
**That:** Facilitates deep self-discovery, generates concrete meaningful projects, and provides daily adaptive support
**Unlike:** Generic productivity apps, journaling tools, or generic coaching apps
**SOC:** Combines depth of coaching-quality conversation with the accessibility and consistency of an AI companion

---

## 6. Competitive Landscape

| Tool | Strength | Weakness | SOC Differentiator |
|------|----------|----------|-------------------|
| Notion / Obsidian | Flexible, powerful | No AI guidance; requires prior clarity | SOC creates the clarity first |
| ChatGPT | Intelligent conversation | No structure, memory, or accountability | SOC has domain-specific flow + longitudinal context |
| BetterUp / Noom Mood | Structured programs | Generic, not personalized to individual desires | SOC generates unique projects per person |
| Reflectly / Day One | Low-friction journaling | No synthesis, no action, no accountability | SOC turns insight into concrete projects |
| Human coaching | High quality, personalized | Expensive, inaccessible, low frequency | SOC delivers daily touchpoints at 1/100th the cost |
| Headspace / Calm | Habit formation | Wellness-only; doesn't address career/life design | SOC addresses all life domains |

---

## 7. Product Principles

1. **Clarity before productivity.** We do not help users do more. We help users do the right thing.
2. **Depth over breadth.** SOC goes deep on what the user actually wants before offering any plan.
3. **Adaptive, not prescriptive.** The AI adapts to the user's current state — not to a fixed program.
4. **Earned trust.** We earn the right to deeper questions by demonstrating we understand the user's answers.
5. **Progress, not perfection.** SOC celebrates momentum, not achievement. A bad week is data, not failure.
6. **Human in the loop.** SOC augments human reflection; it does not replace human judgment.
7. **Privacy by default.** User data is never used to train models without explicit consent.

---

## 8. Success Metrics & KPIs

### North Star Metric

**Weekly Active Reflectors (WAR):** Users who complete at least 3 daily check-ins in a given week.
*Rationale:* This metric indicates users are experiencing ongoing value, not just activation. A user who checks in 3+ times per week has integrated SOC into their routine.

**Target at 6 months post-launch:** 10,000 WAR
**Target at 12 months:** 40,000 WAR

### Activation Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Discovery Completion Rate | % of registered users who complete full Discovery Session | ≥ 65% |
| Time to First Project | Median time from sign-up to first generated project | ≤ 48 hours |
| Project Acceptance Rate | % of generated projects accepted by users | ≥ 70% |
| Onboarding Completion Rate | % completing all onboarding steps | ≥ 75% |

### Engagement Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Daily Check-In Rate | % of active users completing daily check-in on any given day | ≥ 40% |
| Average Session Length | Mean time per active session | 4–8 minutes |
| Streak Length (Median) | Median streak length of active users | ≥ 7 days |
| Check-ins Per Week (Mean) | Average check-ins per active user per week | ≥ 3.5 |

### Retention Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Day 7 Retention | % of users returning on Day 7 | ≥ 45% |
| Day 30 Retention | % of users returning on Day 30 | ≥ 30% |
| Day 90 Retention | % of users returning on Day 90 | ≥ 20% |
| 6-Month Subscriber Retention | % of paid subscribers still active at 6 months | ≥ 65% |

### Monetization Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Free-to-Paid Conversion | % of free users converting to paid within 30 days | ≥ 8% |
| Monthly Recurring Revenue (MRR) | Total paid subscriptions × price | $50K at Month 6; $200K at Month 12 |
| ARPU | Average Revenue Per User (monthly) | $12–$18 |
| LTV:CAC Ratio | Lifetime value vs. customer acquisition cost | ≥ 3:1 |

### Quality Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Discovery Session NPS | Net Promoter Score for Discovery Session experience | ≥ 50 |
| Project Quality Score | User rating of generated projects (1–5) | ≥ 4.0 |
| AI Response Satisfaction | % of AI responses rated "helpful" or "very helpful" | ≥ 80% |

---

## 9. Feature Overview

| Feature | Priority | Version | Status |
|---------|----------|---------|--------|
| Discovery Session | P0 | v1.0 | In Scope |
| Project Generation Engine | P0 | v1.0 | In Scope |
| Daily AI Companion | P1 | v1.0 | In Scope |
| Progress Tracking Dashboard | P1 | v1.0 | In Scope |
| Accountability Partners | P2 | v1.5 | Future |

---

## 10. Feature 1: Discovery Session (P0)

### Overview

The Discovery Session is the foundational feature of SOC. It is an AI-facilitated dialogue of 20 adaptive questions that guides the user through a structured exploration of their values, desires, fears, work style, and life patterns. The session produces a personal profile and a set of weighted insights that feed directly into the Project Generation Engine.

The Discovery Session must feel like a conversation with a thoughtful, perceptive coach — not a form, quiz, or interview. Questions adapt based on prior answers. The AI detects emotional signals and adjusts tone. The session concludes with a summary of "what we discovered together" presented in the user's own language.

### User Stories

- As a new user, I want to experience an intelligent conversation that feels personalized, so that I trust the platform with my real thoughts.
- As a user completing the Discovery Session, I want each question to feel relevant to what I just shared, so that the session feels natural rather than formulaic.
- As a user finishing the session, I want to see a clear, accurate summary of what was discovered, so that I feel understood and ready to see my projects.

### Acceptance Criteria

- [ ] The Discovery Session comprises exactly 20 questions presented one at a time
- [ ] Each question is dynamically selected based on user responses to prior questions
- [ ] Users can pause and resume the session (session state persisted for up to 7 days)
- [ ] The AI detects emotional intensity in responses and adjusts question depth accordingly
- [ ] At question 10, the system has identified at least 2 candidate core themes
- [ ] At session completion, a confidence score (0–100) is assigned to each detected insight
- [ ] Only insights with confidence score ≥ 60 are included in the final profile
- [ ] Session summary is displayed in plain language, no jargon, using the user's own words where possible
- [ ] Users can edit or reject any insight in the summary before proceeding to project generation
- [ ] Session completion triggers automatic project generation within 30 seconds

### Technical Requirements

- AI model: GPT-4o or Claude 3.7 Sonnet via API (configurable)
- Question selection algorithm: Rule-based decision tree + semantic similarity scoring
- Response analysis: Sentiment analysis + theme extraction (NLP pipeline)
- Session state: Stored in database with encryption at rest
- Confidence scoring: Weighted scoring model based on consistency of signals across 20 responses
- Response time per AI turn: ≤ 3 seconds (p95)
- Session data retention: Indefinite (user-owned); deletable on request

### Design Requirements

- Single-question view: one question visible at a time, full-screen, minimal UI
- Typewriter effect for AI messages to simulate natural typing cadence
- Progress indicator: subtle (question X of 20), non-intrusive
- "Previous answer" accessibility without re-opening prior questions
- Warm, calm color palette — no aggressive CTAs during session
- Session pause: prominent but not disruptive; user can return via notification
- Mobile-first: all interactions possible with one thumb

### Dependencies

- Authentication system (user account must exist)
- AI API integration (OpenAI or Anthropic)
- NLP pipeline for theme extraction
- Project Generation Engine (consumer of session results)

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Users abandon mid-session | High | High | Save state at every answer; allow resume; limit session to 15–25 min |
| AI generates inappropriate or harmful questions | Medium | High | Moderation layer; curated question bank with fallbacks |
| Low confidence scores → no usable insights | Low | High | Minimum viable insight set (fallback themes if confidence all < 60) |
| User disagrees with all generated insights | Medium | Medium | Allow full manual editing of summary before proceeding |

### Out of Scope (v1.0)

- Voice input for Discovery Session responses
- Multi-language support beyond English and Russian
- Sharing Discovery Session results with others
- Discovery Session re-runs without cooldown (30-day minimum between sessions)

---

## 11. Feature 2: Project Generation Engine (P0)

### Overview

Immediately following the Discovery Session, SOC's Project Generation Engine analyzes the user's insight profile and produces 2–3 personalized project proposals. Each project includes a title, vision statement, the "why" (derived from Discovery insights), a 90-day milestone roadmap, weekly task suggestions, and recommended resources.

The engine must generate projects that feel genuinely tailored — not generic templates with the user's name inserted. Projects are ranked by predicted alignment with the user's core desires, and the user selects one (or, in the paid tier, can run all simultaneously).

### User Stories

- As a user who completed the Discovery Session, I want to see 2–3 project proposals that feel like they were designed specifically for me, so that I can start taking action on what I actually want.
- As a user reviewing generated projects, I want to understand why each project was recommended, so that I can make an informed choice.
- As a user who selected a project, I want to customize the milestones and timeline before starting, so that the plan fits my actual life.

### Acceptance Criteria

- [ ] Project generation completes within 30 seconds of Discovery Session completion
- [ ] Exactly 2–3 projects are generated (minimum 2; maximum 3 for paid users)
- [ ] Each project includes: title, one-sentence vision, "why this for you" paragraph, 3 milestones (30/60/90 day), 5 first-week tasks, 3 recommended resources
- [ ] Each project card shows an "alignment score" (% match to user's core desires)
- [ ] User can view the reasoning behind each project recommendation
- [ ] User can edit any project field before accepting
- [ ] Accepted project appears in the user's project dashboard immediately
- [ ] Free tier: user selects 1 project; paid tier: user can activate up to 3 simultaneously
- [ ] Rejected projects are stored and accessible for 90 days
- [ ] Project regeneration (request new options) allowed once every 7 days

### Technical Requirements

- Input: Structured insight profile from Discovery Session (JSON schema defined in discovery-session spec)
- AI prompt: Structured multi-shot prompt with project template constraints
- Output: Validated JSON matching project schema; fallback to template fill if generation fails
- Generation timeout: 45 seconds max; if exceeded, return best partial result with flag
- Project domain classifier: Classifies each generated project into one of 5 domains (career, creative, health, relationship, skill)
- Duplicate detection: No two generated projects should be in the same domain unless user has no alternative options

### Design Requirements

- Projects displayed as cards with clear visual hierarchy
- Alignment score displayed as a visual meter, not just a number
- "Why this for you" section expandable (collapsed by default)
- Edit mode for milestones: simple inline editing, no modal overhead
- Comparison view: side-by-side for up to 3 projects
- Accept CTA: clear, celebratory micro-interaction upon acceptance

### Dependencies

- Discovery Session (must complete before generation)
- AI API (same provider as Discovery Session)
- Project database schema
- User dashboard (to display accepted project)

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Generated projects feel generic | Medium | High | Extensive prompt engineering; user testing; quality scoring |
| All 3 projects in same domain | Low | Medium | Domain diversity constraint in generation logic |
| Generation latency > 30s | Medium | Medium | Streaming response display; progress indicator; async fallback |
| User rejects all projects | Low | Medium | Allow regeneration request; manual project creation fallback |

### Out of Scope (v1.0)

- Projects generated without a Discovery Session
- AI-generated project artwork or visual boards
- Collaboration on projects with other users
- Integration with external project management tools (Notion, Asana)

---

## 12. Feature 3: Daily AI Companion (P1)

### Overview

The Daily AI Companion is a 5-minute daily check-in that keeps users connected to their project and current emotional state. Each check-in adapts based on: the user's current project status, recent check-in history, streak length, and detected emotional patterns. The companion asks 3–5 questions, celebrates wins, identifies blockers, and offers a micro-action suggestion.

The experience must feel like a 5-minute conversation with a coach who remembers everything — not a daily survey or reminder notification.

### User Stories

- As an active user, I want a daily check-in that acknowledges where I am emotionally and in my project, so that I feel seen and supported rather than pressured.
- As a user who has been inactive for 5+ days, I want a gentle, non-guilt-inducing re-engagement message, so that I can return without shame.
- As a user on a streak, I want the AI to acknowledge and celebrate my consistency, so that the streak feels meaningful and worth maintaining.

### Acceptance Criteria

- [ ] Daily check-in is available starting Day 1 (after project acceptance)
- [ ] Check-in comprises 3–5 questions depending on user state
- [ ] First question always opens with acknowledgment of current state (not a task check)
- [ ] Check-in adapts based on: project progress, last check-in sentiment, streak status, day of week
- [ ] Streak counter visible throughout the app; increments after check-in completion
- [ ] Users who miss 3+ days receive a re-engagement message variant (softer tone, no guilt)
- [ ] Win celebration triggers on: milestone completion, streak milestones (7, 14, 30, 60, 90 days), project acceptance
- [ ] Micro-action suggestion provided at end of every check-in
- [ ] Check-in can be completed in ≤ 5 minutes (validated by user testing)
- [ ] Push notification delivered at user's preferred time (configurable in settings)

### Technical Requirements

- Check-in state machine: tracks user state across sessions (streak, mood trend, project progress phase)
- Adaptive question selector: rule-based + ML scoring for question relevance
- Sentiment tracking: rolling 7-day sentiment window per user
- Notification system: FCM (Android), APNS (iOS), web push
- Preferred time storage: per-user timezone-aware notification scheduling
- Response latency: ≤ 2 seconds per AI turn

### Design Requirements

- Check-in UI: full-screen, immersive, minimal distraction
- Streak display: prominent but not anxiety-inducing (not a countdown timer)
- Win celebration: animated, joyful, but skippable
- Re-engagement screen: warm, not accusatory; no red indicators for missed days
- Micro-action display: visually distinct from questions; actionable, specific

### Dependencies

- User account and project (must have active project)
- Push notification infrastructure
- Sentiment analysis pipeline
- Progress Tracking (shares data with feature 4)

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Check-ins feel repetitive after 2 weeks | High | High | Large question bank; season-based question rotation; dynamic depth |
| Notification fatigue leading to disabling push | Medium | High | Respect user's time preference; reduce to 3x/week if user misses 3+ days |
| AI response feels hollow or generic | Medium | High | Personalization tokens; reference prior answers explicitly |

### Out of Scope (v1.0)

- Voice-based check-ins
- Video check-ins
- Check-ins shared with accountability partners (v1.5)
- Multiple projects tracked in single check-in (v1.1)

---

## 13. Feature 4: Progress Tracking (P1)

### Overview

The Progress Tracking dashboard gives users a visual representation of their journey — streaks, milestone completion, mood trends, and behavioral patterns. The dashboard surfaces insights users wouldn't notice themselves: "You check in most consistently on Tuesday mornings" or "Your energy scores are lowest mid-week."

### User Stories

- As a user with 30+ days of data, I want to see a visual summary of my progress and patterns, so that I feel a sense of accomplishment and understand myself better.
- As a user who has missed milestones, I want the dashboard to show my actual progress without making me feel like a failure, so that I can re-engage without shame.

### Acceptance Criteria

- [ ] Dashboard available after Day 7 (meaningful data threshold)
- [ ] Streak displayed prominently with visual history (calendar heatmap)
- [ ] Milestone progress shown per project (% complete, days remaining)
- [ ] Mood trend graph: 7-day and 30-day rolling average
- [ ] Pattern insight cards: auto-generated weekly (e.g., best check-in day, energy patterns)
- [ ] Win log: chronological list of all celebrations
- [ ] Shareable progress cards (image export for social media)
- [ ] Dashboard data exports available (CSV) for paid users

### Technical Requirements

- Analytics pipeline: event-based, aggregated per user
- Pattern detection: weekly batch job identifying behavioral patterns per user
- Visualization: lightweight charting library (Chart.js or Recharts)
- Data retention: indefinite for active users; 2 years post-churn
- Privacy: no cross-user data in personal dashboard

### Dependencies

- Daily AI Companion (source of check-in data)
- Discovery Session profile (baseline for patterns)
- Payment system (for export and advanced insights)

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Dashboard feels empty in early days | High | Medium | Progressive disclosure; show motivating placeholder states |
| Pattern insights are inaccurate or unhelpful | Medium | Medium | Human review of pattern templates; confidence threshold before display |

### Out of Scope (v1.0)

- Cross-project analytics
- Coach-visible dashboards
- External app integrations (Apple Health, Oura Ring)

---

## 14. Feature 5: Accountability Partners (P2 — v1.5)

### Overview

In v1.5, SOC introduces Accountability Partners and Circles — optional social features that allow users to share their journey with 1–4 other users. Matching is AI-powered based on project domain, availability, and communication style. Circles (groups of 3–5) have shared weekly rituals: a brief status update and a shared win.

### User Stories

- As a user with an active project, I want to be matched with an accountability partner who is working on something similar, so that I feel less alone and have someone to check in with.
- As a Circle member, I want to share a weekly win with my group, so that I feel celebrated and motivated to keep going.

### Acceptance Criteria

- [ ] Users can opt into partner matching from their project dashboard
- [ ] Matching algorithm considers: project domain, check-in frequency, timezone, communication style preference
- [ ] Match presented with explanation ("You were matched because...")
- [ ] Users can reject a match once without penalty; twice triggers a 7-day cooldown
- [ ] Circles limited to 3–5 members; SOC-facilitated async communication (no real-time chat in v1.5)
- [ ] Weekly Circle ritual: each member posts a "win of the week" by Sunday
- [ ] Privacy: users control what project information is visible to partners
- [ ] Report/block functionality available from day one

### Dependencies

- All P0 and P1 features
- Community moderation infrastructure
- Matching algorithm (ML model)
- In-app messaging or async post system

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Toxic behavior in Circles | Medium | High | Moderation layer; report flow; auto-pause on reports |
| Poor matches leading to disengagement | Medium | Medium | Iterative matching with feedback loop |
| Privacy violations | Low | High | Strict data controls; opt-in only; no defaulting to shared |

### Out of Scope (v1.5)

- Real-time chat
- Video calls between partners
- Enterprise or team-based Circles

---

## 15. Non-Functional Requirements

### Performance

| Requirement | Target |
|-------------|--------|
| AI response time (p50) | ≤ 1.5 seconds |
| AI response time (p95) | ≤ 3.5 seconds |
| Page load time (p95) | ≤ 2 seconds |
| Project generation time | ≤ 30 seconds |
| API availability | ≥ 99.5% uptime |
| Maximum concurrent users (v1.0) | 5,000 |
| Maximum concurrent users (v1.1 target) | 25,000 |

### Availability & Reliability

- Uptime SLA: 99.5% (≤ 3.65 hours downtime per month)
- Planned maintenance windows: Sundays 02:00–04:00 UTC
- Graceful degradation: if AI API is down, check-in reverts to question-based mode with stored prompts
- Data backup: daily; point-in-time recovery for ≤ 24 hours data loss
- Disaster recovery: RTO ≤ 4 hours; RPO ≤ 24 hours

### Security

- Authentication: OAuth 2.0 + email/password; optional SSO (Google, Apple)
- Authorization: role-based access control (user, admin, moderator)
- Data encryption: AES-256 at rest; TLS 1.3 in transit
- PII handling: GDPR compliant (EU users); CCPA compliant (California users)
- AI data usage: user data never sent to AI provider for training without explicit opt-in
- Session security: JWT with 24-hour expiry; refresh token rotation
- Vulnerability management: quarterly penetration testing; automated dependency scanning

### Scalability

- Architecture: microservices with horizontal scaling
- AI usage: rate limiting per user (30 AI turns per day free; 100 paid)
- Database: read replicas for analytics queries
- CDN: static assets served via CDN (Cloudflare or equivalent)
- Cost management: AI API calls cached where semantically appropriate

### Accessibility

- WCAG 2.1 Level AA compliance
- Screen reader compatible (ARIA labels on all interactive elements)
- Minimum contrast ratio: 4.5:1 for body text; 3:1 for UI components
- Keyboard navigable throughout
- Dyslexia-friendly font option in settings

---

## 16. User Flows

See detailed flow diagrams in `/02-PRODUCT/user-flows/diagrams/flows.md`.

---

## 17. Onboarding Flow

**Entry Point:** Marketing site "Get Started" CTA or direct app store install

**Step 1 — Sign Up**
User enters email and password (or continues with Google/Apple). Verification email sent.

**Step 2 — Welcome Screen**
Brief 3-slide introduction to SOC's core promise. Non-skippable for first-time users (skippable on subsequent installs). Total read time: < 60 seconds.

**Step 3 — Context Questions (3 questions)**
Before Discovery Session begins, SOC gathers minimal context:
- "What best describes your situation right now?" (career transition / creative project / general life direction / something else)
- "How long have you felt like something needs to change?" (< 3 months / 3–12 months / 1–3 years / longer)
- "What have you tried before?" (multi-select: journaling, coaching, therapy, productivity apps, goal frameworks, nothing)

These answers are not used in Discovery Session directly but calibrate the opening question.

**Step 4 — Discovery Session Introduction**
Brief screen explaining: "We're going to have a 20-question conversation. There are no right answers. Take your time. You can pause anytime." Prominent "Begin" CTA.

**Step 5 — Discovery Session**
See Feature 1 for full flow.

**Step 6 — Insight Summary Review**
User reviews and optionally edits the generated insight summary.

**Step 7 — Project Generation & Selection**
See Feature 2 for full flow.

**Step 8 — First Check-In Setup**
User sets preferred check-in time and enables/denies push notifications. SOC explains why daily check-ins matter.

**Step 9 — Dashboard Introduction**
Brief contextual tooltips on the main dashboard. Skippable.

**Time to Complete Full Onboarding:** 25–40 minutes (Discovery Session is the primary time investment)

---

## 18. Discovery to Project Flow

1. User completes Discovery Session (20 questions, ~20 minutes)
2. System displays processing animation (≤ 30 seconds)
3. Insight summary displayed: 3–5 key insights with confidence indicators
4. User reviews summary; can edit, reject, or add to any insight
5. User taps "Generate My Projects"
6. System displays processing animation (≤ 30 seconds)
7. 2–3 project cards displayed side-by-side (or stacked on mobile)
8. User taps a project card to expand and view full detail
9. User selects preferred project; taps "Start This Project"
10. Celebratory animation plays; project appears in dashboard
11. System immediately prompts: "Set up your first check-in time"

---

## 19. Daily Check-In Flow

1. Push notification delivered at user's preferred time
2. User taps notification; check-in screen opens
3. AI greeting acknowledges the user's state (references streak, last check-in mood, project phase)
4. Question 1: Emotional state ("How are you showing up today?")
5. Question 2: Project-specific progress check
6. Question 3: Blocker identification or win acknowledgment (conditional on state)
7. Optional Question 4–5: Deep-dive if user indicates significant progress or significant struggle
8. Micro-action suggestion displayed
9. Streak counter updates with animation
10. User returns to dashboard

**Total time: 3–7 minutes**

---

## 20. Monetization & Pricing

### Tier Structure

**Free Tier**
- 1 Discovery Session per year
- 1 active project
- Daily check-ins (limited to 3 per week)
- Basic progress view (7-day)
- AI rate limit: 15 turns per day

**Pro Tier — $14.99/month or $119.99/year (~$10/month)**
- 3 Discovery Sessions per year
- Up to 3 active projects
- Unlimited daily check-ins
- Full progress dashboard (unlimited history)
- Shareable progress cards
- Data export (CSV)
- AI rate limit: 100 turns per day
- Priority AI response queuing

**Teams Tier (v2.0) — $24.99/month**
- Everything in Pro
- Accountability Partners & Circles
- Shared team dashboards
- Facilitator tools for coaches

### Free Trial
- 14-day full Pro access on sign-up (no credit card required)
- At Day 12, user receives soft paywall prompt with retention offer (20% off annual)
- At Day 14, hard paywall; free tier features remain available

### Pricing Philosophy
- Priced below human coaching (sessions cost $150–$500)
- Priced above generic apps (most priced at $4.99–$9.99)
- Annual discount encourages long-term commitment (aligns with user's project timeline)

---

## 21. Activation Metrics

Activation is defined as: **User completes Discovery Session AND accepts a generated project.**

### Activation Funnel

| Stage | Expected Conversion |
|-------|-------------------|
| Sign-up → Onboarding start | 95% |
| Onboarding start → Discovery Session start | 80% |
| Discovery start → Discovery complete | 65% |
| Discovery complete → Project accepted | 85% |
| **Overall sign-up → Activation** | **~42%** |

### Activation Tactics

- Auto-save at every Discovery Session answer (reduces abandonment fear)
- Session resume notifications ("You left your session 2 hours ago — ready to continue?")
- Social proof on Project Generation screen ("Thousands of people like you have chosen similar projects")

---

## 22. Engagement Metrics

### Engagement Ladder

| Level | Definition | % of User Base (Target) |
|-------|-----------|------------------------|
| Dormant | 0 check-ins in last 14 days | < 20% |
| Occasional | 1–2 check-ins per week | 30% |
| Regular | 3–4 check-ins per week | 35% |
| Power User | 5–7 check-ins per week | 15% |

### Engagement Levers

- Streak mechanics with milestone celebrations (7, 14, 30, 60, 90 days)
- Weekly insight email: "Here's what SOC noticed about you this week"
- Milestone approaching nudge: "You're 3 tasks away from completing your 30-day milestone"
- Seasonal Discovery Session prompt at 90 days: "Time to see how you've changed"

---

## 23. Retention Metrics

### Retention Benchmarks (Industry Context)

- Generic wellness apps: Day 30 retention ~15–20%
- Premium coaching apps: Day 30 retention ~25–35%
- SOC target: Day 30 retention ≥ 30%

### Retention Strategy

**Days 1–7 (Activation Phase):** Ensure project starts generating visible momentum; first milestone should be achievable in Week 1
**Days 8–30 (Habit Formation):** Streak mechanics; 7-day streak celebration; first pattern insight delivered at Day 14
**Days 31–90 (Deepening Value):** 30-day milestone review; AI synthesizes growth observations; prompt for second project (paid)
**Day 90+ (Long-Term):** Discovery Session re-run option; progress report; potential Community features (v1.5)

### Churn Interventions

- Day 3 no check-in: gentle push notification
- Day 7 no check-in: re-engagement email with "Your project is waiting for you"
- Day 14 no check-in: personal message from "the SOC team" offering a reset session
- Day 30 no check-in: churn email with option to pause subscription (not cancel)

---

## 24. Release Plan

### Alpha — Weeks 1–8 (Internal + Invited Users)

**Scope:**
- Core Discovery Session (20 questions, basic adaptive logic)
- Basic Project Generation (template-based, minimal personalization)
- Simple daily check-in (fixed 5-question flow, no adaptation)
- Web app only

**Success Criteria:**
- 50 users complete full Discovery → Project flow
- Discovery Session NPS ≥ 40
- 70% of alpha users check in at least 3 times in Week 1

**Exit Gate:**
- Critical bugs resolved (P0 severity: 0 open; P1 severity: ≤ 3 open)
- Performance targets met (AI response p95 ≤ 3.5s)

### Beta — Weeks 9–16 (Expanded Invited + Public Waitlist)

**Scope:**
- Enhanced Discovery Session (full adaptive question tree, confidence scoring)
- Full Project Generation Engine (5 project domains, personalization logic)
- Adaptive daily check-in (sentiment tracking, pattern detection)
- Progress Tracking dashboard (basic)
- iOS and Android apps (React Native)
- Paid subscription tier (Stripe integration)

**Success Criteria:**
- 500 users complete activation
- 30-day retention ≥ 25%
- Free-to-paid conversion ≥ 5%
- ≤ 2 security vulnerabilities of medium severity found in pen test

**Exit Gate:**
- All P0 and P1 bugs resolved
- App store review approval (iOS and Android)
- Legal review of privacy policy and Terms of Service complete

### Public Launch — Week 17+

**Scope:**
- Full feature set as defined in this PRD (P0 + P1)
- Marketing site live
- Press/influencer outreach
- Referral program (invite 3 friends, get 1 month Pro free)

**Launch Targets (30 days post-launch):**
- 5,000 registered users
- 2,000 activated users
- 200 paid subscribers
- App Store rating ≥ 4.2

### v1.5 — 6 Months Post-Launch

- Accountability Partners feature
- Circles (async group rituals)
- Enhanced pattern insights
- Second language support (Russian localization)

---

## 25. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| AI API cost exceeds budget | High | High | Rate limiting; caching; cost-per-user monitoring with alerts |
| Discovery Session abandonment > 40% | Medium | High | Progressive save; mobile optimization; reduce to 15 questions if data shows abandonment at Q10 |
| Generated projects feel generic | Medium | High | Extensive prompt engineering; quality scoring pipeline; user ratings with feedback loop |
| User privacy concerns about AI data | High | Medium | Clear privacy policy; no training data use without consent; EU data residency option |
| App store rejection (iOS) | Low | High | Review guidelines compliance check pre-submission; no medical claims in copy |
| Competitor launches similar product | Medium | Medium | Move fast; differentiate on depth of discovery and personalization quality |
| Key engineering dependency on single AI provider | Medium | High | Abstract AI layer; test with 2 providers from day 1 |
| Negative press around AI "replacing therapy" | Medium | High | Clear messaging: SOC is a growth tool, not therapy; crisis escalation to professional resources |

---

## 26. Open Questions

1. **Discovery Session length:** Should we offer a "quick" 10-question variant alongside the full 20-question session? Risk: shallower insights; Benefit: higher completion rate.
2. **AI provider strategy:** Single provider (OpenAI) for simplicity, or dual-provider (OpenAI + Anthropic) for resilience and A/B testing?
3. **Onboarding skip option:** Should experienced users be able to skip directly to Discovery Session without the 3 context questions?
4. **Pricing for emerging markets:** Should Russian-market pricing be localized (e.g., ₽999/month vs. full USD pricing)?
5. **Crisis protocol:** If a user's Discovery Session or check-in responses indicate acute distress, what is the intervention protocol? (In-app crisis resources? Email to support team? Pause session?)
6. **Data portability:** Should users be able to export their full Discovery Session transcripts and insight profiles? Format: PDF, JSON, or both?
7. **Insight editing:** How much control should users have over their insight profile? If they edit heavily, does it affect project quality?

---

## 27. Appendix: Glossary

| Term | Definition |
|------|-----------|
| Discovery Session | The 20-question AI-facilitated dialogue that is the core onboarding experience |
| Insight Profile | The structured output of the Discovery Session: a set of weighted themes and desires |
| Confidence Score | A 0–100 score assigned to each insight, representing how consistently it appeared across session responses |
| Project | A 90-day initiative generated by the Project Generation Engine, tied to a user's core desires |
| Check-In | A daily 3–7 minute AI conversation that tracks progress and emotional state |
| Streak | The number of consecutive days a user has completed a check-in |
| WAR | Weekly Active Reflector — the North Star metric |
| JTBD | Jobs To Be Done — a framework for understanding user motivations |
| Circle | A small accountability group of 3–5 users (v1.5 feature) |
| Micro-Action | A small, specific action suggested at the end of each check-in to maintain momentum |
| Alignment Score | A percentage score indicating how well a generated project matches a user's insight profile |
| Re-engagement | The set of interventions triggered when a user has been inactive for 3+ days |
