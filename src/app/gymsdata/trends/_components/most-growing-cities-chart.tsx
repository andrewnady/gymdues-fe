'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MOST_GROWING_CITIES } from '../_data/growth-trends-data'

type MostGrowingCityItem = {
  rank: number
  city: string
  state: string
  stateName: string
  label: string
  growth: number
  count: number
  period: string | null
}

interface MostGrowingCitiesChartProps {
  data?: MostGrowingCityItem[] | null
}

export function MostGrowingCitiesChart({ data: apiData }: MostGrowingCitiesChartProps) {
  const data = (apiData?.length
    ? apiData.map((d) => ({ city: d.label || `${d.city}, ${d.state}`, growth: d.growth }))
    : MOST_GROWING_CITIES.map((d) => ({ city: d.city, growth: d.growth }))
  ) as Array<{ city: string; growth: number }>
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <YAxis type="category" dataKey="city" width={75} tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number | undefined) => ['+' + (value ?? 0) + ' gyms (12 mo)', 'Growth']}
            labelFormatter={(label: React.ReactNode) => String(label ?? '')}
          />
          <Bar dataKey="growth" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="New gyms" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
