// Links that open the next ride in a navigation app.
// Google Maps takes every stop. Apple Maps and Waze web links take one destination,
// so they open the first stop: the first pickup for a driver, the meeting point for a rider.

import { placeById } from '../data/places'
import type { Stop } from './plan'

export type NavLink = { app: string; href: string; note: string }

const ll = (placeId: string) => {
  const p = placeById(placeId)
  return `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`
}

export function navLinks(stops: Stop[], isDriver: boolean, myPickupId?: string): NavLink[] {
  if (isDriver) {
    const start = stops[0]
    const end = stops[stops.length - 1]
    const pickups = stops.filter((s) => s.kind === 'pickup')
    const firstStop = pickups[0] ?? end
    const google = new URL('https://www.google.com/maps/dir/')
    google.searchParams.set('api', '1')
    google.searchParams.set('origin', ll(start.placeId))
    google.searchParams.set('destination', ll(end.placeId))
    if (pickups.length) google.searchParams.set('waypoints', pickups.map((s) => ll(s.placeId)).join('|'))
    google.searchParams.set('travelmode', 'driving')
    return [
      { app: 'Google Maps', href: google.toString(), note: 'every stop' },
      { app: 'Apple Maps', href: `https://maps.apple.com/?saddr=${ll(start.placeId)}&daddr=${ll(firstStop.placeId)}&dirflg=d`, note: 'first stop' },
      { app: 'Waze', href: `https://waze.com/ul?ll=${ll(firstStop.placeId)}&navigate=yes`, note: 'first stop' },
    ]
  }
  // Rider: directions to the meeting point.
  const meet = myPickupId ?? stops[0].placeId
  return [
    { app: 'Google Maps', href: `https://www.google.com/maps/dir/?api=1&destination=${ll(meet)}&travelmode=walking`, note: 'to your pickup' },
    { app: 'Apple Maps', href: `https://maps.apple.com/?daddr=${ll(meet)}&dirflg=w`, note: 'to your pickup' },
    { app: 'Waze', href: `https://waze.com/ul?ll=${ll(meet)}&navigate=yes`, note: 'to your pickup' },
  ]
}
