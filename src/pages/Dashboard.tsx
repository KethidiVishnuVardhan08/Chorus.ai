import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getThemes } from '../data/api'
import type { Theme, SortKey } from '../types'
import ThemeCard from '../components/ThemeCard'
import ThemeDrawer from '../components/ThemeDrawer'
import { ScrollReveal, CountUp } from '../components/Motion'
import { BarChart2, Zap, FileText, Clock, ChevronDown } from 'lucide-react'

const intents = ['all', 'bug', 'feature_request', 'churn_risk', 'question', 'praise']
const segments = ['all', 'free', 'pro', 'enterprise', 'churned']
const sources = ['all', 'review', 'ticket', 'call_note', 'screenshot', 'social']

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{
        background: active ? '#1A1512' : 'rgba(107,93,82,0.1)',
        color: active ? '#F3EADE' : '#6B5D52',
        border: active ? '1px solid #1A1512' : '1px solid transparent',
      }}
    >
      {label === 'all' ? 'All' : label.replace('_', ' ')}
    </button>
  )
}

export default function Dashboard() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('rice')
  const [filterIntent, setFilterIntent] = useState('all')
  const [filterSegment, setFilterSegment] = useState('all')
  const [filterSource, setFilterSource] = useState('all')

  useEffect(() => {
    getThemes({ intent: filterIntent, segment: filterSegment, source: filterSource })
      .then(t => { setThemes(t); setLoading(false) })
  }, [filterIntent, filterSegment, filterSource])

  const sortedThemes = useMemo(() => {
    return [...themes].sort((a, b) => {
      if (sortKey === 'rice') return b.rice.score - a.rice.score
      if (sortKey === 'revenue') return b.revenue_at_risk - a.revenue_at_risk
      return b.count - a.count
    })
  }, [themes, sortKey])

  // Stats
  const totalFeedback = 520
  const totalThemes = themes.length
  const totalRevenue = themes.reduce((s, t) => s + t.revenue_at_risk, 0)
  const citationPct = 100

  return (
    <div className="min-h-screen" style={{ background: '#F3EADE' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page header */}
        <ScrollReveal className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="heading-xl text-4xl" style={{ color: '#1A1512' }}>Theme Dashboard</h1>
              <p className="mt-1" style={{ color: '#6B5D52' }}>Revenue-ranked customer feedback themes, cited and scored.</p>
            </div>
            <div
              className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(42,29,22,0.08)', color: '#6B5D52' }}
            >
              Dataset: 2026-09-23 → 2026-11-22
            </div>
          </div>
        </ScrollReveal>

        {/* Stat row */}
        <ScrollReveal delay={0.05} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText, label: 'Items Analyzed', value: totalFeedback, suffix: '' },
            { icon: BarChart2, label: 'Themes', value: totalThemes, suffix: '' },
            { icon: Zap, label: 'Cited Insights', value: citationPct, suffix: '%' },
            { icon: Clock, label: 'Revenue at Risk', value: Math.round(totalRevenue / 1000), suffix: 'k', prefix: '$' },
          ].map(({ icon: Icon, label, value, suffix, prefix }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} style={{ color: '#D98B82' }} />
                <span className="text-xs font-medium" style={{ color: '#6B5D52' }}>{label}</span>
              </div>
              <div className="heading-lg text-2xl" style={{ color: '#1A1512' }}>
                <CountUp end={value} prefix={prefix ?? ''} suffix={suffix} />
              </div>
            </div>
          ))}
        </ScrollReveal>

        {/* Filters + Sort */}
        <ScrollReveal delay={0.1} className="mb-6">
          <div className="card p-4 flex flex-wrap gap-4 items-center">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B5D52' }}>Sort</span>
              <div className="flex gap-1">
                {(['rice', 'revenue', 'volume'] as SortKey[]).map(k => (
                  <button
                    key={k}
                    onClick={() => setSortKey(k)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: sortKey === k ? '#D98B82' : 'rgba(107,93,82,0.1)',
                      color: sortKey === k ? 'white' : '#6B5D52',
                    }}
                  >
                    {k === 'rice' ? '⚡ RICE' : k === 'revenue' ? '💰 Revenue' : '📊 Volume'}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-px h-5 bg-latte/50" />

            {/* Intent filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B5D52' }}>Intent</span>
              {intents.map(i => (
                <FilterPill key={i} label={i} active={filterIntent === i} onClick={() => setFilterIntent(i)} />
              ))}
            </div>

            <div className="w-px h-5 bg-latte/50 hidden md:block" />

            {/* Segment filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B5D52' }}>Segment</span>
              {segments.map(s => (
                <FilterPill key={s} label={s} active={filterSegment === s} onClick={() => setFilterSegment(s)} />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* RICE sort callout */}
        {sortKey === 'rice' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl px-5 py-3 flex items-center gap-3"
            style={{ background: 'rgba(217,139,130,0.1)', border: '1px solid rgba(217,139,130,0.3)' }}
          >
            <Zap size={16} style={{ color: '#D98B82' }} />
            <span className="text-sm font-medium" style={{ color: '#C47B72' }}>
              Sorted by RICE score. Notice how <strong>"No data export / API"</strong> rises to the top — only 17 mentions, yet \$45k ARR at risk and a 35.7 RICE score. Volume alone would have buried it.
            </span>
          </motion.div>
        )}

        {/* Theme grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse" style={{ background: 'rgba(217,195,176,0.3)' }} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {sortedThemes.map((theme, i) => (
              <motion.div
                key={theme.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ThemeCard
                  theme={theme}
                  onClick={setSelectedTheme}
                  rank={i + 1}
                  highlight={theme.id === 'T10' && sortKey === 'rice'}
                  sortKey={sortKey}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Drawer */}
      <ThemeDrawer theme={selectedTheme} onClose={() => setSelectedTheme(null)} />
    </div>
  )
}
