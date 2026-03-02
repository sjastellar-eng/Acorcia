# User Stories — Source Constructor (SOC)
# Organized by Epic

**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Ready for Sprint Planning
**Owner:** Product Team

---

## Story Point Scale

| Points | Complexity |
|--------|-----------|
| 1 | Trivial — configuration or copy change |
| 2 | Simple — well-understood, low risk |
| 3 | Small — clear scope, minimal unknowns |
| 5 | Medium — some complexity or unknown |
| 8 | Large — significant complexity or cross-team dependency |
| 13 | Very Large — needs breakdown before sprint |

---

## Priority Definitions

- **P0:** Must be in MVP; blocking launch
- **P1:** Should be in v1.0; high value, launchable without but not advisable
- **P2:** Nice to have; planned for v1.5 or later

---

## Epic 1: Onboarding

**Epic Goal:** A new user can register, understand what SOC does, and reach their first activated state (project accepted) within a single session.

**Epic Success Metric:** ≥ 65% of registered users reach project acceptance within 48 hours.

---

### US-001: Account Registration

**As a** first-time visitor
**I want to** create an account using my email or Google/Apple login
**So that** I can access the platform securely and have my data saved across sessions

**Acceptance Criteria:**
- [ ] User can register with email + password (password min 8 characters, 1 uppercase, 1 number)
- [ ] User can register with Google OAuth 2.0
- [ ] User can register with Apple Sign-In (iOS app only)
- [ ] Verification email sent within 60 seconds of email registration
- [ ] Unverified users can start onboarding but are prompted to verify before project acceptance
- [ ] Duplicate email registration shows clear error: "An account with this email already exists"
- [ ] Password field has show/hide toggle
- [ ] Registration form is accessible: all fields have labels, error messages are descriptive

**Priority:** P0
**Story Points:** 5
**Dependencies:** None

---

### US-002: Welcome Onboarding Slides

**As a** newly registered user
**I want to** see a brief introduction to what SOC does and why it's different
**So that** I arrive at the Discovery Session with context and motivation

**Acceptance Criteria:**
- [ ] 3 slides presented in sequence: (1) "What SOC is", (2) "How Discovery Session works", (3) "What you'll leave with"
- [ ] Each slide has a title, one-paragraph explanation, and a simple illustration
- [ ] Slide 3 has a prominent "Begin My Discovery" CTA
- [ ] Slides are swipeable on mobile and clickable on desktop
- [ ] First-time only: cannot be permanently skipped, but user can tap "skip intro" to proceed immediately to context questions
- [ ] On return visits, onboarding slides do not appear

**Priority:** P0
**Story Points:** 2
**Dependencies:** US-001

---

### US-003: Pre-Session Context Questions

**As a** user beginning onboarding
**I want to** answer 3 brief context questions before the Discovery Session
**So that** the AI can calibrate its opening questions to my specific situation

**Acceptance Criteria:**
- [ ] Three questions displayed sequentially, one per screen
- [ ] Question 1: "What best describes your situation right now?" — single-select from 4 options
- [ ] Question 2: "How long have you felt like something needs to change?" — single-select from 4 options
- [ ] Question 3: "What have you tried to address this?" — multi-select (up to 5 options + free text "Other")
- [ ] Progress indicator shows "3 of 3 questions" clearly
- [ ] User can navigate back to previous context question
- [ ] Answers are stored and used to personalize the Discovery Session opening
- [ ] If user skips intro slides (US-002 skip), context questions still appear

**Priority:** P0
**Story Points:** 3
**Dependencies:** US-002

---

### US-004: Push Notification Permission Request

**As a** user completing onboarding
**I want to** be asked for push notification permission at the right moment — not immediately on app open
**So that** I understand why notifications matter and am more likely to grant permission

**Acceptance Criteria:**
- [ ] Permission request appears AFTER project acceptance (not on first open)
- [ ] Before the system prompt, a custom in-app explanation screen appears: "SOC works best with daily check-ins. We'll send you one reminder per day at a time you choose."
- [ ] User can choose their preferred notification time (time picker) before granting permission
- [ ] If user denies, the preference time is saved anyway; user can enable notifications later in Settings
- [ ] The system OS permission dialog appears only after the user taps "Enable Notifications" on the custom screen
- [ ] If user has already granted permission (e.g., re-install), the custom screen appears but system dialog does not

**Priority:** P0
**Story Points:** 3
**Dependencies:** US-001, US-007 (Project Acceptance, Epic 3)

---

### US-005: Onboarding Re-Entry After Abandonment

**As a** user who started onboarding but left before completing the Discovery Session
**I want to** return to exactly where I left off
**So that** I don't have to start over and can complete the process at my own pace

**Acceptance Criteria:**
- [ ] Session state persisted at every step of onboarding (including every Discovery question answered)
- [ ] When user returns within 7 days, app opens directly to the abandoned step with context: "Welcome back. You were on question 12 of your Discovery Session."
- [ ] User can choose to resume or start over (starting over resets all session data and begins from context questions)
- [ ] If 7 days have elapsed since abandonment, system sends one email: "Your Discovery Session is waiting"
- [ ] If 14 days have elapsed, session expires; user must start Discovery Session from scratch (context questions re-used)
- [ ] Re-entry banner is warm and non-judgmental: "Pick up where you left off — no pressure."

**Priority:** P0
**Story Points:** 5
**Dependencies:** US-003

---

## Epic 2: Discovery Session

**Epic Goal:** Users complete a 20-question AI dialogue that accurately surfaces their core desires, values, and patterns, producing an insight profile they agree with.

**Epic Success Metric:** ≥ 65% session completion rate; ≥ 80% of users accept their generated insight profile without major edits.

---

### US-006: Discovery Session Question Flow

**As a** user in the Discovery Session
**I want to** answer questions one at a time in a conversational format
**So that** the experience feels like a real dialogue, not a form

**Acceptance Criteria:**
- [ ] Each question displayed one at a time, full-screen
- [ ] Question text appears with typewriter animation (character-by-character, 40ms delay)
- [ ] Response can be free-text (primary) or selection-based when AI offers options
- [ ] "Send" button activates only when response has ≥ 3 words (free text) or a selection is made
- [ ] After submission, AI acknowledges the answer with a brief 1–2 sentence reflection before the next question
- [ ] Subtle progress indicator shows current question number without countdown pressure
- [ ] User can scroll up to review all prior questions and responses in the current session
- [ ] Auto-save after each submitted answer

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-003 (context questions), AI API integration

---

### US-007: Adaptive Question Selection

**As a** user in the Discovery Session
**I want to** receive questions that feel relevant to what I just said
**So that** the session feels intelligent and personally tailored

**Acceptance Criteria:**
- [ ] Each question is selected from a bank of ≥ 100 questions across 5 categories (values, work style, fears, desires, patterns)
- [ ] Question selection algorithm runs after each submitted answer
- [ ] The same question is never repeated in a single session
- [ ] If user mentions a specific topic (e.g., "I want to start a company"), subsequent questions reference this context
- [ ] System detects emotional intensity signals in responses; if intensity is high, next question deepens on that topic rather than changing subject
- [ ] At question 10, system has classified at least 2 core themes with confidence ≥ 50
- [ ] Questions 11–20 are biased toward the 2–3 leading themes identified at question 10
- [ ] If adaptive selection fails (API error), fallback to curated linear question sequence

**Priority:** P0
**Story Points:** 13
**Dependencies:** US-006, NLP pipeline, question bank database

---

### US-008: Session Pause and Resume

**As a** user who needs to stop mid-Discovery-Session
**I want to** pause and resume the session at any time within 7 days
**So that** I can take the session seriously without needing to block a continuous 30-minute window

**Acceptance Criteria:**
- [ ] "Save & Pause" button visible at all times during session (not hidden in menu)
- [ ] Upon pausing, app shows confirmation: "Your session is saved. You can return anytime in the next 7 days."
- [ ] Returning user is brought directly to the next question with a brief recap of the last 2–3 questions
- [ ] Paused sessions that expire (after 7 days) show a "Your session expired" message with option to start fresh
- [ ] If user pauses for > 24 hours, a push notification is sent: "Your Discovery Session is waiting for you"
- [ ] Session pause counter tracks how many pauses occurred; if > 3 pauses, a supportive message is shown: "Taking your time is fine — you're doing great."

**Priority:** P0
**Story Points:** 5
**Dependencies:** US-006

---

### US-009: Discovery Session Insight Summary

**As a** user who completed the Discovery Session
**I want to** see a clear, accurate summary of what the AI discovered about me
**So that** I feel understood and can verify the insights before proceeding to project generation

**Acceptance Criteria:**
- [ ] Summary screen shows 3–5 key insights, each in a titled card format
- [ ] Each insight card includes: theme label, 2–3 sentence explanation in plain language, a confidence indicator (Low / Medium / High)
- [ ] Only insights with confidence score ≥ 60 are shown (minimum 3 shown regardless)
- [ ] Each insight includes one direct quote from the user's Discovery Session responses
- [ ] Summary uses the user's own language and phrasing where possible (no jargon)
- [ ] User can tap any insight to expand and see the specific questions/answers that led to it
- [ ] User can tap an "Edit" icon on any insight to modify the label or description
- [ ] User can remove an insight from the summary (with confirmation: "Are you sure? This will affect your project recommendations")
- [ ] "Looks right — Generate My Projects" CTA at bottom of summary

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-006, US-007, confidence scoring algorithm

---

### US-010: Discovery Session Insight Editing

**As a** user reviewing my insight summary
**I want to** correct or reject insights that don't feel accurate
**So that** the projects generated reflect who I actually am, not who the AI thinks I am

**Acceptance Criteria:**
- [ ] Edit mode for each insight: user can modify the description (free text, max 300 characters)
- [ ] User can change an insight's theme label from a list of 15 predefined labels or create a custom label
- [ ] Removed insights are archived (not deleted) in the user's profile for 90 days
- [ ] If user removes 3+ insights, system shows: "Would you like to add a detail we might have missed?" (optional free-text field to add context)
- [ ] Edits are logged to improve model quality (anonymized; not linked to user if they've opted out of data sharing)
- [ ] After editing, "Regenerate Summary" option available once before proceeding to project generation

**Priority:** P1
**Story Points:** 5
**Dependencies:** US-009

---

### US-011: Discovery Session Quality Safeguards

**As a** user in the Discovery Session
**I want to** feel safe sharing difficult or sensitive thoughts
**So that** the session produces genuine insights, not polished, self-censored answers

**Acceptance Criteria:**
- [ ] AI acknowledges emotionally significant responses (detected via sentiment analysis) before proceeding: "That sounds really significant. Thank you for sharing that."
- [ ] If user mentions phrases associated with acute distress (e.g., references to self-harm, hopelessness), session pauses and displays: "It sounds like you're going through something heavy. SOC is a growth tool, not a crisis service. Please consider reaching out to [crisis resource links]." Session can then continue or be paused.
- [ ] Crisis keywords trigger a flag in the user's record for internal monitoring (anonymized; privacy policy covers this)
- [ ] AI never provides medical, legal, or financial advice; if user asks, AI redirects warmly
- [ ] No question asks users to disclose anything they are not comfortable with; "skip this question" option always visible

**Priority:** P0
**Story Points:** 5
**Dependencies:** US-006, crisis keyword detection service

---

### US-012: Returning User Discovery Session (Re-Run)

**As a** user who completed an initial Discovery Session 90+ days ago
**I want to** run a new Discovery Session to reflect how I've grown and changed
**So that** my project recommendations stay relevant to who I am today

**Acceptance Criteria:**
- [ ] Discovery Session re-run available to paid users after 90 days from previous session
- [ ] Free users can re-run once per year
- [ ] Re-run session incorporates awareness of previous session: opening question references growth since last session
- [ ] Previous insight profile is preserved and shown alongside new profile after completion
- [ ] User can view a "diff" view: what changed between sessions (new insights, dropped insights, evolved insights)
- [ ] If new session conflicts significantly with previous (confidence ≥ 70 on contradicting insight), AI notes this: "This seems like an important shift — we'll prioritize this in your new project recommendations"
- [ ] Previous session transcript archived and downloadable (paid feature)

**Priority:** P1
**Story Points:** 8
**Dependencies:** US-009, user account data, subscription check

---

### US-013: Discovery Session Progress Analytics (Internal)

**As a** product manager / data analyst
**I want to** track question-level drop-off, session completion rates, and insight confidence distributions
**So that** I can improve the question bank and adaptive algorithm over time

**Acceptance Criteria:**
- [ ] Every question view, response submitted, and session pause is logged as an analytics event
- [ ] Admin dashboard shows: session completion rate by cohort (day of week, user segment, onboarding source)
- [ ] Question-level abandonment rate visible: which question do most users pause on?
- [ ] Insight confidence score distribution chart (histogram per insight theme)
- [ ] Average session duration and response length tracked
- [ ] All analytics data is anonymized at the user level; no PII in analytics tables
- [ ] Analytics data available to internal team only (no third-party analytics tools with PII access)

**Priority:** P1
**Story Points:** 5
**Dependencies:** US-006, analytics infrastructure

---

## Epic 3: Project Management

**Epic Goal:** Users accept a personalized project proposal, begin executing on it, and can manage their project's milestones and tasks within the app.

**Epic Success Metric:** ≥ 70% of users who view generated projects accept at least one; ≥ 50% of accepted projects have their first milestone marked complete within 30 days.

---

### US-014: Project Generation Display

**As a** user who completed and approved their insight summary
**I want to** see 2–3 personalized project proposals presented in a clear, compelling format
**So that** I can make an informed decision about which project to pursue

**Acceptance Criteria:**
- [ ] Loading state shown during generation (≤ 30 seconds) with animated progress and brief copy: "Designing your projects..."
- [ ] Projects displayed as visual cards, stacked vertically on mobile, side-by-side on desktop
- [ ] Each card shows: project title, one-line vision, alignment score, project domain tag (Career / Creative / Health / Relationship / Skill)
- [ ] User can tap any card to expand to full project detail view
- [ ] Full detail view shows: title, vision, "Why this for you" section (3–4 sentences referencing specific insights), 3 milestones (30/60/90-day), top 5 first-week tasks, 3 resources (books/courses/tools)
- [ ] Alignment score explained on tap: "This project scores 87% because it directly addresses your desire for creative independence and your pattern of thriving in structured learning"
- [ ] "Start This Project" button on full detail view

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-009, US-010, Project Generation Engine (AI), project database schema

---

### US-015: Project Acceptance and Activation

**As a** user who chose a project
**I want to** formally accept and activate it with a satisfying, meaningful moment
**So that** I feel committed and excited to begin

**Acceptance Criteria:**
- [ ] "Start This Project" CTA leads to a brief commitment screen: "You're committing to [Project Title]. This is your 90-day journey." with the project's core vision displayed
- [ ] User can add a personal "why" note (optional, max 200 characters): "Why does this matter to you?"
- [ ] Confirmation button triggers a celebratory animation (confetti or similar) + haptic feedback on mobile
- [ ] Project immediately appears in user's dashboard as "Active"
- [ ] Free users: if they have an existing active project, shown a message: "You can have 1 active project on the free plan. Would you like to archive your current project?" with upgrade prompt
- [ ] Paid users: up to 3 simultaneous active projects
- [ ] Rejected projects (not selected) stored in "Saved Ideas" tab for 90 days

**Priority:** P0
**Story Points:** 5
**Dependencies:** US-014, payment/subscription system

---

### US-016: Milestone Tracking and Completion

**As a** user with an active project
**I want to** track my progress against the 30/60/90-day milestones
**So that** I can see whether I'm on track and feel a sense of accomplishment at each stage

**Acceptance Criteria:**
- [ ] Project dashboard shows 3 milestones with status (Not Started / In Progress / Complete)
- [ ] Milestone card shows: milestone title, description, due date, and associated tasks
- [ ] User can mark milestone as complete; triggers celebration animation and check-in reference
- [ ] If milestone due date passes without completion, it appears as "Overdue" with a compassionate message: "Milestones are guides, not deadlines. Tap to update your timeline."
- [ ] User can edit milestone due dates at any time
- [ ] Milestone completion triggers a special check-in: "You just hit your 30-day milestone. Let's reflect on what that means."
- [ ] Milestone completion recorded as a "Win" in the progress log

**Priority:** P1
**Story Points:** 5
**Dependencies:** US-015, Progress Tracking (Epic 5)

---

### US-017: Task Management Within Projects

**As a** user with an active project
**I want to** see and manage the weekly tasks associated with my project
**So that** I know what to do today without having to figure it out myself

**Acceptance Criteria:**
- [ ] Each project has a task list generated by AI, organized by week (Week 1, Week 2, etc.)
- [ ] AI generates tasks up to 4 weeks in advance; new weeks auto-populate on schedule
- [ ] User can mark tasks complete, skip, or snooze (snooze moves task to next week)
- [ ] User can edit task descriptions or add custom tasks
- [ ] "Today's Focus" section on dashboard surfaces 1–2 recommended tasks for today based on project phase and check-in data
- [ ] Task completion triggers micro-celebration (subtle, not intrusive)
- [ ] If no tasks completed in a week, daily check-in asks: "What got in the way this week?" with blocker options

**Priority:** P1
**Story Points:** 8
**Dependencies:** US-015, US-016, AI API (task generation)

---

### US-018: Project Archiving and New Project Start

**As a** user who has completed or abandoned their current project
**I want to** archive it and start a new one
**So that** I can continue using SOC for my next goal without feeling stuck with an irrelevant project

**Acceptance Criteria:**
- [ ] "Archive Project" option available from project settings (behind a confirmation: "Are you sure? Archived projects cannot be reactivated, but your progress will be saved.")
- [ ] Archived project moves to "Completed Journey" section of dashboard with all data intact
- [ ] After archiving, user is prompted: "Ready for your next project? You can generate new proposals from your existing insight profile or run a new Discovery Session."
- [ ] New project generation from existing insights available for paid users without re-running Discovery Session
- [ ] Free users must re-run Discovery Session to generate new projects (after 90-day cooldown)
- [ ] Completing a full 90-day project (all 3 milestones marked complete) triggers a "Project Complete" celebration with a shareable achievement card

**Priority:** P1
**Story Points:** 5
**Dependencies:** US-015, US-016, subscription system

---

### US-019: Saved Ideas Browser

**As a** user who did not select one of the generated project proposals
**I want to** browse my saved (rejected) project ideas later
**So that** I can revisit them if my current project doesn't work out or if I'm curious

**Acceptance Criteria:**
- [ ] "Saved Ideas" section visible in project area of dashboard
- [ ] Shows all unselected project proposals from the last 90 days
- [ ] Each saved idea has a "Activate This Project" button (subject to same free/paid tier limits)
- [ ] Saved ideas expire after 90 days; user receives a notification 7 days before expiry: "Your saved project ideas expire in 7 days"
- [ ] User can regenerate fresh project proposals from the saved ideas screen (once every 7 days)

**Priority:** P1
**Story Points:** 3
**Dependencies:** US-014, US-015

---

## Epic 4: Daily Companion

**Epic Goal:** Users develop a consistent daily check-in habit with SOC, feeling genuinely supported and not pressured.

**Epic Success Metric:** ≥ 40% of active users complete a daily check-in on any given day; median streak length ≥ 7 days.

---

### US-020: Daily Check-In Flow

**As a** user with an active project
**I want to** complete a brief, meaningful daily check-in with the AI
**So that** I stay connected to my project and receive guidance relevant to where I am today

**Acceptance Criteria:**
- [ ] Check-in accessible from: push notification, dashboard "Check In" button, home screen widget
- [ ] Opening screen shows today's date, current streak, and a personalized greeting referencing the user's project
- [ ] 3–5 questions asked depending on user state (defined by state machine)
- [ ] Question 1 always: emotional/energy state ("How are you showing up today?") — 5-option selection + optional free text
- [ ] Question 2 always: project progress ("How's [Project Name] going?") — 4-option selection + optional free text
- [ ] Questions 3–5: conditional based on Q1 and Q2 answers
- [ ] Each question transitions smoothly with brief AI acknowledgment of previous answer
- [ ] Check-in concludes with: micro-action suggestion, streak update, and optional win log entry
- [ ] Full check-in completable in ≤ 5 minutes (validated by user testing)
- [ ] Completion triggers streak counter increment and push notification acknowledgment

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-015, sentiment analysis, state machine, push notification system

---

### US-021: Streak Mechanics and Milestone Celebrations

**As a** user building a check-in habit
**I want to** see my streak grow and feel celebrated at key milestones
**So that** consistency feels rewarding and worth maintaining

**Acceptance Criteria:**
- [ ] Streak counter visible on home dashboard and check-in screen
- [ ] Streak increments once per calendar day (UTC-adjusted to user's timezone)
- [ ] Grace period: streak does not break if user checks in within 36 hours of previous check-in (once per 14-day period)
- [ ] Streak milestone celebrations: 7, 14, 30, 60, 90, 180, 365 days
- [ ] Each milestone triggers: full-screen animation, personalized message ("30 days. That's not habit — that's who you're becoming."), shareable image card
- [ ] If streak breaks, system message is compassionate: "Your streak reset. That's okay. What matters is you're back." — counter shows 0 but historical best streak is always visible
- [ ] Users can see their current streak, best-ever streak, and total check-ins completed in their profile

**Priority:** P1
**Story Points:** 5
**Dependencies:** US-020

---

### US-022: Adaptive Check-In Personalization

**As a** user who has completed 14+ check-ins
**I want to** notice that the AI is asking smarter, more relevant questions over time
**So that** the check-in continues to feel fresh and genuinely tailored

**Acceptance Criteria:**
- [ ] After 14 check-ins, system begins referencing patterns: "Last week you said you were energized on Tuesdays — how's today feeling?"
- [ ] Check-in questions rotate to avoid repetition; no identical question appears more than once in a 14-day window
- [ ] If user consistently reports low energy (3+ check-ins in 7 days), AI shifts to a support mode: fewer task-related questions, more reflection questions
- [ ] If user consistently reports high energy and progress, AI introduces challenge questions: "What would make this week feel like a breakthrough?"
- [ ] Weekly question set is re-weighted based on rolling sentiment score and project phase
- [ ] AI explicitly references insights from the user's Discovery Session in check-ins at least once every 10 check-ins

**Priority:** P1
**Story Points:** 8
**Dependencies:** US-020, US-021, sentiment tracking, Discovery Session insight profile

---

### US-023: Re-Engagement After Inactivity

**As a** user who has missed 3+ days of check-ins
**I want to** receive a gentle, non-judgmental re-engagement message
**So that** I can return to SOC without feeling guilty or ashamed about the gap

**Acceptance Criteria:**
- [ ] Day 3 inactivity: push notification, warm tone: "Hey — we noticed you've been away. Whenever you're ready, we're here."
- [ ] Day 7 inactivity: email + push notification: "Your project [name] is still here. Pick up where you left off — no judgment."
- [ ] Day 14 inactivity: email with subject "Let's reset, not quit" — offers a "soft restart" check-in (simpler, 2-question format for re-entry)
- [ ] Day 30 inactivity: final email with "We don't want to spam you. Is SOC still useful? [Yes, I'll come back] [Pause my account] [Cancel subscription]"
- [ ] Re-entry check-in (after 7+ days away) starts with: "Welcome back. No catching up needed. Let's just start fresh from today."
- [ ] Streak counter shows 0 with compassionate message; but "longest streak" is preserved as a badge
- [ ] Users who re-engage after 30+ days are offered a free Discovery Session re-run regardless of subscription tier

**Priority:** P1
**Story Points:** 5
**Dependencies:** US-020, US-021, email notification system, push notification system

---

### US-024: Win Capture and Celebration

**As a** user who has experienced a meaningful moment in my project journey
**I want to** capture it as a "Win" and feel it acknowledged by the AI
**So that** my progress is documented and I feel motivated to keep going

**Acceptance Criteria:**
- [ ] Win can be captured from: check-in flow (AI suggests it), manually from project dashboard ("Add a Win"), or on milestone completion
- [ ] Win entry includes: title (auto-suggested by AI, editable), optional description, date, and associated project
- [ ] AI generates a celebratory response when a win is shared: personalized, warm, references the specific win
- [ ] Wins appear in a chronological log in the Progress dashboard
- [ ] "Big wins" (milestone completion, streak milestones) generate a shareable card (image with user's win quote and SOC branding)
- [ ] On any given check-in, if AI detects a win being mentioned in free-text response, it prompts: "That sounds like a win! Would you like to save it?"
- [ ] Free users: unlimited win logging; shareable cards available on paid tier only

**Priority:** P1
**Story Points:** 5
**Dependencies:** US-020, US-016 (milestone tracking), Progress Tracking (Epic 5)

---

## Epic 5: Progress & Insights

**Epic Goal:** Users with 7+ days of data can see meaningful patterns and progress visualizations that reinforce their engagement and self-understanding.

**Epic Success Metric:** ≥ 60% of 30-day active users visit the Progress dashboard at least once per week.

---

### US-025: Progress Dashboard

**As a** user with at least 7 days of check-ins
**I want to** see a visual dashboard of my progress, patterns, and emotional trends
**So that** I can understand my journey and feel a sense of measurable advancement

**Acceptance Criteria:**
- [ ] Dashboard accessible from main navigation
- [ ] Shows: current streak, total check-ins, project completion percentage, all-time wins count
- [ ] Mood trend chart: 7-day and 30-day rolling average of emotional state (1–5 scale derived from Q1 of check-in)
- [ ] Check-in calendar heatmap: shows which days had check-ins, color-coded by mood
- [ ] Project milestone progress: visual timeline showing 30/60/90-day milestones with current position
- [ ] "Your Patterns" section (available after 14 days): auto-generated insights (e.g., "You check in most on weekdays", "Your best days are Tuesdays")
- [ ] Win log: scrollable, chronological, filterable by date and project
- [ ] Dashboard refreshes daily; no manual refresh needed

**Priority:** P1
**Story Points:** 8
**Dependencies:** US-020, US-021, US-024, analytics pipeline, charting library

---

### US-026: Weekly Pattern Insights

**As a** user who has been using SOC for 2+ weeks
**I want to** receive a weekly summary of patterns the AI noticed about me
**So that** I can understand my habits and make more intentional choices

**Acceptance Criteria:**
- [ ] Every Monday, a "Weekly Insight" card appears on the dashboard (replacing a section of the dashboard, not a separate screen)
- [ ] Insight card contains 2–3 auto-generated observations based on previous week's check-in data
- [ ] Example insights: "You checked in every day this week — your most consistent week yet", "Your energy was notably higher when you mentioned working on [specific task]", "You mentioned 'stuck' 3 times — what do you think is really going on there?"
- [ ] Each insight has an "Explore This" button that opens a reflective question prompt
- [ ] If insufficient data (< 3 check-ins in the past week), insight card shows encouragement: "Check in 3+ days this week to unlock your weekly pattern insights"
- [ ] Weekly insight cards archived in the Progress dashboard for review anytime

**Priority:** P1
**Story Points:** 5
**Dependencies:** US-025, pattern detection batch job

---

### US-027: Progress Report and Milestone Review

**As a** user who has reached the 30, 60, or 90-day milestone of their project
**I want to** receive a comprehensive milestone review generated by the AI
**So that** I can reflect on what I've achieved and plan the next phase

**Acceptance Criteria:**
- [ ] 30-day, 60-day, and 90-day reports auto-generated when user reaches those points (calendar-day based, not milestone-completion based)
- [ ] Report includes: summary of mood trend, tasks completed vs. planned, wins logged, key insights from check-ins
- [ ] AI narrates the report in 3–4 paragraphs using the user's own language patterns
- [ ] Report includes a "What the next 30 days could look like" section with 2–3 suggestions
- [ ] Report available as PDF download (paid users) or viewable in-app (all users)
- [ ] 90-day report includes an option to "Start a New Project" or "Deepen This One" with direct link to next steps

**Priority:** P1
**Story Points:** 8
**Dependencies:** US-025, US-024, AI API, PDF generation library

---

### US-028: Data Export

**As a** paid user who wants to own my data
**I want to** export all my SOC data including check-ins, insights, and progress
**So that** I can review it offline, share it with a coach, or keep a personal record

**Acceptance Criteria:**
- [ ] Export available from Account Settings > Data > Export My Data
- [ ] Export includes: Discovery Session transcript, insight profile, all check-in Q&A records, all wins, all milestone data, mood chart data (CSV)
- [ ] Data provided in two formats: human-readable PDF and structured CSV/JSON
- [ ] Export processing time: ≤ 5 minutes; user notified via email when ready
- [ ] Exported file contains a timestamp and a disclaimer: "This data was generated by SOC AI and reflects your interactions as recorded."
- [ ] Free users can request export once per year; paid users: unlimited exports
- [ ] Export does not include any other users' data, AI model weights, or proprietary system data
- [ ] GDPR deletion request: user can request full data deletion from this screen; executed within 30 days

**Priority:** P2
**Story Points:** 5
**Dependencies:** Data export pipeline, GDPR compliance review

---

## Epic 6: Account & Settings

**Epic Goal:** Users can manage their account, subscription, and preferences without friction, and can trust that their data is safe.

**Epic Success Metric:** < 5% of support tickets are account/settings related; subscription cancellation rate measured via settings exit survey.

---

### US-029: Subscription Management

**As a** user on the free tier
**I want to** understand what I'm missing and upgrade to paid with minimal friction
**So that** I can access the full value of SOC when I'm ready

**Acceptance Criteria:**
- [ ] "Upgrade to Pro" CTA appears contextually when user hits a free tier limit (not intrusive; appears inline with the blocked feature)
- [ ] Upgrade screen shows: feature comparison table (free vs. pro), pricing (monthly and annual), testimonial quote
- [ ] Payment handled via Stripe; supports credit card, Apple Pay, Google Pay
- [ ] After upgrade, user is returned to the screen they were on before the upgrade prompt
- [ ] Pro users can manage subscription from Account Settings: view next billing date, cancel, change plan
- [ ] Cancellation flow: user sees what they'll lose on cancellation, offered a 1-month pause instead, then confirms
- [ ] Cancellation survey shown after confirmation: "What's the main reason you're cancelling?" (5 options + free text)

**Priority:** P0
**Story Points:** 8
**Dependencies:** Stripe integration, subscription database

---

### US-030: Notification Preferences

**As a** user who wants to control when and how SOC contacts me
**I want to** manage my notification settings in detail
**So that** notifications feel helpful rather than intrusive

**Acceptance Criteria:**
- [ ] Settings screen: Notifications section with the following toggles and preferences:
  - Daily check-in reminder: on/off + time picker (7:00–22:00, 30-minute increments)
  - Streak reminders: on/off
  - Weekly insight delivery: on/off
  - Milestone celebrations: on/off (always on by default, can be disabled)
  - Re-engagement messages: on/off
  - Email notifications: granular control (weekly summary, product updates, promotional)
- [ ] Changes saved instantly (no "Save" button needed; auto-save)
- [ ] If user disables all notifications, display a gentle warning: "You might miss your check-in reminders. SOC works best with at least one daily nudge."
- [ ] Settings sync across devices within 30 seconds

**Priority:** P1
**Story Points:** 3
**Dependencies:** Notification infrastructure (FCM, APNS), user preferences database

---

### US-031: Privacy Controls and Data Management

**As a** user concerned about my data privacy
**I want to** understand what data SOC collects, control how it is used, and delete my account if I choose
**So that** I can trust the platform with my most personal thoughts and reflections

**Acceptance Criteria:**
- [ ] Privacy settings accessible from Account Settings > Privacy
- [ ] Clear explanation of what data is collected and why (linked to full privacy policy)
- [ ] Toggle: "Allow SOC to use my anonymized data to improve AI quality" (default: OFF; opt-in only)
- [ ] Toggle: "Allow SOC to use my anonymized data for aggregate research reports" (default: OFF; opt-in only)
- [ ] "Download My Data" button (see US-028)
- [ ] "Delete My Account" button — triggers a flow: confirmation → reason survey → 14-day grace period warning → confirm deletion
- [ ] Account deletion removes all PII within 30 days; anonymized data retained for model improvement only if user opted in
- [ ] Data deletion confirmation email sent to user's email address after deletion is initiated
- [ ] GDPR-specific: "Right to be Forgotten" request form available for EU users; response within 30 days guaranteed

**Priority:** P0
**Story Points:** 8
**Dependencies:** GDPR compliance review, data deletion pipeline, legal review

---

## Story Summary Table

| Story ID | Title | Epic | Priority | Points |
|----------|-------|------|----------|--------|
| US-001 | Account Registration | Onboarding | P0 | 5 |
| US-002 | Welcome Onboarding Slides | Onboarding | P0 | 2 |
| US-003 | Pre-Session Context Questions | Onboarding | P0 | 3 |
| US-004 | Push Notification Permission Request | Onboarding | P0 | 3 |
| US-005 | Onboarding Re-Entry After Abandonment | Onboarding | P0 | 5 |
| US-006 | Discovery Session Question Flow | Discovery | P0 | 8 |
| US-007 | Adaptive Question Selection | Discovery | P0 | 13 |
| US-008 | Session Pause and Resume | Discovery | P0 | 5 |
| US-009 | Discovery Session Insight Summary | Discovery | P0 | 8 |
| US-010 | Discovery Session Insight Editing | Discovery | P1 | 5 |
| US-011 | Discovery Session Quality Safeguards | Discovery | P0 | 5 |
| US-012 | Returning User Discovery Session | Discovery | P1 | 8 |
| US-013 | Discovery Session Analytics (Internal) | Discovery | P1 | 5 |
| US-014 | Project Generation Display | Projects | P0 | 8 |
| US-015 | Project Acceptance and Activation | Projects | P0 | 5 |
| US-016 | Milestone Tracking and Completion | Projects | P1 | 5 |
| US-017 | Task Management Within Projects | Projects | P1 | 8 |
| US-018 | Project Archiving and New Start | Projects | P1 | 5 |
| US-019 | Saved Ideas Browser | Projects | P1 | 3 |
| US-020 | Daily Check-In Flow | Companion | P0 | 8 |
| US-021 | Streak Mechanics and Celebrations | Companion | P1 | 5 |
| US-022 | Adaptive Check-In Personalization | Companion | P1 | 8 |
| US-023 | Re-Engagement After Inactivity | Companion | P1 | 5 |
| US-024 | Win Capture and Celebration | Companion | P1 | 5 |
| US-025 | Progress Dashboard | Progress | P1 | 8 |
| US-026 | Weekly Pattern Insights | Progress | P1 | 5 |
| US-027 | Progress Report and Milestone Review | Progress | P1 | 8 |
| US-028 | Data Export | Progress | P2 | 5 |
| US-029 | Subscription Management | Account | P0 | 8 |
| US-030 | Notification Preferences | Account | P1 | 3 |
| US-031 | Privacy Controls and Data Management | Account | P0 | 8 |

**Total P0 Story Points:** 88
**Total P1 Story Points:** 88
**Total P2 Story Points:** 5
**Grand Total:** 181 points
