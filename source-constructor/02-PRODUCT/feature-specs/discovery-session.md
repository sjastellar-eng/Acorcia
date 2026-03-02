# Feature Specification: Discovery Session
# Source Constructor (SOC) Platform

**Document Version:** 1.2
**Status:** Approved for Development
**Last Updated:** 2026-03-02
**Author:** Product Team
**Engineers Assigned:** TBD
**Designer Assigned:** TBD

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Flow — Step by Step](#3-user-flow--step-by-step)
4. [Question Bank Structure](#4-question-bank-structure)
5. [AI Prompt Engineering Strategy](#5-ai-prompt-engineering-strategy)
6. [Adaptive Question Logic — Decision Tree](#6-adaptive-question-logic--decision-tree)
7. [Insight Generation Algorithm](#7-insight-generation-algorithm)
8. [Confidence Scoring System](#8-confidence-scoring-system)
9. [UI/UX Requirements](#9-uiux-requirements)
10. [API Endpoints](#10-api-endpoints)
11. [Database Schema](#11-database-schema)
12. [Edge Cases and Error Handling](#12-edge-cases-and-error-handling)
13. [Performance Requirements](#13-performance-requirements)
14. [Testing Scenarios](#14-testing-scenarios)
15. [Open Questions](#15-open-questions)

---

## 1. Feature Overview

The Discovery Session is a 20-question AI-facilitated dialogue that forms the heart of the SOC onboarding experience. It is the mechanism by which SOC learns who the user truly is — not through a static profile form, but through a deep, adaptive conversation.

The session is structured to move from surface-level context (career situation, life stage) to deeper emotional truth (core desires, suppressed fears, authentic values) across three phases:

- **Phase 1 (Questions 1–6):** Establishing context and building rapport. Low emotional stakes. Safe entry.
- **Phase 2 (Questions 7–14):** Exploring patterns, values, and tensions. Moderate emotional depth. The AI begins detecting themes.
- **Phase 3 (Questions 15–20):** Clarifying desires and articulating vision. High emotional significance. The AI confirms and deepens its primary hypotheses.

By question 20, the system has generated an **Insight Profile**: a structured set of 3–7 weighted insights about the user's core desires, values, fears, and behavioral patterns. This profile is the input for the Project Generation Engine.

**Fundamental design requirement:** The session must feel like a conversation with a perceptive, warm human coach. It must not feel like a questionnaire, a psychological test, or a chatbot. Every AI message — including transition messages between questions — is part of this experience.

---

## 2. Goals & Success Metrics

### Goals

1. **Clarity generation:** The session surfaces what the user actually wants — not what they think they should want.
2. **Trust establishment:** The user feels safe enough to share honest, vulnerable answers.
3. **Accuracy:** The generated Insight Profile accurately reflects the user's stated and implied desires.
4. **Completion:** The majority of users who start the session complete it.
5. **Action bridge:** The session creates psychological readiness for project generation and action.

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Session completion rate | ≥ 65% | Sessions_completed / Sessions_started |
| Average completion time | 18–28 minutes | Median session duration |
| Insight accuracy (user-rated) | ≥ 80% accept without major edits | (Sessions with 0–1 edits) / Sessions_completed |
| Post-session NPS | ≥ 50 | Post-session survey |
| Emotional resonance score | ≥ 4.0 / 5.0 | In-app 5-star rating after summary review |
| Q10 theme identification rate | ≥ 90% have ≥ 2 themes at Q10 | Analytics event: themes_identified_at_q10 |
| Question-level abandonment peak | No single question loses > 8% of users | Per-question drop-off analytics |

---

## 3. User Flow — Step by Step

### Pre-Session

**Step 1: Context Questions Complete**
User has answered the 3 pre-session context questions (situation type, duration of feeling, prior attempts). These are stored in `session_context` and used to personalize the opening message.

**Step 2: Discovery Session Intro Screen**
- Title: "Your Discovery Session"
- Body: "This is a 20-question conversation designed to understand what you truly want — not what you think you should want. There are no right answers. Your honesty is the only thing that matters. Take as long as you need. You can pause anytime."
- "Begin" CTA button
- "How does this work?" expandable FAQ (3 questions)

**Step 3: Session Begins**
The AI generates a personalized opening message based on context questions, then delivers Question 1.

### During Session (Questions 1–20)

**For each question:**

1. AI acknowledgment message appears (typewriter animation, 40ms/character)
   - Example: "That makes a lot of sense. A lot of people in career transitions describe exactly that feeling of knowing something needs to shift but not being sure which direction."
2. Next question appears (typewriter animation)
3. User types response or selects from AI-offered options
4. "Send" button activates when response is valid
5. User taps "Send"
6. AI processes response (≤ 3 seconds)
7. Return to Step 1 for next question

**At Question 10:**
System runs partial theme identification. If ≥ 2 themes with confidence ≥ 50 are identified, questions 11–20 are biased toward confirming and deepening these themes. If < 2 themes identified, questions 11–20 include broader exploratory questions.

**At Question 20:**
Final question delivered and answered. System displays: "Thank you for sharing all of this. Give me a moment to understand what I heard." Processing animation begins.

### Post-Session

**Step 4: Insight Summary Generation**
Processing takes up to 30 seconds. System generates Insight Profile with 3–7 insights.

**Step 5: Insight Summary Display**
User sees summary screen with all insights. Can review, edit, or confirm.

**Step 6: Transition to Project Generation**
User confirms summary. System transitions to project generation.

---

## 4. Question Bank Structure

The question bank contains a minimum of 120 questions organized into 5 categories. Each question has metadata: category, emotional depth level (1–3), follow-up eligibility, and theme tags.

### Category 1: Values (25 questions)

Values questions surface what the user believes is important and meaningful — their fundamental ethical and philosophical orientation.

**Examples:**

1. "When you think about how you're spending your time right now — the majority of it — does it feel like it's yours? Or does it feel like it belongs to someone else's expectations?"
   - Depth: 2 | Tags: autonomy, authenticity | Follow-up eligible: YES

2. "If you could eliminate one thing from your daily life and never have to deal with it again, what would it be? And what does that tell you about what you value?"
   - Depth: 2 | Tags: values_contrast, frustration_source | Follow-up eligible: YES

3. "Think of a moment in the last two years when you felt genuinely proud of yourself — not proud because someone else was impressed, but proud because you knew you did something that mattered to you. What was it?"
   - Depth: 3 | Tags: values_activation, intrinsic_motivation | Follow-up eligible: YES

4. "What does 'success' mean to you right now — honestly, not the version you'd say in a job interview?"
   - Depth: 2 | Tags: success_definition, authenticity | Follow-up eligible: NO

5. "Is there something you've been defending or justifying to people in your life — a choice, a path, a belief — that you're actually not sure you believe in anymore?"
   - Depth: 3 | Tags: values_conflict, authenticity, self-deception | Follow-up eligible: YES

6. "When you make a decision and it feels wrong in your stomach even before the consequences arrive — what kind of decision is that usually about?"
   - Depth: 2 | Tags: intuition, values_violation | Follow-up eligible: YES

7. "What's something that used to matter a lot to you but doesn't anymore? What changed?"
   - Depth: 2 | Tags: values_evolution, identity_shift | Follow-up eligible: YES

### Category 2: Work Style (20 questions)

Work style questions reveal how the user actually operates best — their energy rhythms, collaboration preferences, and work environment needs.

**Examples:**

1. "Describe a time when you were doing work and completely lost track of time — where hours felt like minutes. What were you doing?"
   - Depth: 2 | Tags: flow_state, intrinsic_motivation, work_type | Follow-up eligible: YES

2. "Do you do your best thinking alone or with other people? And has that changed as you've gotten older?"
   - Depth: 1 | Tags: collaboration_style, social_energy | Follow-up eligible: NO

3. "Is there a version of your current work that you'd love, if only one or two things were different? What are those things?"
   - Depth: 2 | Tags: work_satisfaction_gaps, incremental_vs_radical_change | Follow-up eligible: YES

4. "When a project goes sideways and you're under pressure, what do you do? Do you get clearer or do you get scattered?"
   - Depth: 2 | Tags: resilience, stress_response, self_awareness | Follow-up eligible: YES

5. "If you had complete control over your schedule for the next year — no obligations, no financial pressure — how would your days look? Walk me through a typical day."
   - Depth: 2 | Tags: ideal_day, freedom_vision, energy_management | Follow-up eligible: YES

### Category 3: Fears (25 questions)

Fear questions surface the emotional barriers that prevent the user from moving toward what they want. These are among the most powerful and must be asked with maximum care and appropriate timing.

**Design rule:** No fear questions in Questions 1–4. Fear questions begin at Question 5 at the earliest, and only after rapport has been established (detected by response length > 50 words on prior questions).

**Examples:**

1. "What's the version of the future that you're most afraid of? Not a dramatic catastrophe — just the quiet version where you look back in 5 years and feel like you wasted it."
   - Depth: 3 | Tags: regret_fear, time_anxiety, future_vision | Follow-up eligible: YES

2. "Is there something you want to do — or try — that you haven't started because you're not sure you're good enough? What is it?"
   - Depth: 3 | Tags: impostor_syndrome, self_efficacy, aspiration_blocker | Follow-up eligible: YES

3. "What would happen to your sense of identity if the path you're on stopped working? Who would you be?"
   - Depth: 3 | Tags: identity_fragility, resilience, self_concept | Follow-up eligible: YES

4. "Is there someone in your life whose opinion of your choices matters more than it probably should? How does that show up?"
   - Depth: 3 | Tags: external_validation, social_fear, relationships | Follow-up eligible: YES

5. "What's something you've quit or avoided in the past that you're not entirely sure you gave up for the right reasons?"
   - Depth: 3 | Tags: avoidance_pattern, regret, self_awareness | Follow-up eligible: YES

6. "If you started something new tomorrow — a project, a career shift, a creative pursuit — what's the first fear that shows up? And where does that fear actually come from?"
   - Depth: 3 | Tags: activation_fear, source_of_fear, action_blockers | Follow-up eligible: YES

### Category 4: Desires (25 questions)

Desire questions move toward what the user truly wants — pulling them forward rather than examining what holds them back.

**Examples:**

1. "If you could be known for one thing — not famous, just known in your community and among the people you respect — what would you want to be known for?"
   - Depth: 2 | Tags: legacy_desire, reputation, impact | Follow-up eligible: YES

2. "Is there a version of your life you've imagined but never said out loud — even to yourself? What does it look like?"
   - Depth: 3 | Tags: unexpressed_desire, authentic_vision, suppressed_ambition | Follow-up eligible: YES

3. "What's something you do outside of work that makes you feel more like yourself than anything you do for money?"
   - Depth: 2 | Tags: intrinsic_identity, creative_expression, authentic_self | Follow-up eligible: YES

4. "Imagine it's 3 years from now and things are significantly better. What specifically is better? Be as concrete as you can."
   - Depth: 2 | Tags: future_vision, concrete_desire, success_image | Follow-up eligible: YES

5. "What kind of problem do you most want to be spending your time solving — even if you don't currently know how?"
   - Depth: 2 | Tags: problem_orientation, contribution_desire, mission | Follow-up eligible: YES

6. "Is there something you've been putting off until you're 'ready' — and you know you're probably never going to feel ready?"
   - Depth: 2 | Tags: procrastination, readiness_myth, action_desire | Follow-up eligible: YES

7. "What does freedom mean to you, practically speaking? Not a philosophy — what would it actually look like in your daily life?"
   - Depth: 2 | Tags: freedom_definition, autonomy, lifestyle_design | Follow-up eligible: YES

### Category 5: Patterns (25 questions)

Pattern questions help the user see their own behavioral tendencies — the loops they repeat, the habits that help or hurt them.

**Examples:**

1. "Think about the last three times you felt really alive and motivated. Is there anything those three experiences had in common?"
   - Depth: 2 | Tags: energy_pattern, motivation_source, activation | Follow-up eligible: YES

2. "When you set a goal and then don't follow through, what's usually the real reason — not the excuse you give yourself?"
   - Depth: 3 | Tags: follow_through_pattern, self_sabotage, honesty | Follow-up eligible: YES

3. "Has there been a recurring theme in feedback you've received from people who know you well — something they see in you that you might not fully see yourself?"
   - Depth: 2 | Tags: blind_spot, strengths, external_perception | Follow-up eligible: YES

4. "What's something you're really good at that you've been underusing? Why aren't you using it more?"
   - Depth: 2 | Tags: underutilized_strengths, self_limiting_belief | Follow-up eligible: YES

5. "Do you have a pattern of getting excited about something, starting it, and then losing energy before it's finished? If so, what does that usually feel like right before the energy drops?"
   - Depth: 3 | Tags: completion_pattern, activation_energy, commitment | Follow-up eligible: YES

6. "Looking at the last 3–5 years of your life, what's a decision you made that you now think was actually braver than you gave yourself credit for at the time?"
   - Depth: 2 | Tags: courage_pattern, self_recognition, growth | Follow-up eligible: YES

---

## 5. AI Prompt Engineering Strategy

### System Prompt Architecture

The Discovery Session AI prompt is structured in four layers:

**Layer 1: Role Definition**
```
You are a skilled and empathetic life design coach facilitating a Discovery Session.
Your role is to listen deeply, reflect back what you hear, ask one clear question at a time,
and create the conditions for genuine self-disclosure. You are warm, curious, and non-judgmental.
You never give advice, never evaluate the user's choices as good or bad, and never impose your
perspective. You are a mirror, not a guide.
```

**Layer 2: Session Context Injection**
Each session prompt includes the user's context answers, all prior questions and answers in this session, and the current phase (1, 2, or 3).

```
CONTEXT:
- User situation: {{context.situation_type}}
- Duration of feeling: {{context.duration}}
- Prior attempts: {{context.prior_attempts}}
- Current phase: Phase {{phase}} ({{phase_description}})
- Current question number: {{question_number}} of 20
- Themes identified so far: {{themes_json}}

CONVERSATION HISTORY:
{{formatted_qa_history}}
```

**Layer 3: Behavioral Constraints**
```
CONSTRAINTS:
- Ask exactly ONE question per response. Never ask two questions in one message.
- Your acknowledgment before the question should be 1–3 sentences maximum. Reference what the user just said specifically.
- Do not use coaching jargon: never say "unpack," "sit with," "explore," "lean into," or "at the end of the day."
- Do not offer solutions, next steps, or interpretations. You are gathering, not advising.
- If the user's response is very short (< 20 words), gently probe for more: "Can you say a bit more about that?"
- If the user expresses significant distress, acknowledge it warmly and check if they want to continue.
- Match the user's energy and vocabulary level. If they write formally, respond formally. If casually, respond casually.
- The question you ask must be selected from the provided question bank or be a direct follow-up to something the user said. Never invent arbitrary questions.
```

**Layer 4: Task Specification**
```
TASK:
Given the conversation history and the question bank below, select and output:
1. A brief acknowledgment of the user's last response (1–3 sentences)
2. The next question (verbatim from the question bank, or a closely adapted follow-up question)
3. The question metadata: category, depth, tags

Output as JSON:
{
  "acknowledgment": "...",
  "question_text": "...",
  "question_category": "...",
  "question_depth": 1|2|3,
  "question_tags": ["...", "..."],
  "rationale": "Why this question follows from the user's previous answer"
}
```

### Follow-Up Question Logic

When a user's response to a question contains a significant emotional signal (detected via keyword + sentiment score), the AI may choose to follow up rather than proceed to the next planned question. Follow-up rules:

- Maximum 1 follow-up per original question (do not spiral)
- Follow-up eligibility is defined in the question bank metadata
- Follow-up counts toward the 20-question total
- Follow-ups should reference the user's exact words: "You said '...' — what would it mean if that actually changed?"

### Tone Calibration

The AI calibrates its tone based on the user's response sentiment:
- **Neutral/positive responses:** Warm, engaged, curious tone
- **Negative/frustrated responses:** Empathetic tone, slower pacing, shorter acknowledgments
- **Highly emotional responses:** Pause, acknowledge emotion first before moving to next question

---

## 6. Adaptive Question Logic — Decision Tree

### Phase 1 (Questions 1–6): Context Establishment

Questions 1–3 are always from the work style and values categories (depth ≤ 2). Question 4 branches based on the user's identified situation type:

```
Q4 Branch Decision:
IF situation_type == "career_transition"
  THEN select from: Career-adjacent values questions (depth 2)
ELSE IF situation_type == "creative_project"
  THEN select from: Desire and work style questions (depth 2)
ELSE IF situation_type == "general_life_direction"
  THEN select from: Values and patterns questions (depth 2)
ELSE
  THEN select from: Values questions (depth 2, broad)
```

Questions 5–6 are selected to introduce the first fear/desire dimension based on initial signals.

### Phase 2 (Questions 7–14): Pattern and Theme Detection

After each answer in Phase 2, the theme detector runs and updates the `theme_candidates` array. Each theme has a candidate score (0–100).

**Theme Detection Rules:**
- A theme is added to candidates when 2+ responses contain semantic signals associated with it
- A theme's confidence increases by 15 points for each additional confirming signal
- A theme's confidence decreases by 10 points when a response contradicts it
- At Question 10, `theme_candidates` with score ≥ 50 are elevated to `primary_themes`

**Phase 2 Question Selection:**
- If `primary_themes` is empty: continue broad exploration (all 5 categories, random weighted)
- If `primary_themes` has 1–2 items: 60% of subsequent questions focus on these themes
- If `primary_themes` has 3+ items: 80% of subsequent questions focus on top 2 by score

### Phase 3 (Questions 15–20): Desire Clarification and Vision

Phase 3 questions are explicitly desire-category focused, with depth 2–3. The goal is to surface concrete, actionable vision statements.

**Phase 3 Mandatory Question Set (at least 2 of these 4 must appear in Phase 3):**
1. "Imagine it's 3 years from now and things are significantly better. What specifically is better? Be as concrete as you can."
2. "Is there something you've been putting off until you're 'ready' — and you know you're probably never going to feel ready?"
3. "What kind of problem do you most want to be spending your time solving — even if you don't currently know how?"
4. "If you started something new tomorrow, what's the most honest thing you can say about why you haven't started yet?"

**Phase 3 Final Question (always Q20):**
"Looking at everything we've talked about today — what's the one thing that, if it changed, would make the biggest difference to how you feel about your life?"

This closing question is designed to produce the user's own summary of their core desire. The answer to Q20 is given double weight in the insight confidence scoring.

---

## 7. Insight Generation Algorithm

After Question 20, the system runs the full insight generation pipeline.

### Step 1: Theme Extraction

**Input:** Full conversation transcript (20 Q&A pairs)
**Method:** The AI model is given the transcript with this instruction:

```
Analyze this Discovery Session transcript. Identify the 3–7 most significant themes
about this person's desires, values, fears, and patterns. For each theme:
1. Name it in simple language (not psychological jargon)
2. Write a 2–3 sentence explanation of what you observed
3. List the specific user statements (direct quotes) that evidence this theme
4. Assign a raw confidence score (0–100) based on how consistently and strongly this theme appeared

Output as JSON array of theme objects.
```

### Step 2: Confidence Weighting

Each raw confidence score from the AI is adjusted using the following rules:

| Signal Type | Score Modifier |
|-------------|---------------|
| Theme appeared in Q20 answer | +25 |
| Theme appeared in Phase 3 (Q15–20) | +15 |
| Theme appeared in 3+ separate answers | +20 |
| User expressed emotional intensity (detected via sentiment) | +10 |
| User mentioned the theme unprompted (not in response to a question about it) | +15 |
| Theme only mentioned once | -20 |
| Theme appeared in only Phase 1 (Q1–6) | -10 |

Final confidence score = raw score + sum of modifiers, clamped to [0, 100].

### Step 3: Filtering

- Themes with final confidence ≥ 60: included in insight profile
- Themes with confidence 40–59: flagged as "emerging signals" (not in profile, but stored)
- Themes with confidence < 40: discarded

**Fallback:** If fewer than 3 themes reach the ≥ 60 threshold, the top 3 by score are included regardless of threshold (with a lower confidence indicator shown to the user).

### Step 4: Language Synthesis

The AI generates the user-facing summary for each theme using the user's own language where possible:

```
For this insight theme, write a 2–3 sentence explanation that:
1. Names the insight clearly (not as a problem, as a truth about this person)
2. References what the user said in their own words (use a direct quote if possible)
3. Explains why this matters for their next project
Use warm, direct language. No jargon. No psychobabble.
```

### Step 5: Insight Profile Output

```json
{
  "user_id": "uuid",
  "session_id": "uuid",
  "generated_at": "2026-03-02T14:30:00Z",
  "insights": [
    {
      "id": "uuid",
      "theme_label": "Creative autonomy over institutional stability",
      "description": "Throughout your session, a clear pattern emerged: you feel most alive when you are making things on your own terms. You described flow states exclusively in self-directed work — building, writing, designing — not in collaborative or institutional contexts. This suggests your next meaningful project should give you significant ownership and creative control.",
      "user_quote": "When I'm working on something that's actually mine, hours disappear.",
      "confidence_score": 87,
      "confidence_label": "High",
      "tags": ["autonomy", "creativity", "flow_state"],
      "supporting_question_ids": ["q3", "q8", "q14", "q20"]
    }
  ],
  "emerging_signals": [
    {
      "theme_label": "Unresolved relationship with financial security",
      "confidence_score": 52,
      "note": "Not strong enough to feature, but worth revisiting in next session"
    }
  ]
}
```

---

## 8. Confidence Scoring System

### Scoring Dimensions

The confidence score represents how reliably a theme was identified across the session. It is a composite of four dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Frequency** | 30% | How many separate questions surfaced this theme |
| **Consistency** | 25% | Whether the user's statements align (vs. contradict) across questions |
| **Emotional intensity** | 25% | How emotionally charged the user's language was when touching this theme |
| **Explicitness** | 20% | Whether the user stated it directly vs. it being inferred |

### Score Thresholds

| Score | Label | Action |
|-------|-------|--------|
| 80–100 | Very High | Show with "Strong signal" indicator |
| 60–79 | High | Show with "Clear signal" indicator |
| 40–59 | Medium | Store as emerging signal; not shown in profile by default |
| < 40 | Low | Discarded |

---

## 9. UI/UX Requirements

### Session Interface

**Screen Layout:**
- Single-question view: full screen, no persistent navigation
- Status bar: minimal (question number indicator only)
- Background: calm, warm color (light sand or off-white)
- Typography: large, readable; minimum 18px body text
- AI messages: left-aligned, distinct background color (light sage or similar)
- User messages: right-aligned, distinct background color

**Question Display Animation:**
- Typewriter effect: 40ms per character
- Acknowledgment text appears first, typewriter
- Line break (500ms pause)
- Question text appears, typewriter
- After question is fully displayed: input area activates with subtle fade-in

**Input Area:**
- Text input: full-width, auto-expanding (minimum 3 lines)
- Placeholder: "Type your answer here..."
- Word count: not shown (removes performance anxiety)
- "Send" button: grayed out until ≥ 3 words or a selection is made
- "Pause Session" button: always visible, bottom-left corner, small but accessible

**Selection Input (when offered):**
- AI may offer 3–5 response options as tappable chips
- Free text always available in addition to chips
- Selecting a chip populates it into the text field (not auto-submits)

**Progress Indicator:**
- Bottom of screen: small dots (questions 1–20)
- Dots fill in as questions are answered
- Does not show a countdown ("5 more to go") to avoid pressure
- Tapping the progress dots shows: "Question X of 20"

**Pause Screen:**
- Full-screen overlay: "Your session is saved."
- Brief description: "You can return anytime in the next 7 days. We'll send you a reminder in 24 hours."
- "Resume Now" and "Exit" CTAs

### Insight Summary Interface

**Layout:**
- Cards: each insight on its own card, scrollable list
- Card contents: theme label (H2), description paragraph, confidence indicator (icon + label), user quote (italicized, indented)
- Edit button (pencil icon): top-right of each card
- Remove button: accessible from expanded card or swipe-left gesture

**Confidence Indicator:**
- Visual: horizontal bar (like a strength meter)
- Labels: "Strong Signal" / "Clear Signal" (no "Low" shown to users)
- Tooltip on tap: "This insight appeared consistently across X of your answers"

**Action Bar:**
- Bottom of screen (fixed): "Everything looks right" CTA (primary) + "Edit more" (secondary link)
- After tapping "Everything looks right": confirmation message appears + transition to project generation

---

## 10. API Endpoints

### POST /api/v1/sessions

Create a new Discovery Session.

**Request:**
```json
{
  "user_id": "uuid",
  "context": {
    "situation_type": "career_transition",
    "duration": "3-12_months",
    "prior_attempts": ["journaling", "productivity_apps"]
  }
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "status": "created",
  "phase": 1,
  "next_question_number": 1,
  "opening_message": "...",
  "first_question": {
    "id": "q_001",
    "text": "...",
    "category": "values",
    "depth": 1
  }
}
```

---

### POST /api/v1/sessions/{session_id}/answers

Submit an answer and receive the next question.

**Request:**
```json
{
  "question_id": "q_001",
  "question_number": 1,
  "answer_text": "User's free text answer",
  "answer_duration_seconds": 45,
  "answer_type": "free_text"
}
```

**Response:**
```json
{
  "question_number": 2,
  "acknowledgment": "...",
  "question": {
    "id": "q_014",
    "text": "...",
    "category": "desires",
    "depth": 2
  },
  "session_status": "in_progress",
  "phase": 1,
  "themes_detected": []
}
```

**Error Responses:**
- 400: Invalid answer (too short — < 3 words for free text, no selection for chip input)
- 404: Session not found
- 409: Session already completed or expired
- 503: AI service unavailable (return 503 with `{"fallback": true, "fallback_question": {...}}`)

---

### POST /api/v1/sessions/{session_id}/pause

Pause an in-progress session.

**Request:** `{}`

**Response:**
```json
{
  "status": "paused",
  "resume_by": "2026-03-09T14:30:00Z",
  "last_question_number": 12,
  "resume_url": "https://app.soc.ai/session/resume/{session_id}"
}
```

---

### POST /api/v1/sessions/{session_id}/resume

Resume a paused session.

**Response:**
```json
{
  "session_id": "uuid",
  "status": "in_progress",
  "next_question_number": 13,
  "recap": {
    "last_question": "...",
    "last_answer_summary": "You mentioned feeling most alive when working independently..."
  },
  "next_question": {...}
}
```

---

### GET /api/v1/sessions/{session_id}/insights

Get the generated insight profile after session completion.

**Response:**
```json
{
  "session_id": "uuid",
  "status": "completed",
  "insights": [...],
  "emerging_signals": [...],
  "generation_metadata": {
    "generated_at": "2026-03-02T14:55:00Z",
    "ai_model_version": "gpt-4o-2025-11",
    "total_tokens_used": 8432
  }
}
```

---

### PATCH /api/v1/sessions/{session_id}/insights/{insight_id}

Edit an insight in the profile.

**Request:**
```json
{
  "description": "Updated description by user",
  "theme_label": "Updated theme label",
  "user_action": "edited"
}
```

---

### DELETE /api/v1/sessions/{session_id}/insights/{insight_id}

Remove an insight from the profile (archives it, does not delete).

**Response:** `{"status": "archived", "insight_id": "uuid"}`

---

## 11. Database Schema

### Table: discovery_sessions

```sql
CREATE TABLE discovery_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status                VARCHAR(20) NOT NULL DEFAULT 'created'
                        CHECK (status IN ('created', 'in_progress', 'paused', 'completed', 'expired', 'abandoned')),
  phase                 INTEGER NOT NULL DEFAULT 1 CHECK (phase IN (1, 2, 3)),
  current_question_num  INTEGER NOT NULL DEFAULT 0,
  context_data          JSONB NOT NULL DEFAULT '{}',
  session_number        INTEGER NOT NULL DEFAULT 1,  -- 1 = first session, 2 = re-run, etc.
  paused_at             TIMESTAMPTZ,
  resumed_at            TIMESTAMPTZ,
  pause_count           INTEGER NOT NULL DEFAULT 0,
  expires_at            TIMESTAMPTZ,                 -- set when paused (+ 7 days)
  completed_at          TIMESTAMPTZ,
  total_duration_sec    INTEGER,                     -- null until completed
  ai_model_version      VARCHAR(50),
  total_tokens_used     INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON discovery_sessions(user_id);
CREATE INDEX idx_sessions_status ON discovery_sessions(status);
```

### Table: session_answers

```sql
CREATE TABLE session_answers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            UUID NOT NULL REFERENCES discovery_sessions(id) ON DELETE CASCADE,
  question_id           VARCHAR(50) NOT NULL,        -- references question bank
  question_number       INTEGER NOT NULL,
  question_text         TEXT NOT NULL,               -- stored verbatim at time of delivery
  question_category     VARCHAR(30) NOT NULL,
  question_depth        INTEGER NOT NULL CHECK (question_depth IN (1, 2, 3)),
  question_tags         TEXT[] NOT NULL DEFAULT '{}',
  answer_text           TEXT NOT NULL,
  answer_type           VARCHAR(20) NOT NULL DEFAULT 'free_text'
                        CHECK (answer_type IN ('free_text', 'chip_selection', 'hybrid')),
  answer_duration_sec   INTEGER,                     -- time taken to write answer
  answer_word_count     INTEGER,
  sentiment_score       DECIMAL(5,4),               -- -1.0 to 1.0
  sentiment_label       VARCHAR(20),                -- positive, neutral, negative, mixed
  emotional_intensity   DECIMAL(5,4),               -- 0.0 to 1.0
  ai_acknowledgment     TEXT,                        -- stored for session review
  themes_detected       JSONB NOT NULL DEFAULT '[]', -- [{theme, score}] after each answer
  is_follow_up          BOOLEAN NOT NULL DEFAULT FALSE,
  parent_question_id    VARCHAR(50),                 -- if is_follow_up = true
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_session_id ON session_answers(session_id);
CREATE INDEX idx_answers_category ON session_answers(question_category);
```

### Table: insight_profiles

```sql
CREATE TABLE insight_profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            UUID NOT NULL UNIQUE REFERENCES discovery_sessions(id),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insights              JSONB NOT NULL DEFAULT '[]',
  emerging_signals      JSONB NOT NULL DEFAULT '[]',
  raw_ai_output         TEXT,                        -- full AI response before processing
  generation_duration_ms INTEGER,
  ai_model_version      VARCHAR(50),
  total_tokens_used     INTEGER,
  user_edited           BOOLEAN NOT NULL DEFAULT FALSE,
  user_confirmed_at     TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_insight_profiles_user_id ON insight_profiles(user_id);
```

### Table: insight_items (normalized insight storage)

```sql
CREATE TABLE insight_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            UUID NOT NULL REFERENCES insight_profiles(id) ON DELETE CASCADE,
  session_id            UUID NOT NULL REFERENCES discovery_sessions(id),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_label           VARCHAR(200) NOT NULL,
  description           TEXT NOT NULL,
  user_quote            TEXT,
  raw_confidence_score  INTEGER NOT NULL CHECK (raw_confidence_score BETWEEN 0 AND 100),
  final_confidence_score INTEGER NOT NULL CHECK (final_confidence_score BETWEEN 0 AND 100),
  confidence_label      VARCHAR(20) NOT NULL,
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  supporting_question_ids TEXT[] NOT NULL DEFAULT '{}',
  status                VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'archived', 'user_removed')),
  user_edited           BOOLEAN NOT NULL DEFAULT FALSE,
  original_description  TEXT,                        -- preserved if user edits
  display_order         INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_insight_items_profile_id ON insight_items(profile_id);
CREATE INDEX idx_insight_items_user_id ON insight_items(user_id);
CREATE INDEX idx_insight_items_status ON insight_items(status);
```

---

## 12. Edge Cases and Error Handling

### Scenario 1: User submits very short answers (< 10 words)

**Detection:** Word count check on answer submission.
**Response strategy:** AI acknowledgment uses a gentle probe rather than moving to new question:
- "Can you say a bit more about that? I want to make sure I understand."
- If short answer repeats (second time on same question): proceed to next question anyway; log flag `short_answer_pattern = true` for adaptive logic
- If short answers dominate first 5 questions: switch to offer-options format for remaining questions

### Scenario 2: User answer contains crisis keywords

**Detection:** Real-time keyword match against crisis keyword list (maintained separately; not AI-generated)
**Crisis keywords include (partial list):** self-harm, suicidal, end my life, don't want to exist, no reason to continue, hurt myself

**Response:**
1. Session pauses immediately after answer is submitted
2. Full-screen overlay appears: "Thank you for trusting me with that. SOC is a tool for growth, and right now it sounds like you might need more support than a growth tool can provide. Please reach out to someone who can help."
3. Resources displayed: Crisis Text Line, Samaritans (UK), 988 Lifeline (US), local equivalents
4. Options: "I'm okay to continue" | "I'll reach out for support"
5. If user chooses to continue: session resumes; system logs `crisis_flag = true` for internal monitoring
6. Admin notified for sensitive case review (anonymized; no PII in notification)

### Scenario 3: AI API returns error or timeout

**Detection:** HTTP 500/503 or response timeout > 45 seconds
**Fallback Strategy:**
1. Display: "SOC is thinking... hang tight." (up to 30 seconds)
2. After 30 seconds: "We're having a moment. Let's keep going — here's the next question."
3. Fallback question selected from pre-cached fallback set (10 curated questions per category, always loaded at session start)
4. Error logged; retry with exponential backoff (1s, 2s, 4s)
5. If 3 consecutive failures: session pauses with message: "Something went wrong on our end. Your answers are saved — please try again in a few minutes."
6. Alert sent to on-call engineer

### Scenario 4: User edits or submits a previous answer

**Design decision:** Users cannot modify previous answers once submitted (prevents endless revision anxiety).
**Implementation:** Previous Q&A pairs are displayed read-only in the conversation scroll view.
**User communication:** "Your previous answers are saved. Keep going — the session adapts as you go."

### Scenario 5: Session expires after 7-day pause

**Detection:** Daily cron job checks `expires_at` on paused sessions
**User notification:** Email + push notification 24 hours before expiry: "Your Discovery Session expires tomorrow. Resume now to pick up where you left off."
**On expiry:** Status set to `expired`. If user tries to resume: "This session has expired. You can start a fresh Discovery Session — your previous answers are archived."
**Data:** Archived, not deleted. Available for admin review and future model improvements (if user consented).

### Scenario 6: Fewer than 3 insights meet confidence threshold

**Detection:** After insight generation, < 3 insights have confidence ≥ 60
**Response:** Include the top 3 insights by score regardless of threshold. Display with a modified confidence label: "Emerging" instead of "Clear Signal" or "Strong Signal".
**User communication:** "We detected some strong starting points. These insights may deepen as you use SOC over time."

### Scenario 7: Duplicate session attempt (within 30-day cooldown)

**Detection:** Check `discovery_sessions` for completed sessions in last 30 days for this user
**Free users:** Cooldown is 90 days. Show countdown: "Your next Discovery Session unlocks in 45 days."
**Paid users:** Cooldown is 30 days. Same countdown displayed.
**User bypass request:** No bypass in v1.0 (reduces insight quality if run too frequently)

---

## 13. Performance Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| AI question generation latency (p50) | ≤ 1.5 seconds | Server-side timing from request to response |
| AI question generation latency (p95) | ≤ 3.5 seconds | Server-side timing from request to response |
| Insight generation time | ≤ 30 seconds | From Q20 submission to insight profile ready |
| Session state save latency | ≤ 200ms | Write to database after each answer |
| Session resume latency | ≤ 1 second | From resume request to question display |
| API endpoint response time (non-AI) | ≤ 300ms (p95) | Server-side timing |
| Maximum concurrent active sessions | 2,000 (v1.0) | Load testing target |
| Session data storage per session | ≤ 50KB | Including all answers and AI responses |

### Caching Strategy

- Question bank: Cached in Redis, refreshed every 24 hours
- Fallback questions: Pre-loaded at session start, stored client-side (10 per category)
- User context: Cached in session store for duration of active session
- Insight profile: Cached after generation; cache invalidated on user edit

---

## 14. Testing Scenarios

### Functional Tests

| ID | Scenario | Expected Result |
|----|----------|----------------|
| T-001 | User completes all 20 questions without pause | Session status = completed; insight profile generated |
| T-002 | User pauses at Q12, resumes after 4 hours | Resumes at Q13; Q12 answer preserved |
| T-003 | User pauses at Q5, resumes after 8 days | Session expired message; new session must start |
| T-004 | User submits 3-word answer to Q4 | AI probes for more; does not advance to Q5 |
| T-005 | User includes crisis keyword in Q8 answer | Crisis overlay appears; session pauses |
| T-006 | AI API times out on Q6 | Fallback question delivered; session continues |
| T-007 | User edits 2 insights before confirming | Edits saved; project generation uses updated insights |
| T-008 | User removes 1 insight from summary of 3 | 2 insights remain; project generation proceeds (fallback insight sourced from emerging signals) |
| T-009 | User attempts second session within 30 days | Cooldown message displayed; current session unchanged |
| T-010 | All 20 questions answered; < 3 insights ≥ 60 confidence | Top 3 by score shown with "Emerging" label |

### Performance Tests

| ID | Scenario | Expected Result |
|----|----------|----------------|
| P-001 | 2,000 concurrent sessions, all submitting an answer simultaneously | p95 response time ≤ 3.5s; no errors |
| P-002 | Single session generates insights immediately after Q20 | Insight profile returned within 30 seconds |
| P-003 | 500 simultaneous session resumes | All resumes complete within 2 seconds |

### User Acceptance Tests

| ID | Scenario | Success Criteria |
|----|----------|-----------------|
| U-001 | First-time user completes session without help | User reports session felt "like a real conversation" |
| U-002 | User reviews insight summary | ≥ 80% report insights feel accurate without major edits |
| U-003 | User on mobile completes session with one hand | No interaction requires two-handed operation |
| U-004 | User with slow connection (3G) | Session functional; no lost answers |

---

## 15. Open Questions

1. **Question bank localization:** When we add Russian language support, do questions need to be retranslated by a native speaker, or can we use AI translation with human review? Quality bar for emotionally sensitive questions is very high.

2. **Audio/voice input:** Several test users requested voice input for longer, more natural answers. Is this in scope for v1.1 or v2.0? Voice would require significantly different NLP pipeline.

3. **Question bank expansion:** How often should the question bank be updated? Who owns this process? Should we build a question submission workflow for coaches/experts?

4. **Partner session sharing:** Some users asked if they could run the Discovery Session alongside a partner or coach and share results. Is this a use case we want to support, and if so, when?

5. **Multi-language session mixing:** If a user writes their answers partially in English and partially in Russian, how does the NLP pipeline handle this? Current assumption: English-only in v1.0.

6. **Rerun context injection:** When a user runs their second Discovery Session, how much context from Session 1 should be shared with the AI? Risk of anchoring on past insights vs. benefit of longitudinal continuity.
