import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { askFeedback } from '../data/api'
import type { Theme } from '../types'
import { QuoteCard } from '../components/Chips'
import { MessageCircle, Send, Sparkles, CornerDownLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
  citations?: Array<{ text: string; source: string; segment: string; themeTitle: string; themeId: string }>
  relatedThemes?: Theme[]
}

const suggestedQuestions = [
  "Why are enterprise customers at risk of churning?",
  "What's the highest-priority feature we're missing?",
  "Show me all feedback about data export and API",
  "What billing issues are causing the most churn?",
  "Which theme has the best RICE score?",
]

export default function AskFeedback() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your VoC Copilot. Ask me anything about your 520 customer feedback items — I'll always back my answers with real quotes. Try one of the suggestions below, or type your own question.",
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(text?: string) {
    const q = (text ?? input).trim()
    if (!q || loading) return

    setInput('')
    setMessages(m => [...m, { role: 'user', content: q }])
    setLoading(true)

    try {
      const { answer, citations, relatedThemes } = await askFeedback(q)
      setMessages(m => [...m, {
        role: 'assistant',
        content: answer,
        citations,
        relatedThemes,
      }])
    } catch (e) {
      setMessages(m => [...m, {
        role: 'assistant',
        content: "I encountered an error processing your question. Please try again.",
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F3EADE' }}>
      <div className="max-w-3xl mx-auto w-full px-6 py-10 flex flex-col flex-1">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={20} style={{ color: '#D98B82' }} />
            <h1 className="heading-xl text-3xl" style={{ color: '#1A1512' }}>Ask your feedback</h1>
          </div>
          <p style={{ color: '#6B5D52' }}>Every answer cites real quotes from the dataset. No hallucinations.</p>
        </div>

        {/* Chat area */}
        <div
          className="flex-1 overflow-y-auto rounded-2xl mb-4 p-4 space-y-4"
          style={{
            background: 'white',
            border: '1px solid rgba(217,195,176,0.5)',
            minHeight: 400,
            maxHeight: 520,
          }}
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[88%] ${msg.role === 'user' ? '' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#D98B82' }}>
                      <Sparkles size={10} color="white" />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#6B5D52' }}>Chorus.ai</span>
                  </div>
                )}

                <div
                  className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={msg.role === 'user'
                    ? { background: 'linear-gradient(135deg, #2A1D16, #4A3426)', color: '#F3EADE', borderRadius: '16px 16px 4px 16px' }
                    : { background: 'rgba(243,234,222,0.8)', color: '#1A1512', borderRadius: '4px 16px 16px 16px', border: '1px solid rgba(217,195,176,0.4)' }
                  }
                >
                  {msg.content}
                </div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B5D52' }}>
                      Cited evidence ({msg.citations.length})
                    </div>
                    {msg.citations.slice(0, 3).map((c, j) => (
                      <QuoteCard
                        key={j}
                        text={c.text}
                        source={c.source as any}
                        segment={c.segment}
                      />
                    ))}
                  </div>
                )}

                {/* Related themes */}
                {msg.relatedThemes && msg.relatedThemes.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B5D52' }}>
                      Related themes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.relatedThemes.map(t => (
                        <Link
                          key={t.id}
                          to="/dashboard"
                          className="text-xs px-3 py-1 rounded-full font-medium transition-colors"
                          style={{ background: 'rgba(217,139,130,0.12)', color: '#C47B72', border: '1px solid rgba(217,139,130,0.25)' }}
                        >
                          {t.title} ↗
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Loading */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(243,234,222,0.8)', border: '1px solid rgba(217,195,176,0.4)' }}>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#D98B82' }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className="text-xs" style={{ color: '#6B5D52' }}>Searching feedback…</span>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B5D52' }}>
              Suggested questions
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-2 rounded-xl text-left transition-all hover:shadow-sm"
                  style={{ background: 'white', border: '1px solid rgba(217,195,176,0.5)', color: '#1A1512' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div
          className="rounded-2xl p-3 flex items-end gap-3"
          style={{ background: 'white', border: '1px solid rgba(217,195,176,0.6)', boxShadow: '0 2px 12px rgba(42,29,22,0.06)' }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your customer feedback…"
            rows={1}
            className="flex-1 resize-none outline-none text-sm leading-relaxed bg-transparent"
            style={{ color: '#1A1512', maxHeight: 120 }}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs hidden sm:flex items-center gap-1" style={{ color: '#D9C3B0' }}>
              <CornerDownLeft size={10} /> Send
            </span>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: input.trim() && !loading ? '#D98B82' : 'rgba(107,93,82,0.1)',
                color: input.trim() && !loading ? 'white' : '#D9C3B0',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        <p className="text-xs text-center mt-3" style={{ color: '#D9C3B0' }}>
          Answers draw from 520 real feedback items • All insights are cited • No hallucinations
        </p>
      </div>
    </div>
  )
}
