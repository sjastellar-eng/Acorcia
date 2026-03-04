import Link from 'next/link'
import { WaitlistForm } from '../components/WaitlistForm'

// ── LANDING PAGE ──────────────────────────────────────────────
// Premium dark theme — deep navy/black with blue-violet gradients

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2.5" fill="white" />
                <path d="M8 2v3M8 11v3M2 8h3M11 8h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span>Source Constructor</span>
          </Link>

          <ul className="hidden md:flex items-center gap-8 list-none text-sm font-medium text-slate-400">
            <li><a href="#how" className="hover:text-white transition-colors">How it works</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
          </ul>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-400 px-4 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
            >
              Get started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-10 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(59,130,246,0.22) 0%, transparent 100%)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Early access — join the waitlist
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            Discover what you <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              truly want to build.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered conversations that uncover your real desires — then transform them into a structured project with a 90-day plan.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Start Your Discovery Session →
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-medium px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm-1.5 11.5v-7l5.5 3.5-5.5 3.5z" />
              </svg>
              See how it works
            </a>
          </div>
          <p className="text-sm text-slate-500 mb-20">Free plan available · No credit card required</p>

          {/* ── PRODUCT MOCKUP ── */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/15 to-violet-600/15 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0b1120] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/[0.06] rounded-md px-3 py-1 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Discovery Session in progress
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 text-left">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex-shrink-0 flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="white">
                      <path d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z" />
                    </svg>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-300 max-w-xs">
                    What kind of impact do you want to have on the world?
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-blue-600/80 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white max-w-xs">
                    Something that helps founders find their path earlier in the journey...
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex-shrink-0 flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="white">
                      <path d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z" />
                    </svg>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-300 max-w-sm">
                    Interesting — is this from personal experience? Were you once that founder who felt lost?
                  </div>
                </div>

                {/* Typing */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex-shrink-0" />
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Input row */}
              <div className="border-t border-white/[0.06] px-5 py-3 bg-white/[0.02] flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-600">
                  Share your thoughts...
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <div className="border-y border-white/[0.06] bg-white/[0.02] py-10 px-6 mt-16">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-14 text-center">
          {[
            { value: '89%', label: 'found clarity in session 1' },
            { value: '4.8/5', label: 'avg. satisfaction rating' },
            { value: '68%', label: 'still active after 30 days' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            From &ldquo;I don&apos;t know what to build&rdquo;
            <br />
            <span className="text-slate-400">to &ldquo;Here&apos;s my plan&rdquo; — in one session.</span>
          </h2>
          <p className="text-slate-500 mb-16 max-w-xl mx-auto">
            No templates. No frameworks. Just a deep conversation that draws out what&apos;s already inside you.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <path d="M4 10C4 7.8 5.8 6 8 6H24C26.2 6 28 7.8 28 10V20C28 22.2 26.2 24 24 24H18L12 28V24H8C5.8 24 4 22.2 4 20V10Z" stroke="#60a5fa" strokeWidth="1.5" />
                    <path d="M10 13h12M10 17h8" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="26" cy="6" r="4" fill="#3b82f6" />
                    <path d="M26 4v4M24 6h4" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Discovery Session',
                desc: 'A 25–35 minute AI conversation with deep, honest questions that cut through the noise and surface what you actually care about.',
                color: 'from-blue-500/10 to-blue-500/5',
                border: 'hover:border-blue-500/30',
                glow: 'from-blue-600/5 to-transparent',
              },
              {
                num: '02',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="4" width="20" height="24" rx="3" stroke="#a78bfa" strokeWidth="1.5" />
                    <path d="M10 12h12M10 16h12M10 20h8" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M23 2l1.5 4 4 1.5-4 1.5L23 13l-1.5-4-4-1.5 4-1.5L23 2z" fill="#8b5cf6" />
                  </svg>
                ),
                title: 'Your Project Emerges',
                desc: 'The AI synthesizes your session into a personalized project: a name, a purpose, phases, milestones, and a week-by-week task plan.',
                color: 'from-violet-500/10 to-violet-500/5',
                border: 'hover:border-violet-500/30',
                glow: 'from-violet-600/5 to-transparent',
              },
              {
                num: '03',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="8" width="24" height="20" rx="3" stroke="#c084fc" strokeWidth="1.5" />
                    <path d="M4 14h24" stroke="#c084fc" strokeWidth="1.5" />
                    <path d="M10 4v8M22 4v8" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M9 21l4 4 10-8" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Daily Momentum',
                desc: 'Your AI companion checks in daily — just 3 minutes. It remembers everything, notices patterns, and keeps you consistently moving forward.',
                color: 'from-purple-500/10 to-purple-500/5',
                border: 'hover:border-purple-500/30',
                glow: 'from-purple-600/5 to-transparent',
              },
            ].map((step) => (
              <div
                key={step.num}
                className={`group relative bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left transition-colors ${step.border}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} border border-white/10 flex items-center justify-center mb-5`}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-mono text-slate-600 mb-2">{step.num}</div>
                  <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-20 px-6 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">Built for builders</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Everything you need to stay in motion.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Deep AI Conversations',
                desc: 'Not just a chatbot. A structured Socratic process that uncovers your true motivations, fears, and desires before generating any plan.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#a78bfa" strokeWidth="1.5" />
                    <path d="M3 9h18M9 4v5M15 4v5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7 14l3 3 7-6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: '90-Day Project Roadmap',
                desc: 'Every session generates a full project plan — phases, weekly tasks, milestones — personalized to your schedule and ambition level.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17l4-8 4 5 3-3 4 6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="19" cy="5" r="2" fill="#34d399" fillOpacity="0.3" stroke="#34d399" strokeWidth="1.5" />
                  </svg>
                ),
                title: 'Pattern Detection',
                desc: 'Your AI notices recurring themes across sessions: what energizes you, what stalls you, and exactly how to course-correct.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Daily Momentum Check-ins',
                desc: '3 minutes a day keeps the clarity alive. Smart questions keep you honest, accountable, and consistently moving forward.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex gap-5 p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/15 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">What people say</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">Real people. Real clarity.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                initials: 'AM',
                quote: '"I spent 2 years not knowing what to build. One session with SOC and I knew. I\'m now 6 weeks in and haven\'t looked back."',
                name: 'Alex M.',
                role: 'Product Manager, 31',
                gradient: 'from-blue-600 to-cyan-600',
              },
              {
                initials: 'MK',
                quote: '"Better than the 6 coaching sessions I paid $900 for. It remembered everything from our first conversation and built on it each time."',
                name: 'Maria K.',
                role: 'Career Transitioner, 34',
                gradient: 'from-violet-600 to-blue-600',
              },
              {
                initials: 'DV',
                quote: '"I\'m a serial abandoner of side projects. For the first time I\'ve stayed with one idea for 8 weeks. The daily check-ins are the difference."',
                name: 'Dmitri V.',
                role: 'Software Engineer, 27',
                gradient: 'from-purple-600 to-violet-600',
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-left hover:border-white/20 transition-colors"
              >
                <div className="flex gap-0.5 text-yellow-400 text-sm mb-4">
                  {[1,2,3,4,5].map((i) => <span key={i}>★</span>)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} text-white text-xs font-bold flex items-center justify-center shadow-lg`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-6 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Simple, honest pricing.</h2>
          <p className="text-slate-500 mb-14">No tricks. Start free and upgrade when you&apos;re ready.</p>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Free */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left">
              <div className="text-sm font-semibold text-slate-500 mb-1">Free</div>
              <div className="text-4xl font-bold text-white mb-1">$0</div>
              <p className="text-slate-500 text-sm mb-6">Try it, no commitment</p>
              <ul className="space-y-2.5 text-sm text-slate-400 mb-8">
                {['1 Discovery Session', '1 Generated project', '7-day task plan', 'Basic daily check-in'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#10b981" fillOpacity="0.15" />
                      <path d="M4 7l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center bg-white/5 border border-white/10 text-slate-300 font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                Get started free
              </Link>
            </div>

            {/* Pro — featured */}
            <div
              className="relative rounded-2xl p-8 text-left"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2e1065 100%)',
                boxShadow: '0 0 60px rgba(59,130,246,0.18), 0 0 120px rgba(139,92,246,0.10)',
              }}
            >
              <div className="absolute inset-0 rounded-2xl border border-blue-500/30" />
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                Most Popular
              </div>
              <div className="relative">
                <div className="text-sm font-semibold text-blue-300 mb-1">Pro</div>
                <div className="text-4xl font-bold text-white mb-1">
                  $19<span className="text-lg font-normal text-blue-300">/month</span>
                </div>
                <p className="text-blue-200/60 text-sm mb-6">For serious builders</p>
                <ul className="space-y-2.5 text-sm text-blue-100/80 mb-8">
                  {[
                    'Unlimited Discovery Sessions',
                    'Full 90-day project roadmap',
                    'Daily AI companion',
                    'Pattern detection & insights',
                    'Session history & insights library',
                    'Weekly progress email',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill="#34d399" fillOpacity="0.2" />
                        <path d="M4 7l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block text-center bg-white text-blue-900 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg"
                >
                  Start 7-day free trial
                </Link>
              </div>
            </div>

            {/* Annual */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left">
              <div className="text-sm font-semibold text-slate-500 mb-1">Annual</div>
              <div className="text-4xl font-bold text-white mb-1">
                $149<span className="text-lg font-normal text-slate-500">/year</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">Best value — save $79</p>
              <ul className="space-y-2.5 text-sm text-slate-400 mb-8">
                {['Everything in Pro', 'Priority support', '2 months free', 'Early access to new features'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#10b981" fillOpacity="0.15" />
                      <path d="M4 7l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center bg-white/5 border border-white/10 text-slate-300 font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                Get annual access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(59,130,246,0.10) 0%, transparent 100%)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Limited early access spots
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to find your <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              next big project?
            </span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join the waitlist and get early access when we launch.
          </p>
          <WaitlistForm source="landing-cta" className="text-left max-w-md mx-auto" />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-10 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2.5 font-semibold text-white">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-sm">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="2" fill="white" />
                <path d="M6 1v2M6 9v2M1 6h2M9 6h2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            Source Constructor
          </div>
          <p>© {new Date().getFullYear()} Source Constructor. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className="hover:text-white transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
