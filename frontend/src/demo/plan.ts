// Route planning and savings maths for the guided demo.
// Builds on the matching rules in lib/matching.ts.

import { DEMO_DRIVERS, DEMO_RIDERS } from '../data/demo'
import { pinId, placeById } from '../data/places'
import { COST_PER_KM, EARLY_LIMIT_MIN, STOP_MIN, distanceKm, driveMin, matchPair } from '../lib/matching'
import type { Day, Driver, Rider, Role } from '../lib/types'

export const MAX_DETOUR = 10 // default from approach.md; drivers can change it on the Choose matches screen
export const DETOUR_RANGE = { min: 5, max: 20 }
export const SEATS = 3
const WEEKS_PER_MONTH = 4.33
// Rough transit-vs-car ratio from the 2021 Census (47.6 vs 25.5 min average one-way
// commute in the Toronto area). Different trips, so this is only an estimate.
export const TRANSIT_FACTOR = 1.9

export type Answers = {
  role: Role | null
  destinationId: string
  startId: string
  arriveBy: number
  days: Day[]
  name: string
  email: string
  selectedIds: string[] // chosen passengers (driver) or chosen driver (rider)
  maxDetour?: number // driver's detour limit in minutes; older saved answers may not have it
}

export const DEFAULT_ANSWERS: Answers = {
  role: null,
  destinationId: 'york-keele',
  startId: '',
  arriveBy: 8 * 60,
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  name: '',
  email: '',
  selectedIds: [],
  maxDetour: MAX_DETOUR,
}

// Defaults that give a good demo for each role.
export const ROLE_DEFAULTS: Record<Role, Pick<Answers, 'startId' | 'arriveBy' | 'days'>> = {
  driver: { startId: 'brampton-dt', arriveBy: 8 * 60, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  rider: { startId: 'malton', arriveBy: 8 * 60, days: ['Mon', 'Wed', 'Thu'] },
}

export function meAsDriver(a: Answers): Driver {
  return {
    id: 'me', role: 'driver', name: a.name || 'You', blurb: '', car: 'Your car',
    startId: a.startId, destinationId: a.destinationId, arriveBy: a.arriveBy, days: a.days,
    maxDetour: a.maxDetour ?? MAX_DETOUR, seats: SEATS,
  }
}

export function meAsRider(a: Answers): Rider {
  return {
    id: 'me', role: 'rider', name: a.name || 'You', blurb: '',
    startId: a.startId, destinationId: a.destinationId, arriveBy: a.arriveBy, days: a.days,
  }
}

export type Stop = { kind: 'start' | 'pickup' | 'end'; placeId: string; time: number; who: string }

export type RoutePlan = {
  driver: Driver
  riders: Rider[]
  stops: Stop[]
  detour: number
  departTime: number
  arrival: number
  share: number // each rider's contribution per ride: trip cost split evenly, driver included
  sharedDays: Record<string, Day[]>
  monthlySaving: number // what the driver gets back each month
  monthlyCost: number // what one rider pays each month (rider view)
  overLimit: boolean
  warnings: string[]
}

const roundHalf = (v: number) => Math.round(v * 2) / 2

export function planRoute(driver: Driver, riders: Rider[], viewer: Role = 'driver'): RoutePlan {
  const start = placeById(driver.startId)
  const end = placeById(driver.destinationId)
  // Pick people up nearest-first on the way to the shared destination.
  const ordered = [...riders].sort((a, b) => driveMin(start, placeById(a.startId)) - driveMin(start, placeById(b.startId)))

  let t = 0
  let km = 0
  let prev = start
  const offsets: number[] = []
  for (const r of ordered) {
    const p = placeById(r.startId)
    t += driveMin(prev, p)
    km += distanceKm(prev, p)
    offsets.push(t)
    t += STOP_MIN
    prev = p
  }
  t += driveMin(prev, end)
  km += distanceKm(prev, end)

  const detour = Math.max(0, Math.round(t - driveMin(start, end)))
  const arrival = Math.min(driver.arriveBy, ...ordered.map((r) => r.arriveBy))
  const departTime = Math.floor(arrival - t)

  const stops: Stop[] = [
    { kind: 'start', placeId: start.id, time: departTime, who: driver.name },
    ...ordered.map((r, i) => ({ kind: 'pickup' as const, placeId: r.startId, time: departTime + offsets[i], who: r.name })),
    { kind: 'end', placeId: end.id, time: Math.ceil(departTime + t), who: '' },
  ]

  const n = ordered.length
  const tripCost = km * COST_PER_KM
  const share = n ? Math.max(2, roundHalf(tripCost / (n + 1))) : 0
  const sharedDays: Record<string, Day[]> = {}
  for (const r of ordered) sharedDays[r.id] = driver.days.filter((d) => r.days.includes(d))

  const monthlySaving = Math.round(ordered.reduce((sum, r) => sum + share * sharedDays[r.id].length * WEEKS_PER_MONTH, 0))
  const me = viewer === 'rider' ? ordered.find((r) => r.id === 'me') : undefined
  const monthlyCost = me ? Math.round(share * sharedDays[me.id].length * WEEKS_PER_MONTH) : 0

  const warnings: string[] = []
  const firstName = (name: string) => (name === 'You' ? 'You' : name.split(' ')[0])
  for (const p of [driver, ...ordered]) {
    const early = Math.round(p.arriveBy - (departTime + t))
    if (early > EARLY_LIMIT_MIN) warnings.push(`${firstName(p.name)} would arrive ${early} min early`)
  }

  // Leaving on a whole minute lands up to a minute early, so round the arrival up.
  return {
    driver, riders: ordered, stops, detour, departTime, arrival: Math.ceil(departTime + t), share, sharedDays,
    monthlySaving, monthlyCost, overLimit: detour > driver.maxDetour, warnings,
  }
}

/* ---------- Demo cast ----------
   The guided demo always finds people, whatever trip the tester enters. Each sample
   commuter is fitted to the tester's trip: same destination, an arrival up to 10 minutes
   after the tester's (so the group still arrives on the tester's time), and their shared days (or all of the tester's days). If their
   usual starting point still fails the matching rules, they are moved onto the tester's
   route. The "no one matches" screen is shown with a preview button instead. */

const KM_PER_DEG = 111.32
const ARRIVAL_SPREAD = [0, 5, 10, 0, 5, 10, 0, 5]
const SIDE_KM = [0.4, -0.5, 0.3, -0.6, 0.5, -0.3, 0.6, -0.4] // off the line, left (+) or right (−)
const BEHIND_KM = [6, 9, 4, 11, 7, 5, 8, 10] // drivers start this far before the rider's pickup

// Points along the straight line from start to destination.
function routeFrame(startId: string, destinationId: string) {
  const s = placeById(startId)
  const e = placeById(destinationId)
  const kx = Math.cos((s.lat * Math.PI) / 180) * KM_PER_DEG
  const dx = (e.lng - s.lng) * kx
  const dy = (e.lat - s.lat) * KM_PER_DEG
  const len = Math.hypot(dx, dy)
  const ux = len > 0.5 ? dx / len : 0
  const uy = len > 0.5 ? dy / len : 1
  // `along` km toward the destination (negative = behind the start), `side` km to the left.
  const at = (along: number, side: number) => pinId(s.lat + (along * uy + side * ux) / KM_PER_DEG, s.lng + (along * ux - side * uy) / kx)
  return { len, at }
}

const pick = <T,>(list: T[], i: number) => list[i % list.length]

function castRiders(me: Driver): Rider[] {
  const frame = routeFrame(me.startId, me.destinationId)
  return DEMO_RIDERS.map((r, i) => {
    const shared = r.days.filter((d) => me.days.includes(d))
    // Riders start at or after the driver's time, so the group still arrives when the tester asked.
    const fitted: Rider = { ...r, destinationId: me.destinationId, arriveBy: me.arriveBy + pick(ARRIVAL_SPREAD, i), days: shared.length ? shared : me.days }
    if (matchPair(me, fitted).ok) return fitted
    const along = frame.len * ((i + 1) / (DEMO_RIDERS.length + 1))
    return { ...fitted, startId: frame.at(along, pick(SIDE_KM, i)) }
  })
}

function castDrivers(me: Rider): Driver[] {
  const frame = routeFrame(me.startId, me.destinationId)
  return DEMO_DRIVERS.map((d, i) => {
    const shared = d.days.filter((day) => me.days.includes(day))
    const fitted: Driver = { ...d, destinationId: me.destinationId, arriveBy: me.arriveBy + pick(ARRIVAL_SPREAD, i), days: shared.length ? shared : me.days }
    if (matchPair(fitted, me).ok) return fitted
    return { ...fitted, startId: frame.at(-pick(BEHIND_KM, i), pick(SIDE_KM, i)) }
  })
}

// People on the other side who pass all three matching rules, best first.
export function driverCandidates(me: Driver): Rider[] {
  return castRiders(me)
    .map((r) => matchPair(me, r))
    .filter((m) => m.ok)
    .sort((a, b) => a.detour - b.detour)
    .map((m) => m.rider)
}

export function riderCandidates(me: Rider): Driver[] {
  // Most shared days first: one regular driver for the whole week is the goal.
  return castDrivers(me).map((d) => matchPair(d, me))
    .filter((m) => m.ok)
    .sort((a, b) => b.sharedDays.length - a.sharedDays.length || a.detour - b.detour)
    .map((m) => m.driver)
}

// Fill seats with the closest riders while the whole route stays within the detour limit.
export function suggestRiders(me: Driver, candidates: Rider[]): Rider[] {
  const picked: Rider[] = []
  for (const r of candidates) {
    if (picked.length >= me.seats) break
    const next = [...picked, r]
    if (planRoute(me, next).detour <= me.maxDetour) picked.push(r)
  }
  return picked
}

// Rider view: how long the car ride takes and a rough transit comparison.
export function riderTimes(me: Rider) {
  const car = Math.round(driveMin(placeById(me.startId), placeById(me.destinationId)) + STOP_MIN)
  const transit = Math.round((car - STOP_MIN) * TRANSIT_FACTOR)
  return { car, transit }
}
