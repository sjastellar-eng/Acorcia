// ─────────────────────────────────────────────────────────────
// Source Constructor — Shared TypeScript Types
// ─────────────────────────────────────────────────────────────

// ── USER ─────────────────────────────────────────────────────

export type UserPlan = 'free' | 'pro' | 'annual'
export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  plan: UserPlan
  role: UserRole
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// ── DISCOVERY SESSION ────────────────────────────────────────

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'
export type SessionType = 'open_discovery' | 'focused'
export type SessionPhase =
  | 'context'
  | 'values'
  | 'desires'
  | 'constraints'
  | 'synthesis'
  | 'complete'

export interface DiscoverySession {
  id: string
  userId: string
  title: string | null
  type: SessionType
  status: SessionStatus
  currentPhase: SessionPhase
  focusQuestion: string | null
  summary: string | null
  startedAt: string
  completedAt: string | null
  durationMinutes: number | null
  messageCount: number
}

export interface SessionMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  phase: SessionPhase
  createdAt: string
}

export interface SessionInsight {
  id: string
  sessionId: string
  userId: string
  content: string
  theme: string | null
  importance: number
  createdAt: string
}

// ── PROJECT ───────────────────────────────────────────────────

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived'
export type ProjectPhaseStatus = 'not_started' | 'in_progress' | 'completed'

export interface Project {
  id: string
  userId: string
  sessionId: string | null
  name: string
  tagline: string | null
  description: string | null
  targetUser: string | null
  monetizationModel: string | null
  timeCommitmentWeekly: number | null
  timelineWeeks: number | null
  status: ProjectStatus
  progressPercent: number
  currentStreak: number
  longestStreak: number
  createdAt: string
  updatedAt: string
  phases?: ProjectPhase[]
  tasks?: Task[]
  insights?: ProjectInsight[]
}

export interface ProjectPhase {
  id: string
  projectId: string
  title: string
  description: string | null
  orderIndex: number
  status: ProjectPhaseStatus
  startWeek: number
  endWeek: number
  completedAt: string | null
  milestones?: Milestone[]
}

export interface Milestone {
  id: string
  phaseId: string
  projectId: string
  title: string
  description: string | null
  dueDate: string | null
  completedAt: string | null
  orderIndex: number
}

export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'skipped'

export interface Task {
  id: string
  projectId: string
  phaseId: string | null
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  dueDate: string | null
  completedAt: string | null
  orderIndex: number
  isAiSuggested: boolean
  createdAt: string
}

export interface ProjectInsight {
  id: string
  projectId: string
  userId: string
  content: string
  source: 'session' | 'checkin' | 'pattern_detection'
  createdAt: string
}

// ── DAILY CHECK-IN ────────────────────────────────────────────

export type CheckinStatus = 'done' | 'partial' | 'missed' | 'skipped'

export interface DailyCheckin {
  id: string
  userId: string
  projectId: string
  date: string
  taskCommittedId: string | null
  taskCommittedTitle: string | null
  taskResult: CheckinStatus | null
  taskResultNote: string | null
  aiResponse: string | null
  nextTaskId: string | null
  nextTaskTitle: string | null
  blockerMentioned: string | null
  moodScore: number | null
  completedAt: string | null
  createdAt: string
}

// ── API RESPONSES ─────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, string>
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ── PAGINATION ────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ── STREAMING ─────────────────────────────────────────────────

export type StreamEvent =
  | { type: 'token'; content: string }
  | { type: 'phase_change'; phase: SessionPhase }
  | { type: 'session_complete'; summary: string; projectDraft: ProjectDraft }
  | { type: 'error'; message: string }
  | { type: 'done' }

export interface ProjectDraft {
  name: string
  tagline: string
  description: string
  targetUser: string
  monetizationModel: string
  timelineWeeks: number
  timeCommitmentWeekly: number
  phases: {
    title: string
    description: string
    startWeek: number
    endWeek: number
    milestones: { title: string; description: string; weekOffset: number }[]
  }[]
  firstWeekTasks: { title: string; priority: TaskPriority }[]
  coreInsights: { content: string; theme: string }[]
}

// ── BILLING ───────────────────────────────────────────────────

export interface Subscription {
  id: string
  userId: string
  stripeSubscriptionId: string
  plan: UserPlan
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnd: string | null
}

// ── ANALYTICS ─────────────────────────────────────────────────

export interface UserStats {
  totalSessions: number
  totalProjects: number
  totalTasksCompleted: number
  currentStreak: number
  longestStreak: number
  totalCheckins: number
  weeklyTasksCompleted: number[]
  topThemes: { theme: string; count: number }[]
  projectProgress: number
}
