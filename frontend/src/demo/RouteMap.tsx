import { PLACES, placeById } from '../data/places'
import { formatTime, initials } from '../lib/format'
import type { Stop } from './plan'

// A simple drawn map of the shared route. It needs no map tiles or network,
// so the demo works offline at the venue.

const W = 340
const H = 220
const PAD = 34

export function RouteMap({ stops }: { stops: Stop[] }) {
  const pts = stops.map((s) => placeById(s.placeId))
  const lats = pts.map((p) => p.lat)
  const lngs = pts.map((p) => p.lng)
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const kx = Math.cos((midLat * Math.PI) / 180) // longitude degrees are shorter here

  const minX = Math.min(...lngs) * kx
  const maxX = Math.max(...lngs) * kx
  const minY = Math.min(...lats)
  const maxY = Math.max(...lats)
  const span = Math.max(maxX - minX, (maxY - minY) * ((W - 2 * PAD) / (H - 2 * PAD)), 0.02)
  const scale = (W - 2 * PAD) / span
  const offX = (W - (maxX - minX) * scale) / 2
  const offY = (H - (maxY - minY) * scale) / 2

  const project = (lat: number, lng: number) => ({
    x: offX + (lng * kx - minX) * scale,
    y: H - (offY + (lat - minY) * scale),
  })

  const xy = pts.map((p) => project(p.lat, p.lng))
  const path = xy.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const first = xy[0]
  const last = xy[xy.length - 1]

  // Other meeting points nearby, drawn faintly for context.
  const context = PLACES.map((p) => ({ p, ...project(p.lat, p.lng) })).filter(
    (c) => c.x > 8 && c.x < W - 8 && c.y > 8 && c.y < H - 8 && !stops.some((s) => s.placeId === c.p.id),
  )

  const summary = stops.map((s) => `${s.kind === 'end' ? 'Arrive at' : s.kind === 'start' ? 'Leave from' : `Pick up ${s.who} at`} ${placeById(s.placeId).area} at ${formatTime(s.time)}`).join('. ')

  return (
    <svg className="route-map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of the shared route. ${summary}.`}>
      <defs>
        <pattern id="rm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" className="route-map__grid" />
        </pattern>
      </defs>
      <rect width={W} height={H} className="route-map__bg" />
      <rect width={W} height={H} fill="url(#rm-grid)" />

      {context.map((c) => (
        <circle key={c.p.id} cx={c.x} cy={c.y} r={2.5} className="route-map__context" />
      ))}

      {/* Direct route the driver would take alone */}
      <line x1={first.x} y1={first.y} x2={last.x} y2={last.y} className="route-map__direct" />
      {/* Shared route */}
      <path d={path} className="route-map__casing" />
      <path d={path} className="route-map__line" />

      {stops.map((s, i) => {
        const { x, y } = xy[i]
        const labelLeft = x > W * 0.62
        const place = placeById(s.placeId)
        return (
          <g key={i}>
            {s.kind === 'start' && <circle cx={x} cy={y} r={8} className="route-map__start" />}
            {s.kind === 'pickup' && (
              <>
                <circle cx={x} cy={y} r={11} className="route-map__pickup" />
                <text x={x} y={y + 3.5} textAnchor="middle" className="route-map__initials">
                  {initials(s.who)}
                </text>
              </>
            )}
            {s.kind === 'end' && (
              <>
                <circle cx={x} cy={y} r={11} className="route-map__end" />
                <path d={`M${x - 3.5} ${y + 5}V${y - 5}h7l-1.5 2.5 1.5 2.5h-7`} className="route-map__flag" />
              </>
            )}
            <text x={labelLeft ? x - 15 : x + 15} y={y - 2} textAnchor={labelLeft ? 'end' : 'start'} className="route-map__label">
              {place.area.split(',')[0]}
            </text>
            <text x={labelLeft ? x - 15 : x + 15} y={y + 11} textAnchor={labelLeft ? 'end' : 'start'} className="route-map__time">
              {formatTime(s.time)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
