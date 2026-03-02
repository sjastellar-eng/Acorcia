import { Router, Request, Response } from 'express'
import Stripe from 'stripe'
import { prisma } from '@soc/database'
import { authenticate, AuthRequest } from '../middleware/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

const router = Router()

// ── CREATE CHECKOUT SESSION ───────────────────────────────────

router.post('/checkout', authenticate, async (req: AuthRequest, res: Response) => {
  const { priceId } = req.body

  if (!priceId) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_PRICE', message: 'priceId is required' },
    })
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId! } })
  if (!user) throw new Error('NOT_FOUND')

  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    })
    customerId = customer.id

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    trial_period_days: 7,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
    metadata: { userId: user.id },
  })

  return res.json({ success: true, data: { url: session.url } })
})

// ── CUSTOMER PORTAL ───────────────────────────────────────────

router.post('/portal', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } })

  if (!user?.stripeCustomerId) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_SUBSCRIPTION', message: 'No active subscription found' },
    })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  })

  return res.json({ success: true, data: { url: session.url } })
})

// ── STRIPE WEBHOOK ────────────────────────────────────────────

router.post(
  '/webhook',
  // Raw body needed for signature verification
  (req: Request, res: Response, next) => {
    if (req.headers['stripe-signature']) {
      (req as any).rawBody = req.body
    }
    next()
  },
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']
    if (!sig) return res.sendStatus(400)

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        (req as any).rawBody ?? req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch {
      return res.sendStatus(400)
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session
          if (session.metadata?.userId && session.subscription) {
            const sub = await stripe.subscriptions.retrieve(
              session.subscription as string
            )
            await handleSubscriptionUpdate(session.metadata.userId, sub)
          }
          break
        }

        case 'customer.subscription.updated':
        case 'customer.subscription.created': {
          const sub = event.data.object as Stripe.Subscription
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if ('metadata' in customer && customer.metadata.userId) {
            await handleSubscriptionUpdate(customer.metadata.userId, sub)
          }
          break
        }

        case 'customer.subscription.deleted': {
          const sub = event.data.object as Stripe.Subscription
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if ('metadata' in customer && customer.metadata.userId) {
            await prisma.user.update({
              where: { id: customer.metadata.userId },
              data: { plan: 'free' },
            })
          }
          break
        }
      }
    } catch (err) {
      console.error('[Webhook error]', err)
      return res.status(500).json({ error: 'Webhook handler failed' })
    }

    return res.json({ received: true })
  }
)

async function handleSubscriptionUpdate(
  userId: string,
  sub: Stripe.Subscription
) {
  const priceId = sub.items.data[0]?.price.id
  const plan =
    priceId === process.env.STRIPE_ANNUAL_PRICE_ID
      ? 'annual'
      : priceId === process.env.STRIPE_PRO_PRICE_ID
      ? 'pro'
      : 'free'

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { plan, stripeSubscriptionId: sub.id },
    }),
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: sub.id,
        plan,
        status: sub.status as any,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      },
      update: {
        plan,
        status: sub.status as any,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      },
    }),
  ])
}

export default router
