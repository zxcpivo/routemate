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

export const placeById = (id: string): Place => {
  const p = PLACES.find((x) => x.id === id)
  if (!p) throw new Error(`Unknown place: ${id}`)
  return p
}
