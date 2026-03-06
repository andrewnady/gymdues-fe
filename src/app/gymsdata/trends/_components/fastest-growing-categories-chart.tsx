'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FASTEST_GROWING_CATEGORIES } from '../_data/growth-trends-data'

const CATEGORY_COLORS = [
  'hsl(var(--primary))',
  'hsl(25 95% 53%)',
  'hsl(142 76% 36%)',
  'hsl(262 83% 58%)',
  'hsl(199 89% 48%)',
  'hsl(0 72% 51%)',
  'hsl(38 92% 50%)',
]

type CategoryItem = { category: string; count: number; percentage: number }

interface FastestGrowingCategoriesChartProps {
  data?: CategoryItem[] | null
}

export function FastestGrowingCategoriesChart({ data: apiData }: FastestGrowingCategoriesChartProps) {
  const data = (apiData?.length
    ? apiData.map((d, i) => ({
        name: d.category,
        value: d.percentage,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))
    : FASTEST_GROWING_CATEGORIES.map((d) => ({ name: d.name, value: d.value, color: d.color }))
  ) as Array<{ name: string; value: number; color: string }>
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={'cell-' + index} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number | undefined) => [(value != null ? value : 0) + '%', 'Share of growth']}
          />
          <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
