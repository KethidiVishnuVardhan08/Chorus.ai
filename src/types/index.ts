// Types for the VoC Copilot seed data

export type Source = 'review' | 'ticket' | 'call_note' | 'screenshot' | 'social'
export type Segment = 'free' | 'pro' | 'enterprise' | 'churned'
export type Intent = 'bug' | 'feature_request' | 'churn_risk' | 'praise' | 'question'

export interface FeedbackItem {
  id: string
  text: string
  source: Source
  date: string
  segment: Segment
  account_id: string
  arr: number
  intent: Intent
  sentiment: number // -1 to 1
  theme_id: string
}

export interface TopQuote {
  text: string
  source: Source
  segment: Segment
  account_id: string
}

export interface IntentMix {
  bug?: number
  feature_request?: number
  churn_risk?: number
  question?: number
  praise?: number
}

export interface RICE {
  reach: number
  impact: number
  confidence: number
  effort: number
  score: number
}

export interface Theme {
  id: string
  title: string
  l1: string
  count: number
  avg_sentiment: number
  intent_mix: IntentMix
  revenue_at_risk: number
  rice: RICE
  weekly_trend: number[] // 8 weekly data points
  rising: boolean
  top_quotes: TopQuote[]
}

export interface GoldenSetItem {
  id: string
  text: string
  gold_intent: Intent
  gold_theme: string
  source: Source
}

export interface Evals {
  method?: string
  golden_set_size?: number
  intent_theme_f1: number
  theme_f1?: number
  theme_purity_precision: number
  theme_coverage_recall: number
  nmi: number
  ari: number
  theme_churn_naive: number
  theme_churn_grounded: number
  churn_reduction_pct?: number
  citation_faithfulness: number
}

export interface Meta {
  generated: string
  total_feedback: number
  themes: number
  sources: Source[]
  l1_categories: string[]
  product: string
}

export interface SeedData {
  meta: Meta
  feedback: FeedbackItem[]
  themes: Theme[]
  goldenSet: GoldenSetItem[]
  evals: Evals
}

export type SortKey = 'rice' | 'revenue' | 'volume'
