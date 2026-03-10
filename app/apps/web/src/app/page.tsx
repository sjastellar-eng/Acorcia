'use client'

import Link from 'next/link'
import { useLocale } from '../hooks/useLocale'
import { WaitlistForm } from '../components/WaitlistForm'
import { LOCALES, type Locale } from '../lib/i18n/translations'

// ── ACORCIA logo mark — SVG approximation ──────────────────────
function AcorciaIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="acg-main" x1="8" y1="2" x2="28" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#38BDF8" />
          <stop offset="30%"  stopColor="#6366F1" />
          <stop offset="65%"  stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* Outer left leg */}
      <path d="M2 34 L13 4 L16.5 4 L5.5 34Z" fill="url(#acg-main)" />
      {/* Outer right leg */}
      <path d="M19.5 4 L23 4 L31 34 L27.5 34Z" fill="url(#acg-main)" />
      {/* Inner left leg */}
      <path d="M10.5 34 L16 13 L18.5 13 L13 34Z" fill="url(#acg-main)" opacity="0.85" />
      {/* Inner right leg */}
      <path d="M19 13 L21.5 13 L24 34 L21.5 34Z" fill="url(#acg-main)" opacity="0.85" />
      {/* Crossbar */}
      <path d="M7.5 23.5 L28 23.5 L27 20 L8.5 20Z" fill="url(#acg-main)" />
    </svg>
  )
}

const LOCALE_FLAGS: Record<Locale, string> = { uk: '🇺🇦', en: '🇬🇧', ru: '🇷🇺' }
const LOCALE_SHORT: Record<Locale, string> = { uk: 'УКР', en: 'ENG', ru: 'РУС' }

function LangSwitcher() {
  const { locale, setLocale } = useLocale()
  return (
    <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/10 rounded-lg p-0.5">
      {(LOCALES as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${
            locale === l ? 'bg-white/15 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {LOCALE_FLAGS[l]} {LOCALE_SHORT[l]}
        </button>
      ))}
    </div>
  )
}

function Check({ color = '#10b981' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="7" cy="7" r="7" fill={color} fillOpacity="0.15" />
      <path d="M4 7l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function LandingPage() {
  const { t } = useLocale()
  const l = t.landing

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <AcorciaIcon size={30} />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base tracking-widest text-white">ACORCIA</span>
              <span className="text-[10px] text-slate-500 tracking-wide">Source Constructor</span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-8 list-none text-sm font-medium text-slate-400">
            <li><a href="#how" className="hover:text-white transition-colors">{l.howTitle}</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">{l.pricingTitle}</a></li>
          </ul>

          <div className="flex items-center gap-2 shrink-0">
            <LangSwitcher />
            <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-400 px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              {t.auth.signIn}
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20 whitespace-nowrap">
              {t.auth.startFree} →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-10 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.20) 0%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {l.heroBadge}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            {l.heroHeadline1} <br />
            <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              {l.heroHeadline2}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {l.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-3">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 hover:-translate-y-0.5">
              {l.heroCta1}
            </Link>
            <a href="#how" className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-medium px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm-1.5 11.5v-7l5.5 3.5-5.5 3.5z" /></svg>
              {l.heroCta2}
            </a>
          </div>
          <p className="text-sm text-slate-500 mb-20">{l.heroNote}</p>

          {/* Product mockup */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/15 via-violet-600/15 to-pink-600/10 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0b1120] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/50" /><div className="w-3 h-3 rounded-full bg-yellow-500/50" /><div className="w-3 h-3 rounded-full bg-green-500/50" /></div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/[0.06] rounded-md px-3 py-1 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Discovery Session in progress
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4 text-left">
                {[
                  { role: 'ai', text: 'What kind of impact do you want to have on the world?' },
                  { role: 'user', text: 'Something that helps founders find their path earlier in the journey...' },
                  { role: 'ai', text: 'Interesting — is this from personal experience? Were you once that founder who felt lost?' },
                ].map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 via-violet-600 to-pink-600 flex-shrink-0 flex items-center justify-center">
                        <AcorciaIcon size={14} />
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-xs ${msg.role === 'ai' ? 'bg-white/5 border border-white/10 rounded-tl-sm text-slate-300' : 'bg-violet-600/80 rounded-tr-sm text-white'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 via-violet-600 to-pink-600 flex-shrink-0" />
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: `${i*150}ms` }} />)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/[0.06] px-5 py-3 bg-white/[0.02] flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-600">Share your thoughts...</div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────────── */}
      <div className="border-y border-white/[0.06] bg-white/[0.02] py-10 px-6 mt-16">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-14 text-center">
          {[
            { value: l.stat1Value, label: l.stat1Label },
            { value: l.stat2Value, label: l.stat2Label },
            { value: l.stat3Value, label: l.stat3Label },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how" className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">{l.howTitle}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {l.howHeadline1}<br />
            <span className="text-slate-400">{l.howHeadline2}</span>
          </h2>
          <p className="text-slate-500 mb-16 max-w-xl mx-auto">{l.howSub}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {([
              { num: '01', title: l.step1Title, desc: l.step1Desc, color: 'from-blue-500/10 to-blue-500/5', border: 'hover:border-blue-500/30', glow: 'from-blue-600/5', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M4 10C4 7.8 5.8 6 8 6H24C26.2 6 28 7.8 28 10V20C28 22.2 26.2 24 24 24H18L12 28V24H8C5.8 24 4 22.2 4 20V10Z" stroke="#60a5fa" strokeWidth="1.5" /><path d="M10 13h12M10 17h8" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" /></svg>) },
              { num: '02', title: l.step2Title, desc: l.step2Desc, color: 'from-violet-500/10 to-violet-500/5', border: 'hover:border-violet-500/30', glow: 'from-violet-600/5', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect x="6" y="4" width="20" height="24" rx="3" stroke="#a78bfa" strokeWidth="1.5" /><path d="M10 12h12M10 16h12M10 20h8" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" /></svg>) },
              { num: '03', title: l.step3Title, desc: l.step3Desc, color: 'from-pink-500/10 to-pink-500/5', border: 'hover:border-pink-500/30', glow: 'from-pink-600/5', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="20" rx="3" stroke="#f472b6" strokeWidth="1.5" /><path d="M4 14h24" stroke="#f472b6" strokeWidth="1.5" /><path d="M10 4v8M22 4v8" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" /><path d="M9 21l4 4 10-8" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
            ] as const).map((step) => (
              <div key={step.num} className={`group relative bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left transition-colors ${step.border}`}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} border border-white/10 flex items-center justify-center mb-5`}>{step.icon}</div>
                  <div className="text-xs font-mono text-slate-600 mb-2">{step.num}</div>
                  <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">{l.featTitle}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{l.featHeadline}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {([
              { title: l.feat1Title, desc: l.feat1Desc, icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" /></svg>) },
              { title: l.feat2Title, desc: l.feat2Desc, icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#a78bfa" strokeWidth="1.5" /><path d="M3 9h18M9 4v5M15 4v5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" /><path d="M7 14l3 3 7-6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
              { title: l.feat3Title, desc: l.feat3Desc, icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-8 4 5 3-3 4 6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
              { title: l.feat4Title, desc: l.feat4Desc, icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
            ] as const).map((f) => (
              <div key={f.title} className="flex gap-5 p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/15 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">{f.icon}</div>
                <div><h3 className="font-bold text-white mb-2">{f.title}</h3><p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">{l.testimonialsTitle}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">{l.testimonialsHeadline}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { initials: 'AM', quote: l.t1Quote, name: l.t1Name, role: l.t1Role, gradient: 'from-blue-600 to-cyan-600' },
              { initials: 'MK', quote: l.t2Quote, name: l.t2Name, role: l.t2Role, gradient: 'from-violet-600 to-blue-600' },
              { initials: 'DV', quote: l.t3Quote, name: l.t3Name, role: l.t3Role, gradient: 'from-pink-600 to-violet-600' },
            ].map((item) => (
              <div key={item.name} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-left hover:border-white/20 transition-colors">
                <div className="flex gap-0.5 text-yellow-400 text-sm mb-4">{[1,2,3,4,5].map(i => <span key={i}>★</span>)}</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{item.quote}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} text-white text-xs font-bold flex items-center justify-center`}>{item.initials}</div>
                  <div><div className="text-sm font-semibold text-white">{item.name}</div><div className="text-xs text-slate-500">{item.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-6 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">{l.pricingTitle}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{l.pricingHeadline}</h2>
          <p className="text-slate-500 mb-14">{l.pricingSub}</p>

          {/* Monthly — 3 plans */}
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">{l.monthlyLabel}</p>
          <div className="grid md:grid-cols-3 gap-6 items-start mb-10">
            {/* Free */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left">
              <div className="text-sm font-semibold text-slate-500 mb-1">{l.planFreeTitle}</div>
              <div className="text-4xl font-bold text-white mb-1">{l.planFreePrice}</div>
              <p className="text-slate-500 text-sm mb-6">{l.planFreeSub}</p>
              <ul className="space-y-2.5 text-sm text-slate-400 mb-8">
                {(l.planFreeFeatures as readonly string[]).map((f) => (
                  <li key={f} className="flex items-start gap-2.5"><Check />{f}</li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-white/5 border border-white/10 text-slate-300 font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
                {l.planFreeCta}
              </Link>
            </div>

            {/* Starter */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left">
              <div className="text-sm font-semibold text-sky-400 mb-1">{l.planStarterTitle}</div>
              <div className="text-4xl font-bold text-white mb-1">
                {l.planStarterPrice}<span className="text-lg font-normal text-slate-500">/mo</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">{l.planStarterSub}</p>
              <ul className="space-y-2.5 text-sm text-slate-400 mb-8">
                {(l.planStarterFeatures as readonly string[]).map((f) => (
                  <li key={f} className="flex items-start gap-2.5"><Check color="#38bdf8" />{f}</li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-sky-600/20 border border-sky-500/30 text-sky-300 font-semibold py-3 rounded-xl hover:bg-sky-600/30 transition-colors text-sm">
                {l.planStarterCta}
              </Link>
            </div>

            {/* Pro — featured */}
            <div className="relative rounded-2xl p-8 text-left" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 100%)', boxShadow: '0 0 60px rgba(139,92,246,0.20), 0 0 120px rgba(236,72,153,0.08)' }}>
              <div className="absolute inset-0 rounded-2xl border border-violet-500/30" />
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                {l.planProBadge}
              </div>
              <div className="relative">
                <div className="text-sm font-semibold text-violet-300 mb-1">{l.planProTitle}</div>
                <div className="text-4xl font-bold text-white mb-1">
                  {l.planProPrice}<span className="text-lg font-normal text-violet-300">/mo</span>
                </div>
                <p className="text-violet-200/60 text-sm mb-6">{l.planProSub}</p>
                <ul className="space-y-2.5 text-sm text-violet-100/80 mb-8">
                  {(l.planProFeatures as readonly string[]).map((f) => (
                    <li key={f} className="flex items-start gap-2.5"><Check color="#a78bfa" />{f}</li>
                  ))}
                </ul>
                <Link href="/register" className="block text-center bg-white text-violet-900 font-bold py-3 rounded-xl hover:bg-violet-50 transition-colors text-sm shadow-lg">
                  {l.planProCta}
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3">{l.annualLabel}</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Annual — 2 plans */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Annual Starter */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left hover:border-white/20 transition-colors">
              <div className="text-sm font-semibold text-sky-400 mb-1">{l.annualBasicTitle}</div>
              <div className="text-4xl font-bold text-white mb-1">
                {l.annualBasicPrice}<span className="text-lg font-normal text-slate-500">/yr</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">{l.annualBasicSub}</p>
              <ul className="space-y-2.5 text-sm text-slate-400 mb-8">
                {(l.annualBasicFeatures as readonly string[]).map((f) => (
                  <li key={f} className="flex items-start gap-2.5"><Check color="#38bdf8" />{f}</li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-white/5 border border-white/10 text-slate-300 font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
                {l.annualBasicCta}
              </Link>
            </div>

            {/* Annual Pro */}
            <div className="relative rounded-2xl p-8 text-left border border-violet-500/20 bg-violet-500/5 hover:border-violet-500/40 transition-colors">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                {l.annualProBadge}
              </div>
              <div className="text-sm font-semibold text-violet-400 mb-1">{l.annualProTitle}</div>
              <div className="text-4xl font-bold text-white mb-1">
                {l.annualProPrice}<span className="text-lg font-normal text-violet-400">/yr</span>
              </div>
              <p className="text-violet-300/60 text-sm mb-6">{l.annualProSub}</p>
              <ul className="space-y-2.5 text-sm text-slate-400 mb-8">
                {(l.annualProFeatures as readonly string[]).map((f) => (
                  <li key={f} className="flex items-start gap-2.5"><Check color="#a78bfa" />{f}</li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-lg shadow-violet-500/20">
                {l.annualProCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST CTA ─────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(139,92,246,0.10) 0%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {l.ctaBadge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {l.ctaHeadline1} <br />
            <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              {l.ctaHeadline2}
            </span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg">{l.ctaSub}</p>
          <WaitlistForm source="landing-cta" className="text-left max-w-md mx-auto" />
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2.5">
            <AcorciaIcon size={24} />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm tracking-widest text-white">ACORCIA</span>
              <span className="text-[10px] text-slate-600">Source Constructor</span>
            </div>
          </div>
          <p>© {new Date().getFullYear()} ACORCIA. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <LangSwitcher />
            <Link href="/login" className="hover:text-white transition-colors">{t.auth.signIn}</Link>
            <Link href="/register" className="hover:text-white transition-colors">{t.auth.startFree}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
