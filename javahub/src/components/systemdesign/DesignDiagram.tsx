import { useState } from 'react'
import type { SvgComponent, SvgConnection } from '@/types/content'

interface Props {
  components: SvgComponent[]
  connections: SvgConnection[]
}

const VIEWBOX_W = 700
const VIEWBOX_H = 460

function getCenter(c: SvgComponent) {
  return { cx: c.x + c.width / 2, cy: c.y + c.height / 2 }
}

function ShapeEl({ comp, selected, onClick }: { comp: SvgComponent; selected: boolean; onClick: () => void }) {
  const stroke = selected ? '#6366f1' : '#4b5563'
  const strokeW = selected ? 2.5 : 1.5
  const fill = selected ? '#1e1b4b' : '#111827'
  const labelLines = comp.label.split('\n')

  const handleClick = (e: React.MouseEvent) => { e.stopPropagation(); onClick() }

  const labelEl = (cx: number, cy: number) => (
    <>
      {labelLines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={cy + (i - (labelLines.length - 1) / 2) * 13}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fill={selected ? '#a5b4fc' : '#d1d5db'}
        >{line}</text>
      ))}
    </>
  )

  if (comp.shape === 'cylinder') {
    const rx = comp.width / 2, ry = 8
    const cx = comp.x + rx, cy = comp.y + comp.height / 2
    return (
      <g onClick={handleClick} style={{ cursor: 'pointer' }}>
        <ellipse cx={cx} cy={comp.y + ry} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={strokeW} />
        <rect x={comp.x} y={comp.y + ry} width={comp.width} height={comp.height - ry * 2} fill={fill} stroke={stroke} strokeWidth={strokeW} />
        <ellipse cx={cx} cy={comp.y + comp.height - ry} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={strokeW} />
        {labelEl(cx, cy)}
      </g>
    )
  }

  if (comp.shape === 'diamond') {
    const cx = comp.x + comp.width / 2, cy = comp.y + comp.height / 2
    const pts = `${cx},${comp.y} ${comp.x + comp.width},${cy} ${cx},${comp.y + comp.height} ${comp.x},${cy}`
    return (
      <g onClick={handleClick} style={{ cursor: 'pointer' }}>
        <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={strokeW} />
        {labelEl(cx, cy)}
      </g>
    )
  }

  if (comp.shape === 'circle') {
    const cx = comp.x + comp.width / 2, cy = comp.y + comp.height / 2
    const r = Math.min(comp.width, comp.height) / 2
    return (
      <g onClick={handleClick} style={{ cursor: 'pointer' }}>
        <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeW} />
        {labelEl(cx, cy)}
      </g>
    )
  }

  // rect (default)
  return (
    <g onClick={handleClick} style={{ cursor: 'pointer' }}>
      <rect x={comp.x} y={comp.y} width={comp.width} height={comp.height} rx={6} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      {labelEl(comp.x + comp.width / 2, comp.y + comp.height / 2)}
    </g>
  )
}

function Arrow({ from, to, label, components }: { from: string; to: string; label?: string; components: SvgComponent[] }) {
  const src = components.find(c => c.id === from)
  const dst = components.find(c => c.id === to)
  if (!src || !dst) return null

  const s = getCenter(src)
  const d = getCenter(dst)
  const mx = (s.cx + d.cx) / 2
  const my = (s.cy + d.cy) / 2

  return (
    <g>
      <defs>
        <marker id={`arrow-${from}-${to}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#6b7280" />
        </marker>
      </defs>
      <line
        x1={s.cx} y1={s.cy} x2={d.cx} y2={d.cy}
        stroke="#374151" strokeWidth={1.5}
        markerEnd={`url(#arrow-${from}-${to})`}
      />
      {label && (
        <text x={mx} y={my - 5} textAnchor="middle" fontSize={8} fill="#6b7280">{label}</text>
      )}
    </g>
  )
}

export default function DesignDiagram({ components, connections }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const selectedComp = components.find(c => c.id === selected)

  return (
    <div className="flex gap-4 flex-col lg:flex-row">
      <div className="flex-1 overflow-x-auto bg-gray-950 border border-gray-800 rounded-xl p-2">
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          width="100%"
          style={{ minWidth: 480 }}
          onClick={() => setSelected(null)}
        >
          {connections.map(conn => (
            <Arrow key={`${conn.from}-${conn.to}`} {...conn} components={components} />
          ))}
          {components.map(comp => (
            <ShapeEl
              key={comp.id}
              comp={comp}
              selected={selected === comp.id}
              onClick={() => setSelected(selected === comp.id ? null : comp.id)}
            />
          ))}
        </svg>
      </div>

      {selectedComp && (
        <div className="lg:w-72 bg-gray-900 border border-indigo-800/50 rounded-xl p-4 space-y-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-indigo-300">{selectedComp.label.replace('\n', ' ')}</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-600 hover:text-gray-400 text-xs"
            >✕</button>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{selectedComp.javaNote}</p>
        </div>
      )}
    </div>
  )
}
