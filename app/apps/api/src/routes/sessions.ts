import { Router, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@soc/database'
import { authenticate, AuthRequest } from '../middleware/auth'
import {
  streamSessionResponse,
  shouldTransitionPhase,
  getNextPhase,
  generateSessionSummary,
  generateProject,
} from '../services/claude'
import type { SessionPhase } from '@soc/types'

const router = Router()
router.use(authenticate)

// ── SCHEMAS ───────────────────────────────────────────────────

const CreateSessionSchema = z.object({
  type: z.enum(['open_discovery', 'focused']).default('open_discovery'),
  focusQuestion: z.string().max(500).optional(),
})

const SendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
})

// ── CREATE SESSION ────────────────────────────────────────────

router.post('/', async (req: AuthRequest, res: Response) => {
  const body = CreateSessionSchema.parse(req.body)

  // Check free plan limit (1 session)
  if (req.userPlan === 'free') {
    const count = await prisma.discoverySession.count({
      where: { userId: req.userId!, status: 'completed' },
    })
    if (count >= 1) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'SESSION_LIMIT',
          message: 'Free plan allows 1 Discovery Session. Upgrade to Pro for unlimited.',
        },
      })
    }
  }

  const session = await prisma.discoverySession.create({
    data: {
      userId: req.userId!,
      type: body.type,
      focusQuestion: body.focusQuestion ?? null,
      currentPhase: 'context',
      status: 'in_progress',
    },
  })

  return res.status(201).json({ success: true, data: { session } })
})

// ── LIST SESSIONS ─────────────────────────────────────────────

router.get('/', async (req: AuthRequest, res: Response) => {
  const sessions = await prisma.discoverySession.findMany({
    where: { userId: req.userId! },
    orderBy: { startedAt: 'desc' },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      currentPhase: true,
      summary: true,
      startedAt: true,
      completedAt: true,
      durationMinutes: true,
      messageCount: true,
    },
  })

  return res.json({ success: true, data: { sessions } })
})

// ── GET SESSION ───────────────────────────────────────────────

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const session = await prisma.discoverySession.findFirst({
    where: { id: req.params.id, userId: req.userId! },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      insights: true,
    },
  })

  if (!session) throw new Error('NOT_FOUND')

  return res.json({ success: true, data: { session } })
})

// ── SEND MESSAGE (STREAMING) ──────────────────────────────────

router.post('/:id/message', async (req: AuthRequest, res: Response) => {
  const body = SendMessageSchema.parse(req.body)

  const session = await prisma.discoverySession.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  })

  if (!session) throw new Error('NOT_FOUND')
  if (session.status !== 'in_progress') {
    return res.status(400).json({
      success: false,
      error: { code: 'SESSION_CLOSED', message: 'This session is no longer active' },
    })
  }

  // Save user message
  await prisma.sessionMessage.create({
    data: {
      sessionId: session.id,
      role: 'user',
      content: body.content,
      phase: session.currentPhase,
    },
  })

  // Get all messages for context
  const allMessages = await prisma.sessionMessage.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
  })

  // Set up SSE streaming
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const sendEvent = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  let currentPhase = session.currentPhase as SessionPhase

  // Check phase transition before responding
  const shouldTransition = await shouldTransitionPhase(
    allMessages.map((m) => ({ role: m.role, content: m.content })),
    currentPhase
  )

  if (shouldTransition && currentPhase !== 'complete') {
    const nextPhase = getNextPhase(currentPhase)
    currentPhase = nextPhase

    await prisma.discoverySession.update({
      where: { id: session.id },
      data: { currentPhase: nextPhase },
    })

    sendEvent({ type: 'phase_change', phase: nextPhase })
  }

  // If reached synthesis phase and all questions done → complete session
  if (currentPhase === 'synthesis' && shouldTransition) {
    const summary = await generateSessionSummary(
      allMessages.map((m) => ({ role: m.role, content: m.content }))
    )

    const projectDraft = await generateProject(
      summary,
      allMessages.map((m) => ({ role: m.role, content: m.content }))
    )

    await prisma.discoverySession.update({
      where: { id: session.id },
      data: {
        status: 'completed',
        currentPhase: 'complete',
        summary,
        completedAt: new Date(),
        durationMinutes: Math.round(
          (Date.now() - session.startedAt.getTime()) / 60000
        ),
      },
    })

    sendEvent({ type: 'session_complete', summary, projectDraft })
    sendEvent({ type: 'done' })
    return res.end()
  }

  // Stream AI response
  try {
    await streamSessionResponse({
      messages: allMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      currentPhase,
      onToken: (token) => {
        sendEvent({ type: 'token', content: token })
      },
      onComplete: async (fullText) => {
        // Save AI message
        await prisma.sessionMessage.create({
          data: {
            sessionId: session.id,
            role: 'assistant',
            content: fullText,
            phase: currentPhase,
          },
        })

        // Update message count
        await prisma.discoverySession.update({
          where: { id: session.id },
          data: { messageCount: { increment: 2 } },
        })
      },
    })

    sendEvent({ type: 'done' })
    res.end()
  } catch (err) {
    sendEvent({ type: 'error', message: 'AI service error. Please try again.' })
    res.end()
  }
})

// ── COMPLETE SESSION ──────────────────────────────────────────

router.post('/:id/complete', async (req: AuthRequest, res: Response) => {
  const session = await prisma.discoverySession.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  })

  if (!session) throw new Error('NOT_FOUND')

  await prisma.discoverySession.update({
    where: { id: session.id },
    data: { status: 'abandoned' },
  })

  return res.json({ success: true, data: null })
})

export default router
