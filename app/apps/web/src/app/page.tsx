import Link from 'next/link'
import { WaitlistForm } from '../components/WaitlistForm'

// ── LANDING PAGE ──────────────────────────────────────────────
// Public page — no auth required
// Contains: Nav, Hero, How it works, Chat demo, Testimonials, Pricing, Waitlist CTA, Footer

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
            Source Constructor
          </Link>
          <ul className="hidden md:flex items-center gap-8 list-none text-sm font-medium text-slate-500">
            <li><a href="#how" className="hover:text-slate-900 transition-colors">How it works</a></li>
            <li><a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-blue-100">
            <span>★</span> Early access — join the waitlist
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Discover what you{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              truly
            </span>{' '}
            want to build.
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered conversations that uncover your real desires — then transform them into a structured project with a 90-day plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity shadow-sm hover:shadow-md hover:-translate-y-px"
            >
              Start Your Discovery Session →
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-medium px-8 py-4 rounded-xl text-base hover:bg-slate-50 transition-colors"
            >
              ▷ See how it works
            </a>
          </div>
          <p className="text-sm text-slate-400">Free plan available · No credit card required</p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <div className="border-y border-slate-100 bg-slate-50 py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: '89%', label: 'found clarity in session 1' },
            { value: '4.8/5', label: 'avg. rating' },
            { value: '68%', label: 'D30 retention' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            From &ldquo;I don&apos;t know what to build&rdquo;<br />to &ldquo;Here&apos;s my plan&rdquo; — in one session.
          </h2>
          <p className="text-slate-500 mb-16 max-w-xl mx-auto">
            No templates. No frameworks. Just a deep conversation that draws out what&apos;s already inside you.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'Discovery Session',
                desc: 'A 25–35 minute conversation with your AI companion. Deep, honest questions that cut through the noise and surface what you actually care about.',
              },
              {
                num: '2',
                title: 'Your Project Emerges',
                desc: 'The AI synthesizes your session into a personalized project: a name, a purpose, phases, milestones, and a week-by-week task plan tailored to your life.',
              },
              {
                num: '3',
                title: 'Daily Momentum',
                desc: 'Your AI companion checks in daily — 3 minutes. It remembers everything, notices patterns, and keeps you consistently moving forward.',
              },
            ].map((step) => (
              <div key={step.num} className="bg-white border border-slate-200 rounded-2xl p-8 text-left shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white font-bold text-lg flex items-center justify-center mb-5">
                  {step.num}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">What people say</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Real people. Real clarity.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                initials: 'AM',
                quote: '"I spent 2 years not knowing what to build. One session with SOC and I knew. I\'m now 6 weeks into my project and haven\'t looked back."',
                name: 'Alex M.',
                role: 'Product Manager, 31',
              },
              {
                initials: 'MK',
                quote: '"Better than the 6 coaching sessions I paid $900 for. It remembered everything from our first conversation and built on it each time."',
                name: 'Maria K.',
                role: 'Career Transitioner, 34',
              },
              {
                initials: 'DV',
                quote: '"I\'m a serial abandoner of side projects. For the first time I\'ve stayed with one idea for 8 weeks. The daily check-ins are the difference."',
                name: 'Dmitri V.',
                role: 'Software Engineer, 27',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-sm">
                <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white text-xs font-bold flex items-center justify-center">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Simple, honest pricing.</h2>
          <p className="text-slate-500 mb-14">No tricks. Start free and upgrade when you&apos;re ready.</p>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Free */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-left shadow-sm">
              <div className="text-sm font-semibold text-slate-500 mb-1">Free</div>
              <div className="text-4xl font-bold text-slate-900 mb-1">$0</div>
              <p className="text-slate-500 text-sm mb-6">Try it, no commitment</p>
              <ul className="space-y-2 text-sm text-slate-600 mb-8">
                {['1 Discovery Session', '1 Generated project', '7-day task plan', 'Basic daily check-in'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center border border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-blue-600 to-violet-600 rounded-2xl p-8 text-left shadow-lg text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="text-sm font-semibold text-blue-100 mb-1">Pro</div>
              <div className="text-4xl font-bold mb-1">
                $19<span className="text-lg font-normal opacity-80">/month</span>
              </div>
              <p className="text-blue-100 text-sm mb-6">For serious builders</p>
              <ul className="space-y-2 text-sm text-white/90 mb-8">
                {[
                  'Unlimited Discovery Sessions',
                  'Full 90-day project roadmap',
                  'Daily AI companion',
                  'Pattern detection & insights',
                  'Session history & insights library',
                  'Weekly progress email',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-300 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center bg-white text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                Start 7-day free trial
              </Link>
            </div>

            {/* Annual */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-left shadow-sm">
              <div className="text-sm font-semibold text-slate-500 mb-1">Annual</div>
              <div className="text-4xl font-bold text-slate-900 mb-1">
                $149<span className="text-lg font-normal text-slate-500">/year</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">Best value — save $79</p>
              <ul className="space-y-2 text-sm text-slate-600 mb-8">
                {[
                  'Everything in Pro',
                  'Priority support',
                  '2 months free',
                  'Early access to new features',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center border border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Get annual access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-violet-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your project?
          </h2>
          <p className="text-blue-100 mb-10 text-lg">
            Join the waitlist and get early access when we launch.
          </p>
          <WaitlistForm
            locale="en"
            source="landing-cta"
            className="text-left max-w-md mx-auto"
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            Source Constructor
          </div>
          <p>© {new Date().getFullYear()} Source Constructor. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-slate-900 transition-colors">Log in</Link>
            <Link href="/register" className="hover:text-slate-900 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
