import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface SubjectMark {
  subject: string
  marks: number
}

/**
 * Professional, visually distinct palette so every bar on a chart has its own
 * colour (subjects and classes are comparisons, not a single series).
 */
const BAR_COLORS = [
  '#2563eb', // blue-600
  '#0d9488', // teal-600
  '#7c3aed', // violet-600
  '#ea580c', // orange-600
  '#db2777', // pink-600
  '#65a30d', // lime-600
  '#0284c7', // sky-600
  '#b45309', // amber-700
]

export function SubjectBarChart({
  data,
  ariaLabel = 'Bar chart of average marks',
}: {
  data: SubjectMark[]
  ariaLabel?: string
}) {
  return (
    <div role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value}`, 'Average mark']}
            cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            }}
          />
          <Bar dataKey="marks" radius={[6, 6, 0, 0]} maxBarSize={42}>
            {data.map((entry, index) => (
              <Cell key={entry.subject} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
