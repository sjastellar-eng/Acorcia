import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@soc/database'

const router = Router()

// ── SCHEMA ────────────────────────────────────────────────────

const WaitlistSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
  locale: z.enum(['en', 'uk', 'ru']).default('en'),
})

// ── HELPERS ───────────────────────────────────────────────────

async function notifyTelegram(email: string, name?: string, locale?: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const text = `🎉 *New Waitlist Signup*\n📧 ${email}${name ? `\n👤 ${name}` : ''}${locale ? `\n🌐 ${locale}` : ''}`

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    })
  } catch {
    // Non-critical — don't fail the request
  }
}

async function appendToGoogleSheets(email: string, name?: string, locale?: string) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL

  if (!spreadsheetId || !privateKey || !clientEmail) return

  try {
    // Get access token via service account JWT
    const now = Math.floor(Date.now() / 1000)
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(
      JSON.stringify({
        iss: clientEmail,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
      })
    ).toString('base64url')

    const { createSign } = await import('crypto')
    const sign = createSign('RSA-SHA256')
    sign.update(`${header}.${payload}`)
    const signature = sign.sign(privateKey, 'base64url')
    const jwt = `${header}.${payload}.${signature}`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })

    const { access_token } = (await tokenRes.json()) as { access_token: string }
    if (!access_token) return

    const row = [new Date().toISOString(), email, name ?? '', locale ?? 'en']

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:D:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [row] }),
      }
    )
  } catch {
    // Non-critical — don't fail the request
  }
}

// ── ROUTES ────────────────────────────────────────────────────

// POST /api/waitlist — join waitlist
router.post('/', async (req: Request, res: Response) => {
  const parsed = WaitlistSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid data', details: parsed.error.flatten().fieldErrors },
    })
  }

  const { email, name, source, locale } = parsed.data

  // Check duplicate
  const existing = await prisma.waitlistEntry.findUnique({ where: { email } })
  if (existing) {
    return res.status(200).json({ success: true, message: 'already_registered' })
  }

  await prisma.waitlistEntry.create({ data: { email, name, source, locale } })

  // Fire-and-forget notifications
  void notifyTelegram(email, name, locale)
  void appendToGoogleSheets(email, name, locale)

  return res.status(201).json({ success: true, message: 'registered' })
})

// GET /api/waitlist/count — public count for social proof
router.get('/count', async (_req: Request, res: Response) => {
  const count = await prisma.waitlistEntry.count()
  return res.json({ success: true, count })
})

export default router
