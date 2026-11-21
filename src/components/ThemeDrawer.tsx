import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, FileText, Zap, ExternalLink } from 'lucide-react'
import type { Theme } from '../types'
import { QuoteCard, SentimentChip, IntentMixBar, RICEDisplay, RevenueAtRisk } from './Chips'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import { useState } from 'react'

interface ThemeDrawerProps {
  theme: Theme | null
  onClose: () => void
}

function generatePRD(theme: Theme): string {
  return `## 🎯 Roadmap Card: ${theme.title}

**Category:** ${theme.l1}
**RICE Score:** ${theme.rice.score} | **Revenue at Risk:** $${theme.revenue_at_risk.toLocaleString()}

### Problem Statement
${theme.top_quotes[0]?.text ?? '—'}

### Evidence
- **${theme.count}** customer mentions across reviews, tickets, and calls
- **${Math.round((theme.intent_mix.churn_risk ?? 0) * 100)}%** of signals indicate churn risk
- Average sentiment: **${theme.avg_sentiment.toFixed(2)}** (scale: -1 to +1)
${theme.rising ? '- ⚠️ **RISING TREND** — volume increasing week over week' : ''}

### Representative Quotes
${theme.top_quotes.slice(0, 3).map(q => `> "${q.text}" — ${q.segment} user (${q.source})`).join('\n')}

### RICE Breakdown
- **Reach:** ${theme.rice.reach} users
- **Impact:** ${theme.rice.impact}× (1=low, 3=high)
- **Confidence:** ${theme.rice.confidence}%
- **Effort:** ${theme.rice.effort} weeks

### Recommendation
${theme.rice.score > 30 ? '🔴 **P0 — Ship now.** High RICE + revenue signal demands immediate prioritization.' :
  theme.rice.score > 20 ? '🟠 **P1 — Next sprint.** Strong signal, plan in upcoming cycle.' :
  '🟡 **P2 — Backlog.** Worth addressing but not urgent.'}
`
}

export default function ThemeDrawer({ theme, onClose }: ThemeDrawerProps) {
  const [prdVisible, setPrdVisible] = useState(false)
  const [prdText, setPrdText] = useState('')

  function handleDraftPRD() {
    if (theme) {
      setPrdText(generatePRD(theme))
      setPrdVisible(true)
    }
  }

  const trendData = theme?.weekly_trend.map((v, i) => ({
    week: `W${i + 1}`,
    mentions: v,
  })) ?? []

  const trendDir = theme
    ? theme.weekly_trend[theme.weekly_trend.length - 1] > theme.weekly_trend[0]
      ? 'up'
      : 'down'
    : 'flat'

  return (
    <AnimatePresence>
      {theme && (
        <>
          {/* Overlay */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 p-6 pb-4"
              style={{ background: 'rgba(243,234,222,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(217,195,176,0.4)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D98B82' }}>
                    {theme.l1}
                  </span>
                  <h2 className="heading-lg text-2xl mt-1" style={{ color: '#1A1512' }}>
                    {theme.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <SentimentChip value={theme.avg_sentiment} />
                    {theme.rising && (
                      <span className="badge-rising">
                        <TrendingUp size={10} />
                        Rising
                      </span>
                    )}
                    <span className="text-sm" style={{ color: '#6B5D52' }}>
                      {theme.count} mentions
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} style={{ color: '#6B5D52' }} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#6B5D52' }}>Revenue at Risk</div>
                  <div className="heading-lg text-2xl">
                    <RevenueAtRisk amount={theme.revenue_at_risk} />
                  </div>
                </div>
                <div className="card p-4">
                  <RICEDisplay rice={theme.rice} />
                </div>
              </div>

              {/* 8-week trend */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: '#1A1512' }}>8-Week Trend</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${trendDir === 'up' ? 'text-red-500' : 'text-green-600'}`}>
                    {trendDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trendDir === 'up' ? 'Increasing' : 'Declining'}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#6B5D52' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: '#1A1512', border: 'none', borderRadius: 8, color: '#F3EADE', fontSize: 12 }}
                      labelStyle={{ color: '#D9C3B0' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mentions"
                      stroke={trendDir === 'up' ? '#ef4444' : '#22c55e'}
                      strokeWidth={2.5}
                      dot={{ fill: trendDir === 'up' ? '#ef4444' : '#22c55e', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Intent Mix */}
              <div className="card p-4">
                <div className="text-sm font-semibold mb-3" style={{ color: '#1A1512' }}>Intent Mix</div>
                <IntentMixBar mix={theme.intent_mix as Record<string, number>} />
              </div>

              {/* RICE Breakdown */}
              <div className="card p-4">
                <div className="text-sm font-semibold mb-3" style={{ color: '#1A1512' }}>RICE Framework</div>
                <RICEDisplay rice={theme.rice} showBreakdown />
              </div>

              {/* Quotes */}
              <div>
                <div className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#1A1512' }}>
                  <FileText size={14} />
                  Cited Evidence ({theme.top_quotes.length} quotes)
                </div>
                <div className="space-y-3">
                  {theme.top_quotes.map((q, i) => (
                    <QuoteCard
                      key={i}
                      text={q.text}
                      source={q.source}
                      segment={q.segment}
                      account_id={q.account_id}
                    />
                  ))}
                </div>
              </div>

              {/* Draft PRD button */}
              <button
                onClick={handleDraftPRD}
                className="w-full btn-primary justify-center"
              >
                <Zap size={16} />
                Draft Roadmap Card
              </button>

              {/* PRD output */}
              <AnimatePresence>
                {prdVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="rounded-xl p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                      style={{ background: '#1E1A2E', color: '#D9C3B0' }}
                    >
                      {prdText}
                    </div>
                    <p className="text-xs mt-2 text-center" style={{ color: '#6B5D52' }}>
                      Copy the above into your PM tool of choice
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
