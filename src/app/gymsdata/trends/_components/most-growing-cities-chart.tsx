'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MOST_GROWING_CITIES } from '../_data/growth-trends-data'

const data = MOST_GROWING_CITIES.map((d) => ({ city: d.city, growth: d.growth }))

export function MostGrowingCitiesChart() {
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
            formatter={(value: number) => ['+' + value + ' gyms (12 mo)', 'Growth']}
            labelFormatter={(label: string) => label}
          />
          <Bar dataKey="growth" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="New gyms" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
