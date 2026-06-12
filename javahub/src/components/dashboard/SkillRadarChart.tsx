import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface Props {
  groupScores: Record<string, number>
  previousGroupScores?: Record<string, number>
}

function labelColor(score: number) {
  if (score < 40) return '#f87171'   // red-400
  if (score < 70) return '#facc15'   // yellow-400
  return '#4ade80'                   // green-400
}

export function SkillRadarChart({ groupScores, previousGroupScores }: Props) {
  const data = Object.entries(groupScores).map(([group, score]) => ({
    group,
    score,
    previous: previousGroupScores?.[group] ?? undefined,
  }))

  const CustomTick = ({ x, y, payload }: any) => {
    const score = groupScores[payload.value] ?? 50
    return (
      <text x={x} y={y} textAnchor="middle" fill={labelColor(score)} fontSize={12}>
        {payload.value}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis dataKey="group" tick={<CustomTick />} />
        <Radar
          name="Current"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.4}
        />
        {previousGroupScores && (
          <Radar
            name="Previous"
            dataKey="previous"
            stroke="#9ca3af"
            fill="#9ca3af"
            fillOpacity={0.15}
            strokeDasharray="4 4"
          />
        )}
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
          labelStyle={{ color: '#e5e7eb' }}
          formatter={(v: number) => [`${v}%`, '']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
