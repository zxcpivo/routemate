import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { placeById, placeIdAt } from '../data/places'

// Live map for the Starting point & Destination step. Both pins can be dragged;
// a pin dropped close to a known station, mall or campus snaps to it.
// The road route comes from the public OSRM demo server. If that fails (offline at
// the venue, rate limits), a dashed straight line is drawn instead.

type LatLng = [number, number]

const routeCache = new Map<string, LatLng[]>()

async function fetchRoute(a: LatLng, b: LatLng, signal: AbortSignal): Promise<LatLng[] | null> {
  const key = `${a.join()};${b.join()}`
  const cached = routeCache.get(key)
  if (cached) return cached
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`
    const res = await fetch(url, { signal })
    if (!res.ok) return null
    const data = (await res.json()) as { routes?: { geometry: { coordinates: [number, number][] } }[] }
    const coords = data.routes?.[0]?.geometry.coordinates
    if (!coords?.length) return null
    const line = coords.map(([lng, lat]) => [lat, lng] as LatLng)
    routeCache.set(key, line)
    return line
  } catch {
    return null
  }
}

const pinIcon = (kind: 'start' | 'end', label: string) =>
  L.divIcon({
    className: '',
    html: `<span class="trip-pin trip-pin--${kind}" aria-hidden="true">${
      kind === 'end' ? '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 21V4h12l-2 4 2 4H5" fill="currentColor"/></svg>' : ''
    }</span><span class="sr-only">${label}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })

export function TripMap({
  startId,
  destinationId,
  startLabel,
  onMoveStart,
  onMoveDestination,
}: {
  startId: string
  destinationId: string
  startLabel: string
  onMoveStart: (id: string) => void
  onMoveDestination: (id: string) => void
}) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const startPin = useRef<L.Marker | null>(null)
  const endPin = useRef<L.Marker | null>(null)
  const line = useRef<L.Polyline | null>(null)
  const framed = useRef(false)
  // Keep the latest callbacks for Leaflet's event handlers.
  const handlers = useRef({ onMoveStart, onMoveDestination })
  useEffect(() => {
    handlers.current = { onMoveStart, onMoveDestination }
  })

  // Create the map once.
  useEffect(() => {
    if (!el.current) return
    const m = L.map(el.current, { scrollWheelZoom: false, zoomSnap: 0.25, zoomControl: true, attributionControl: true })
    // Standard OpenStreetMap tiles; demo.css darkens them in dark mode.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(m)
    line.current = L.polyline([], { className: 'trip-map__route', interactive: false }).addTo(m)

    const makePin = (kind: 'start' | 'end', label: string) => {
      const pin = L.marker([0, 0], { draggable: true, autoPan: true, icon: pinIcon(kind, label), title: label, alt: label }).addTo(m)
      pin.on('drag', () => {
        // Straight line while dragging, the road route comes back on drop.
        const a = startPin.current?.getLatLng()
        const b = endPin.current?.getLatLng()
        if (a && b) {
          line.current?.setLatLngs([a, b])
          line.current?.getElement()?.classList.add('trip-map__route--estimate')
        }
      })
      pin.on('dragend', () => {
        const { lat, lng } = pin.getLatLng()
        if (kind === 'start') handlers.current.onMoveStart(placeIdAt(lat, lng, 'meeting'))
        else handlers.current.onMoveDestination(placeIdAt(lat, lng, 'destination'))
      })
      return pin
    }
    startPin.current = makePin('start', startLabel)
    endPin.current = makePin('end', 'Destination')
    map.current = m

    // The step animates in; make sure Leaflet knows the final size.
    const ro = new ResizeObserver(() => m.invalidateSize())
    ro.observe(el.current)
    return () => {
      ro.disconnect()
      m.remove()
      map.current = null
      framed.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Move pins, frame the trip and draw the route whenever the places change.
  useEffect(() => {
    const m = map.current
    if (!m) return
    const s = placeById(startId)
    const d = placeById(destinationId)
    const a: LatLng = [s.lat, s.lng]
    const b: LatLng = [d.lat, d.lng]
    startPin.current?.setLatLng(a)
    endPin.current?.setLatLng(b)

    // Reframe only when the trip doesn't fit the current view, so a small drag doesn't jump the map.
    const bounds = L.latLngBounds([a, b])
    if (!framed.current || !m.getBounds().pad(-0.1).contains(bounds)) {
      m.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 })
      framed.current = true
    }

    line.current?.setLatLngs([a, b])
    line.current?.getElement()?.classList.add('trip-map__route--estimate')
    let live = true
    const ctrl = new AbortController()
    const timer = window.setTimeout(() => ctrl.abort(), 5000)
    fetchRoute(a, b, ctrl.signal).then((road) => {
      if (!live || !road) return
      line.current?.setLatLngs(road)
      line.current?.getElement()?.classList.remove('trip-map__route--estimate')
    })
    return () => {
      live = false
      window.clearTimeout(timer)
      ctrl.abort()
    }
  }, [startId, destinationId])

  return <div ref={el} className="trip-map" role="region" aria-label="Map of your trip. Drag the pins to move your starting point or destination." />
}
