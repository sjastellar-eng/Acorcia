# Feature Spec: Community Layer

**Feature Name:** Community Layer
**Priority:** P2 (v1.5)
**Version:** 1.0
**Last Updated:** 2026-03-02
**Owner:** Product Lead
**Status:** Planning — Not in MVP

---

## 1. Overview

The Community Layer connects SOC users who are building similar types of projects or working through similar challenges. Unlike traditional community features (forums, comments), SOC's community layer is AI-curated and context-aware: it matches users based on the insights extracted from their Discovery Sessions, not just their stated interests.

The Community Layer has three components:
1. **Accountability Partners** — 1:1 pairing of users with complementary but similar-stage projects
2. **Project Showcases** — Shareable public project pages to build audience before launch
3. **Insight Circles** — Small groups (4–6 people) meeting weekly around a shared theme (e.g., "Builders transitioning from corporate")

---

## 2. Why Community (v1.5, Not MVP)?

Community requires critical mass to provide value. We will not build community features until:
- 500+ active users (defined as ≥ 2 check-ins/week)
- NPS > 45 from core product (ensures strong product foundation)
- Evidence from user research that isolation/accountability is a top unmet need

**Risk if built too early:**
- Empty community feels like a ghost town and damages trust
- Engineering cost diverts from core product quality
- Community moderation adds operational burden before product-market fit

---

## 3. User Stories

### Accountability Partners

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| CL-1 | User | Be matched with an accountability partner | I have someone checking in on my progress |
| CL-2 | User | See my partner's project (anonymized summary) | I understand what they're building |
| CL-3 | User | Send weekly check-in messages to my partner | We hold each other accountable |
| CL-4 | User | Opt out of the match if it's not working | I'm not stuck in a poor match |
| CL-5 | User | Have the AI summarize my week for my partner | Sharing is low-effort |

### Project Showcase

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| CL-6 | User | Create a public page for my project | Others can follow my journey |
| CL-7 | User | Control what appears on my public page | I only share what I'm comfortable with |
| CL-8 | User | See who is following my project | I feel the support |
| CL-9 | Visitor | Follow a project I find inspiring | I can see updates |

### Insight Circles

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| CL-10 | User | Be placed in a small group with similar people | I can share and learn in context |
| CL-11 | User | See curated prompts for our weekly call | Our conversations are structured |
| CL-12 | User | See a summary of our group's insights | I can refer back to what we discussed |

---

## 4. Accountability Partner Matching Algorithm

### Input Signals

| Signal | Weight | Source |
|--------|--------|--------|
| Project stage (ideation / planning / building / launching) | High | Project data |
| Project category (education / productivity / creator / etc.) | Medium | Session analysis |
| Available time per week | Medium | User settings |
| Communication style (analytical / exploratory / action-oriented) | Medium | Session analysis |
| Timezone (within ±4 hours) | High | User settings |
| Desired partner type (similar background vs. different) | High | Opt-in preference |

### Matching Process

1. User opts in to matching program
2. AI analyzes user's project data and session insights
3. System generates compatibility score with available partners
4. Top 3 candidates reviewed by moderation algorithm (safety check)
5. Best match proposed to both users ("You've been matched with someone building a similar project!")
6. Both users must accept within 7 days (otherwise re-matched)
7. 4-week trial period → user rates match → system learns

---

## 5. Project Showcase Page

### Visible Elements (user-controlled)

```
┌────────────────────────────────────────────────────┐
│  Project Name + Tagline                            │
│  ─────────────────────────────────────────────     │
│  "Building [project name] to [solve X for Y]"     │
│                                                    │
│  📅 Day 47 | 🎯 Phase: Building | 🔥 Streak: 12   │
│                                                    │
│  ─────────────────────────────────────────────     │
│  Project Summary (AI-generated, editable)          │
│                                                    │
│  Recent Milestones                                 │
│  ✓ Completed: Landing page draft                   │
│  ✓ Completed: First user interview                 │
│  → In Progress: MVP v0.1                           │
│                                                    │
│  [ Follow Project ]  👁 23 followers               │
└────────────────────────────────────────────────────┘
```

### Privacy Controls

- **Fully private** (default): visible only to user
- **Partner-visible**: visible to accountability partner
- **Public**: discoverable page, shareable link
- **Discovery Sessions:** never public (always private)

---

## 6. Insight Circles

### Circle Formation

- Groups of 4–6 users
- Formed around a theme extracted from session data: e.g., "Career Transitioners Building EdTech" or "Engineers Learning to Sell"
- AI-curated theme, not user-selected (reduces echo chambers)
- Facilitated async-first: weekly Slack-equivalent thread (in-app), optional sync call

### Weekly Circle Prompt

Each week, the AI generates a discussion prompt for each Circle based on:
- The most common blocker across Circle members that week
- A thematic question aligned with the group's shared journey

Example prompt for "Career Transitioners":
> *"This week, 3 of you mentioned fear of not being 'credible' in your new direction. What does 'credibility' actually mean to you — and how much of it do you actually need before starting?"*

---

## 7. Moderation Framework

### Automated Moderation
- AI screens all public-facing content before publishing
- Flags: personal contact info, financial solicitations, off-topic promotions, harmful content

### Human Moderation
- Dedicated community manager (0.5 FTE initially)
- Escalation path for reported content
- Weekly review of flagged items

### Community Guidelines
1. Support, don't compare — celebrate your progress, not status
2. No solicitation or promotion
3. Confidentiality — what's shared in the circle stays in the circle
4. Respect each person's pace

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Partner match acceptance rate | > 70% |
| Partner pairs active after 4 weeks | > 55% |
| Public project pages created | > 30% of active users |
| Circle participation (≥1 response/week) | > 50% |
| Retention lift vs. solo users | +15% D60 |

---

## 9. Dependencies

- Core product NPS > 45 (prerequisite)
- User base > 500 active (prerequisite)
- Real-time messaging infrastructure (in-app)
- Moderation tooling

---

## 10. Out of Scope (v1.5)

- Live video calls (use Zoom/Meet links instead)
- Public community feed / social timeline
- Creator monetization features
- Mentorship marketplace

---

*Feature Owner: Product Lead | Target release: v1.5 (Q4 2026)*
