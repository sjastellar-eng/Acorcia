import { Router, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@soc/database'
import { authenticate, AuthRequest } from '../middleware/auth'
import type { ProjectDraft } from '@soc/types'

const router = Router()
router.use(authenticate)

// ── SCHEMAS ───────────────────────────────────────────────────

const CreateProjectSchema = z.object({
  sessionId: z.string().optional(),
  projectDraft: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    targetUser: z.string(),
    monetizationModel: z.string(),
    timelineWeeks: z.number(),
    timeCommitmentWeekly: z.number(),
    phases: z.array(z.object({
      title: z.string(),
      description: z.string(),
      startWeek: z.number(),
      endWeek: z.number(),
      milestones: z.array(z.object({
        title: z.string(),
        description: z.string(),
        weekOffset: z.number(),
      })),
    })),
    firstWeekTasks: z.array(z.object({
      title: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
    })),
    coreInsights: z.array(z.object({
      content: z.string(),
      theme: z.string(),
    })),
  }),
})

const UpdateTaskSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done', 'skipped']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  title: z.string().optional(),
})

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(500),
  phaseId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
})

// ── CREATE PROJECT FROM SESSION ───────────────────────────────

router.post('/', async (req: AuthRequest, res: Response) => {
  const body = CreateProjectSchema.parse(req.body)
  const draft: ProjectDraft = body.projectDraft

  // Check free plan limit (1 project)
  if (req.userPlan === 'free') {
    const count = await prisma.project.count({ where: { userId: req.userId! } })
    if (count >= 1) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PROJECT_LIMIT',
          message: 'Free plan allows 1 project. Upgrade to Pro for unlimited.',
        },
      })
    }
  }

  const project = await prisma.project.create({
    data: {
      userId: req.userId!,
      sessionId: body.sessionId ?? null,
      name: draft.name,
      tagline: draft.tagline,
      description: draft.description,
      targetUser: draft.targetUser,
      monetizationModel: draft.monetizationModel,
      timelineWeeks: draft.timelineWeeks,
      timeCommitmentWeekly: draft.timeCommitmentWeekly,

      phases: {
        create: draft.phases.map((phase, idx) => ({
          title: phase.title,
          description: phase.description,
          orderIndex: idx,
          startWeek: phase.startWeek,
          endWeek: phase.endWeek,
          milestones: {
            create: phase.milestones.map((m, mIdx) => ({
              title: m.title,
              description: m.description,
              orderIndex: mIdx,
              dueDate: new Date(
                Date.now() + m.weekOffset * 7 * 24 * 60 * 60 * 1000
              ),
            })),
          },
        })),
      },

      tasks: {
        create: draft.firstWeekTasks.map((task, idx) => ({
          title: task.title,
          priority: task.priority,
          orderIndex: idx,
          isAiSuggested: true,
        })),
      },

      insights: {
        create: draft.coreInsights.map((insight) => ({
          content: insight.content,
          source: 'session',
          userId: req.userId!,
        })),
      },
    },
    include: {
      phases: { include: { milestones: true } },
      tasks: { orderBy: { orderIndex: 'asc' } },
      insights: true,
    },
  })

  return res.status(201).json({ success: true, data: { project } })
})

// ── LIST PROJECTS ─────────────────────────────────────────────

router.get('/', async (req: AuthRequest, res: Response) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId!, status: { not: 'archived' } },
    orderBy: { updatedAt: 'desc' },
    include: {
      phases: {
        orderBy: { orderIndex: 'asc' },
        include: { milestones: { orderBy: { orderIndex: 'asc' } } },
      },
      tasks: {
        where: { status: { not: 'skipped' } },
        orderBy: { orderIndex: 'asc' },
        take: 10,
      },
      insights: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })

  return res.json({ success: true, data: { projects } })
})

// ── GET PROJECT ───────────────────────────────────────────────

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.userId! },
    include: {
      phases: {
        orderBy: { orderIndex: 'asc' },
        include: { milestones: { orderBy: { orderIndex: 'asc' } } },
      },
      tasks: {
        where: { status: { not: 'skipped' } },
        orderBy: { orderIndex: 'asc' },
      },
      insights: { orderBy: { createdAt: 'desc' } },
      checkins: { orderBy: { date: 'desc' }, take: 14 },
    },
  })

  if (!project) throw new Error('NOT_FOUND')

  return res.json({ success: true, data: { project } })
})

// ── UPDATE TASK ───────────────────────────────────────────────

router.patch('/:id/tasks/:taskId', async (req: AuthRequest, res: Response) => {
  const body = UpdateTaskSchema.parse(req.body)

  const task = await prisma.task.findFirst({
    where: { id: req.params.taskId, projectId: req.params.id },
    include: { project: { select: { userId: true } } },
  })

  if (!task || task.project.userId !== req.userId) throw new Error('NOT_FOUND')

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      ...body,
      completedAt: body.status === 'done' ? new Date() : undefined,
    },
  })

  // Recalculate project progress
  await recalculateProgress(req.params.id)

  return res.json({ success: true, data: { task: updated } })
})

// ── CREATE TASK ───────────────────────────────────────────────

router.post('/:id/tasks', async (req: AuthRequest, res: Response) => {
  const body = CreateTaskSchema.parse(req.body)

  const project = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  })

  if (!project) throw new Error('NOT_FOUND')

  const maxOrder = await prisma.task.aggregate({
    where: { projectId: project.id },
    _max: { orderIndex: true },
  })

  const task = await prisma.task.create({
    data: {
      projectId: project.id,
      phaseId: body.phaseId ?? null,
      title: body.title,
      priority: body.priority,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      orderIndex: (maxOrder._max.orderIndex ?? 0) + 1,
    },
  })

  return res.status(201).json({ success: true, data: { task } })
})

// ── GET STATS ─────────────────────────────────────────────────

router.get('/:id/stats', async (req: AuthRequest, res: Response) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  })

  if (!project) throw new Error('NOT_FOUND')

  const [totalTasks, completedTasks, checkins] = await Promise.all([
    prisma.task.count({ where: { projectId: project.id, status: { not: 'skipped' } } }),
    prisma.task.count({ where: { projectId: project.id, status: 'done' } }),
    prisma.dailyCheckin.findMany({
      where: { projectId: project.id, userId: req.userId! },
      orderBy: { date: 'desc' },
      take: 90,
    }),
  ])

  // Weekly task completions (last 8 weeks)
  const weeklyTasksCompleted: number[] = Array(8).fill(0)
  const now = Date.now()

  for (const checkin of checkins) {
    const weeksAgo = Math.floor(
      (now - checkin.date.getTime()) / (7 * 24 * 60 * 60 * 1000)
    )
    if (weeksAgo < 8 && checkin.taskResult === 'done') {
      weeklyTasksCompleted[7 - weeksAgo]++
    }
  }

  return res.json({
    success: true,
    data: {
      stats: {
        totalSessions: await prisma.discoverySession.count({ where: { userId: req.userId! } }),
        totalProjects: await prisma.project.count({ where: { userId: req.userId! } }),
        totalTasksCompleted: completedTasks,
        currentStreak: project.currentStreak,
        longestStreak: project.longestStreak,
        totalCheckins: checkins.length,
        weeklyTasksCompleted,
        projectProgress: project.progressPercent,
        topThemes: await getTopThemes(req.userId!),
      },
    },
  })
})

// ── HELPERS ───────────────────────────────────────────────────

async function recalculateProgress(projectId: string) {
  const [total, done] = await Promise.all([
    prisma.task.count({ where: { projectId, status: { not: 'skipped' } } }),
    prisma.task.count({ where: { projectId, status: 'done' } }),
  ])

  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  await prisma.project.update({
    where: { id: projectId },
    data: { progressPercent: progress },
  })
}

async function getTopThemes(
  userId: string
): Promise<{ theme: string; count: number }[]> {
  const insights = await prisma.sessionInsight.findMany({
    where: { userId },
    select: { theme: true },
  })

  const counts: Record<string, number> = {}
  for (const insight of insights) {
    if (insight.theme) {
      counts[insight.theme] = (counts[insight.theme] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

export default router
