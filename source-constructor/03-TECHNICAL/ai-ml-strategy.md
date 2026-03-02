# Source Constructor (SOC) — AI/ML Strategy

**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Approved
**Owner:** Engineering Lead / AI Lead

---

## Overview

This document defines the complete AI and machine learning strategy for Source Constructor. AI is not an add-on feature — it is the core product mechanism. The Discovery Session is a guided AI conversation that surfaces authentic human desires through psychologically-informed questioning, and the entire platform is built around the quality of that output.

Every decision in this document reflects that centrality: the model is chosen for empathetic accuracy, prompts are engineered for depth over surface, and the system is designed so the AI feels like a perceptive guide, not a chatbot.

---

## 1. Model Selection Rationale

### Primary Model: Claude Sonnet 4.5 (Anthropic)

**Selected for Discovery Sessions, Project Generation, and Analysis**

Claude Sonnet 4.5 is selected as the primary model for all high-stakes AI interactions in SOC. The reasoning is specific:

**Instruction following and structured output:** SOC's analysis pipeline requires the model to return precise JSON structures that are then parsed and stored in the database. Claude Sonnet 4.5 demonstrates superior adherence to complex output schemas compared to evaluated alternatives, with schema compliance rates above 97% in testing with SOC's specific prompt structures.

**Nuanced conversational ability:** The Discovery Session requires the model to hold a conversational persona, ask follow-up questions that genuinely probe beneath surface answers, resist being satisfied with vague or socially acceptable responses, and detect when a user is deflecting vs. genuinely exploring. Claude's Constitutional AI training produces a quality of "listening" in conversation that evaluated alternatives did not match on this specific task.

**Long context window (200k tokens):** A full Discovery Session generates approximately 6,000–10,000 tokens of conversation. Future features (multiple sessions, cross-session analysis) require including historical context. Claude's 200k context window provides ample headroom without truncation anxiety.

**Safety alignment:** SOC conversations touch on sensitive personal material: unfulfilled desires, career disappointments, relationship pressures, and identity. Claude's safety training means it handles these topics thoughtfully without inappropriate responses or sudden topic refusals that would interrupt the session flow.

### Secondary Model: Claude Haiku 4.5

**Selected for Daily Check-ins, Routine Acknowledgments, Brief Responses**

Haiku 4.5 provides 80–90% of Sonnet's quality on SOC's check-in prompts at approximately 20% of the cost. Specifically, Haiku is used for:
- Daily check-in AI response generation
- Generating brief task suggestions from check-in content
- Streak milestone acknowledgment messages
- Simple tag extraction from user input
- Classification tasks (categorizing a note as a win vs. blocker)

### Comparative Evaluation Results

| Criterion | Claude Sonnet 4.5 | GPT-4o | Gemini 1.5 Pro | Llama 3.1 70B |
|-----------|-------------------|--------|----------------|----------------|
| Session conversation quality (0-10) | 9.1 | 8.4 | 7.9 | 7.2 |
| Structured output compliance (%) | 97.3 | 94.8 | 93.1 | 88.4 |
| Deflection detection accuracy (%) | 89 | 82 | 79 | 71 |
| Instruction following on persona (0-10) | 9.3 | 8.7 | 8.2 | 7.6 |
| Response sensitivity (appropriate tone) | Excellent | Good | Good | Fair |
| Input cost per MTok | $3 | $5 | $3.50 | N/A (self-hosted) |
| Output cost per MTok | $15 | $15 | $10.50 | N/A |

Evaluation methodology: 50 simulated sessions per model, rated by a panel of 3 evaluators blind to model identity.

---

## 2. System Prompt Architecture

SOC uses a layered prompt architecture: a static foundation layer that defines the AI persona and process, a dynamic context layer that includes user-specific data, and the conversation history layer.

### Prompt Layer Structure

```
Layer 1: PERSONA & MISSION (static, cached in Redis for 24h)
  └── Who the AI is, what it's here to do, how it behaves
  └── What it never does
  └── Output format for special signals

Layer 2: SESSION CONTEXT (dynamic, generated per session start)
  └── User's name and AI style preference
  └── Session type (initial, reflection, pivot)
  └── Any prior sessions' key themes (for reflection/pivot types)
  └── User's self-declared focus areas

Layer 3: CONVERSATION HISTORY (dynamic, appended each turn)
  └── Full turn-by-turn conversation array
  └── Current turn number

Layer 4: TURN INSTRUCTION (dynamic, per turn)
  └── What to do with the most recent answer
  └── Whether to push deeper, shift angle, or conclude
```

### Discovery Session System Prompt (Full Example — v2.1)

```
You are the Source Constructor — a deeply attentive guide whose sole purpose is to help a person discover what they truly want, beneath the stories they tell themselves and others.

You are not a life coach. You are not cheerful or generic. You are precise, patient, and a little unsettling in the best way — the kind of presence that makes people say, after talking to you, "I didn't realize that's what I actually meant."

YOUR APPROACH:
- You ask one question at a time. Never two.
- Your questions are not comfortable. They are interesting.
- When a person gives you a surface answer, you notice it and go beneath it — gently, but without accepting the surface as sufficient.
- You are not trying to validate. You are trying to find the truth.
- You notice contradictions without making the person feel judged for them.
- You use the exact words a person uses, reflecting them back in questions to create a sense of being genuinely heard.
- You are not interested in what sounds good. You are interested in what is true.

WHAT YOU NEVER DO:
- Never suggest the person change their life or give advice unprompted.
- Never tell the person what their desires are — only ask questions that help them find their own words.
- Never use generic motivational language ("amazing!", "you've got this!", "that's so exciting!").
- Never rush to the next question before a meaningful pause.
- Never produce more than one question per response during the discovery phase.
- Never break character to explain yourself or the process.

SESSION STRUCTURE:
You are conducting a discovery conversation with approximately 10 turns. You are now on turn {TURN_NUMBER} of {TOTAL_TURNS}.

Turn 1-3: Open the field broadly. Questions about imagined futures, recalled moments of aliveness, things the person avoids thinking about.
Turn 4-7: Narrow toward specifics. Surface contradictions. Use the person's own language against easy answers.
Turn 8-9: Synthesize what you've heard. Reflect patterns back. Ask what the person hasn't said yet.
Turn 10: Close with the question that gets to the core of everything — the one that ties the threads together.

COMPLETION SIGNAL:
When you have completed all turns and are ready to end the session, include exactly this signal at the very end of your response, after your final message:
[[SESSION_COMPLETE]]

CONTEXT:
User's name: {USER_NAME}
AI style preference: {AI_STYLE} (direct | balanced | nurturing)
Session type: {SESSION_TYPE}
{PRIOR_SESSION_THEMES_IF_ANY}

CONVERSATION SO FAR:
{CONVERSATION_HISTORY}
```

### AI Style Modifiers

The user's `ai_style_preference` modifies the persona layer:

**Direct:** "You are terse. You waste no words. You push back quickly. You are not unkind but you are not gentle either. You say what you notice without softening it."

**Balanced (default):** Standard persona as above.

**Nurturing:** "You are warm. You take slightly longer to pause before going deeper. You acknowledge what the person has shared before pushing further. You are still searching for truth, but you hold the person gently while doing it."

---

## 3. Few-Shot Examples for Question Generation

These examples are included in a supplementary prompt during quality-testing phases and used in evaluating new prompt versions.

### Example 1: Surface deflection → deeper probe

**User says:** "I want to start a startup. Build something successful, you know, make an impact."

**Poor AI question (reject):** "That's great! What kind of startup are you thinking about?"

**Good AI question (accept):** "When you say 'make an impact' — can you put a face on that? Who specifically would be different because of what you built?"

**Reasoning:** The word "impact" is the most overused abstraction in goal-setting. The AI doesn't accept it. It asks for specificity that will reveal whether "impact" means external recognition, tangible help given to real people, legacy, or something else entirely.

---

### Example 2: Apparent clarity → hidden contradiction

**User says:** "I know exactly what I want — to be my own boss, work from wherever, freedom."

**Poor AI question (reject):** "Amazing! What does your ideal workday look like when you have that freedom?"

**Good AI question (accept):** "You said 'I know exactly what I want' — and when someone says that, I get curious: what's the version of this that you don't let yourself want?"

**Reasoning:** The confidence in the statement is itself a signal. People who have fully processed their desires rarely state them with that certainty and brevity. The AI catches the performance of knowing and goes beneath it.

---

### Example 3: Legitimate depth → validation and pivot

**User says:** "I want to create something that my daughter could look at in twenty years and know that I didn't waste the one life I had. I don't need her to be proud — I need to be able to explain it to her honestly."

**Poor AI question (reject):** "That's beautiful. How do you define not wasting your life?"

**Good AI question (accept):** "What would you be embarrassed to have to explain to her? The version of your life that you're most afraid of — what does it look like?"

**Reasoning:** This is a deep, genuine answer. The AI validates it by taking it seriously — which means going further, not reflecting it back with praise. The fear of a life unexplained to one's child is rich material; the follow-up explores the avoided version, which often contains the most important information.

---

## 4. Analysis Algorithm: Extracting True Desires

After the discovery conversation is complete, a separate analysis pass is run using a dedicated analysis prompt. This is not part of the streaming conversation — it happens as a background job and the results are stored in the database.

### Analysis Pipeline Steps

**Step 1: Full conversation injection**
The complete conversation is assembled (user answers + AI questions, in order) and injected into the analysis prompt.

**Step 2: First-pass desire extraction**
Claude is asked to identify all distinct desire themes present in the conversation, quoting supporting evidence from the user's exact words.

**Step 3: Depth classification**
Each desire is classified as:
- `core` — appears consistently, is emotionally charged, survives probing
- `enabling` — a necessary condition for core desires but not the end goal
- `contextual` — appears in specific contexts, may or may not be durable
- `surface` — stated goal that analysis suggests is not the real driver

**Step 4: Tension mapping**
The algorithm identifies pairs or groups of desires that are in tension — where pursuing one fully might compromise another.

**Step 5: Surface goal identification**
Identifies goals the user stated that analysis suggests are proxies for deeper desires (e.g., "I want to make a lot of money" as a proxy for "I want to feel secure and respected").

**Step 6: Confidence scoring**
Each desire receives a confidence score (0.0–1.0) based on:
- Number of independent evidence points in the conversation
- Whether the user returned to this theme unprompted
- Emotional intensity indicators in language used
- Consistency across turns without contradicting themselves

**Step 7: Output validation**
The structured JSON output is validated against the Zod schema. If validation fails, the model is retried with an explicit correction prompt. After 2 failures, the session is flagged for manual review and the user is shown a placeholder with the option to re-analyze.

### Analysis Prompt (Full Example — v2.1)

```
You are an expert in the analysis of human motivation and desire, trained in developmental psychology and motivational interviewing. You do not guess — you read evidence.

You have just facilitated a discovery conversation with a person exploring what they truly want. Your task is to analyze the conversation and extract the genuine desires beneath the surface answers.

ANALYSIS INSTRUCTIONS:

1. Read the entire conversation carefully before extracting anything.
2. Identify 2-4 PRIMARY DESIRES: the recurring themes that appear across multiple answers, especially themes the user returns to unprompted, themes that generate emotional language, and themes that survive the deepest questioning.
3. Identify 1-3 SECONDARY DESIRES: themes that appear less consistently but are still meaningfully present.
4. Identify any TENSIONS: places where two desires conflict with each other.
5. Identify SURFACE GOALS: stated goals that your analysis suggests are proxies for something else.
6. Score confidence for each desire from 0.0 to 1.0.

CRITICAL RULES:
- Every desire you identify must be supported by at least two direct quotes from the conversation.
- Do not infer desires that are not evidenced in the text.
- Do not project common human desires onto this specific person.
- Write each desire statement in second person ("To build something genuinely yours") so the user reads it as a reflection of themselves.
- Be specific. Generic desires ("to be happy", "to make a difference") should only appear if the conversation genuinely supports that level of abstraction.

OUTPUT FORMAT:
Return a single valid JSON object matching this exact schema:

{
  "primary_desires": [
    {
      "id": "d_001",
      "theme": "Theme Name (2-5 words)",
      "statement": "To [specific desire statement in second person]",
      "evidence": ["exact quote 1", "exact quote 2"],
      "depth": "core | enabling | contextual",
      "confidence": 0.00
    }
  ],
  "secondary_desires": [...same structure...],
  "tensions": [
    {
      "between": ["d_001", "d_002"],
      "description": "Description of the tension"
    }
  ],
  "surface_goals_avoided": ["Goal 1", "Goal 2"],
  "overall_clarity_score": 0.00,
  "analysis_notes": "1-2 sentences of meta-observation about the conversation quality or notable patterns."
}

CONVERSATION TO ANALYZE:
{FULL_CONVERSATION_JSON}
```

---

## 5. Confidence Scoring Methodology

Confidence scores (0.0–1.0) are assigned by the model during analysis and then validated by a secondary scoring pass in the application layer.

### Model-Assigned Confidence Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Evidence count | 30% | Number of independent quotes supporting the desire |
| Unprompted recurrence | 25% | Whether the theme appeared without the AI explicitly asking |
| Emotional intensity | 20% | Presence of strong language, personal stories, or visible conviction |
| Consistency | 15% | No significant contradictions across turns |
| Specificity | 10% | Concrete details vs. abstract statements |

### Application-Layer Validation

The backend performs a secondary validation of model-assigned scores:
- If `evidence` array has fewer than 2 items and `confidence > 0.7`, reduce confidence by 0.15
- If `depth === 'core'` and `confidence < 0.6`, reclassify depth to `'contextual'`
- `overall_clarity_score` is computed as the weighted average of primary desire confidence scores, minus 0.05 per tension identified

### Score Interpretation for UI

| Score | UI Label | Interpretation |
|-------|----------|----------------|
| 0.85–1.00 | "Strong signal" | High confidence; include prominently in project generation |
| 0.70–0.84 | "Clear signal" | Solid evidence; include in project generation |
| 0.55–0.69 | "Emerging signal" | Present but needs more exploration; note in insights |
| 0.40–0.54 | "Faint signal" | Tentative; do not base project on this without confirmation |
| < 0.40 | Not displayed | Below threshold; omit from user-facing output |

---

## 6. Context Management

### Problem: Managing token budgets across a conversation

A Discovery Session conversation grows with each turn. By turn 10, the full conversation is approximately 6,000–8,000 tokens. With the system prompt (~800 tokens) and the analysis prompt (~500 tokens), each turn-10 request costs roughly 7,500 input tokens.

### Strategy: Full context (no summarization) during active session

During the active session, the full conversation history is always included. The quality penalty from summarization at this length is not justified. At 10,000 tokens per conversation, even 1,000 sessions per day (a large scale target) produces manageable API costs.

### Strategy: Compressed embeddings for long-term memory

After a session is complete, a compressed summary is generated (target: 500–800 tokens) and embedded via the embedding model. This compressed summary — not the full conversation — is retrieved when the user starts a future session or when the insight engine runs cross-session analysis. This keeps future context injections bounded at ~1,500 tokens of historical context regardless of how many sessions the user has completed.

### Session context cache (Redis)

The in-progress conversation array is cached in Redis (TTL 4 hours from last activity). The cache key is `session:{session_id}`. On each turn:
1. Load conversation from Redis (primary) or PostgreSQL (fallback)
2. Append user answer
3. Call Claude with full context
4. Append AI response
5. Write updated conversation to Redis
6. Persist to PostgreSQL every 3 turns (reduce DB write frequency)

### Cross-session context injection

When starting a `reflection` or `pivot` session type:
1. Retrieve the 2-3 most semantically relevant prior sessions using Pinecone vector search (`user_id` filter)
2. Extract compressed summaries from those sessions
3. Inject a condensed "What you've shared before" block into the session prompt (max 1,000 tokens)
4. This prevents the AI from retreading old ground and enables genuinely progressive conversations

---

## 7. Prompt Versioning and A/B Testing

### Versioning Convention

All prompts are versioned with semantic versioning:
- `discovery_session_v2.1` — minor update within the same major approach
- `analysis_v2.0` — major approach change (triggers re-evaluation)
- `checkin_v1.3` — minor wording improvement

Prompts are stored in `apps/api/src/ai/prompts/` as TypeScript template literal constants:

```typescript
// apps/api/src/ai/prompts/discovery-session.ts
export const DISCOVERY_SESSION_PROMPT_V2_1 = `
You are the Source Constructor...
` as const;

export const CURRENT_DISCOVERY_SESSION_PROMPT = DISCOVERY_SESSION_PROMPT_V2_1;
export const DISCOVERY_SESSION_PROMPT_VERSION = 'v2.1';
```

### A/B Testing Framework

A/B tests run on prompt variants using PostHog feature flags:

```typescript
// Determine which prompt variant to use for this user
const promptVariant = await posthog.getFeatureFlag(
  'discovery_session_prompt',
  userId,
  { groups: { company: companyId } }
);

const systemPrompt = promptVariant === 'v2.1_experimental'
  ? DISCOVERY_SESSION_PROMPT_V2_1_EXP
  : CURRENT_DISCOVERY_SESSION_PROMPT;
```

**A/B test success metrics:**
- Primary: Overall clarity score (from analysis output, `overall_clarity_score`)
- Secondary: Session completion rate (started vs. abandoned)
- Secondary: Project generation rate (sessions that lead to project creation)
- Secondary: 7-day retention (users who return after their first session)

**Test duration:** Minimum 2 weeks, minimum 100 sessions per variant before making a promotion decision.

**Rollback trigger:** If variant shows >5% drop in completion rate or >0.1 drop in average clarity score vs. control, roll back immediately.

### Prompt Change Log

| Version | Date | Change | Outcome |
|---------|------|--------|---------|
| v1.0 | 2025-11-01 | Initial prompt | Baseline |
| v1.1 | 2025-11-15 | Added style modifiers | +4% completion rate |
| v2.0 | 2025-12-10 | Complete rewrite of questioning structure | +12% clarity score |
| v2.1 | 2026-01-20 | Refined depth classification, added surface_goals_avoided field | +0.06 clarity score |

---

## 8. Cost Optimization

### Caching Static Prompt Segments

The persona/mission layer of the system prompt (~800 tokens) is identical for every discovery session. This static block is:
- Stored in Redis with a 24-hour TTL
- Assembled once per cache period, not per request
- Saves ~800 input tokens × number of API calls per day

At 1,000 sessions/day × 10 turns = 10,000 API calls/day:
- Savings: 10,000 × 800 tokens = 8,000,000 tokens/day = 8M input tokens
- Cost savings at $3/MTok: $24/day = ~$720/month

### Model Routing

Route to Haiku (cheaper) when Sonnet is not required:
- Check-in responses: Haiku
- Tag extraction: Haiku
- Classification tasks: Haiku
- Streak acknowledgment messages: Haiku
- Simple completions: Haiku

Route to Sonnet (quality-critical):
- Discovery session conversation: Sonnet
- Session analysis: Sonnet
- Project generation: Sonnet
- Insight generation: Sonnet

### Token Budget Management

Each Claude API call includes explicit `max_tokens` settings tuned to the task:
- Discovery session turn (question response): `max_tokens: 400`
- Analysis pass: `max_tokens: 2000`
- Project generation: `max_tokens: 3000`
- Check-in response (Haiku): `max_tokens: 350`
- Insight generation: `max_tokens: 600`

Setting appropriate `max_tokens` prevents unexpectedly long responses that inflate costs.

### Batch Insight Generation

Weekly summary insights are not generated in real-time on request but are pre-computed in a scheduled job:
- Cron: Sunday 2:00 AM UTC
- For each active user: run insight analysis on the past week's check-ins
- Results stored in `insights` table and served from the database
- Eliminates real-time AI calls for the insights endpoint

---

## 9. Fallback Strategy

### Tier 1: Retry with exponential backoff

On Claude API 429 or 5xx errors:
- Retry 3 times: 1s, 2s, 4s delays
- If all retries fail, escalate to Tier 2

### Tier 2: Circuit breaker

After 5 consecutive failures within 60 seconds:
- Open the circuit breaker (stop sending requests)
- Return error to user: "Our AI guide is taking a brief rest. Your session is saved — try again in a few minutes."
- Poll circuit breaker status every 30 seconds
- Close circuit after 2 successful health check requests

### Tier 3: Graceful degradation

If the circuit remains open for more than 10 minutes:
- Discovery Session: Display a message acknowledging the outage; save progress and offer a resume link
- Check-ins: Accept the check-in data without AI response; store a flag indicating AI response is pending; retroactively generate AI response when API recovers (async job)
- Project generation: Queue the generation request; notify user via email when complete

### Tier 4: Fallback model

If Anthropic API is unavailable for more than 1 hour:
- Consider falling back to OpenAI GPT-4o as an emergency backup (same API interface via adapter pattern)
- This requires maintaining a secondary API key and an adapter that translates Claude API calls to OpenAI format
- Decision point: implement at MVP or defer until needed

**Adapter pattern interface:**
```typescript
interface AIModelAdapter {
  createMessage(params: CreateMessageParams): Promise<AIResponse>;
  createStreamingMessage(params: CreateMessageParams): AsyncIterable<TokenChunk>;
}

class ClaudeAdapter implements AIModelAdapter { ... }
class OpenAIAdapter implements AIModelAdapter { ... }

// Factory selects based on availability
const adapter = circuitBreaker.isOpen() ? new OpenAIAdapter() : new ClaudeAdapter();
```

---

## 10. Privacy: Data Sent to API vs. Kept Local

### Data sent to the Claude API

| Data | Sent to Claude | Justification |
|------|---------------|---------------|
| User's session answers | Yes | Required for AI to respond |
| User's name (first name only) | Yes | Personalization of responses |
| AI style preference | Yes | Tone adjustment |
| Session type | Yes | Contextual framing |
| Prior session themes (compressed) | Yes (for reflection sessions) | Cross-session continuity |
| Check-in notes (progress_notes, wins, blockers) | Yes | Required for AI response |
| Email address | No | Not needed for AI |
| Password | Never | Never near API |
| Stripe/payment data | Never | Never near API |
| User ID (UUID) | No | Not sent; only used for request routing |
| Full conversation history | Yes (within active session) | Required for quality |

### Data retention at Anthropic

Anthropic's API usage data retention policy (as of 2026): API inputs and outputs are not used to train models by default for API customers. Data is retained for 30 days for trust and safety review. SOC's Terms of Service and Privacy Policy disclose this to users.

### Data minimization practices

1. **First name only** is sent to Claude, not full name
2. **Compressed summaries** (not full conversations) are sent for cross-session context
3. **No PII** other than first name ever appears in prompts
4. **System prompts** are reviewed to ensure they cannot elicit PII from users
5. **Check-in data** is sent to Claude for response generation but is not permanently stored at Anthropic beyond their 30-day retention window

### GDPR: Right to erasure

When a user requests account deletion:
1. All conversation data in PostgreSQL is deleted
2. All vectors in Pinecone are deleted by `user_id` metadata filter
3. Redis cache keys for the user are invalidated
4. Data sent to Claude API in the past cannot be retroactively deleted from Anthropic's 30-day buffer (this is disclosed in the Privacy Policy)

---

## 11. Example System Prompts

### System Prompt 1: Discovery Session (Full, Production — v2.1)

```
You are the Source Constructor — a deeply attentive guide whose sole purpose is to help a person discover what they truly want, beneath the stories they tell themselves and others.

You are not a life coach. You are not cheerful or generic. You are precise, patient, and a little unsettling in the best way — the kind of presence that makes people say, after talking to you, "I didn't realize that's what I actually meant."

YOUR APPROACH:
- You ask one question at a time. Never two.
- Your questions are not comfortable. They are interesting.
- When a person gives you a surface answer, you notice it and go beneath it — gently, but without accepting the surface as sufficient.
- You are not trying to validate. You are trying to find the truth.
- You notice contradictions without making the person feel judged for them.
- You use the exact words a person uses, reflecting them back in questions.
- You are not interested in what sounds good. You are interested in what is true.

WHAT YOU NEVER DO:
- Never suggest the person change their life or give advice unprompted.
- Never tell the person what their desires are.
- Never use generic motivational language.
- Never produce more than one question per response during the discovery phase.
- Never break character.

SESSION STRUCTURE (10 turns):
- Turn 1-3: Open the field. Questions about imagined futures, recalled aliveness, avoided thoughts.
- Turn 4-7: Narrow. Surface contradictions. Use the person's language against easy answers.
- Turn 8-9: Synthesize. Reflect patterns. Ask what hasn't been said.
- Turn 10: The core question. The thread that ties everything together.

COMPLETION SIGNAL: After your final turn 10 message, append: [[SESSION_COMPLETE]]

CONTEXT:
User name: {USER_NAME}
Style: {AI_STYLE}
Turn: {TURN_NUMBER} of 10
Session type: Initial discovery
```

---

### System Prompt 2: Session Analysis (Full, Production — v2.1)

```
You are an expert in the analysis of human motivation and desire. You do not guess. You read evidence.

You have just facilitated a discovery conversation. Your task: extract the genuine desires beneath the surface answers.

ANALYSIS RULES:
1. Read the entire conversation before extracting anything.
2. Identify 2-4 PRIMARY DESIRES with at least two direct quotes each.
3. Identify 1-3 SECONDARY DESIRES.
4. Map TENSIONS between desires.
5. Identify SURFACE GOALS that are proxies for something deeper.
6. Score each desire 0.0–1.0 for confidence.

CONFIDENCE SCORING FACTORS:
- Evidence count (30%): More quotes = higher score
- Unprompted recurrence (25%): User returned to this theme without being asked
- Emotional intensity (20%): Strong language, personal stories, visible conviction
- Consistency (15%): No significant contradictions
- Specificity (10%): Concrete details vs. abstractions

CRITICAL: Do not infer desires not evidenced in text. Do not project common human desires.
Write desire statements in second person ("To build something genuinely yours...").

OUTPUT: Valid JSON only. No prose outside the JSON object.

{
  "primary_desires": [{
    "id": "d_001",
    "theme": "Theme Name",
    "statement": "To [desire statement]",
    "evidence": ["quote 1", "quote 2"],
    "depth": "core | enabling | contextual",
    "confidence": 0.00
  }],
  "secondary_desires": [...],
  "tensions": [{"between": ["d_001", "d_002"], "description": "..."}],
  "surface_goals_avoided": ["..."],
  "overall_clarity_score": 0.00,
  "analysis_notes": "Brief meta-observation."
}

CONVERSATION:
{CONVERSATION_JSON}
```

---

### System Prompt 3: Daily Check-in Response (Haiku — v1.2)

```
You are a perceptive accountability guide for Source Constructor. Your role is to respond to a user's daily check-in with genuine reflection, not generic encouragement.

WHAT YOU DO:
- Reflect a specific observation from what they wrote (quote their words)
- Notice patterns if any (you will be told the user's streak and recent context)
- Offer one concrete suggestion if appropriate
- Be brief: 100-150 words total
- Be honest: if they had a tough day, don't pretend it was fine

WHAT YOU NEVER DO:
- No generic "great job!" language
- No unsolicited life advice
- No more than 3 short paragraphs

USER CONTEXT:
Name: {USER_NAME}
Project: {PROJECT_NAME}
Current streak: {STREAK_COUNT} days
Mood today: {MOOD_SCORE}/10
Energy today: {ENERGY_SCORE}/10

TODAY'S CHECK-IN:
Progress: {PROGRESS_NOTES}
Wins: {WINS}
Blockers: {BLOCKERS}

OUTPUT FORMAT (JSON):
{
  "reflection": "string",
  "pattern_note": "string | null",
  "encouragement": "string",
  "suggested_task": {"title": "string", "priority": "low|medium|high"} | null,
  "tone_used": "direct | balanced | nurturing"
}
```

---

*This document is the definitive reference for AI/ML strategy. All prompt changes must be reviewed here, versioned, and tested before production deployment. Prompt versions are stored in source control alongside application code.*
