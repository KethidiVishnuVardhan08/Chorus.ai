// Data access layer — async wrappers so a real LLM can be swapped in later

import seedData from '../data/voc_copilot_seed.json'
import type { SeedData, Theme, FeedbackItem, Evals } from '../types'

const data = seedData as SeedData

// Simulate async (network-ready interface)
function delay(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Fetch all themes, optionally filtered */
export async function getThemes(filters?: {
  intent?: string
  segment?: string
  source?: string
}): Promise<Theme[]> {
  await delay()
  let themes = [...data.themes]

  if (filters?.intent && filters.intent !== 'all') {
    themes = themes.filter(t => {
      const mix = t.intent_mix as Record<string, number>
      return mix[filters.intent!] && mix[filters.intent!] > 0.05
    })
  }

  if (filters?.segment && filters.segment !== 'all') {
    // Filter themes that have quotes from that segment
    themes = themes.filter(t =>
      t.top_quotes.some(q => q.segment === filters.segment)
    )
  }

  if (filters?.source && filters.source !== 'all') {
    themes = themes.filter(t =>
      t.top_quotes.some(q => q.source === filters.source)
    )
  }

  return themes
}

/** Ask feedback — keyword match across feedback text, returning relevant items with theme context */
export async function askFeedback(question: string): Promise<{
  answer: string
  citations: Array<{ text: string; source: string; segment: string; themeTitle: string; themeId: string }>
  relatedThemes: Theme[]
}> {
  await delay(300) // simulate LLM latency

  const q = question.toLowerCase()
  const keywords = q.split(/\s+/).filter(w => w.length > 3)

  // Score feedback items by keyword overlap
  const scored = data.feedback.map(f => {
    const textLower = f.text.toLowerCase()
    const score = keywords.reduce((acc, kw) => acc + (textLower.includes(kw) ? 1 : 0), 0)
    return { item: f, score }
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score)

  // Also score themes
  const themeScores = data.themes.map(t => {
    const titleLower = t.title.toLowerCase()
    const quoteTexts = t.top_quotes.map(q => q.text.toLowerCase()).join(' ')
    const score = keywords.reduce((acc, kw) =>
      acc + (titleLower.includes(kw) ? 2 : 0) + (quoteTexts.includes(kw) ? 1 : 0), 0
    )
    return { theme: t, score }
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score)

  const topItems = scored.slice(0, 5)
  const topThemes = themeScores.slice(0, 3).map(x => x.theme)

  // Build citations
  const citations = topItems.map(({ item }) => {
    const theme = data.themes.find(t => t.id === item.theme_id)
    return {
      text: item.text,
      source: item.source,
      segment: item.segment,
      themeTitle: theme?.title ?? 'Unknown',
      themeId: item.theme_id,
    }
  })

  // Build synthesized answer
  let answer = ''
  if (topThemes.length === 0 && topItems.length === 0) {
    answer = "I couldn't find specific feedback matching your question. Try asking about crashes, sync, notifications, pricing, or data export."
  } else if (q.includes('export') || q.includes('api')) {
    const t10 = data.themes.find(t => t.id === 'T10')!
    answer = `Despite only ${t10.count} mentions, 'No data export / API' has the highest RICE score (${t10.rice.score}) in the dataset. ${Math.round(t10.intent_mix.churn_risk! * 100)}% of feedback signals churn risk, with \$${t10.revenue_at_risk.toLocaleString()} ARR at stake. Enterprise customers are actively evaluating alternatives because of this gap.`
  } else if (q.includes('crash') || q.includes('bug')) {
    const t04 = data.themes.find(t => t.id === 'T04')!
    answer = `App crashes are the highest-volume pain point with ${t04.count} mentions and a strongly negative sentiment of ${t04.avg_sentiment.toFixed(2)}. The theme is rising (${t04.weekly_trend[t04.weekly_trend.length-1]} reports in the latest week vs ${t04.weekly_trend[0]} 8 weeks ago). \$${t04.revenue_at_risk.toLocaleString()} ARR is at risk.`
  } else if (q.includes('slow') || q.includes('load') || q.includes('performance')) {
    const t05 = data.themes.find(t => t.id === 'T05')!
    answer = `Slow load times affect ${t05.count} users across all segments with a RICE score of ${t05.rice.score}. The trend is declining (improving), but enterprise customers with high ARR are still flagging it.`
  } else if (q.includes('churn') || q.includes('risk') || q.includes('leaving')) {
    const churnThemes = data.themes.filter(t => t.intent_mix.churn_risk && t.intent_mix.churn_risk > 0.3)
    answer = `The top churn-risk themes are: ${churnThemes.map(t => `"${t.title}" (${Math.round(t.intent_mix.churn_risk! * 100)}% churn signal)`).join(', ')}. Collectively they put \$${churnThemes.reduce((s, t) => s + t.revenue_at_risk, 0).toLocaleString()} ARR at risk.`
  } else if (q.includes('price') || q.includes('billing') || q.includes('plan')) {
    const t07 = data.themes.find(t => t.id === 'T07')!
    const t08 = data.themes.find(t => t.id === 'T08')!
    answer = `Two billing themes surface: "Unexpected charges" (${t07.count} mentions, ${Math.round(t07.intent_mix.churn_risk! * 100)}% churn signal) and "Plan & pricing confusion" (${t08.count} mentions). Together they represent \$${(t07.revenue_at_risk + t08.revenue_at_risk).toLocaleString()} ARR at risk.`
  } else if (topThemes.length > 0) {
    const t = topThemes[0]
    answer = `The most relevant theme is "${t.title}" (${t.count} mentions, RICE ${t.rice.score}, \$${t.revenue_at_risk.toLocaleString()} ARR at risk). Sentiment is ${t.avg_sentiment < -0.3 ? 'strongly negative' : t.avg_sentiment < 0 ? 'mildly negative' : 'mixed'} at ${t.avg_sentiment.toFixed(2)}.`
  } else {
    answer = `Found ${topItems.length} relevant feedback items. The top signal is from "${topItems[0]?.item.text.slice(0, 60)}..." — a ${topItems[0]?.item.intent} from a ${topItems[0]?.item.segment} user.`
  }

  return { answer, citations, relatedThemes: topThemes }
}

/** Fetch evaluation metrics */
export async function getEvals(): Promise<Evals> {
  await delay()
  return data.evals
}

/** Get daily digest — rising and new themes */
export async function getDailyDigest() {
  await delay()

  const rising = data.themes.filter(t => t.rising)
  const churnRisk = data.themes
    .filter(t => t.intent_mix.churn_risk && t.intent_mix.churn_risk > 0.35)
    .sort((a, b) => b.revenue_at_risk - a.revenue_at_risk)

  // Get most recent feedback (last 2 days relative to dataset date)
  const cutoff = new Date('2026-11-20')
  const recentFeedback = data.feedback
    .filter(f => new Date(f.date) >= cutoff)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return {
    rising,
    churnRisk: churnRisk.slice(0, 3),
    recentFeedback,
    summary: {
      newMentions: recentFeedback.length,
      risingCount: rising.length,
      topChurnRisk: churnRisk[0] ?? null,
    }
  }
}

/** Get all feedback */
export async function getAllFeedback(): Promise<FeedbackItem[]> {
  await delay()
  return data.feedback
}

/** Get meta */
export async function getMeta() {
  await delay()
  return data.meta
}

export { data as seedData }
