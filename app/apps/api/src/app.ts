import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import router from './routes'
import { errorHandler, notFound } from './middleware/errorHandler'

const app = express()

// ── SECURITY ──────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── LOGGING ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ── BODY PARSING ──────────────────────────────────────────────
// Raw body for Stripe webhook signature verification
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── ROUTES ────────────────────────────────────────────────────
app.use('/api', router)

// ── ERROR HANDLING ────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
