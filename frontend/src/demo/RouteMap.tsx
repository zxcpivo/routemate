import { PLACES, placeById } from '../data/places'
import { formatTime, initials } from '../lib/format'
import type { Stop } from './plan'

// A simple drawn map of the shared route. It needs no map tiles or network,
// so the demo works offline at the venue.

const W = 340
const H = 220
const PAD = 34

// Label placement: two lines (place, time) beside each stop. Try right, then left,
// nudged up or down, and keep the first spot that stays inside the map without
// covering another label or stop. Widths are estimates for the 11px / 10px text.
type Box = { l: number; r: number; t: number; b: number }
type Spot = { x: number; y: number; anchor: 'start' | 'end' }

const overlaps = (a: Box, b: Box) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b

function placeLabels(points: { x: number; y: number }[], labels: { place: string; time: string }[]): Spot[] {
  const markers: Box[] = points.map((p) => ({ l: p.x - 12, r: p.x + 12, t: p.y - 12, b: p.y + 12 }))
  const placed: Box[] = []
  return points.map((p, i) => {
    const w = Math.max(labels[i].place.length * 7.2, labels[i].time.length * 6.2) + 2
    const sides: Spot['anchor'][] = p.x > W * 0.62 ? ['end', 'start'] : ['start', 'end']
    const candidates: { spot: Spot; box: Box }[] = []
    for (const dy of [0, 16, -16, 30, -30, 44, -44, 58, -58]) {
      for (const anchor of sides) {
        const x = anchor === 'start' ? p.x + 15 : p.x - 15
        const y = p.y - 2 + dy
        const l = anchor === 'start' ? x : x - w
        candidates.push({ spot: { x, y, anchor }, box: { l, r: l + w, t: y - 11, b: y + 15 } })
      }
    }
    const inside = (b: Box) => b.l >= 4 && b.r <= W - 4 && b.t >= 4 && b.b <= H - 4
    const free = (b: Box) => !placed.some((o) => overlaps(o, b)) && !markers.some((m, j) => j !== i && overlaps(m, b))
    const best = candidates.find((c) => inside(c.box) && free(c.box)) ?? candidates.find((c) => inside(c.box))
    if (best) {
      placed.push(best.box)
      return best.spot
    }
    // Nothing fits: keep the label inside the map edges at least.
    const anchor = sides[0]
    const x = anchor === 'start' ? Math.min(p.x + 15, W - 4 - w) : Math.max(p.x - 15, 4 + w)
    const y = Math.min(Math.max(p.y - 2, 15), H - 19)
    placed.push({ l: anchor === 'start' ? x : x - w, r: anchor === 'start' ? x + w : x, t: y - 11, b: y + 15 })
    return { x, y, anchor }
  })
}

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
  const labels = stops.map((s) => ({ place: placeById(s.placeId).area.split(',')[0], time: formatTime(s.time) }))
  const spots = placeLabels(xy, labels)

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
        const spot = spots[i]
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
            <text x={spot.x} y={spot.y} textAnchor={spot.anchor} className="route-map__label">
              {labels[i].place}
            </text>
            <text x={spot.x} y={spot.y + 13} textAnchor={spot.anchor} className="route-map__time">
              {labels[i].time}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
