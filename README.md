# Chorus.ai — Voice-of-Customer Copilot

*Turning scattered customer feedback into source-cited, revenue-ranked roadmap decisions.*

**Live Application:** [https://chorus-ai-voc.vercel.app](https://chorus-ai-voc.vercel.app) · **Repository:** [https://github.com/shambhavi999/Chorus.ai](https://github.com/shambhavi999/Chorus.ai)

Chorus.ai ingests 520 customer feedback signals across five channels (reviews, support tickets, call notes, screenshots, social), clusters them into a stable theme taxonomy, and ranks each theme by the revenue it puts at risk — with every insight traceable to a real customer quote. It's a working demo built to show how I think as an AI product manager, not just that I can wire up an LLM.

---

## The Problem

A PM drowns in feedback scattered across App Store reviews, support tickets, sales calls, and WhatsApp screenshots. Turning that into a defensible roadmap is slow and lossy — teams routinely spend most of their time just organizing feedback, so insights arrive weeks late and miss the sprint they mattered for. Two failure modes make it worse:
1. **Prioritizing by volume** (the loudest issue, not the most valuable one).
2. **Trusting AI summaries that can't point to the evidence** behind them (the trust and hallucination deficit).

## What It Does

- **Ingests & normalizes** multi-source feedback into one feed, tagged by intent (`bug` / `feature_request` / `churn_risk` / `praise` / `question`), sentiment (-1.0 to +1.0), and segment (`free`, `pro`, `enterprise`, `churned`).
- **Clusters** every item into a fixed two-level taxonomy (5 categories → 12 themes).
- **Ranks** themes by **revenue-at-risk** and **RICE score**, not raw volume.
- **Cites** every theme and every answer with the actual customer quotes behind it.
- **Answers questions** in natural language ("what's driving churn in enterprise?") over the whole corpus with cited evidence.
- **Ships a daily digest** of what changed (rising themes, churn warnings) and a one-click PRD draft per theme.

## Key Product Decisions (The Thinking)

**1. A fixed taxonomy, not free re-clustering.**  
Ask an LLM twice for "the top themes" and it returns a different set each time — useless for tracking a theme week over week. I ground clustering in a fixed taxonomy so themes are stable and comparable. I *measured* this: it cut theme churn by 84%.

**2. Revenue-at-risk over volume.**  
Volume ranks the loudest users first. I score each theme by the ARR of accounts raising it in a churn, renewal, or competitive context, weighted by renewal proximity. The clearest proof is the **"No data export / API"** theme: just **17 mentions** (the lowest volume) yet a top-tier RICE score and real ARR at stake — a volume-based roadmap would have buried it.

**3. Citation-first.**  
No insight appears without a real quote behind it. This is the trust guarantee, and I verify it: 100% of displayed quotes exist verbatim in the source corpus.

**4. Intent routing.**  
Users report broken experiences far more often than they request features, so every signal is tagged by intent and routed (bugs → engineering, feature requests → product, churn-risk → customer success).

## How I Evaluated It (The Part Most Portfolios Skip)

I built a 40-case **golden set** (hand-labeled intents and themes) and measured the system against it with a method that can't quietly cheat:

- **Classifier:** A transparent, rule-based keyword classifier with **no training step**, so label leakage is impossible and errors come from genuine intent overlap (feature-request vs. question).
- **Theme churn:** Measured, not asserted — I assign all 520 items twice and count how many move between runs. "Naive" = unsupervised KMeans with a random init per run; "grounded" = the fixed taxonomy with 10% of keywords dropped each run (so it isn't a rigged zero).
- **Citation faithfulness:** Every displayed quote is checked against the corpus.

### Measured Results (`python run_evals.py`)

| Metric | Result | Target / Baseline | Status |
| --- | --- | --- | --- |
| **Intent macro-F1 (golden set)** | **0.87** | > 0.80 | PASS |
| **Theme macro-F1** | **0.95** | > 0.85 | PASS |
| **Theme purity / coverage** | **0.93 / 0.95** | > 0.90 | PASS |
| **Clustering NMI / ARI vs. gold** | **0.89 / 0.82** | > 0.75 | PASS |
| **Theme churn: naive → grounded** | **0.38 → 0.06 (84% ↓)** | < 0.10 | 84% REDUCTION |
| **Citation faithfulness** | **100%** | 100% | VERIFIED |

These are reproducible: `python run_evals.py` recomputes and verifies them from the seed data on every run.

## Trade-offs I Made

- **Coverage vs. hallucination.** I cap the system at what it can cite. It will miss a faint emerging theme rather than invent one — a deliberate choice for a trust product.
- **Volume vs. revenue.** Revenue-at-risk can under-weight a high-volume free-tier pain point. I keep volume as a visible sort option so the PM sees both lenses side by side.
- **Taxonomy stability vs. adaptability.** A fixed taxonomy buys stability but can go stale over time as new user language emerges. Recommended extension: a quarterly taxonomy re-alignment flow triggered by unclassified cluster density.

---

## Design System ('Editorial Coffee House Meets Analytics')

- **Palette**: Warm Espresso (`#2A1D16` gradient to `#4A3426`), Cream background (`#F3EADE`), Latte borders (`#D9C3B0`), Clay accents & CTAs (`#D98B82`), Deep Ink typography (`#1A1512`), Muted brown secondary (`#6B5D52`), Plum contrast accents (`#1E1A2E`).
- **Typography**: General Sans / Satoshi (Display headlines, tight tracking) paired with Inter (Body, metrics, code).
- **Motion**: Framer Motion scroll reveals, metric count-ups, card hover lifts, drawer transitions (fully respects `prefers-reduced-motion`).

---

## Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Animations**: Framer Motion
- **Visualizations**: Recharts (Responsive Trend Lines, Bar Charts, Area Sparklines)
- **Icons**: Lucide React
- **Data Layer**: 100% client-side SPA reading from `/src/data/voc_copilot_seed.json`, with async abstractions (`getThemes`, `askFeedback`, `getEvals`, `getDailyDigest`) ready for backend LLM / vector DB integration.

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run evaluation verification suite
```bash
python run_evals.py
```

### 4. Build for production
```bash
npm run build
```
