# Feature Spec: Daily AI Companion

**Feature Name:** Daily AI Companion
**Priority:** P1
**Version:** 1.0
**Last Updated:** 2026-03-02
**Owner:** Product Lead
**Status:** Approved for Sprint 3

---

## 1. Overview

The Daily AI Companion is a lightweight, conversational check-in system that maintains user momentum between Discovery Sessions. While Discovery Sessions are deep, exploratory (30–45 min), the AI Companion is brief and action-oriented (3–7 min).

The Companion:
- Checks in daily to track progress on active project tasks
- Notices patterns in user behavior (e.g., consistent blockers)
- Proactively surfaces relevant insights from past Discovery Sessions
- Escalates to recommending a new Discovery Session when patterns indicate stagnation

---

## 2. Problem Statement

**Users lose momentum between Discovery Sessions.**

After the excitement of the first Discovery Session and project generation, users face the reality of execution. Without daily scaffolding, projects stall. The AI Companion provides the equivalent of a brief daily meeting with an accountability partner.

**Key insight from research:** Users who received daily AI follow-ups retained at 68% at D30 vs. 34% for those who didn't.

---

## 3. User Stories

### Primary Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| AC-1 | User | Receive a daily check-in prompt | I stay accountable to my project |
| AC-2 | User | Tell the AI what I accomplished | My progress is recorded |
| AC-3 | User | Tell the AI what blocked me | We can problem-solve together |
| AC-4 | User | Skip days without losing streak | I'm not penalized for real life |
| AC-5 | User | See my check-in history | I can see patterns in my progress |

### Secondary Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| AC-6 | User | Have the AI remember what I shared | It feels like a continuous relationship |
| AC-7 | User | Get a push notification to check in | I don't forget |
| AC-8 | User | Set my preferred check-in time | It fits my schedule |
| AC-9 | User | Have the AI suggest a task when I'm stuck | I know what to do next |

---

## 4. Feature Specification

### 4.1 Check-In Flow

**Entry Points:**
- Push notification (configurable time, default: 9:00 AM user's timezone)
- In-app: persistent "Daily Check-In" card on dashboard
- Email reminder (if push not enabled)

**Flow:**

```
1. Greeting (personalized based on time of day + day of week)
   "Good morning, Alex. It's Day 12 of your project.
    Yesterday you said you'd [last committed task]. How did it go?"

2. Response collection (free text + optional quick-select)
   [Done ✓] [Partially done ~] [Didn't happen ✗]

3. Brief follow-up question (1 question max)
   If done: "Nice! What made it work?"
   If partial: "What got in the way?"
   If not done: "No worries. Is this still the right task? Or should we reprioritize?"

4. Task for today
   "Based on your project plan, your next task is: [X].
    Does that still make sense, or would you like to adjust?"
   → [Confirm] [Adjust] [Skip today]

5. Closing
   "Got it. I'll check in tomorrow. Good luck with [task]."
```

**Total interaction: 3–7 minutes**

---

### 4.2 Pattern Detection

The AI Companion monitors patterns and takes action:

| Pattern | Trigger | AI Action |
|---------|---------|-----------|
| Same blocker 3+ times | 3 consecutive check-ins mention same obstacle | "I've noticed [X] has come up 3 times. Want to do a focused session on it?" |
| Inactive 3 days | No check-in for 3 days | Push notification: "Hey, we miss you. Quick check-in?" |
| Inactive 7 days | No check-in for 7 days | Email: re-engagement with personalized insight |
| High velocity | 5+ tasks completed in 5 days | Celebrate + ask about adjusting timeline |
| Stagnant project | Same task marked "partial" 5+ times | Suggest a new Discovery Session |

---

### 4.3 Memory Architecture

The AI Companion has access to:
- All past Discovery Session summaries (vectorized, retrieved via semantic search)
- Full check-in history (last 90 days in context window; older → summarized)
- Project task list (current state)
- User-set preferences (check-in time, notification preferences)

**Context passed to AI on each check-in:**
```json
{
  "user_name": "Alex",
  "project_name": "DevPath Academy",
  "project_day": 12,
  "last_checkin_date": "2026-03-01",
  "last_committed_task": "Write outline for Module 1",
  "recent_blockers": ["Finding time in the evenings"],
  "session_insights": ["You care deeply about making technical concepts accessible", "..."],
  "today_suggested_task": "Finalize Module 1 outline"
}
```

---

### 4.4 Notification Settings

Users can configure:
- Check-in time (default: 9:00 AM)
- Notification channel: push, email, or both
- Frequency: Daily, weekdays only, or custom
- Quiet days: select specific days to skip

---

## 5. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Response time | AI response < 2 seconds |
| Availability | 99.5% uptime |
| Context retrieval | Session summaries retrieved in < 500ms |
| Mobile usability | Full functionality on mobile browser |

---

## 6. Success Metrics

| Metric | Baseline | Target (90 days) |
|--------|----------|-----------------|
| Check-in open rate (push) | — | > 45% |
| Check-in completion rate | — | > 60% |
| D30 retention (users with ≥10 check-ins) | — | > 65% |
| Users who recommend new Discovery Session via pattern detection | — | > 20% |
| User satisfaction with check-in (post-interaction survey) | — | > 4.0/5.0 |

---

## 7. Out of Scope (v1)

- Group check-ins / accountability partner features
- Integration with external calendars (Google Calendar, etc.)
- Voice-based check-ins
- Video responses

---

## 8. Open Questions

1. Should check-in history be visible to users as a timeline, or only as aggregate stats?
2. How do we handle users who have multiple active projects? (v1: one active project only)
3. Should the AI proactively suggest journal prompts for deeper reflection, or stay strictly task-focused?

---

*Feature Owner: Product Lead | Engineering Lead: TBD | Design: TBD*
