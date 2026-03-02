import { Router, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@soc/database'
import { authenticate, AuthRequest } from '../middleware/auth'
import { generateCompanionResponse, extractInsights } from '../services/claude'

const router = Router()
router.use(authenticate)

const StartCheckinSchema = z.object({
  projectId: z.string(),
})

const CompleteCheckinSchema = z.object({
  taskResult: z.enum(['done', 'partial', 'missed', 'skipped']),
  taskResultNote: z.string().max(500).optional(),
  moodScore: z.number().min(1).max(5).optional(),
  userMessage: z.string().max(1000).optional(),
})

// ── GET TODAY'S CHECKIN ───────────────────────────────────────

router.get('/today/:projectId', async (req: AuthRequest, res: Response) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkin = await prisma.dailyCheckin.findFirst({
    where: {
      userId: req.userId!,
      projectId: req.params.projectId,
      date: today,
    },
  })

  // Get project with next task
  const project = await prisma.project.findFirst({
    where: { id: req.params.projectId, userId: req.userId! },
    include: {
      tasks: {
        where: { status: 'todo' },
        orderBy: { orderIndex: 'asc' },
        take: 1,
      },
    },
  })

  if (!project) throw new Error('NOT_FOUND')

  return res.json({
    success: true,
    data: {
      checkin,
      project: {
        id: project.id,
        name: project.name,
        currentStreak: project.currentStreak,
        progressPercent: project.progressPercent,
      },
      nextTask: project.tasks[0] ?? null,
    },
  })
})

// ── START CHECKIN ─────────────────────────────────────────────

router.post('/start', async (req: AuthRequest, res: Response) => {
  const body = StartCheckinSchema.parse(req.body)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const project = await prisma.project.findFirst({
    where: { id: body.projectId, userId: req.userId! },
    include: {
      tasks: {
        where: { status: 'todo' },
        orderBy: { orderIndex: 'asc' },
        take: 1,
      },
      insights: { take: 3 },
    },
  })

  if (!project) throw new Error('NOT_FOUND')

  // Get last completed check-in
  const lastCheckin = await prisma.dailyCheckin.findFirst({
    where: { userId: req.userId!, projectId: body.projectId, completedAt: { not: null } },
    orderBy: { date: 'desc' },
  })

  // Create or get today's checkin
  const checkin = await prisma.dailyCheckin.upsert({
    where: {
      userId_projectId_date: {
        userId: req.userId!,
        projectId: body.projectId,
        date: today,
      },
    },
    create: {
      userId: req.userId!,
      projectId: body.projectId,
      date: today,
      taskCommittedId: lastCheckin?.nextTaskId ?? project.tasks[0]?.id ?? null,
      taskCommittedTitle: lastCheckin?.nextTaskTitle ?? project.tasks[0]?.title ?? null,
    },
    update: {},
  })

  // Build companion greeting
  const projectDayCount = Math.floor(
    (Date.now() - project.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )

  // Get recent blockers from last 7 checkins
  const recentCheckins = await prisma.dailyCheckin.findMany({
    where: { projectId: body.projectId, userId: req.userId!, completedAt: { not: null } },
    orderBy: { date: 'desc' },
    take: 7,
    select: { blockerMentioned: true, taskResult: true },
  })

  const blockers = recentCheckins
    .filter((c) => c.blockerMentioned)
    .map((c) => c.blockerMentioned!)

  const greeting = await generateCompanionResponse(
    {
      userName: (await prisma.user.findUnique({
        where: { id: req.userId! },
        select: { name: true },
      }))?.name ?? 'there',
      projectName: project.name,
      projectDay: projectDayCount,
      lastCheckinDate: lastCheckin?.date.toISOString() ?? null,
      lastCommittedTask: lastCheckin?.taskCommittedTitle ?? null,
      lastTaskResult: lastCheckin?.taskResult ?? null,
      recentBlockers: blockers,
      sessionInsights: project.insights.map((i) => i.content),
      suggestedNextTask: project.tasks[0]?.title ?? null,
      currentStreak: project.currentStreak,
    },
    lastCheckin
      ? `How did yesterday's task go? (${lastCheckin.taskCommittedTitle ?? 'your committed task'})`
      : "Starting my first check-in!"
  )

  await prisma.dailyCheckin.update({
    where: { id: checkin.id },
    data: { aiResponse: greeting },
  })

  return res.json({
    success: true,
    data: {
      checkin: { ...checkin, aiResponse: greeting },
      greeting,
    },
  })
})

// ── COMPLETE CHECKIN ──────────────────────────────────────────

router.post('/:id/complete', async (req: AuthRequest, res: Response) => {
  const body = CompleteCheckinSchema.parse(req.body)

  const checkin = await prisma.dailyCheckin.findFirst({
    where: { id: req.params.id, userId: req.userId! },
    include: {
      project: {
        include: {
          tasks: { where: { status: 'todo' }, orderBy: { orderIndex: 'asc' }, take: 2 },
          insights: { take: 3 },
        },
      },
    },
  })

  if (!checkin) throw new Error('NOT_FOUND')
  if (checkin.completedAt) {
    return res.status(400).json({
      success: false,
      error: { code: 'ALREADY_COMPLETED', message: 'Check-in already completed today' },
    })
  }

  const nextTask = checkin.project.tasks[0] ?? null
  const projectDay = Math.floor(
    (Date.now() - checkin.project.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )

  // Generate AI response to task result
  const userMsg = body.userMessage ?? `Task result: ${body.taskResult}${body.taskResultNote ? ` — ${body.taskResultNote}` : ''}`

  const recentCheckins = await prisma.dailyCheckin.findMany({
    where: { projectId: checkin.projectId, userId: req.userId!, completedAt: { not: null } },
    orderBy: { date: 'desc' },
    take: 7,
    select: { blockerMentioned: true, taskResultNote: true },
  })

  const aiResponse = await generateCompanionResponse(
    {
      userName: (await prisma.user.findUnique({ where: { id: req.userId! }, select: { name: true } }))?.name ?? 'there',
      projectName: checkin.project.name,
      projectDay,
      lastCheckinDate: new Date().toISOString(),
      lastCommittedTask: checkin.taskCommittedTitle,
      lastTaskResult: body.taskResult,
      recentBlockers: recentCheckins.filter((c) => c.blockerMentioned).map((c) => c.blockerMentioned!),
      sessionInsights: checkin.project.insights.map((i) => i.content),
      suggestedNextTask: nextTask?.title ?? null,
      currentStreak: checkin.project.currentStreak + (body.taskResult !== 'missed' ? 1 : 0),
    },
    userMsg
  )

  // Extract blocker if mentioned
  const blockerKeywords = ['stuck', 'blocked', "can't", 'no time', 'difficult', 'hard', 'issue', 'problem']
  const mentionedBlocker = blockerKeywords.some((kw) =>
    userMsg.toLowerCase().includes(kw)
  )
    ? userMsg
    : null

  // Update checkin
  const updated = await prisma.dailyCheckin.update({
    where: { id: checkin.id },
    data: {
      taskResult: body.taskResult,
      taskResultNote: body.taskResultNote ?? null,
      moodScore: body.moodScore ?? null,
      aiResponse,
      nextTaskId: nextTask?.id ?? null,
      nextTaskTitle: nextTask?.title ?? null,
      blockerMentioned: mentionedBlocker,
      completedAt: new Date(),
    },
  })

  // Update streak
  await updateStreak(req.userId!, checkin.projectId, body.taskResult)

  // Mark committed task as done if result is done
  if (body.taskResult === 'done' && checkin.taskCommittedId) {
    await prisma.task.update({
      where: { id: checkin.taskCommittedId },
      data: { status: 'done', completedAt: new Date() },
    })
  }

  // Check for pattern-based insights (every 7 checkins)
  const completedCount = await prisma.dailyCheckin.count({
    where: { projectId: checkin.projectId, userId: req.userId!, completedAt: { not: null } },
  })

  if (completedCount % 7 === 0) {
    const recentNotes = recentCheckins
      .filter((c) => c.taskResultNote)
      .map((c) => c.taskResultNote!)

    if (recentNotes.length > 0) {
      const newInsights = await extractInsights(recentNotes)
      if (newInsights.length > 0) {
        await prisma.projectInsight.createMany({
          data: newInsights.map((i) => ({
            projectId: checkin.projectId,
            userId: req.userId!,
            content: i.content,
            source: 'pattern_detection',
          })),
        })
      }
    }
  }

  return res.json({ success: true, data: { checkin: updated, aiResponse } })
})

// ── HELPERS ───────────────────────────────────────────────────

async function updateStreak(
  userId: string,
  projectId: string,
  taskResult: string
) {
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return

  const isActive = taskResult !== 'missed'
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const yesterdayCheckin = await prisma.dailyCheckin.findFirst({
    where: { projectId, userId, date: yesterday, completedAt: { not: null } },
  })

  let newStreak: number
  if (isActive && yesterdayCheckin) {
    newStreak = project.currentStreak + 1
  } else if (isActive) {
    newStreak = 1
  } else {
    newStreak = 0
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(project.longestStreak, newStreak),
      lastCheckinAt: new Date(),
    },
  })
}

export default router
