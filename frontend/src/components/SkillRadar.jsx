// ========================================
// Skill Radar Chart Component
// Visual representation of skills by category
// ========================================

import { useMemo } from 'react'

function SkillRadar({ data }) {
  const size = 200
  const center = size / 2
  const radius = size * 0.4
  const levels = 5

  // Calculate polygon points for each data point
  const points = useMemo(() => {
    const angleStep = (2 * Math.PI) / data.length
    return data.map((item, i) => {
      const angle = i * angleStep - Math.PI / 2 // Start from top
      const value = (item.value / 100) * radius
      return {
        x: center + value * Math.cos(angle),
        y: center + value * Math.sin(angle),
        labelX: center + (radius + 25) * Math.cos(angle),
        labelY: center + (radius + 25) * Math.sin(angle),
        name: item.name,
        value: item.value
      }
    })
  }, [data])

  // Create polygon path
  const polygonPath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z'

  // Background levels
  const levelPolygons = useMemo(() => {
    return Array.from({ length: levels }, (_, levelIndex) => {
      const levelRadius = (radius / levels) * (levelIndex + 1)
      const angleStep = (2 * Math.PI) / data.length
      
      const levelPoints = data.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        return {
          x: center + levelRadius * Math.cos(angle),
          y: center + levelRadius * Math.sin(angle)
        }
      })

      return levelPoints.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ') + ' Z'
    })
  }, [data])

  // Axis lines
  const axisLines = useMemo(() => {
    const angleStep = (2 * Math.PI) / data.length
    return data.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2
      return {
        x1: center,
        y1: center,
        x2: center + radius * Math.cos(angle),
        y2: center + radius * Math.sin(angle)
      }
    })
  }, [data])

  return (
    <div className="flex flex-col items-center">
      <svg width={size + 60} height={size + 60} className="overflow-visible">
        <g transform={`translate(30, 30)`}>
          {/* Background levels */}
          {levelPolygons.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="rgb(51, 65, 85)"
              strokeWidth="1"
              opacity={0.5}
            />
          ))}

          {/* Axis lines */}
          {axisLines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgb(51, 65, 85)"
              strokeWidth="1"
            />
          ))}

          {/* Data polygon */}
          <path
            d={polygonPath}
            fill="rgba(99, 102, 241, 0.3)"
            stroke="rgb(99, 102, 241)"
            strokeWidth="2"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="rgb(99, 102, 241)"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Labels */}
          {points.map((point, i) => (
            <text
              key={i}
              x={point.labelX}
              y={point.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="rgb(148, 163, 184)"
            >
              {point.name}
            </text>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.value >= 70 ? '#10b981' : item.value >= 40 ? '#f59e0b' : '#ef4444' }}
            />
            <span className="text-xs text-slate-400">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillRadar
