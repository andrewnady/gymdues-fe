'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer as PieResponsive } from 'recharts'
import { RATING_DISTRIBUTION } from '../_data/dataset-metrics'

const RATING_COLORS = ['hsl(142 76% 36%)', 'hsl(var(--primary))', 'hsl(45 93% 47%)', 'hsl(25 95% 53%)', 'hsl(0 84% 60%)']

interface DatasetChartsProps {
  top10States: { stateName: string; count: number }[]
}

export function DatasetCharts({ top10States }: DatasetChartsProps) {
  const barData = top10States.map((s) => ({ name: s.stateName, count: s.count }))
  const pieData = RATING_DISTRIBUTION.map((r, i) => ({ ...r, color: RATING_COLORS[i] }))

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Top 10 states by count</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [v.toLocaleString('en-US'), 'Gyms']} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Rating distribution</h3>
        <div className="h-[280px]">
          <PieResponsive width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={2} />
                ))}
              </Pie>
              <PieTooltip formatter={(v: number) => [v + '%', 'Share']} />
            </PieChart>
          </PieResponsive>
        </div>
      </div>
    </div>
  )
}
