'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { billing } from '../../../lib/api'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'

const PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? ''
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID ?? ''

export default function SettingsPage() {
  const { user, getToken } = useAuth()
  const searchParams = useSearchParams()
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [isLoadingCheckout, setIsLoadingCheckout] = useState<string | null>(null)

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const handleCheckout = async (priceId: string) => {
    const token = await getToken()
    if (!token) return

    setIsLoadingCheckout(priceId)
    try {
      const { url } = await billing.checkout(token, priceId)
      window.location.href = url
    } finally {
      setIsLoadingCheckout(null)
    }
  }

  const handlePortal = async () => {
    const token = await getToken()
    if (!token) return

    setIsLoadingPortal(true)
    try {
      const { url } = await billing.portal(token)
      window.location.href = url
    } finally {
      setIsLoadingPortal(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4 mb-6 text-emerald-700 text-sm">
          🎉 You're now on the Pro plan. Welcome to the full experience!
        </div>
      )}

      {canceled && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 mb-6 text-amber-700 text-sm">
          Checkout was canceled. You can upgrade any time.
        </div>
      )}

      {/* Account */}
      <Card className="mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Email</span>
            <span className="text-slate-900">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Name</span>
            <span className="text-slate-900">{user?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-slate-500">Plan</span>
            <Badge variant={user?.plan === 'free' ? 'default' : 'primary'} className="capitalize">
              {user?.plan}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Billing */}
      <Card className="mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Plan & Billing</h2>

        {user?.plan === 'free' ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              You're on the free plan. Upgrade to unlock unlimited Discovery Sessions, your daily AI companion, and full insights.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-cobalt-600 rounded-xl p-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cobalt-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </div>
                <div className="font-bold text-slate-900 mb-1">Pro</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  $19<span className="text-sm font-normal text-slate-500">/mo</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Unlimited everything · 7-day trial</p>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => handleCheckout(PRO_PRICE_ID)}
                  isLoading={isLoadingCheckout === PRO_PRICE_ID}
                >
                  Start Free Trial
                </Button>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-slate-900 mb-1">Annual</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  $149<span className="text-sm font-normal text-slate-500">/yr</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Save 35% · All Pro features</p>
                <Button
                  variant="secondary"
                  className="w-full"
                  size="sm"
                  onClick={() => handleCheckout(ANNUAL_PRICE_ID)}
                  isLoading={isLoadingCheckout === ANNUAL_PRICE_ID}
                >
                  Get Annual
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-500 mb-4">
              You're on the <strong className="text-slate-900 capitalize">{user?.plan}</strong> plan.
              Manage your subscription, update billing details, or cancel at any time.
            </p>
            <Button
              variant="secondary"
              onClick={handlePortal}
              isLoading={isLoadingPortal}
            >
              Manage Subscription →
            </Button>
          </div>
        )}
      </Card>

      {/* Danger zone */}
      <Card>
        <h2 className="font-semibold text-slate-900 mb-4">Data & Privacy</h2>
        <p className="text-sm text-slate-500 mb-4">
          Your Discovery Sessions are private and encrypted. You can export or delete your data at any time.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm">Export my data</Button>
          <Button variant="danger" size="sm">Delete account</Button>
        </div>
      </Card>
    </div>
  )
}
