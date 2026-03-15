'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { NEW_GYMS_BY_MONTH } from '../_data/growth-trends-data'

type NewGymsByMonthItem = { month: string; monthKey: string; count: number }

interface NewGymsTimelineChartProps {
  data?: NewGymsByMonthItem[] | null
}

const CHART_HEIGHT = 280

export function NewGymsTimelineChart({ data: apiData }: NewGymsTimelineChartProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const data = (apiData?.length
    ? apiData.map((d) => ({ name: d.month, count: d.count }))
    : NEW_GYMS_BY_MONTH.map((d) => ({ name: d.month + ' ' + d.year, count: d.count }))
  ) as Array<{ name: string; count: number }>

  if (!mounted) {
    return <div className="h-[280px] w-full min-w-0" aria-hidden />
  }

  return (
    <div className="h-[280px] min-h-[280px] w-full min-w-0" style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="newGymsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number | undefined) => [(value ?? 0) + ' new gyms', 'Count']}
            labelFormatter={(label: React.ReactNode) => 'Month: ' + String(label ?? '')}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#newGymsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
