import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart2, MessageCircle, Sun, FlaskConical, TrendingUp, Zap, Shield, FileText, Star, ChevronRight, Quote } from 'lucide-react'
import { ScrollReveal, StaggerChildren, CountUp } from '../components/Motion'
import { useRef, useEffect, useState } from 'react'
import { seedData } from '../data/api'

// Feedback snippet collage items for the hero
const heroSnippets = [
  { text: "Without data export we cannot justify the enterprise contract.", source: "ticket", segment: "enterprise", sentiment: -0.86 },
  { text: "Keeps force-closing on my Android, unusable right now.", source: "review", segment: "enterprise", sentiment: -0.75 },
  { text: "Best in its category, recommended it to my whole office.", source: "review", segment: "enterprise", sentiment: 0.91 },
  { text: "Slow support plus privacy concerns are making us nervous about renewing.", source: "ticket", segment: "enterprise", sentiment: -0.55 },
  { text: "Loading is painfully slow on mobile data.", source: "review", segment: "pro", sentiment: -0.92 },
  { text: "Had to verify three times, no idea if it actually worked.", source: "social", segment: "churned", sentiment: -0.65 },
]

const features = [
  { icon: TrendingUp, title: 'Revenue-ranked themes', desc: 'Prioritize by ARR at risk, not volume. Catch the \$42k deal about to churn over a missing CSV export.', accent: '#D98B82' },
  { icon: Zap, title: 'RICE scoring', desc: 'Automatic Reach × Impact × Confidence / Effort scoring across all 12 themes to cut through roadmap politics.', accent: '#3b82f6' },
  { icon: Quote, title: '100% cited insights', desc: 'Every claim links to a real quote. No hallucinated summaries — if there\'s no evidence, we say so.', accent: '#22c55e' },
  { icon: MessageCircle, title: 'Ask your feedback', desc: 'Natural-language queries across all 520 feedback items. Ask "why are enterprise accounts churning?" and get cited answers.', accent: '#a855f7' },
  { icon: Sun, title: 'Daily digest', desc: 'Rising themes and churn-risk flags surface automatically. Know what changed since yesterday in 60 seconds.', accent: '#f97316' },
  { icon: FlaskConical, title: 'Eval transparency', desc: 'Intent F1 0.87, theme F1 0.95, recall 0.95, citation faithfulness 1.0. We show you exactly how good the system is — no black box.', accent: '#D98B82' },
  { icon: Shield, title: 'Zero hallucination policy', desc: 'Theme churn drops from 38% (naive) to 6% (grounded) — an 84% reduction with our fixed citation-anchored architecture.', accent: '#22c55e' },
  { icon: BarChart2, title: 'Multi-source ingestion', desc: 'Reviews, tickets, call notes, screenshots, social — all normalized into a unified taxonomy.', accent: '#3b82f6' },
  { icon: FileText, title: '1-click PRD drafts', desc: 'Click any theme to generate a structured roadmap card with RICE inputs, evidence, and a prioritization recommendation.', accent: '#a855f7' },
]

const testimonials = [
  { name: 'Priya K.', role: 'Head of Product, Series B SaaS', quote: 'We found a \$120k revenue risk hiding in 17 feedback items. Volume-first analysis would have buried it completely.', stars: 5 },
  { name: 'Marcus T.', role: 'PM Lead, Fintech', quote: 'The citation requirement is a game-changer. I can share insights with engineering without anyone questioning the evidence.', stars: 5 },
  { name: 'Yuki N.', role: 'Director of CX, Consumer App', quote: 'The daily digest means I arrive at standup with insights, not just data. It\'s the difference between reactive and proactive.', stars: 5 },
]

function FeedbackSnippet({ item, delay = 0 }: { item: typeof heroSnippets[0]; delay?: number }) {
  const sentClass = item.sentiment > 0.1 ? 'chip-positive' : item.sentiment < -0.15 ? 'chip-negative' : 'chip-neutral'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/80 backdrop-blur-sm border border-latte/40 rounded-xl p-3 shadow-card text-sm max-w-56"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <p className="text-ink leading-snug mb-2" style={{ fontSize: 13 }}>"{item.text}"</p>
      <div className="flex items-center gap-2">
        <span className={`chip-base ${sentClass}`} style={{ fontSize: 10 }}>
          {item.sentiment > 0.1 ? '↑' : '↓'} {item.sentiment.toFixed(2)}
        </span>
        <span className="text-xs" style={{ color: '#D9C3B0' }}>{item.segment}</span>
      </div>
    </motion.div>
  )
}

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })
  const [glowVisible, setGlowVisible] = useState(false)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setGlowVisible(true)
    }
    const handleLeave = () => setGlowVisible(false)
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => { el.removeEventListener('mousemove', handleMove); el.removeEventListener('mouseleave', handleLeave) }
  }, [])

  return (
    <div>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2A1D16 0%, #3D2B20 50%, #1E1A2E 100%)' }}
      >
        {/* Cursor glow */}
        {glowVisible && (
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, rgba(217,139,130,0.1) 0%, transparent 70%)',
              left: glowPos.x - 250,
              top: glowPos.y - 250,
              transition: 'left 0.08s ease-out, top 0.08s ease-out',
            }}
          />
        )}

        {/* Warm radial bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(217,139,130,0.06) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            {/* Nav-like wordmark */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-10"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(217,139,130,0.15)', border: '1px solid rgba(217,139,130,0.3)' }}>
                <div className="w-4 h-4 rounded-full" style={{ background: '#D98B82' }} />
              </div>
              <span className="heading-md text-lg" style={{ color: '#D9C3B0' }}>
                Chorus<span style={{ color: '#D98B82' }}>.ai</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-xl text-5xl lg:text-7xl mb-6"
              style={{ color: '#F3EADE' }}
            >
              Hear what your customers are <span style={{ color: '#D98B82' }}>really</span> saying.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg leading-relaxed mb-10"
              style={{ color: 'rgba(217,195,176,0.8)', maxWidth: 480 }}
            >
              Turn 520 scattered customer signals — reviews, tickets, calls, screenshots — into source-cited, revenue-ranked roadmap decisions. No black box. No hallucinations. Every insight earns its place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/dashboard" className="btn-primary text-base">
                Explore Dashboard <ArrowRight size={18} />
              </Link>
              <Link to="/evals" className="btn-ghost text-base">
                View Eval Scores
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-8 mt-12 pt-8"
              style={{ borderTop: '1px solid rgba(217,195,176,0.15)' }}
            >
              {[
                { n: 520, label: 'Feedback items', suffix: '' },
                { n: 12, label: 'Themes discovered', suffix: '' },
                { n: 100, label: 'Citations', suffix: '%' },
              ].map(({ n, label, suffix }) => (
                <div key={label}>
                  <div className="heading-lg text-3xl" style={{ color: '#D98B82' }}>
                    <CountUp end={n} suffix={suffix} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(217,195,176,0.6)' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: feedback collage */}
          <div className="hidden lg:block relative h-[480px]">
            <div className="absolute top-0 left-8">
              <FeedbackSnippet item={heroSnippets[0]} delay={0.4} />
            </div>
            <div className="absolute top-24 right-0">
              <FeedbackSnippet item={heroSnippets[1]} delay={0.5} />
            </div>
            <div className="absolute top-48 left-0">
              <FeedbackSnippet item={heroSnippets[2]} delay={0.6} />
            </div>
            <div className="absolute bottom-32 right-8">
              <FeedbackSnippet item={heroSnippets[3]} delay={0.7} />
            </div>
            <div className="absolute bottom-8 left-16">
              <FeedbackSnippet item={heroSnippets[4]} delay={0.8} />
            </div>
            <div className="absolute top-72 left-28">
              <FeedbackSnippet item={heroSnippets[5]} delay={0.65} />
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-24 px-6" style={{ background: '#F3EADE' }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D98B82' }}>The Problem</span>
            <h2 className="heading-xl text-4xl lg:text-5xl mt-3 mb-6" style={{ color: '#1A1512' }}>
              Volume-first thinking buries your highest-value signals.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#6B5D52', maxWidth: 600, margin: '0 auto' }}>
              A theme with 17 mentions outranks one with 66 — once you account for revenue at risk, RICE impact, and churn signal. Traditional counting misses this every time.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { label: 'Without Chorus.ai', value: '38%', desc: 'Theme churn (naive grouping)', bad: true },
              { label: 'With grounded citations', value: '6%', desc: 'Theme churn rate (84% reduction)', good: true },
              { label: 'Revenue surfaced', value: '$907k', desc: 'ARR at risk across 12 themes', highlight: true },
            ].map(({ label, value, desc, bad, good, highlight }) => (
              <div
                key={label}
                className="card p-6 text-center"
                style={highlight ? { background: 'rgba(217,139,130,0.06)', borderColor: 'rgba(217,139,130,0.3)' } : {}}
              >
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B5D52' }}>{label}</div>
                <div
                  className="heading-xl text-4xl mb-1"
                  style={{ color: bad ? '#dc2626' : good ? '#16a34a' : '#D98B82' }}
                >
                  {value}
                </div>
                <div className="text-sm" style={{ color: '#6B5D52' }}>{desc}</div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Feature bento grid */}
      <section className="py-24 px-6" style={{ background: 'rgba(217,195,176,0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D98B82' }}>What's inside</span>
            <h2 className="heading-xl text-4xl mt-3" style={{ color: '#1A1512' }}>
              9 capabilities. Zero compromises on evidence.
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc, accent }, i) => (
              <ScrollReveal key={title} delay={i * 0.06}>
                <div className="card p-6 h-full">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${accent}18` }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <h3 className="heading-md text-base mb-2" style={{ color: '#1A1512' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5D52' }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6" style={{ background: '#F3EADE' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D98B82' }}>How it works</span>
            <h2 className="heading-xl text-4xl mt-3" style={{ color: '#1A1512' }}>
              Insight in 3 steps.
            </h2>
          </ScrollReveal>

          <div className="space-y-8">
            {[
              { n: '01', title: 'Ingest & normalize', desc: 'Feedback from 5 channels (reviews, tickets, call notes, screenshots, social) is normalized into a unified schema with intent, sentiment, segment, and ARR.' },
              { n: '02', title: 'Cluster & cite', desc: 'A grounded clustering algorithm groups feedback into 12 themes. Every theme is backed by real quotes — no phantom patterns. Citation faithfulness: 100%.' },
              { n: '03', title: 'Revenue-rank & recommend', desc: 'Themes are scored by RICE and revenue at risk. The dashboard surfaces the right priority order — including that low-volume, high-stakes theme hiding at the bottom.' },
            ].map(({ n, title, desc }) => (
              <ScrollReveal key={n} delay={0.1}>
                <div className="flex gap-6 items-start">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2A1D16, #4A3426)', color: '#D98B82' }}
                  >
                    {n}
                  </div>
                  <div className="pt-2">
                    <h3 className="heading-md text-xl mb-2" style={{ color: '#1A1512' }}>{title}</h3>
                    <p className="leading-relaxed" style={{ color: '#6B5D52' }}>{desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6" style={{ background: 'rgba(217,195,176,0.12)' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D98B82' }}>Built for PMs</span>
            <h2 className="heading-xl text-4xl mt-3" style={{ color: '#1A1512' }}>
              Evidence beats opinion.
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, stars }, i) => (
              <ScrollReveal key={name} delay={i * 0.1}>
                <div className="card p-6 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array(stars).fill(0).map((_, j) => (
                      <Star key={j} size={14} fill="#D98B82" stroke="none" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: '#1A1512' }}>"{quote}"</p>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#1A1512' }}>{name}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#6B5D52' }}>{role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2A1D16 0%, #4A3426 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(217,139,130,0.08), transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="heading-xl text-4xl lg:text-5xl mb-6" style={{ color: '#F3EADE' }}>
              Ready to let your customers guide the roadmap?
            </h2>
            <p className="text-lg mb-10" style={{ color: 'rgba(217,195,176,0.7)' }}>
              See 520 real feedback items turned into 12 revenue-ranked themes — with every insight cited.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dashboard" className="btn-primary text-base px-10 py-4">
                Open Dashboard <ChevronRight size={18} />
              </Link>
              <Link to="/ask" className="btn-ghost text-base px-8 py-4">
                Ask a Question
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-6"
        style={{ background: '#1E1A2E' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,139,130,0.15)' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: '#D98B82' }} />
            </div>
            <span className="heading-md" style={{ color: 'rgba(217,195,176,0.8)' }}>
              Chorus<span style={{ color: '#D98B82' }}>.ai</span>
            </span>
            <span className="text-xs ml-2" style={{ color: 'rgba(217,195,176,0.3)' }}>VoC Copilot</span>
          </div>
          <nav className="flex gap-6">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/ask', label: 'Ask Feedback' },
              { to: '/digest', label: 'Daily Digest' },
              { to: '/evals', label: 'Evals' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="text-sm transition-colors" style={{ color: 'rgba(217,195,176,0.5)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(217,195,176,0.9)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(217,195,176,0.5)')}
              >
                {label}
              </Link>
            ))}
          </nav>
          <p className="text-xs" style={{ color: 'rgba(217,195,176,0.3)' }}>
            Portfolio demo — synthetic data
          </p>
        </div>
      </footer>
    </div>
  )
}
