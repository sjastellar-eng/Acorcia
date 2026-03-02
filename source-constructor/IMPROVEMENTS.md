# Source Constructor (SOC) — Suggested Improvements

**Document Version:** 1.0
**Date:** March 2026
**Author:** Product & Research Team

---

## Overview

This document captures suggestions for improving the product, business model, and go-to-market strategy based on internal review, user research, and competitive analysis. Items are prioritized by impact and feasibility.

---

## Product Improvements

### P0 — Critical for Launch Quality

#### 1. Adaptive Discovery Session Depth
**Current state:** All sessions follow the same 5-phase structure regardless of user's readiness or depth of engagement.

**Problem:** Users who give shallow answers get shallow projects. Users who are ready to go deep are artificially constrained.

**Suggested improvement:** Implement an adaptive branching system where the AI evaluates response depth and adjusts the next question's direction. If a user gives a surface answer, the AI follows up before moving forward. If a user is highly introspective, the AI can deepen faster.

**Effort:** Medium | **Impact:** Very High

---

#### 2. Session Quality Score
**Current state:** No feedback on whether a session was high-quality before project generation.

**Problem:** Users may complete a session quickly with minimal depth, receive a generic project, and conclude the product doesn't work.

**Suggested improvement:** After each session, show a "session depth score" (1–5 stars) with a brief explanation: *"You explored 4 of 5 themes deeply. Your project reflects strong self-awareness. The most impactful dimension was: how you relate to teaching."*

This sets expectations and gives users a reason to redo the session if they feel it was rushed.

**Effort:** Low | **Impact:** High

---

#### 3. Project Edit & Refinement Mode
**Current state:** Generated project is shown as-is. Users can edit tasks but not the core project structure.

**Problem:** Some users feel the generated project is 90% right but want to adjust the framing, target audience, or revenue model.

**Suggested improvement:** Add a "Refine with AI" mode where the user can ask the AI to adjust specific aspects of the project: *"Change the target audience to freelancers instead of full-time employees"* or *"Make the timeline more aggressive."*

**Effort:** Medium | **Impact:** High

---

### P1 — High Value, Post-Launch

#### 4. "Focused Session" Mode
**Current state:** All sessions start from scratch.

**Problem:** After the initial Discovery Session, users often return with a specific question or decision to work through, not a full open-ended exploration.

**Suggested improvement:** Add a "Focused Session" type where the user enters a specific context: *"I'm stuck on deciding whether to build for B2C or B2B."* The AI tailors the session specifically to that question while drawing on previous session insights.

**Effort:** Low | **Impact:** High

---

#### 5. Partner & Coach Mode
**Current state:** SOC is individual-only.

**Opportunity:** Coaches and therapists represent a high-leverage distribution channel. Their clients are exactly SOC's target audience.

**Suggested improvement:** Add a "Coach Mode" where a coach can view a client's project (not session transcripts — privacy maintained) and provide notes. Coaches get a dashboard showing all their clients' project progress.

**Pricing:** Add a "Coach Pro" tier at $49/month (covers up to 5 clients).

**Effort:** High | **Impact:** Very High (unlocks B2B2C channel)

---

#### 6. Insight Export & Portability
**Current state:** Insights are locked inside the SOC platform.

**Problem:** Power users want to bring their insights into Notion, Obsidian, or share with their coach.

**Suggested improvement:** Add one-click export of:
- Session transcript (Markdown)
- Project plan (Markdown or Notion-compatible)
- Insights library (Markdown)

**Effort:** Low | **Impact:** Medium (builds trust + reduces churn from "lock-in" fear)

---

### P2 — Long-Term Roadmap

#### 7. Voice-Based Discovery Sessions
**Current state:** Text-only interface.

**Opportunity:** Many users think better out loud. Voice sessions could unlock faster, more authentic responses.

**Suggested improvement:** Add optional voice input (transcribed in real-time) for mobile users. Voice output for AI responses (text-to-speech, optional).

**Effort:** High | **Impact:** High (expands use cases, especially mobile)

---

#### 8. Project Templates by Archetype
**Current state:** Every project is generated from scratch.

**Opportunity:** After gathering data from 1,000+ sessions, patterns emerge — certain user profiles consistently create certain project types.

**Suggested improvement:** Create "Project Archetypes" that serve as starting points when the AI detects a strong match: *"You match the Education Creator archetype. Here's a template — let's customize it for you."*

**Effort:** Medium | **Impact:** Medium (speeds up time-to-clarity for common patterns)

---

## Business Model Improvements

#### 9. B2B2C via HR/L&D Channel
**Observation:** Companies spend $1,200/employee/year on L&D tools. SOC solves a specific problem: employees who don't know how to develop themselves.

**Suggested improvement:** Explore a "Teams" SKU for HR departments: $8/employee/month (min 20 seats). Target: companies with strong L&D programs or high internal mobility.

**Effort:** High | **Impact:** Very High (ACV ~$10k vs. $228/individual)

---

#### 10. Annual Plan Incentive Optimization
**Current state:** Annual plan is positioned as "save 35%."

**Problem:** Users on monthly may never consider annual because the framing is financial-only.

**Suggested improvement:** Reframe annual as "full commitment mode" with exclusive features: early access to new features, priority support, annual review session with AI. Users who commit annually signal they're serious — mirror that energy.

**Effort:** Low | **Impact:** Medium (improves LTV)

---

## Go-To-Market Improvements

#### 11. Coach & Therapist Partnership Program
**Observation:** Life coaches and therapists regularly refer clients to tools. They are trusted recommendation sources for the primary persona.

**Suggested improvement:** Create a formal referral/partnership program:
- Coaches get a personalized referral link
- 3-month free Pro access for their clients
- Coach gets paid commission ($5/month per referred paying user)
- Feature coaches in the SOC "Made with SOC" showcase

**Effort:** Medium | **Impact:** High (warm acquisition channel)

---

#### 12. Build in Public Content Strategy
**Observation:** The SOC story is inherently compelling: an AI that helps people find their purpose.

**Suggested improvement:** Founder commits to a weekly "Build in Public" thread on Twitter/X and IndieHackers showing real SOC user transformations (anonymized, with permission). Share product decisions, metrics, and learnings.

Expected impact: 200–500 signups/month from organic content at $0 CAC.

**Effort:** Low | **Impact:** High (compound organic growth)

---

#### 13. The "SOC Audit" Lead Magnet
**Suggested improvement:** Create a free 5-question "Project Clarity Audit" on the landing page. Takes 2 minutes. Output: *"Your project idea is at clarity level 2/5. Here's what's blocking you."*

This demonstrates product value before sign-up and serves as a low-friction top-of-funnel entry point.

**Effort:** Medium | **Impact:** High (improves landing page conversion rate)

---

## Documentation Improvements

#### 14. EXEC_SUMMARY.md Should Be Living
**Current state:** Executive summary reflects pre-seed projections.

**Suggestion:** Update the executive summary after each major milestone with real data. Investors doing follow-on diligence should be able to see how actuals compare to projections.

---

#### 15. Add Architecture Decision Records (ADRs)
**Current state:** Technology decisions are embedded in `03-TECHNICAL/architecture.md`.

**Suggestion:** Create `03-TECHNICAL/decisions/` directory with individual ADR files (ADR-001, ADR-002, etc.) for major decisions: choice of Claude over GPT-4, modular monolith vs. microservices, Supabase vs. custom Postgres, etc. This improves team alignment and helps new engineers understand why decisions were made.

---

## Priority Summary

| ID | Improvement | Priority | Effort | Impact |
|----|-------------|----------|--------|--------|
| 1 | Adaptive session depth | P0 | Medium | Very High |
| 2 | Session quality score | P0 | Low | High |
| 3 | Project refinement mode | P0 | Medium | High |
| 4 | Focused Session mode | P1 | Low | High |
| 11 | Coach partnership program | P1 | Medium | High |
| 12 | Build in public strategy | P1 | Low | High |
| 13 | SOC Audit lead magnet | P1 | Medium | High |
| 5 | Coach Mode / B2B2C | P2 | High | Very High |
| 9 | Enterprise / Teams SKU | P2 | High | Very High |
| 6 | Insight export | P2 | Low | Medium |
| 7 | Voice sessions | P3 | High | High |
| 8 | Project archetypes | P3 | Medium | Medium |

---

*Document Owner: Product & Research Team | Updated as learnings are gathered*
