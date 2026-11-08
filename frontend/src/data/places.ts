// Meeting points and destinations around the GTA.
// Riders pick a meeting point instead of a home address, which keeps
// home addresses private and shortens the driver's detour.

export type Place = {
  id: string
  name: string // exact meeting point, shown only after both people accept
  area: string // approximate area, shown before a match is accepted
  lat: number
  lng: number
  kind: 'meeting' | 'destination'
}

export const PLACES: Place[] = [
  // Destinations
  { id: 'york-keele', name: 'York University – Keele campus (Vari Hall loop)', area: 'York University, Keele', lat: 43.7735, lng: -79.5019, kind: 'destination' },
  { id: 'humber-north', name: 'Humber Polytechnic – North campus', area: 'Humber North, Etobicoke', lat: 43.7289, lng: -79.6066, kind: 'destination' },
  { id: 'pearson-t1', name: 'Toronto Pearson – Terminal 1 staff lot', area: 'Pearson Airport', lat: 43.6777, lng: -79.6248, kind: 'destination' },
  { id: 'north-york-centre', name: 'North York Centre (Yonge & Sheppard)', area: 'North York Centre', lat: 43.768, lng: -79.413, kind: 'destination' },

  // Meeting points
  { id: 'bramalea', name: 'Bramalea Terminal, bay 4', area: 'Bramalea, Brampton', lat: 43.716, lng: -79.724, kind: 'meeting' },
  { id: 'brampton-dt', name: 'Brampton Downtown Terminal, Main St entrance', area: 'Downtown Brampton', lat: 43.686, lng: -79.76, kind: 'meeting' },
  { id: 'malton', name: 'Westwood Square, south parking lot', area: 'Malton, Mississauga', lat: 43.707, lng: -79.639, kind: 'meeting' },
  { id: 'square-one', name: 'Square One, City Centre Transit Terminal', area: 'Mississauga City Centre', lat: 43.5933, lng: -79.6424, kind: 'meeting' },
  { id: 'rexdale', name: 'Albion Centre, Finch Ave entrance', area: 'Rexdale, Etobicoke', lat: 43.741, lng: -79.585, kind: 'meeting' },
  { id: 'woodbridge', name: 'Market Lane, Woodbridge Ave', area: 'Woodbridge, Vaughan', lat: 43.7867, lng: -79.6025, kind: 'meeting' },
  { id: 'vmc', name: 'Vaughan Metropolitan Centre, SmartVMC bus terminal', area: 'Vaughan Metropolitan Centre', lat: 43.7942, lng: -79.5275, kind: 'meeting' },
  { id: 'maple', name: 'Maple GO Station, kiss & ride', area: 'Maple, Vaughan', lat: 43.853, lng: -79.509, kind: 'meeting' },
  { id: 'richmond-hill', name: 'Richmond Hill Centre, Viva platform', area: 'Richmond Hill', lat: 43.841, lng: -79.427, kind: 'meeting' },
  { id: 'thornhill', name: 'Promenade Mall, Centre St entrance', area: 'Thornhill', lat: 43.807, lng: -79.452, kind: 'meeting' },
  { id: 'unionville', name: 'Unionville GO Station, kiss & ride', area: 'Unionville, Markham', lat: 43.861, lng: -79.313, kind: 'meeting' },
  { id: 'scarborough', name: 'Scarborough Centre, McCowan Rd entrance', area: 'Scarborough Centre', lat: 43.7756, lng: -79.2578, kind: 'meeting' },
  { id: 'kipling', name: 'Kipling Station, passenger pick-up', area: 'Kipling, Etobicoke', lat: 43.637, lng: -79.536, kind: 'meeting' },
  { id: 'downsview', name: 'Downsview Park Station, kiss & ride', area: 'Downsview', lat: 43.7535, lng: -79.4787, kind: 'meeting' },
]

// Extra public spots people can search for in the guided demo. No demo commuter
// starts here, so they don't appear as context dots on the route map.
export const EXTRA_PLACES: Place[] = [
  // Meeting points
  { id: 'mount-pleasant-go', name: 'Mount Pleasant GO Station, kiss & ride', area: 'Mount Pleasant, Brampton', lat: 43.6766, lng: -79.8225, kind: 'meeting' },
  { id: 'trinity-common', name: 'Trinity Common Mall, Bovaird Dr entrance', area: 'Heart Lake, Brampton', lat: 43.7366, lng: -79.7638, kind: 'meeting' },
  { id: 'georgetown-go', name: 'Georgetown GO Station, kiss & ride', area: 'Georgetown, Halton Hills', lat: 43.656, lng: -79.9177, kind: 'meeting' },
  { id: 'bolton', name: 'Bolton Community Centre parking lot', area: 'Bolton, Caledon', lat: 43.8757, lng: -79.7372, kind: 'meeting' },
  { id: 'erin-mills', name: 'Erin Mills Town Centre, Eglinton Ave entrance', area: 'Erin Mills, Mississauga', lat: 43.5567, lng: -79.7114, kind: 'meeting' },
  { id: 'meadowvale', name: 'Meadowvale Town Centre bus terminal', area: 'Meadowvale, Mississauga', lat: 43.5876, lng: -79.757, kind: 'meeting' },
  { id: 'streetsville-go', name: 'Streetsville GO Station, kiss & ride', area: 'Streetsville, Mississauga', lat: 43.5755, lng: -79.7097, kind: 'meeting' },
  { id: 'cooksville-go', name: 'Cooksville GO Station, kiss & ride', area: 'Cooksville, Mississauga', lat: 43.5835, lng: -79.6235, kind: 'meeting' },
  { id: 'port-credit-go', name: 'Port Credit GO Station, kiss & ride', area: 'Port Credit, Mississauga', lat: 43.5507, lng: -79.5866, kind: 'meeting' },
  { id: 'sherway', name: 'Sherway Gardens, The West Mall entrance', area: 'Sherway, Etobicoke', lat: 43.6118, lng: -79.5573, kind: 'meeting' },
  { id: 'islington', name: 'Islington Station, passenger pick-up', area: 'Islington, Etobicoke', lat: 43.6454, lng: -79.524, kind: 'meeting' },
  { id: 'weston-go', name: 'Weston GO Station, kiss & ride', area: 'Weston', lat: 43.7004, lng: -79.5145, kind: 'meeting' },
  { id: 'yorkdale', name: 'Yorkdale Shopping Centre, bus terminal', area: 'Yorkdale', lat: 43.7254, lng: -79.4521, kind: 'meeting' },
  { id: 'pioneer-village', name: 'Pioneer Village Station, kiss & ride', area: 'Pioneer Village', lat: 43.7768, lng: -79.5093, kind: 'meeting' },
  { id: 'vaughan-mills', name: 'Vaughan Mills, Bass Pro Mills Dr entrance', area: 'Vaughan Mills', lat: 43.8253, lng: -79.5383, kind: 'meeting' },
  { id: 'rutherford-go', name: 'Rutherford GO Station, kiss & ride', area: 'Rutherford, Vaughan', lat: 43.8382, lng: -79.4992, kind: 'meeting' },
  { id: 'king-city-go', name: 'King City GO Station, kiss & ride', area: 'King City', lat: 43.9204, lng: -79.5272, kind: 'meeting' },
  { id: 'finch', name: 'Finch Station, passenger pick-up', area: 'Finch, North York', lat: 43.7806, lng: -79.4157, kind: 'meeting' },
  { id: 'don-mills', name: 'Don Mills Station, Fairview Mall entrance', area: 'Don Mills, North York', lat: 43.7754, lng: -79.3462, kind: 'meeting' },
  { id: 'markville', name: 'Markville Mall, McCowan Rd entrance', area: 'Markville, Markham', lat: 43.869, lng: -79.288, kind: 'meeting' },
  { id: 'kennedy', name: 'Kennedy Station, passenger pick-up', area: 'Kennedy, Scarborough', lat: 43.7324, lng: -79.2637, kind: 'meeting' },
  { id: 'dundas-west', name: 'Dundas West Station, Bloor St entrance', area: 'Dundas West', lat: 43.6566, lng: -79.4525, kind: 'meeting' },
  { id: 'union', name: 'Union Station, Front St entrance', area: 'Union Station, Downtown Toronto', lat: 43.6453, lng: -79.3806, kind: 'meeting' },
  // Destinations
  { id: 'uoft-st-george', name: 'University of Toronto – St. George campus', area: 'U of T St. George', lat: 43.6629, lng: -79.3957, kind: 'destination' },
  { id: 'tmu', name: 'Toronto Metropolitan University', area: 'TMU, Downtown Toronto', lat: 43.6577, lng: -79.3788, kind: 'destination' },
  { id: 'utm', name: 'University of Toronto Mississauga', area: 'U of T Mississauga', lat: 43.5483, lng: -79.6627, kind: 'destination' },
  { id: 'utsc', name: 'University of Toronto Scarborough', area: 'U of T Scarborough', lat: 43.7845, lng: -79.1873, kind: 'destination' },
  { id: 'seneca-newnham', name: 'Seneca Polytechnic – Newnham campus', area: 'Seneca Newnham, North York', lat: 43.7954, lng: -79.3496, kind: 'destination' },
  { id: 'sheridan-davis', name: 'Sheridan College – Davis campus', area: 'Sheridan Davis, Brampton', lat: 43.6557, lng: -79.7393, kind: 'destination' },
  { id: 'centennial-progress', name: 'Centennial College – Progress campus', area: 'Centennial Progress, Scarborough', lat: 43.7843, lng: -79.2346, kind: 'destination' },
  { id: 'humber-lakeshore', name: 'Humber Polytechnic – Lakeshore campus', area: 'Humber Lakeshore, Etobicoke', lat: 43.5959, lng: -79.5165, kind: 'destination' },
]

export const SEARCHABLE_PLACES: Place[] = [...PLACES, ...EXTRA_PLACES]

// A spot dropped on the map is stored as "pin:<lat>,<lng>", so saved answers stay plain strings.
const PIN = /^pin:(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/

export const pinId = (lat: number, lng: number) => `pin:${lat.toFixed(4)},${lng.toFixed(4)}`

// Straight-line distance in km (no road factor).
function crowKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (d: number) => (d * Math.PI) / 180
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

export function nearestPlace(lat: number, lng: number, kind?: Place['kind']): { place: Place; km: number } {
  let best = { place: SEARCHABLE_PLACES[0], km: Infinity }
  for (const p of SEARCHABLE_PLACES) {
    if (kind && p.kind !== kind) continue
    const km = crowKm({ lat, lng }, p)
    if (km < best.km) best = { place: p, km }
  }
  return best
}

// Where a dragged pin lands: a known spot if it's close enough, otherwise a pin.
export function placeIdAt(lat: number, lng: number, kind: Place['kind']): string {
  const near = nearestPlace(lat, lng, kind)
  return near.km <= (kind === 'destination' ? 0.8 : 0.4) ? near.place.id : pinId(lat, lng)
}

export const placeById = (id: string): Place => {
  const p = SEARCHABLE_PLACES.find((x) => x.id === id)
  if (p) return p
  const m = PIN.exec(id)
  if (m) {
    const lat = Number(m[1])
    const lng = Number(m[2])
    const near = nearestPlace(lat, lng).place.area.split(',')[0]
    return { id, name: `Pinned spot near ${near}`, area: `Near ${near}`, lat, lng, kind: 'meeting' }
  }
  throw new Error(`Unknown place: ${id}`)
}
