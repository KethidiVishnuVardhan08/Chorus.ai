import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function ScrollReveal({ children, delay = 0, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps {
  children: ReactNode[]
  delay?: number
  staggerDelay?: number
  className?: string
}

export function StaggerChildren({ children, delay = 0, staggerDelay = 0.08, className = '' }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: delay + i * staggerDelay, ease: [0.22, 1, 0.36, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

interface CountUpProps {
  end: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
}

export function CountUp({ end, prefix = '', suffix = '', decimals = 0, duration = 1.5 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const startTime = performance.now()
    const factor = Math.pow(10, decimals)

    function update(now: number) {
      const elapsed = (now - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(end * eased * factor) / factor)
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }, [isInView, end, duration, decimals])

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? current.toFixed(decimals) : current.toLocaleString()}{suffix}
    </span>
  )
}
