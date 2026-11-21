import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDailyDigest } from '../data/api'
import type { Theme, FeedbackItem } from '../types'
import { QuoteCard, SentimentChip } from '../components/Chips'
import { ScrollReveal } from '../components/Motion'
import { TrendingUp, AlertTriangle, Sun, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DigestData {
  rising: Theme[]
  churnRisk: Theme[]
  recentFeedback: FeedbackItem[]
  summary: { newMentions: number; risingCount: number; topChurnRisk: Theme | null }
}

export default function DailyDigest() {
  const [digest, setDigest] = useState<DigestData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDailyDigest().then(d => { setDigest(d as DigestData); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F3EADE' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-clay border-t-transparent animate-spin mx-auto mb-3" />
          <p style={{ color: '#6B5D52' }}>Building your digest…</p>
        </div>
      </div>
    )
  }

  if (!digest) return null

  return (
    <div className="min-h-screen" style={{ background: '#F3EADE' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <ScrollReveal className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D98B82, #C47B72)' }}>
              <Sun size={18} color="white" />
            </div>
            <div>
              <h1 className="heading-xl text-3xl" style={{ color: '#1A1512' }}>Daily Digest</h1>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5D52' }}>
                <Calendar size={12} />
                <span>What changed since yesterday — Nov 22, 2026</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Summary band */}
        <ScrollReveal delay={0.05} className="mb-8">
          <div
            className="rounded-2xl p-6 grid md:grid-cols-3 gap-6"
            style={{ background: 'linear-gradient(135deg, #2A1D16 0%, #3D2B20 100%)' }}
          >
            {[
              { icon: Sun, label: 'New mentions (48h)', value: digest.summary.newMentions, color: '#D98B82' },
              { icon: TrendingUp, label: 'Rising themes', value: digest.summary.risingCount, color: '#ef4444' },
              {
                icon: AlertTriangle,
                label: 'Top churn risk',
                value: digest.summary.topChurnRisk?.title ?? '—',
                color: '#f97316',
                isString: true
              },
            ].map(({ icon: Icon, label, value, color, isString }) => (
              <div key={label} className="text-center">
                <Icon size={16} style={{ color, margin: '0 auto 8px' }} />
                <div
                  className={isString ? 'heading-md text-base' : 'heading-xl text-3xl'}
                  style={{ color: '#F3EADE' }}
                >
                  {value}
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(217,195,176,0.6)' }}>{label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Rising themes */}
        <ScrollReveal delay={0.1} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: '#ef4444' }} />
            <h2 className="heading-md text-xl" style={{ color: '#1A1512' }}>Rising themes</h2>
            <span className="badge-rising ml-auto">{digest.rising.length} themes</span>
          </div>

          <div className="space-y-4">
            {digest.rising.map((theme, i) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#D98B82' }}>
                      {theme.l1}
                    </div>
                    <h3 className="heading-md text-lg" style={{ color: '#1A1512' }}>{theme.title}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="badge-rising"><TrendingUp size={9} /> Rising</span>
                    <SentimentChip value={theme.avg_sentiment} showLabel={false} />
                  </div>
                </div>

                {/* Trend bars */}
                <div className="flex items-end gap-1 h-10 mb-3">
                  {theme.weekly_trend.map((v, j) => {
                    const max = Math.max(...theme.weekly_trend)
                    const h = max > 0 ? (v / max) * 100 : 0
                    const isLast = j === theme.weekly_trend.length - 1
                    return (
                      <motion.div
                        key={j}
                        className="flex-1 rounded-t-sm"
                        style={{ background: isLast ? '#ef4444' : 'rgba(239,68,68,0.3)' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.3 + j * 0.04, duration: 0.4 }}
                      />
                    )
                  })}
                </div>
                <div className="text-xs mb-3" style={{ color: '#6B5D52' }}>
                  Week-over-week: {theme.weekly_trend[0]} → {theme.weekly_trend[theme.weekly_trend.length - 1]} mentions
                </div>

                {/* Top quote */}
                <QuoteCard
                  text={theme.top_quotes[0].text}
                  source={theme.top_quotes[0].source}
                  segment={theme.top_quotes[0].segment}
                />

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium" style={{ color: '#6B5D52' }}>
                    ${theme.revenue_at_risk.toLocaleString()} ARR at risk
                  </span>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: '#D98B82' }}
                  >
                    View in dashboard <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Churn risk section */}
        <ScrollReveal delay={0.15} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} style={{ color: '#f97316' }} />
            <h2 className="heading-md text-xl" style={{ color: '#1A1512' }}>Churn risk flag</h2>
          </div>

          <div
            className="rounded-2xl p-5 border"
            style={{ background: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.2)' }}
          >
            {digest.churnRisk.slice(0, 2).map((theme, i) => (
              <div key={theme.id} className={i > 0 ? 'mt-4 pt-4 border-t' : ''} style={{ borderColor: 'rgba(249,115,22,0.15)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="heading-md text-base" style={{ color: '#1A1512' }}>{theme.title}</h3>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(249,115,22,0.15)', color: '#ea580c' }}
                  >
                    {Math.round((theme.intent_mix.churn_risk ?? 0) * 100)}% churn signal
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: '#6B5D52' }}>
                  ${theme.revenue_at_risk.toLocaleString()} ARR at risk · {theme.count} mentions
                </p>
                <QuoteCard
                  text={theme.top_quotes[0].text}
                  source={theme.top_quotes[0].source}
                  segment={theme.top_quotes[0].segment}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Recent feedback */}
        <ScrollReveal delay={0.2}>
          <h2 className="heading-md text-xl mb-4" style={{ color: '#1A1512' }}>
            Recent feedback (last 48 hours)
          </h2>
          <div className="space-y-3">
            {digest.recentFeedback.slice(0, 6).map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <QuoteCard
                  text={f.text}
                  source={f.source}
                  segment={f.segment}
                  account_id={f.arr > 0 ? `${f.account_id} · $${f.arr.toLocaleString()} ARR` : f.account_id}
                />
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
