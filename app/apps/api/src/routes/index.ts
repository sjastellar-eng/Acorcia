import { Router } from 'express'
import authRouter from './auth'
import sessionsRouter from './sessions'
import projectsRouter from './projects'
import checkinsRouter from './checkins'
import billingRouter from './billing'

const router = Router()

router.use('/auth', authRouter)
router.use('/sessions', sessionsRouter)
router.use('/projects', projectsRouter)
router.use('/checkins', checkinsRouter)
router.use('/billing', billingRouter)

router.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
