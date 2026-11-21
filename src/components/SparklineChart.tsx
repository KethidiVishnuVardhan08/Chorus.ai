import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface SparklineChartProps {
  data: number[]
  rising: boolean
  height?: number
}

export function SparklineChart({ data, rising, height = 40 }: SparklineChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [animatedData, setAnimatedData] = useState(data.map(() => 0))

  useEffect(() => {
    if (!isInView) return
    const timer = setTimeout(() => {
      setAnimatedData(data)
    }, 100)
    return () => clearTimeout(timer)
  }, [isInView, data])

  const chartData = animatedData.map((v, i) => ({ week: `W${i + 1}`, v }))
  const color = rising ? '#ef4444' : '#22c55e'

  return (
    <div ref={ref} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`sg-${rising}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{ display: 'none' }}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sg-${rising})`}
            isAnimationActive={isInView}
            animationDuration={800}
            animationEasing="ease-out"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
