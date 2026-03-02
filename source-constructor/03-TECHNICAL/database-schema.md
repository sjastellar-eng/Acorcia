# Source Constructor (SOC) — Database Schema

**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Approved
**Owner:** Engineering Lead
**Database:** PostgreSQL 15 via Supabase

---

## Overview

This document defines the complete database schema for the Source Constructor platform. The schema is designed for PostgreSQL 15 running on Supabase, leveraging:

- **JSONB columns** for semi-structured AI output data that evolves as prompt engineering improves
- **Row Level Security (RLS)** policies to enforce user data isolation at the database layer
- **UUID primary keys** for distributed ID generation without central coordination
- **Timestamps with time zone** for consistent UTC storage across global deployments
- **Partial indexes** for performance on common filtered queries
- **Full-text search** on project and task content using `tsvector`

---

## Extensions

```sql
-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram similarity for fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Accent-insensitive search
```

---

## Table: users

Stores the core user account record. Linked to Supabase Auth's `auth.users` table via the `id` field, which must match the Supabase Auth user ID for RLS policies to function correctly.

```sql
CREATE TABLE public.users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  avatar_url            TEXT,
  subscription_tier     TEXT NOT NULL DEFAULT 'free'
                          CHECK (subscription_tier IN ('free', 'pro', 'team')),
  onboarding_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step       INTEGER NOT NULL DEFAULT 0,
  last_active           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX idx_users_last_active ON public.users(last_active DESC NULLS LAST);

-- Automatically update updated_at on any modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.users IS 'Core user accounts, linked to Supabase Auth.';
COMMENT ON COLUMN public.users.subscription_tier IS 'Current subscription tier: free, pro, or team.';
COMMENT ON COLUMN public.users.onboarding_step IS 'Last completed onboarding step index (0-4).';
```

### RLS Policies: users

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only read their own record
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own record
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can insert (triggered by auth.users creation via trigger)
CREATE POLICY "users_insert_service" ON public.users
  FOR INSERT
  WITH CHECK (TRUE);  -- Further restricted by service role API key
```

---

## Table: user_profiles

Extended user profile data including preferences, timezone, and AI personalization settings. Separated from `users` to keep the main table lean and allow profile data to expand without affecting the core user record.

```sql
CREATE TABLE public.user_profiles (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  bio                   TEXT,
  timezone              TEXT NOT NULL DEFAULT 'UTC',
  locale                TEXT NOT NULL DEFAULT 'en-US',
  notification_email    BOOLEAN NOT NULL DEFAULT TRUE,
  notification_weekly   BOOLEAN NOT NULL DEFAULT TRUE,
  notification_streak   BOOLEAN NOT NULL DEFAULT TRUE,
  ai_style_preference   TEXT NOT NULL DEFAULT 'balanced'
                          CHECK (ai_style_preference IN ('direct', 'balanced', 'nurturing')),
  focus_areas           TEXT[] DEFAULT '{}',
  preferences           JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON COLUMN public.user_profiles.ai_style_preference IS
  'Preferred AI interaction style: direct (concise/challenging), balanced (default), nurturing (gentle/encouraging).';
COMMENT ON COLUMN public.user_profiles.focus_areas IS
  'Array of self-declared focus areas, e.g. {career, health, relationships, creativity}.';
COMMENT ON COLUMN public.user_profiles.preferences IS 'Flexible JSONB for UI preferences and feature flags.';
```

### JSONB Field: preferences (user_profiles)

```json
{
  "theme": "dark",
  "dashboardLayout": "compact",
  "checkinReminderTime": "20:00",
  "weeklyDigestDay": "sunday",
  "showStreakOnDashboard": true,
  "onboardingCompletedAt": "2026-03-02T10:30:00Z",
  "dismissedBanners": ["accountability_beta"],
  "featureFlags": {
    "newCheckinUI": true
  }
}
```

### RLS Policies: user_profiles

```sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## Table: discovery_sessions

Stores discovery session state, the full conversation history, extracted true desires, and confidence scoring. The `conversation` and `true_desires` fields use JSONB to accommodate evolving AI output schemas without database migrations.

```sql
CREATE TABLE public.discovery_sessions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status                TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'completed', 'abandoned', 'expired')),
  session_type          TEXT NOT NULL DEFAULT 'initial'
                          CHECK (session_type IN ('initial', 'reflection', 'pivot')),
  turn_count            INTEGER NOT NULL DEFAULT 0,
  conversation          JSONB NOT NULL DEFAULT '[]',
  true_desires          JSONB,
  confidence_scores     JSONB,
  analysis_version      TEXT,
  pinecone_vector_id    TEXT,
  started_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at          TIMESTAMPTZ,
  abandoned_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON public.discovery_sessions(user_id);
CREATE INDEX idx_sessions_status ON public.discovery_sessions(status);
CREATE INDEX idx_sessions_user_status ON public.discovery_sessions(user_id, status);
CREATE INDEX idx_sessions_created_at ON public.discovery_sessions(created_at DESC);

-- Partial index for active sessions (most frequent query)
CREATE INDEX idx_sessions_active ON public.discovery_sessions(user_id, last_activity_at)
  WHERE status = 'active';

-- Automatically expire sessions inactive for more than 4 hours
-- (enforced at application layer, not database — for clarity)

COMMENT ON COLUMN public.discovery_sessions.conversation IS
  'Full conversation history as a JSONB array of message objects.';
COMMENT ON COLUMN public.discovery_sessions.true_desires IS
  'Structured AI analysis output: extracted desires, themes, and contradictions.';
COMMENT ON COLUMN public.discovery_sessions.confidence_scores IS
  'Per-desire confidence scoring from the analysis pass.';
COMMENT ON COLUMN public.discovery_sessions.analysis_version IS
  'Version identifier of the analysis prompt used, for reproducibility tracking.';
COMMENT ON COLUMN public.discovery_sessions.pinecone_vector_id IS
  'ID of the corresponding vector in Pinecone for semantic retrieval.';
```

### JSONB Field: conversation

```json
[
  {
    "role": "assistant",
    "content": "Welcome to your Source Constructor session. I'm here to help you discover what truly matters to you beneath the surface. Let's begin: When you imagine your life going exactly right five years from now, what does a typical Tuesday look like?",
    "turn": 1,
    "timestamp": "2026-03-02T10:00:00Z"
  },
  {
    "role": "user",
    "content": "I'd be working on something I built myself, probably from home, with enough money not to worry about bills. Maybe a small team.",
    "turn": 1,
    "timestamp": "2026-03-02T10:01:30Z"
  },
  {
    "role": "assistant",
    "content": "That image of building something yourself stands out. When you say 'something I built myself' — is it the act of creating it that matters, or is it more about owning the outcome, or something else entirely?",
    "turn": 2,
    "timestamp": "2026-03-02T10:01:45Z"
  }
]
```

### JSONB Field: true_desires

```json
{
  "primary_desires": [
    {
      "id": "d_001",
      "theme": "Creative Autonomy",
      "statement": "To build something that is genuinely your own — where your ideas are the ones that matter, without needing approval.",
      "evidence": [
        "I'd be working on something I built myself",
        "I hate having to justify every decision to people who don't understand the work"
      ],
      "depth": "core",
      "confidence": 0.91
    },
    {
      "id": "d_002",
      "theme": "Financial Security Without Obsession",
      "statement": "To have enough financial stability that money is not a daily anxiety — not wealth for its own sake, but peace of mind.",
      "evidence": [
        "enough money not to worry about bills",
        "I don't care about being rich, I just want to stop stressing"
      ],
      "depth": "enabling",
      "confidence": 0.87
    }
  ],
  "secondary_desires": [
    {
      "id": "d_003",
      "theme": "Selective Collaboration",
      "statement": "To work with a small number of people you respect deeply, rather than in isolation or large groups.",
      "evidence": ["Maybe a small team"],
      "depth": "contextual",
      "confidence": 0.72
    }
  ],
  "tensions": [
    {
      "between": ["d_001", "d_003"],
      "description": "Creative autonomy sometimes conflicts with collaboration; you may need to explore how much creative control you're willing to share."
    }
  ],
  "surface_goals_avoided": [
    "Starting a startup",
    "Making a lot of money",
    "Being my own boss"
  ],
  "overall_clarity_score": 0.83,
  "analysis_notes": "Strong clarity on the creative dimension; financial theme shows typical surface-to-core pattern. Recommend exploring the collaboration theme in a future session."
}
```

### JSONB Field: confidence_scores

```json
{
  "overall": 0.83,
  "per_desire": {
    "d_001": 0.91,
    "d_002": 0.87,
    "d_003": 0.72
  },
  "session_quality": {
    "answer_depth": 0.78,
    "emotional_engagement": 0.84,
    "consistency": 0.91,
    "turn_count": 10,
    "avg_answer_length": 142
  },
  "analysis_metadata": {
    "model": "claude-sonnet-4-5",
    "prompt_version": "analysis_v2.1",
    "tokens_used": 4821,
    "analyzed_at": "2026-03-02T10:25:33Z"
  }
}
```

### RLS Policies: discovery_sessions

```sql
ALTER TABLE public.discovery_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_own" ON public.discovery_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sessions_insert_own" ON public.discovery_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_update_own" ON public.discovery_sessions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

## Table: projects

The central entity representing a user's goal-project, generated from a discovery session.

```sql
CREATE TABLE public.projects (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id            UUID REFERENCES public.discovery_sessions(id) ON DELETE SET NULL,
  name                  TEXT NOT NULL,
  vision                TEXT NOT NULL,
  why                   TEXT NOT NULL,
  description           TEXT,
  status                TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  color                 TEXT DEFAULT '#1E40AF',
  icon                  TEXT DEFAULT 'sparkles',
  target_completion     DATE,
  completed_at          TIMESTAMPTZ,
  last_checkin_at       TIMESTAMPTZ,
  checkin_streak        INTEGER NOT NULL DEFAULT 0,
  total_checkins        INTEGER NOT NULL DEFAULT 0,
  ai_metadata           JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_user_status ON public.projects(user_id, status);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

-- Full-text search index
CREATE INDEX idx_projects_fts ON public.projects
  USING GIN (to_tsvector('english', name || ' ' || vision || ' ' || why));

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON COLUMN public.projects.vision IS
  'The aspirational statement for this project — what it looks like when done.';
COMMENT ON COLUMN public.projects.why IS
  'The deeper reason this project matters, derived from true desires analysis.';
COMMENT ON COLUMN public.projects.ai_metadata IS
  'Generation metadata: model version, prompt version, token count, desire_ids used.';
```

### JSONB Field: ai_metadata (projects)

```json
{
  "generated_by": "claude-sonnet-4-5",
  "prompt_version": "project_gen_v1.3",
  "source_desire_ids": ["d_001", "d_002"],
  "generation_tokens": 2341,
  "generated_at": "2026-03-02T10:30:00Z",
  "human_edited": false,
  "edit_history": []
}
```

### RLS Policies: projects

```sql
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_own" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_own" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_delete_own" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);
```

---

## Table: project_milestones

Major phases or checkpoints within a project. Each milestone contains multiple tasks and has its own target completion date.

```sql
CREATE TABLE public.project_milestones (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id            UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  description           TEXT,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  target_date           DATE,
  completed_at          TIMESTAMPTZ,
  ai_generated          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX idx_milestones_project_status ON public.project_milestones(project_id, status);
CREATE INDEX idx_milestones_sort ON public.project_milestones(project_id, sort_order);

CREATE TRIGGER milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies: project_milestones

```sql
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- RLS via project join — user can access milestones they own via project ownership
CREATE POLICY "milestones_select_own" ON public.project_milestones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_milestones.project_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "milestones_insert_own" ON public.project_milestones
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_milestones.project_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "milestones_update_own" ON public.project_milestones
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_milestones.project_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "milestones_delete_own" ON public.project_milestones
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_milestones.project_id
        AND p.user_id = auth.uid()
    )
  );
```

---

## Table: tasks

Individual action items within a milestone. Tasks are the day-to-day actionable units the user works on.

```sql
CREATE TABLE public.tasks (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id          UUID REFERENCES public.project_milestones(id) ON DELETE SET NULL,
  project_id            UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  description           TEXT,
  priority              TEXT NOT NULL DEFAULT 'medium'
                          CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  due_date              DATE,
  completed_at          TIMESTAMPTZ,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  ai_generated          BOOLEAN NOT NULL DEFAULT TRUE,
  tags                  TEXT[] DEFAULT '{}',
  metadata              JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_milestone_id ON public.tasks(milestone_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date NULLS LAST);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);

-- Partial index for pending/in-progress tasks (active work)
CREATE INDEX idx_tasks_active ON public.tasks(project_id, priority, due_date)
  WHERE status IN ('pending', 'in_progress');

-- Full-text search
CREATE INDEX idx_tasks_fts ON public.tasks
  USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies: tasks

```sql
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select_own" ON public.tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_insert_own" ON public.tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_update_own" ON public.tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_delete_own" ON public.tasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id AND p.user_id = auth.uid()
    )
  );
```

---

## Table: daily_checkins

Stores the user's daily progress check-in for a specific project, including mood, notes, and the AI-generated response.

```sql
CREATE TABLE public.daily_checkins (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id            UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  checkin_date          DATE NOT NULL,
  mood_score            INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
  energy_score          INTEGER CHECK (energy_score BETWEEN 1 AND 10),
  progress_notes        TEXT,
  wins                  TEXT,
  blockers              TEXT,
  tasks_completed_count INTEGER NOT NULL DEFAULT 0,
  ai_response           JSONB,
  streak_count          INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One check-in per user per project per day
  CONSTRAINT unique_daily_checkin UNIQUE (user_id, project_id, checkin_date)
);

-- Indexes
CREATE INDEX idx_checkins_user_id ON public.daily_checkins(user_id);
CREATE INDEX idx_checkins_project_id ON public.daily_checkins(project_id);
CREATE INDEX idx_checkins_date ON public.daily_checkins(checkin_date DESC);
CREATE INDEX idx_checkins_user_date ON public.daily_checkins(user_id, checkin_date DESC);
CREATE INDEX idx_checkins_user_project ON public.daily_checkins(user_id, project_id, checkin_date DESC);

COMMENT ON COLUMN public.daily_checkins.mood_score IS '1 = very low, 10 = excellent. User self-reported.';
COMMENT ON COLUMN public.daily_checkins.streak_count IS 'Consecutive days of check-ins at the time of this submission.';
COMMENT ON COLUMN public.daily_checkins.ai_response IS 'Structured AI response with reflection, encouragement, and suggestions.';
```

### JSONB Field: ai_response (daily_checkins)

```json
{
  "model": "claude-haiku-4-5",
  "prompt_version": "checkin_v1.2",
  "response_type": "standard",
  "reflection": "You mentioned feeling energized by the user research session today — that sense of direct connection with the people you're building for is exactly the kind of signal worth paying attention to.",
  "pattern_note": "This is the third consecutive day you've noted momentum on the product side. Your energy scores have been consistently above 7 this week.",
  "encouragement": "The blocker you mentioned — the technical decision about the database architecture — is a real one, but you've navigated similar crossroads before. Consider scheduling a focused 2-hour block tomorrow to make the call and move forward.",
  "suggested_task": {
    "title": "Make and document the database architecture decision",
    "priority": "high",
    "reason": "Removing this blocker will unblock the next two milestones."
  },
  "tone_used": "direct",
  "generated_at": "2026-03-02T21:05:00Z",
  "tokens_used": 487
}
```

### RLS Policies: daily_checkins

```sql
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkins_select_own" ON public.daily_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "checkins_insert_own" ON public.daily_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "checkins_update_own" ON public.daily_checkins
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

## Table: insights

AI-generated insights about the user's patterns, progress, and underlying themes. Generated periodically (after sessions, after 7 check-ins, after milestone completions) and stored for the Insights view.

```sql
CREATE TABLE public.insights (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id            UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  session_id            UUID REFERENCES public.discovery_sessions(id) ON DELETE SET NULL,
  type                  TEXT NOT NULL
                          CHECK (type IN (
                            'pattern', 'milestone', 'weekly_review',
                            'session_complete', 'streak', 'contradiction', 'growth'
                          )),
  title                 TEXT NOT NULL,
  summary               TEXT NOT NULL,
  content               JSONB NOT NULL,
  is_read               BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned             BOOLEAN NOT NULL DEFAULT FALSE,
  pinecone_vector_id    TEXT,
  generated_by_model    TEXT,
  prompt_version        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_insights_user_id ON public.insights(user_id);
CREATE INDEX idx_insights_type ON public.insights(type);
CREATE INDEX idx_insights_user_type ON public.insights(user_id, type);
CREATE INDEX idx_insights_user_created ON public.insights(user_id, created_at DESC);
CREATE INDEX idx_insights_unread ON public.insights(user_id, is_read, created_at DESC)
  WHERE is_read = FALSE;

COMMENT ON COLUMN public.insights.type IS
  'Categorizes the insight: pattern (behavioral), milestone (achievement), weekly_review, session_complete, streak (accountability), contradiction (tension in goals), growth (progress).';
```

### JSONB Field: content (insights)

```json
{
  "headline": "You work best when you own the entire creative process.",
  "body": "Across your three discovery sessions and 23 check-in entries, a consistent pattern emerges: your highest energy scores (8–10) correlate almost perfectly with days when you describe work where you made the key decisions yourself. On days involving group decision-making or waiting for approval, your mood scores drop by an average of 2.3 points.",
  "data_points": [
    { "label": "Avg mood (autonomous work)", "value": 8.4 },
    { "label": "Avg mood (collaborative/approval)", "value": 6.1 },
    { "label": "Days analyzed", "value": 23 }
  ],
  "actionable_suggestion": "Consider restructuring your current project to front-load the decisions that require collaboration, then protect extended blocks of autonomous building time.",
  "desire_connection": "d_001",
  "related_insight_ids": ["ins_abc123"],
  "evidence_sources": {
    "checkin_ids": ["ci_001", "ci_002"],
    "session_ids": ["sess_001"]
  }
}
```

### RLS Policies: insights

```sql
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insights_select_own" ON public.insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insights_update_own" ON public.insights
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Service role inserts insights (triggered by backend processes)
CREATE POLICY "insights_insert_service" ON public.insights
  FOR INSERT WITH CHECK (TRUE);
```

---

## Table: subscriptions

Tracks Stripe subscription records linked to users. The authoritative subscription state lives in Stripe; this table is updated via webhooks and used for fast tier checks without Stripe API calls.

```sql
CREATE TABLE public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT NOT NULL UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  tier                    TEXT NOT NULL DEFAULT 'free'
                            CHECK (tier IN ('free', 'pro', 'team')),
  status                  TEXT NOT NULL DEFAULT 'active'
                            CHECK (status IN (
                              'active', 'trialing', 'past_due',
                              'canceled', 'unpaid', 'paused'
                            )),
  trial_ends_at           TIMESTAMPTZ,
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at             TIMESTAMPTZ,
  stripe_price_id         TEXT,
  metadata                JSONB NOT NULL DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON public.subscriptions(current_period_end)
  WHERE status IN ('active', 'trialing');

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies: subscriptions

```sql
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update (via Stripe webhooks)
-- No user-facing INSERT or UPDATE policies; mutations are service-role only
```

---

## Table: accountability_pairs (v1.5)

Links two users who have agreed to be accountability partners for a shared project context. Introduced in version 1.5.

```sql
CREATE TABLE public.accountability_pairs (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_1_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_2_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id            UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  initiated_by          UUID NOT NULL REFERENCES public.users(id),
  pair_settings         JSONB NOT NULL DEFAULT '{}',
  started_at            TIMESTAMPTZ,
  ended_at              TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate pairs
  CONSTRAINT no_self_pair CHECK (user_1_id <> user_2_id),
  CONSTRAINT unique_active_pair UNIQUE (user_1_id, user_2_id)
);

-- Indexes
CREATE INDEX idx_pairs_user_1 ON public.accountability_pairs(user_1_id);
CREATE INDEX idx_pairs_user_2 ON public.accountability_pairs(user_2_id);
CREATE INDEX idx_pairs_status ON public.accountability_pairs(status);

CREATE TRIGGER pairs_updated_at
  BEFORE UPDATE ON public.accountability_pairs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON COLUMN public.accountability_pairs.pair_settings IS
  'Shared settings: check-in visibility preferences, notification opt-ins, shared notes visibility.';
```

### JSONB Field: pair_settings

```json
{
  "shareCheckinMood": true,
  "shareCheckinNotes": false,
  "shareStreakCount": true,
  "notifyOnPartnerCheckin": true,
  "notifyOnPartnerMilestone": true,
  "weeklyDigestShared": true
}
```

### RLS Policies: accountability_pairs

```sql
ALTER TABLE public.accountability_pairs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pairs_select_participant" ON public.accountability_pairs
  FOR SELECT
  USING (auth.uid() = user_1_id OR auth.uid() = user_2_id);

CREATE POLICY "pairs_insert_initiator" ON public.accountability_pairs
  FOR INSERT
  WITH CHECK (auth.uid() = user_1_id AND auth.uid() = initiated_by);

CREATE POLICY "pairs_update_participant" ON public.accountability_pairs
  FOR UPDATE
  USING (auth.uid() = user_1_id OR auth.uid() = user_2_id);
```

---

## Computed Views

### View: user_project_summary

```sql
CREATE VIEW public.user_project_summary AS
SELECT
  p.id,
  p.user_id,
  p.name,
  p.vision,
  p.status,
  p.checkin_streak,
  p.total_checkins,
  p.last_checkin_at,
  p.created_at,
  COUNT(DISTINCT pm.id) AS milestone_count,
  COUNT(DISTINCT pm.id) FILTER (WHERE pm.status = 'completed') AS milestones_completed,
  COUNT(DISTINCT t.id) AS task_count,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') AS tasks_completed
FROM public.projects p
LEFT JOIN public.project_milestones pm ON pm.project_id = p.id
LEFT JOIN public.tasks t ON t.project_id = p.id
GROUP BY p.id;
```

---

## Migration Strategy

### Approach: Sequential numbered migrations

All schema changes are managed as numbered migration files in `apps/api/migrations/`. The migration tool is `node-postgres-migrate` with the following conventions:

```
migrations/
├── 001_initial_schema.sql
├── 002_add_ai_metadata_to_projects.sql
├── 003_add_energy_score_to_checkins.sql
├── 004_accountability_pairs.sql
└── ...
```

### Migration rules:
1. **Never drop columns in production** without a deprecation period (mark as nullable first, migrate data, then drop in a later migration)
2. **JSONB schema changes** do not require migrations — validate at application layer with Zod
3. **Index creation** uses `CREATE INDEX CONCURRENTLY` to avoid table locks in production
4. **Backfill migrations** are run separately from schema migrations during off-peak hours
5. **Rollback scripts** are written alongside every migration that cannot be trivially reversed

### Adding new fields to JSONB columns:
JSONB fields (`preferences`, `ai_response`, `content`, `true_desires`, `confidence_scores`) evolve without migrations. When the AI model output schema changes:
1. Update the Zod validation schema in `packages/validation/`
2. Update the JSONB field documentation in this document
3. Handle missing fields gracefully with `?.` optional chaining in application code
4. Run a one-time backfill job if existing records need updating

---

## Seed Data (Development)

```sql
-- Development seed: creates a test user with a complete project
INSERT INTO public.users (id, email, name, subscription_tier, onboarding_completed)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'dev@sourceconstructor.com',
  'Dev User',
  'pro',
  TRUE
);

INSERT INTO public.user_profiles (user_id, timezone, ai_style_preference)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'America/New_York',
  'balanced'
);

-- Additional seed data omitted for brevity; see apps/api/seeds/development.sql
```

---

*This schema document is the source of truth for database structure. Any proposed schema change must be reflected here before implementation. JSONB field examples should be updated whenever the AI prompt output format changes significantly.*
