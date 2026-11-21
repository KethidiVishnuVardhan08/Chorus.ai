import { motion } from 'framer-motion'
import type { Theme } from '../types'
import { SentimentChip, IntentMixBar, RevenueAtRisk } from './Chips'
import { TrendingUp, TrendingDown, Zap, AlertTriangle } from 'lucide-react'
import { SparklineChart } from './SparklineChart'

interface ThemeCardProps {
  theme: Theme
  onClick: (theme: Theme) => void
  rank: number
  highlight?: boolean
  sortKey: string
}

export default function ThemeCard({ theme, onClick, rank, highlight, sortKey }: ThemeCardProps) {
  const isLowVolHighRice = theme.id === 'T10' && (sortKey === 'rice' || sortKey === 'revenue')

  return (
    <motion.div
      className="card p-5 cursor-pointer relative overflow-hidden group"
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(42,29,22,0.14)' }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(theme)}
      style={isLowVolHighRice ? { borderColor: 'rgba(217,139,130,0.6)', background: 'rgba(217,139,130,0.04)' } : {}}
    >
      {/* Low-volume callout */}
      {isLowVolHighRice && (
        <div
          className="absolute top-0 left-0 right-0 py-1.5 px-4 flex items-center gap-2 text-xs font-semibold"
          style={{ background: 'linear-gradient(90deg, rgba(217,139,130,0.15), rgba(217,139,130,0.05))', color: '#C47B72', borderBottom: '1px solid rgba(217,139,130,0.2)' }}
        >
          <AlertTriangle size={11} />
          Volume does not equal priority — only {theme.count} mentions, yet #1 RICE score
        </div>
      )}

      <div className={isLowVolHighRice ? 'mt-7' : ''}>
        {/* Top row: rank + title + rising */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <span
              className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
              style={{ background: rank <= 3 ? 'rgba(217,139,130,0.15)' : 'rgba(107,93,82,0.08)', color: rank <= 3 ? '#D98B82' : '#6B5D52' }}
            >
              {rank}
            </span>
            <div>
              <h3 className="heading-md text-base leading-tight" style={{ color: '#1A1512' }}>
                {theme.title}
              </h3>
              <span className="text-xs" style={{ color: '#D9C3B0' }}>{theme.l1}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {theme.rising ? (
              <span className="badge-rising"><TrendingUp size={9} />↑</span>
            ) : (
              <span className="text-xs flex items-center gap-1" style={{ color: '#D9C3B0' }}>
                <TrendingDown size={10} />
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <div className="text-center">
            <div className="text-xs font-medium mb-0.5" style={{ color: '#6B5D52' }}>Mentions</div>
            <div className="font-bold text-base" style={{ color: '#1A1512' }}>{theme.count}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium mb-0.5" style={{ color: '#6B5D52' }}>Rev. at Risk</div>
            <div className="font-bold text-base">
              <RevenueAtRisk amount={theme.revenue_at_risk} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium mb-0.5" style={{ color: '#6B5D52' }}>RICE</div>
            <div className="font-bold text-base flex items-center gap-1" style={{ color: '#1A1512' }}>
              <Zap size={12} style={{ color: '#D98B82' }} />
              {theme.rice.score.toFixed(1)}
            </div>
          </div>
          <div className="ml-auto">
            <SentimentChip value={theme.avg_sentiment} showLabel={false} />
          </div>
        </div>

        {/* Intent mix */}
        <div className="mb-3">
          <IntentMixBar mix={theme.intent_mix as Record<string, number>} compact />
        </div>

        {/* Sparkline */}
        <SparklineChart data={theme.weekly_trend} rising={theme.rising} />

        {/* Top quote preview */}
        <div
          className="mt-3 text-xs italic leading-relaxed line-clamp-2 pl-3 border-l-2"
          style={{ color: '#6B5D52', borderColor: '#D9C3B0' }}
        >
          "{theme.top_quotes[0]?.text}"
        </div>

        {/* Click hint */}
        <div
          className="absolute bottom-3 right-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: '#D98B82' }}
        >
          View details →
        </div>
      </div>
    </motion.div>
  )
}
