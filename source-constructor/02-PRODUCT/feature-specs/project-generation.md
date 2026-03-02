# Feature Specification: Project Generation Engine
# Source Constructor (SOC) Platform

**Document Version:** 1.1
**Status:** Approved for Development
**Last Updated:** 2026-03-02
**Author:** Product Team

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [Input: Discovery Session Output](#2-input-discovery-session-output)
3. [Project Template Structure](#3-project-template-structure)
4. [Personalization Logic](#4-personalization-logic)
5. [Project Domains and Types](#5-project-domains-and-types)
6. [Generation Algorithm](#6-generation-algorithm)
7. [Quality Criteria for Generated Projects](#7-quality-criteria-for-generated-projects)
8. [User Flow for Project Selection and Customization](#8-user-flow-for-project-selection-and-customization)
9. [API Design](#9-api-design)
10. [Database Schema](#10-database-schema)
11. [Example Generated Projects](#11-example-generated-projects)
12. [Edge Cases](#12-edge-cases)
13. [Performance Requirements](#13-performance-requirements)

---

## 1. Feature Overview

The Project Generation Engine is the mechanism that transforms a user's Discovery Session insight profile into 2–3 concrete, actionable, personally resonant project proposals. It is triggered automatically upon the user confirming their insight summary and produces results within 30 seconds.

A "project" in SOC is not a task list or a productivity plan. It is a **90-day personal initiative** tied directly to the user's core desires — the thing they said they wanted when they were being honest. Each project includes:

- A compelling title and one-sentence vision
- A "why this for you" narrative that references the user's specific Discovery Session insights
- A three-stage 30/60/90-day milestone roadmap
- Weekly task suggestions for the first four weeks
- Recommended resources (books, courses, tools, communities)
- An alignment score showing how well the project maps to the insight profile

The engine generates projects across five life domains, ensuring diversity in the proposals (no two projects in the same domain unless unavoidable). The goal is that when the user sees their projects, they feel: "One of these is obviously me. I can't believe an AI figured that out."

---

## 2. Input: Discovery Session Output

### Insight Profile Schema (Input)

The Project Generation Engine receives the confirmed insight profile from the Discovery Session:

```json
{
  "user_id": "uuid",
  "session_id": "uuid",
  "session_context": {
    "situation_type": "career_transition",
    "duration": "3-12_months",
    "prior_attempts": ["journaling", "coaching"]
  },
  "insights": [
    {
      "id": "uuid",
      "theme_label": "Creative autonomy over institutional stability",
      "description": "Throughout the session, a consistent theme emerged: this person experiences their deepest flow states in self-directed creative work, not in institutional or collaborative structures.",
      "user_quote": "When I'm working on something that's actually mine, hours disappear.",
      "confidence_score": 87,
      "tags": ["autonomy", "creativity", "flow_state"],
      "supporting_question_ids": ["q3", "q8", "q14", "q20"]
    },
    {
      "id": "uuid",
      "theme_label": "Deep expertise as identity anchor",
      "description": "This person's sense of self-worth is strongly tied to being genuinely good at something — not just competent, but expert. The fear of being a generalist or appearing shallow is a real tension.",
      "user_quote": "I need to feel like I actually know what I'm talking about.",
      "confidence_score": 78,
      "tags": ["expertise", "identity", "depth"]
    },
    {
      "id": "uuid",
      "theme_label": "Financial independence as prerequisite for authentic life",
      "description": "This person doesn't want to be rich — they want financial security sufficient to make choices based on what matters rather than what pays. This is a means, not an end.",
      "user_quote": "I just want money to stop being the reason I say yes to things.",
      "confidence_score": 71,
      "tags": ["financial_freedom", "autonomy", "lifestyle"]
    }
  ],
  "emerging_signals": [...],
  "q20_answer": "If my relationship with my work actually changed — if I was building something that was mine — I think everything else would fall into place."
}
```

### Key Input Variables for Generation

| Variable | Used For |
|----------|----------|
| `insights[].theme_label` | Project title and vision language |
| `insights[].tags` | Domain classification and project type selection |
| `insights[].confidence_score` | Alignment score calculation and project prioritization |
| `session_context.situation_type` | Domain weighting (career_transition → Career domain prioritized) |
| `q20_answer` | Project vision synthesis (user's own words as anchor) |
| User demographics (age, profession from profile) | Resource recommendations, milestone timescale calibration |

---

## 3. Project Template Structure

Every generated project follows this schema, which is populated by the AI:

### 3.1 Project Card (Summary View)

```
TITLE: [8 words maximum; evocative, specific, action-oriented]
DOMAIN: [Career | Creative | Health | Relationship | Skill]
VISION: [One sentence, present-tense, first-person: "I am..."]
ALIGNMENT SCORE: [0–100%]
WHY THIS EXISTS: [1-sentence connection to the user's primary insight]
```

### 3.2 Project Full View

```
TITLE
DOMAIN
VISION STATEMENT
  One powerful sentence expressing who this person is becoming. Written in their voice.

WHY THIS FOR YOU
  3–4 paragraph narrative connecting the project to the user's specific Discovery Session insights.
  Paragraph 1: What the project is, in concrete terms.
  Paragraph 2: Why it maps to this user's core desire (reference insight 1).
  Paragraph 3: Why it addresses a secondary need or fear (reference insight 2 or 3).
  Paragraph 4: What success looks and feels like for this specific person.

30-DAY MILESTONE
  Title: [Milestone name — concrete deliverable or state]
  Description: [2–3 sentences on what this phase involves]
  Success indicator: [How the user knows they've hit this milestone]

60-DAY MILESTONE
  [Same structure as 30-day]

90-DAY MILESTONE
  [Same structure as 30-day]

WEEK 1 TASKS
  1. [Specific, concrete, completable in 1–3 hours]
  2. [...]
  3. [...]
  4. [...]
  5. [...]

RESOURCES
  Resource 1: [Name] — [Type: Book/Course/Tool/Community] — [1-sentence reason this is relevant]
  Resource 2: [...]
  Resource 3: [...]
```

### 3.3 Full Project JSON Schema

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "session_id": "uuid",
  "generation_batch_id": "uuid",
  "title": "Build the Writing Practice That Earns My Exit",
  "domain": "creative",
  "sub_domain": "writing",
  "vision_statement": "I am a writer with a consistent practice, a growing audience, and the income to choose my clients.",
  "alignment_score": 89,
  "alignment_explanation": "This project directly addresses your desire for creative autonomy and financial independence, while building on your existing writing expertise.",
  "why_this_for_you": {
    "project_description": "...",
    "connection_to_primary_insight": "...",
    "connection_to_secondary_insight": "...",
    "success_image": "..."
  },
  "milestones": [
    {
      "period": 30,
      "title": "Foundation: Daily Practice and First Published Piece",
      "description": "...",
      "success_indicator": "You have written every day for 21 of the 30 days, and at least one piece is published publicly."
    },
    {
      "period": 60,
      "title": "Growth: Audience and Feedback Loop",
      "description": "...",
      "success_indicator": "You have 50+ newsletter subscribers or social followers who found you through your writing."
    },
    {
      "period": 90,
      "title": "Leverage: Income Signal or Career Shift Offer",
      "description": "...",
      "success_indicator": "You have received at least one concrete signal that your writing creates economic value: a paid inquiry, a speaking invitation, or a job offer."
    }
  ],
  "week1_tasks": [
    "Set up a simple writing environment: a dedicated folder, a document template, and a 'no excuses' rule — write before opening email",
    "Write your first 500-word piece on a topic you know well. Publish it somewhere, even just a personal blog or LinkedIn.",
    "Identify 3 writers you admire who are where you want to be in 3 years. Study their trajectory, not just their work.",
    "Tell one person — just one — that you are starting a writing practice. Accountability starts with one witness.",
    "Block 45 minutes on your calendar every morning next week as 'Writing — non-negotiable'."
  ],
  "resources": [
    {
      "name": "Bird by Bird",
      "type": "book",
      "author": "Anne Lamott",
      "reason": "The definitive guide to showing up and writing badly first — essential for breaking the perfection paralysis you described."
    },
    {
      "name": "Beehiiv",
      "type": "tool",
      "reason": "The simplest newsletter platform for writers who want to own their audience from day one without technical overhead."
    },
    {
      "name": "Write of Passage",
      "type": "community",
      "reason": "A course and community for internet writers. If you decide to invest in your writing, this is where serious writers go."
    }
  ],
  "status": "generated",
  "user_selected": false,
  "user_customized": false,
  "created_at": "2026-03-02T15:00:00Z"
}
```

---

## 4. Personalization Logic

### 4.1 Domain Selection

The engine selects 2–3 domains for the project proposals based on a weighted scoring system:

**Domain Score Formula:**
```
domain_score = (insight_tag_match_score × 0.5) + (situation_type_score × 0.3) + (q20_semantic_score × 0.2)
```

- `insight_tag_match_score`: Number of insight tags that map to this domain, weighted by confidence
- `situation_type_score`: Bonus points based on context (career_transition → Career +20; creative_project → Creative +20)
- `q20_semantic_score`: Semantic similarity between Q20 answer and domain description (0–100)

**Top 2–3 domains by score are used.** No two projects share the same domain unless the domain score difference is < 10 points.

### 4.2 Project Type Selection Within Domain

Each domain has 3–6 project types. The selection is based on the user's insight tags:

| Domain | Project Types | Triggering Tags |
|--------|--------------|----------------|
| Career | Pivot, Promotion Track, Freelance Launch, Entrepreneurship | career, work, employment, direction |
| Creative | Writing Practice, Creative Project Launch, Portfolio Build, Course Creation | creativity, expression, making, art |
| Health | Physical Transformation, Energy Optimization, Mental Health | health, body, energy, wellbeing |
| Relationship | Partnership Deepening, Network Building, Community Creation | relationships, connection, belonging |
| Skill | Deep Expertise Build, New Skill Acquisition, Teaching/Mentoring | learning, expertise, knowledge, growth |

### 4.3 Milestone Calibration

Milestone timescales are calibrated to the user's context:
- If `prior_attempts` includes "productivity_apps": milestones are smaller and more frequent (15/30/60 days instead of 30/60/90)
- If user expressed patience and long-term thinking in session: 30/60/90 day milestones standard
- If user expressed urgency ("I've been stuck for 3 years"): first milestone at 14 days for quick win

### 4.4 Resource Personalization

Resources are selected from a curated database of 300+ books, courses, tools, and communities, filtered by:
1. Domain relevance
2. Project type relevance
3. User's insight tags
4. User demographics (profession, experience level inferred from session)

Resources are never generic bestsellers unless they are specifically the best for the user's situation. The AI must explain why each resource is relevant to this specific user.

### 4.5 Vision Statement Language

The vision statement uses the user's Q20 answer as the linguistic anchor. If the user said "I want to stop doing work that doesn't feel like mine," the vision statement reflects that language: "I do only work that is genuinely mine to do."

The AI is instructed: "Write the vision statement as if the user themselves wrote it, after achieving what they described wanting. Use their vocabulary, their specificity level, and their emotional register."

---

## 5. Project Domains and Types

### Domain 1: Career

**Description:** Projects about how the user earns money, applies their skills, and positions themselves professionally.

**Project Types:**

**Career Pivot**
- Trigger: User expresses desire to change industry, role type, or core function
- Characteristics: Bridges current skills to target; includes networking, portfolio, and transition milestones
- Example: "Transition from Engineering Manager to Independent Product Consultant in 90 days"

**Freelance Launch**
- Trigger: User expresses desire for income independence, client-based work, or autonomy
- Characteristics: Service definition, first client acquisition, pricing structure, and legal setup
- Example: "Launch a Freelance UX Research Practice with 2 Paying Clients"

**Promotion & Influence Track**
- Trigger: User wants to advance within current context but gain more ownership and influence
- Characteristics: Leadership visibility, skill gap closure, relationship-building within organization
- Example: "Position Myself as the Obvious Choice for the Next Director Role"

**Entrepreneurship / Product Launch**
- Trigger: User expresses desire to build something of their own, creator economy interest
- Characteristics: Idea validation, minimum viable build, first revenue signal
- Example: "Validate and Launch a B2B SaaS Tool for [Specific Problem]"

### Domain 2: Creative

**Description:** Projects about making things — writing, design, music, film, photography, craft — and sharing them.

**Project Types:**

**Writing Practice and Audience Building**
- Newsletter, blog, or social writing practice with audience growth target
- Focus: Consistency and publishing cadence

**Creative Project Launch**
- A specific creative work (book chapter, album, film short, design portfolio, art series)
- Focus: From idea to finished artifact

**Course or Knowledge Product Creation**
- Teaching expertise as a course, guide, or educational product
- Focus: Packaging knowledge, building a small audience

**Portfolio Development**
- Building a body of work for career or creative credibility
- Focus: Curation, production, and showcase

### Domain 3: Health

**Description:** Projects about the user's physical and mental wellbeing, energy management, and relationship with their body.

**Project Types:**

**Physical Transformation**
- Exercise, nutrition, sleep, or physical capacity goals
- Focus: Sustainable behavior change, not extreme transformation

**Energy Optimization**
- Holistic approach to managing energy: sleep, stress, nutrition, movement, and recovery
- Focus: Understanding personal energy patterns and designing around them

**Mental Health Practice**
- Therapy initiation, meditation practice, journaling habit, anxiety management
- Focus: Building a consistent mental health toolkit

**Sobriety or Habit Reset**
- Reduction or elimination of a specific habit (alcohol, screens, etc.)
- Focus: Replacement behavior design and accountability

### Domain 4: Relationship

**Description:** Projects about the quality and nature of the user's key relationships — romantic, family, friendship, professional.

**Project Types:**

**Partnership Deepening**
- Intentional deepening of a primary romantic partnership or friendship
- Focus: Communication, shared experiences, conflict resolution habits

**Network and Community Building**
- Deliberately expanding a professional or personal network around a shared interest
- Focus: Consistency, genuine contribution, relationship maintenance

**Family Reconnection**
- Repairing or deepening family relationships that have become distant or strained
- Focus: Specific conversations, shared experiences, and boundary-setting

### Domain 5: Skill

**Description:** Projects about developing a specific capability that the user identified as important for their next chapter.

**Project Types:**

**Deep Expertise Development**
- Achieving genuine mastery in a specific professional or creative domain
- Focus: Structured learning, deliberate practice, expert feedback

**New Skill Acquisition**
- Learning a completely new skill for career pivot, creative pursuit, or personal development
- Focus: Learning methodology, milestone-based progress, practical application

**Teaching and Mentoring**
- Developing skills through teaching — leading a workshop, mentoring a junior colleague, creating educational content
- Focus: Teaching as a learning accelerator and reputation-builder

---

## 6. Generation Algorithm

### Step 1: Profile Analysis

**Input:** Confirmed insight profile
**Output:** Weighted domain scores and project type preferences

```
1. Extract all tags from confirmed insights
2. Map tags to domains (many-to-many relationship)
3. Score each domain using domain score formula (Section 4.1)
4. Select top 2–3 domains
5. Within each selected domain, score project types using insight tags
6. Select highest-scoring project type per domain
7. Store as generation_plan: [{domain, project_type, primary_insight_id, secondary_insight_id}]
```

### Step 2: AI Prompt Construction

For each project in the generation_plan, construct a structured prompt:

```
SYSTEM: You are a life design specialist who creates 90-day personal growth projects.
You generate projects that feel deeply personal — not generic templates.
You speak directly and warmly. You use the user's language.

INPUT PROFILE:
Primary Insight: {{primary_insight.description}}
User Quote: "{{primary_insight.user_quote}}"
Secondary Insight: {{secondary_insight.description}}
Project Domain: {{domain}}
Project Type: {{project_type}}
User Context: {{session_context}}
Q20 Answer (their deepest truth): "{{q20_answer}}"

TASK: Generate ONE project proposal for this specific person.
Follow this exact JSON schema: [schema]

CONSTRAINTS:
- The title must be specific and evocative. No generic titles like "Career Development Plan."
- The vision statement must sound like the user wrote it, not like a corporate HR document.
- "Why this for you" must reference the user's actual quote at least once.
- Week 1 tasks must be completable in less than 3 hours each.
- Resources must be genuinely relevant — not bestseller defaults.
- The alignment score is calculated externally — do not include it in your output.
```

### Step 3: Quality Scoring

Each generated project is scored against quality criteria (Section 7) before being shown to the user. Projects that fail 2+ quality checks are regenerated once. If regeneration also fails, the project is included with a flag for human review.

### Step 4: Alignment Score Calculation

```
alignment_score = (
  primary_insight_match × 0.40 +
  secondary_insight_match × 0.30 +
  q20_semantic_similarity × 0.20 +
  domain_situation_match × 0.10
) × 100

primary_insight_match: cosine similarity between project content embedding and primary insight embedding
secondary_insight_match: cosine similarity between project content embedding and secondary insight embedding
q20_semantic_similarity: cosine similarity between vision statement and Q20 answer
domain_situation_match: 1.0 if domain matches situation_type priority domain; 0.7 otherwise
```

### Step 5: Project Ordering

Projects are sorted by alignment score (descending). The highest-aligned project is presented first.

---

## 7. Quality Criteria for Generated Projects

Each generated project is evaluated against these criteria before presentation to the user. A project must pass at least 7 of 10 criteria:

| # | Criterion | Evaluation Method |
|---|-----------|------------------|
| 1 | Title is specific and non-generic | Check: title contains at least 1 concrete noun referencing the user's domain |
| 2 | Vision statement is first-person and present-tense | Regex check: starts with "I am" or "I [verb]" |
| 3 | "Why this for you" references at least one user quote | String check: contains a quote from the insight profile |
| 4 | At least one milestone uses a concrete, measurable success indicator | NLP check for quantitative language or specific deliverable |
| 5 | Week 1 tasks are specific actions, not vague intentions | NLP check: each task contains a verb and a specific deliverable |
| 6 | Resources are specific titles/products (not "find a course online") | String check: each resource has a specific name |
| 7 | Project domain matches at least one primary insight tag | Logic check against domain-tag mapping |
| 8 | No plagiarized or template-copied content | Similarity check against known generic templates |
| 9 | Vision statement language matches user's emotional register | Sentiment + complexity score within 20% of user's Q20 answer |
| 10 | The total project is internally consistent (milestones flow logically) | AI self-review pass: "Does this project make sense as a journey?" |

### Quality Score Communication to User

Users do not see the quality score. They see the alignment score only. Quality scoring is for internal pipeline use.

---

## 8. User Flow for Project Selection and Customization

### Phase 1: Generation Loading State

**Screen:** Full-screen with subtle animated visual
**Copy:** "We're designing your projects..."
**Sub-copy:** "This takes about 30 seconds. SOC is building something specific for you."
**Timer:** No visible countdown. Progress animation only.

### Phase 2: Project Cards Presentation

**Layout (mobile):** Stacked cards, vertically scrollable
**Layout (tablet/desktop):** Side-by-side cards (max 3 columns)

**Each card shows:**
- Domain badge (colored tag: Career / Creative / Health / Relationship / Skill)
- Project title
- Vision statement (first line only; truncated after 80 characters)
- Alignment score (visual meter + percentage)
- "View Full Project" button

### Phase 3: Project Detail View

User taps a card → Full project detail view slides up (bottom sheet on mobile; modal on desktop).

**Contents (in order):**
1. Title (H1)
2. Vision statement (large, quoted style)
3. Domain + Alignment score
4. "Why This For You" section (3–4 paragraphs, expandable)
5. Milestone roadmap (30/60/90 timeline visual)
6. Week 1 Task list (5 items with checkboxes — decorative, not functional yet)
7. Resources section (3 items)
8. "Start This Project" button (primary CTA)
9. "Not for me" link (dismisses this project, marks as 'rejected')

### Phase 4: Project Acceptance

**Step 1:** User taps "Start This Project"
**Step 2:** Commitment screen appears:
- Title: "You're starting [Project Title]"
- Your vision: [Vision statement displayed prominently]
- Optional: "Add your personal 'why'" — text field (max 200 chars)
- CTA: "I'm starting this" (primary) | "Let me look again" (secondary)

**Step 3:** Acceptance animation:
- Confetti or particle burst (tasteful, celebratory)
- Brief copy: "Your journey starts today."
- Streak counter initializes: Day 1

**Step 4:** Dashboard entry
- Project appears in dashboard as "Active"
- First check-in CTA appears

### Phase 5: Project Customization

After acceptance, user can customize their project from the project detail screen:

**Editable elements:**
- Project title (max 80 characters)
- Vision statement (max 200 characters)
- Each milestone: title, description, and due date
- Week 1 tasks: edit text or swap for alternatives (AI generates 3 alternative tasks per slot on request)
- Personal "why" note

**Non-editable elements:**
- Domain classification
- Alignment score (historical record)
- Resources (but user can add their own)

**Customization UX:**
- Inline editing; no separate edit mode screen
- Changes auto-saved with 1-second debounce
- "Reset to original" option available for each section for 7 days post-generation

---

## 9. API Design

### POST /api/v1/projects/generate

Trigger project generation from a confirmed insight profile.

**Request:**
```json
{
  "user_id": "uuid",
  "session_id": "uuid",
  "insight_profile_id": "uuid"
}
```

**Response (immediate — generation is async):**
```json
{
  "batch_id": "uuid",
  "status": "generating",
  "estimated_completion_seconds": 30,
  "poll_url": "/api/v1/projects/generate/{batch_id}/status"
}
```

**Webhook / Polling:**

`GET /api/v1/projects/generate/{batch_id}/status`

```json
{
  "batch_id": "uuid",
  "status": "completed",
  "projects": [
    {
      "id": "uuid",
      "title": "...",
      "domain": "creative",
      "alignment_score": 89,
      "alignment_explanation": "..."
    }
  ]
}
```

---

### GET /api/v1/projects/{project_id}

Retrieve full project details.

**Response:** Full project JSON (Section 3.3 schema)

---

### POST /api/v1/projects/{project_id}/accept

Accept a generated project and activate it.

**Request:**
```json
{
  "user_personal_why": "Because I've been saying I'll do this for 3 years and I'm done waiting."
}
```

**Response:**
```json
{
  "project_id": "uuid",
  "status": "active",
  "activated_at": "2026-03-02T15:30:00Z",
  "dashboard_url": "/dashboard/projects/{project_id}",
  "first_checkin_available": true
}
```

**Error:** 409 if user already has max active projects for their tier.

---

### POST /api/v1/projects/{project_id}/reject

Mark a project as rejected (moved to Saved Ideas).

**Request:** `{}`
**Response:** `{"status": "rejected", "saved_until": "2026-06-02T15:30:00Z"}`

---

### PATCH /api/v1/projects/{project_id}

Update project customizations.

**Request:**
```json
{
  "title": "New custom title",
  "vision_statement": "My updated vision statement",
  "personal_why": "Updated personal why",
  "milestones": [
    {
      "period": 30,
      "title": "Updated milestone title",
      "due_date": "2026-04-02"
    }
  ]
}
```

---

### GET /api/v1/projects/{project_id}/tasks/alternatives

Get alternative week 1 task options for a specific task slot.

**Request:** `?slot=2` (task slot 1–5)
**Response:** `{"alternatives": ["Task A", "Task B", "Task C"]}`

---

### POST /api/v1/projects/regenerate

Request a new batch of project proposals. Limited to once every 7 days.

**Request:** `{"session_id": "uuid", "reason": "none_of_these_felt_right"}`
**Response:** Same as `/generate` response.

---

## 10. Database Schema

### Table: project_generation_batches

```sql
CREATE TABLE project_generation_batches (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id                UUID NOT NULL REFERENCES discovery_sessions(id),
  insight_profile_id        UUID NOT NULL REFERENCES insight_profiles(id),
  status                    VARCHAR(20) NOT NULL DEFAULT 'generating'
                            CHECK (status IN ('generating', 'completed', 'failed', 'partial')),
  projects_count            INTEGER,
  generation_plan           JSONB NOT NULL DEFAULT '[]',  -- [{domain, project_type, ...}]
  ai_model_version          VARCHAR(50),
  total_tokens_used         INTEGER,
  generation_duration_ms    INTEGER,
  quality_checks_failed     INTEGER NOT NULL DEFAULT 0,
  regeneration_count        INTEGER NOT NULL DEFAULT 0,   -- how many times user requested new batch
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at              TIMESTAMPTZ
);
```

### Table: projects

```sql
CREATE TABLE projects (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id                UUID NOT NULL REFERENCES discovery_sessions(id),
  batch_id                  UUID NOT NULL REFERENCES project_generation_batches(id),
  insight_profile_id        UUID NOT NULL REFERENCES insight_profiles(id),

  -- Core content
  title                     VARCHAR(200) NOT NULL,
  original_title            VARCHAR(200) NOT NULL,   -- preserved on user edit
  domain                    VARCHAR(30) NOT NULL
                            CHECK (domain IN ('career', 'creative', 'health', 'relationship', 'skill')),
  sub_domain                VARCHAR(50),
  project_type              VARCHAR(50) NOT NULL,
  vision_statement          TEXT NOT NULL,
  original_vision_statement TEXT NOT NULL,
  personal_why              TEXT,                     -- user-added on acceptance

  -- Why this for you
  why_project_description   TEXT NOT NULL,
  why_primary_connection    TEXT NOT NULL,
  why_secondary_connection  TEXT,
  why_success_image         TEXT NOT NULL,

  -- Scoring
  alignment_score           INTEGER NOT NULL CHECK (alignment_score BETWEEN 0 AND 100),
  alignment_explanation     TEXT NOT NULL,
  quality_score             INTEGER,                  -- internal; not shown to user
  quality_checks_passed     INTEGER,

  -- Status
  status                    VARCHAR(20) NOT NULL DEFAULT 'generated'
                            CHECK (status IN ('generated', 'active', 'rejected', 'archived', 'completed')),
  user_selected             BOOLEAN NOT NULL DEFAULT FALSE,
  user_customized           BOOLEAN NOT NULL DEFAULT FALSE,
  accepted_at               TIMESTAMPTZ,
  archived_at               TIMESTAMPTZ,
  completed_at              TIMESTAMPTZ,
  saved_until               TIMESTAMPTZ,             -- for rejected projects

  -- Metadata
  ai_generation_prompt_hash VARCHAR(64),             -- for debugging; not user-facing
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_domain ON projects(domain);
```

### Table: project_milestones

```sql
CREATE TABLE project_milestones (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_days           INTEGER NOT NULL CHECK (period_days IN (14, 30, 60, 90)),
  title                 VARCHAR(200) NOT NULL,
  original_title        VARCHAR(200) NOT NULL,
  description           TEXT NOT NULL,
  success_indicator     TEXT NOT NULL,
  due_date              DATE,
  status                VARCHAR(20) NOT NULL DEFAULT 'not_started'
                        CHECK (status IN ('not_started', 'in_progress', 'completed', 'overdue', 'skipped')),
  completed_at          TIMESTAMPTZ,
  display_order         INTEGER NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Table: project_tasks

```sql
CREATE TABLE project_tasks (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number           INTEGER NOT NULL,
  task_text             TEXT NOT NULL,
  original_task_text    TEXT NOT NULL,
  status                VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'completed', 'skipped', 'snoozed')),
  is_today_focus        BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at          TIMESTAMPTZ,
  snoozed_until_week    INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 11. Example Generated Projects

### Example 1: Career Domain — Freelance Launch

**User Insights:** Creative autonomy (87%), financial independence (71%), expertise as identity (78%)
**Situation:** Career transition, 3–12 months stuck, tried journaling and coaching

---

**Title:** Launch a Senior UX Research Consultancy with $5K Month 1 Revenue

**Vision:** I am an independent UX researcher who works with the clients I choose, on problems that matter to me, and earns enough to stay free.

**Why This For You:**
You've told me you feel most alive when the work is genuinely yours — when you're not executing someone else's vision but actually thinking alongside the people you work with. Right now, your expertise is real, but the institution that holds it isn't yours. That's the friction you described.

A freelance consultancy changes that equation. You keep the expertise — in fact, you get to deepen it by working across multiple contexts simultaneously — but you gain the ownership over what you do with it. The work becomes yours.

You also mentioned money as a pressure point — not greed, but the need to stop saying yes to things for the wrong reasons. Freelancing solves this differently than most people expect: it's not immediately more money, but it's money you control, which is what you actually said you wanted.

In 90 days, you'll have your first two clients, a service offering you believe in, and enough evidence to decide whether this is your long-term path or a stepping stone to something even more yours.

**30-Day Milestone:** Define Your Offer and Land First Paid Discovery Call
- Success indicator: You have a written service description, a clear price point, and at least one paid discovery call completed.

**60-Day Milestone:** First Delivering Project Complete and Repeat Inquiry Received
- Success indicator: You have delivered a client project, received feedback, and have at least one follow-up inquiry or referral.

**90-Day Milestone:** $5K Monthly Revenue Signal and Systematic Pipeline
- Success indicator: You have invoiced $5,000 in Month 3 (or you have enough pipeline to project $5,000 in Month 4).

**Week 1 Tasks:**
1. Write a one-page "services offered" document. No website needed — just clarity. Share it with one trusted colleague.
2. Identify 10 former colleagues, clients, or contacts who could benefit from your UX research skills or know someone who could.
3. Send 3 personal messages (not cold emails) to those 10 contacts simply sharing that you're exploring consulting work.
4. Set your rate: research what independent UX researchers charge in your market. Choose a number that makes you slightly uncomfortable.
5. Open a business bank account. This is symbolic as much as practical — you're drawing a line.

**Resources:**
- "Company of One" by Paul Jarvis (Book) — challenges the assumption that freelancing is just a stepping stone; argues for intentional smallness.
- Bonsai (Tool) — contracts, invoicing, and time tracking purpose-built for solo consultants; eliminates admin friction from day one.
- Independent Minds Slack community (Community) — active community of independent UX and product consultants sharing rate information and client referrals.

---

### Example 2: Creative Domain — Writing Practice

**User Insights:** Unexpressed desire to create (83%), deep expertise as identity (78%), fear of visibility (65%)

---

**Title:** Publish 12 Pieces in 90 Days and Find the 100 People Who Need Your Voice

**Vision:** I am a writer. I publish consistently, my thinking reaches people who need it, and the fear of being seen no longer runs my creative life.

**Why This For You:**
You described something in your session that a lot of people feel but rarely say: that there's a version of yourself you've been keeping offline. You know things worth saying. You've thought seriously about your field for years. But putting those thoughts into public form has felt like too much exposure.

The problem with waiting for that feeling to go away is that it doesn't. The only thing that changes the relationship with visibility is small doses of it, consistently, until it becomes ordinary.

This project is designed around that truth. Twelve pieces in 90 days isn't a marketing campaign — it's a practice. Your job is to show up, not to go viral. But what often happens when people commit to this, seriously, is that by piece 8 or 9, they stop thinking about who's reading and start thinking only about what they want to say. That's when writing becomes sustainable.

In 90 days, you won't just have 12 pieces — you'll have 100 people who found value in your thinking and a practice that belongs to you.

**30-Day Milestone:** Publish Your First 4 Pieces and Establish Your Voice
- Success indicator: 4 pieces published, at least 10 people have read at least one of them, and you've identified 1–2 themes you want to write about regularly.

**60-Day Milestone:** 8 Pieces Published and 50 Readers Engaged
- Success indicator: 8 pieces published, 50+ newsletter subscribers or followers who came to you through your writing.

**90-Day Milestone:** 12 Pieces Published, 100 Engaged Readers, and One Unexpected Opportunity
- Success indicator: 100 engaged readers and at least one concrete thing that happened because of your writing (a conversation, an invitation, a job inquiry, a collaboration).

---

### Example 3: Health Domain — Energy Optimization

**User Insights:** Feeling depleted and operating at half-capacity (88%), desire for sustainable lifestyle (74%), patterns of avoidance under stress (67%)

---

**Title:** Redesign Your Energy System from the Ground Up in 90 Days

**Vision:** I have enough energy at the end of my workday to actually live the life I'm working for.

**Why This For You:**
You said something striking: that by 4pm most days, you've already spent yourself. That the life you're trying to build — the creative work, the relationships, the time that's yours — is happening in the hours when you have nothing left to give.

This project doesn't add more to your life. It restructures what's already there so that the life you want to live stops happening at the margins of your exhausted evenings.

You're not depleted because you're lazy or because something is medically wrong. You're depleted because your days are structured around recovery from demands, not around generating the energy to meet them. Sleep, movement, food, and recovery are not luxuries — they are the infrastructure on which everything else runs.

In 90 days, you'll have a stable, personalized energy system: a morning that sets you up, a work rhythm that sustains you, and an evening that actually recovers you.

---

## 12. Edge Cases

| Scenario | Handling |
|----------|---------|
| All 3 domains have equal scores | Use random weighted selection; prioritize situation_type domain |
| Insight profile has only 1 insight (all others removed by user) | Generate from single insight; note limitation in "Why this for you" |
| AI generates duplicate title across 2 projects | Detect via string similarity > 80%; regenerate the lower-quality duplicate |
| Generation takes > 45 seconds | Return partial result (1–2 projects) with message: "We have 2 projects ready now — a third is coming" (async load third) |
| User has no internet during generation | Queue generation for when connection restores; notify user |
| User regenerates projects (7-day cooldown) | New batch ignores previously generated projects (logged to avoid repetition) |
| User on free tier tries to accept 2nd project | Paywall prompt: "Pro users can run up to 3 projects simultaneously" |

---

## 13. Performance Requirements

| Requirement | Target |
|-------------|--------|
| Project generation time (2 projects) | ≤ 30 seconds (p90) |
| Project generation time (3 projects) | ≤ 45 seconds (p90) |
| Project generation timeout | 60 seconds max; partial result returned |
| Project detail load time | ≤ 500ms (cached) |
| Task generation (per week) | ≤ 10 seconds |
| Alternative task generation | ≤ 5 seconds |
| Alignment score calculation | ≤ 2 seconds |
| Maximum concurrent generation jobs | 500 |
