# Sprint 01 — Core Infrastructure + Discovery Session

**Sprint Duration:** 2 weeks (Week 1–2 of MVP Development)
**Sprint Goal:** Auth working, database schema live, Discovery Session UI complete with Claude API integration

---

## Sprint Backlog

### 🏗️ Infrastructure (12 points)

| Ticket | Description | Points | Priority |
|--------|-------------|--------|----------|
| INFRA-01 | Next.js 14 project setup with TypeScript | 2 | P0 |
| INFRA-02 | Supabase project + schema migrations | 3 | P0 |
| INFRA-03 | Authentication (email + Google OAuth) | 3 | P0 |
| INFRA-04 | Vercel deployment + staging env | 2 | P0 |
| INFRA-05 | Tailwind CSS + design tokens setup | 1 | P0 |
| INFRA-06 | Sentry error monitoring | 1 | P1 |

### 💬 Discovery Session (16 points)

| Ticket | Description | Points | Priority |
|--------|-------------|--------|----------|
| DS-01 | Chat UI component (messages, typing indicator, progress bar) | 4 | P0 |
| DS-02 | Claude API integration service | 3 | P0 |
| DS-03 | Session start/save/resume/complete API | 3 | P0 |
| DS-04 | Answer storage and context management | 3 | P0 |
| DS-05 | Quick answer buttons | 1 | P1 |
| DS-06 | Session results screen (desires display) | 2 | P0 |

**Total Sprint Points: 28**

---

## Definition of Done

- [ ] User can sign up with email and Google OAuth
- [ ] User can start a Discovery Session
- [ ] Session adapts questions based on previous answers (via Claude)
- [ ] User can pause and resume session within 24h
- [ ] Session results saved to database
- [ ] Results screen shows 3–5 true desires with confidence scores
- [ ] All pages deployed to staging environment
- [ ] No TypeScript errors in CI

---

## Daily Standup Format

```
What did I do yesterday?
What am I doing today?
Any blockers?
```

---

## Sprint Review Criteria

**Demo to stakeholders:**
1. Sign up flow (30 seconds)
2. Complete Discovery Session (3 minutes condensed)
3. View results

**Success metrics:**
- 0 critical bugs
- Session completion in test: > 80%
- Claude API response time: < 3 seconds

---

## Technical Notes

### Claude API Setup
```typescript
// system prompt for discovery session
const SYSTEM_PROMPT = `You are a compassionate AI coach running a Discovery Session.
Your goal is to help the user understand their true desires and motivations.

Rules:
- Ask one question at a time
- Adapt next question based on previous answers
- Look for patterns, contradictions, and emotional responses
- After 10-15 questions, provide analysis with 3-5 true desires
- Be empathetic, not judgmental
- Never rush the user
- Use the user's own words back to them

Current conversation context:
{conversation_history}

User's latest answer: {latest_answer}
Question number: {question_number}/10

Next step: {next_question OR analysis}`;
```

### Database Schema Priority
```sql
-- Sprint 01 focus tables:
-- users (handled by Supabase Auth)
-- user_profiles (extended data)
-- discovery_sessions (core)
```
