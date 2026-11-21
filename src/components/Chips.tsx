import type { Source } from '../types'
import { FileText, Ticket, Phone, Image, Twitter, LucideIcon } from 'lucide-react'

interface SourceBadgeProps {
  source: Source
  size?: 'sm' | 'md'
}

const sourceConfig: Record<Source, { label: string; className: string; icon: LucideIcon }> = {
  review: { label: 'Review', className: 'source-review', icon: FileText },
  ticket: { label: 'Ticket', className: 'source-ticket', icon: Ticket },
  call_note: { label: 'Call Note', className: 'source-call_note', icon: Phone },
  screenshot: { label: 'Screenshot', className: 'source-screenshot', icon: Image },
  social: { label: 'Social', className: 'source-social', icon: Twitter },
}

export function SourceBadge({ source, size = 'sm' }: SourceBadgeProps) {
  const cfg = sourceConfig[source] || sourceConfig.review
  const Icon = cfg.icon
  return (
    <span className={`source-badge ${cfg.className}`} style={{ fontSize: size === 'md' ? 12 : 10 }}>
      <Icon size={size === 'md' ? 11 : 9} />
      {cfg.label}
    </span>
  )
}

interface SentimentChipProps {
  value: number
  showLabel?: boolean
}

export function SentimentChip({ value, showLabel = true }: SentimentChipProps) {
  const cls = value > 0.1 ? 'chip-positive' : value < -0.15 ? 'chip-negative' : 'chip-neutral'
  const label = value > 0.1 ? 'Positive' : value < -0.15 ? 'Negative' : 'Neutral'
  const emoji = value > 0.1 ? '↑' : value < -0.15 ? '↓' : '→'

  return (
    <span className={`chip-base ${cls}`}>
      {emoji} {showLabel ? label : ''} {value.toFixed(2)}
    </span>
  )
}

interface IntentMixBarProps {
  mix: Record<string, number>
  compact?: boolean
}

const intentColors: Record<string, string> = {
  bug: '#ef4444',
  feature_request: '#3b82f6',
  churn_risk: '#f97316',
  question: '#a855f7',
  praise: '#22c55e',
}

const intentLabels: Record<string, string> = {
  bug: 'Bug',
  feature_request: 'Feature',
  churn_risk: 'Churn Risk',
  question: 'Question',
  praise: 'Praise',
}

export function IntentMixBar({ mix, compact = false }: IntentMixBarProps) {
  const entries = Object.entries(mix).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])

  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        {entries.map(([key, val]) => (
          <div
            key={key}
            style={{ width: `${val * 100}%`, background: intentColors[key] ?? '#94a3b8' }}
            title={`${intentLabels[key] ?? key}: ${Math.round(val * 100)}%`}
          />
        ))}
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-2 mt-2">
          {entries.map(([key, val]) => (
            <span key={key} className="flex items-center gap-1 text-xs" style={{ color: '#6B5D52' }}>
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: intentColors[key] ?? '#94a3b8' }}
              />
              {intentLabels[key] ?? key} {Math.round(val * 100)}%
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

interface QuoteCardProps {
  text: string
  source: Source
  segment: string
  account_id?: string
  highlight?: boolean
}

export function QuoteCard({ text, source, segment, account_id, highlight = false }: QuoteCardProps) {
  return (
    <div
      className="quote-card"
      style={highlight ? { borderColor: 'rgba(217,139,130,0.5)', background: 'rgba(217,139,130,0.06)' } : {}}
    >
      <div className="pl-6 text-sm leading-relaxed" style={{ color: '#1A1512' }}>
        {text}
      </div>
      <div className="flex items-center gap-2 mt-3 pl-6">
        <SourceBadge source={source} />
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(107,93,82,0.1)', color: '#6B5D52' }}>
          {segment}
        </span>
        {account_id && (
          <span className="text-xs" style={{ color: '#D9C3B0' }}>{account_id}</span>
        )}
      </div>
    </div>
  )
}

interface RICEDisplayProps {
  rice: { reach: number; impact: number; confidence: number; effort: number; score: number }
  showBreakdown?: boolean
}

export function RICEDisplay({ rice, showBreakdown = false }: RICEDisplayProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B5D52' }}>RICE</span>
        <span className="heading-md text-lg" style={{ color: '#1A1512' }}>{rice.score.toFixed(1)}</span>
      </div>
      {showBreakdown && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[
            { label: 'Reach', value: rice.reach },
            { label: 'Impact', value: `${rice.impact}×` },
            { label: 'Confidence', value: `${rice.confidence}%` },
            { label: 'Effort', value: `${rice.effort}w` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(217,195,176,0.2)' }}>
              <div className="text-xs font-medium" style={{ color: '#6B5D52' }}>{label}</div>
              <div className="font-semibold text-sm mt-0.5" style={{ color: '#1A1512' }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function RevenueAtRisk({ amount }: { amount: number }) {
  const formatted = amount >= 1000
    ? `$${(amount / 1000).toFixed(0)}k`
    : `$${amount}`

  return (
    <span className="font-semibold" style={{ color: amount > 50000 ? '#dc2626' : amount > 20000 ? '#f97316' : '#6B5D52' }}>
      {formatted}
    </span>
  )
}
