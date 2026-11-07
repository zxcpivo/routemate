// Route planning and savings maths for the guided demo.
// Builds on the matching rules in lib/matching.ts.

import { DEMO_DRIVERS, DEMO_RIDERS } from '../data/demo'
import { placeById } from '../data/places'
import { COST_PER_KM, EARLY_LIMIT_MIN, STOP_MIN, distanceKm, driveMin, matchPair } from '../lib/matching'
import type { Day, Driver, Rider, Role } from '../lib/types'

export const MAX_DETOUR = 10 // the demo uses the suggested default from approach.md
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
}

export const DEFAULT_ANSWERS: Answers = {
  role: null,
  destinationId: 'york-keele',
  startId: '',
  arriveBy: 9 * 60,
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  name: '',
  email: '',
  selectedIds: [],
}

// Defaults that give a good demo for each role.
export const ROLE_DEFAULTS: Record<Role, Pick<Answers, 'startId' | 'arriveBy' | 'days'>> = {
  driver: { startId: 'brampton-dt', arriveBy: 9 * 60, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  rider: { startId: 'malton', arriveBy: 8 * 60 + 45, days: ['Mon', 'Wed', 'Thu'] },
}

export function meAsDriver(a: Answers): Driver {
  return {
    id: 'me', role: 'driver', name: a.name || 'You', blurb: '', car: 'Your car',
    startId: a.startId, destinationId: a.destinationId, arriveBy: a.arriveBy, days: a.days,
    maxDetour: MAX_DETOUR, seats: SEATS,
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
    { kind: 'end', placeId: end.id, time: departTime + t, who: '' },
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

  return {
    driver, riders: ordered, stops, detour, departTime, arrival: departTime + t, share, sharedDays,
    monthlySaving, monthlyCost, overLimit: detour > driver.maxDetour, warnings,
  }
}

// People on the other side who pass all three matching rules, best first.
export function driverCandidates(me: Driver): Rider[] {
  return DEMO_RIDERS.filter((r) => r.destinationId === me.destinationId)
    .map((r) => matchPair(me, r))
    .filter((m) => m.ok)
    .sort((a, b) => a.detour - b.detour)
    .map((m) => m.rider)
}

export function riderCandidates(me: Rider): Driver[] {
  // Most shared days first: one regular driver for the whole week is the goal.
  return DEMO_DRIVERS.map((d) => matchPair(d, me))
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
