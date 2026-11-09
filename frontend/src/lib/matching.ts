// Routemate matching rules (from docs/product.md):
//   1. Recurring days overlap.
//   2. Picking up and dropping off the rider adds no more than the driver's max detour.
//   3. Both the driver and the rider arrive by their required times.
//
// Travel times are rough estimates from straight-line distance, good enough for a prototype.

import { placeById, type Place } from '../data/places'
import { activeRidePreference, meetsRidePreference } from './ridePreferences'
import type { Day, Driver, Rider } from './types'

const ROAD_FACTOR = 1.3 // roads are longer than a straight line
const AVG_SPEED_KMH = 45 // typical GTA morning driving speed (estimate)
export const STOP_MIN = 2 // time to stop and let someone in or out

// Assumption to test: nobody wants to arrive much earlier than they need to.
// Without a limit, rule 3 could always be met by leaving hours early.
export const EARLY_LIMIT_MIN = 20

// Example running cost per km for suggesting a fair contribution (gas + wear).
export const COST_PER_KM = 0.2

export function distanceKm(a: Place, b: Place): number {
  const R = 6371
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h)) * ROAD_FACTOR
}

export function driveMin(a: Place, b: Place): number {
  if (a.id === b.id) return 0
  return (distanceKm(a, b) / AVG_SPEED_KMH) * 60
}

export type RuleCheck = { ok: boolean; text: string }

export type MatchResult = {
  driver: Driver
  rider: Rider
  ok: boolean
  sharedDays: Day[]
  detour: number
  departTime: number // driver leaves start
  pickupTime: number
  riderArrival: number
  driverArrival: number
  riderEarly: number
  driverEarly: number
  riderKm: number
  checks: { days: RuleCheck; detour: RuleCheck; timing: RuleCheck; preference?: RuleCheck }
}

export function matchPair(driver: Driver, rider: Rider, groupRide = false): MatchResult {
  const dStart = placeById(driver.startId)
  const dEnd = placeById(driver.destinationId)
  const rStart = placeById(rider.startId)
  const rEnd = placeById(rider.destinationId)

  const sharedDays = driver.days.filter((d) => rider.days.includes(d))

  const direct = driveMin(dStart, dEnd)
  const toPickup = driveMin(dStart, rStart)
  const ride = driveMin(rStart, rEnd)
  const sameEnd = rEnd.id === dEnd.id
  const afterDrop = sameEnd ? 0 : STOP_MIN + driveMin(rEnd, dEnd)
  const via = toPickup + STOP_MIN + ride + afterDrop
  const detour = Math.max(0, Math.round(via - direct))

  // Leave as late as possible while getting both people there on time.
  const latestForDriver = driver.arriveBy - via
  const latestForRider = rider.arriveBy - (toPickup + STOP_MIN + ride)
  const depart = Math.floor(Math.min(latestForDriver, latestForRider))
  const pickupTime = depart + toPickup
  const riderArrival = pickupTime + STOP_MIN + ride
  const driverArrival = riderArrival + afterDrop
  const riderEarly = Math.round(rider.arriveBy - riderArrival)
  const driverEarly = Math.round(driver.arriveBy - driverArrival)

  // Names for messages. "me" is the person using the prototype.
  const driverIsMe = driver.id === 'me'
  const riderIsMe = rider.id === 'me'
  const first = driver.name.split(' ')[0]
  const drive = driverIsMe ? 'your drive' : `${first}'s drive`
  const limit = driverIsMe ? 'your' : 'their'
  const riderWho = riderIsMe ? 'You' : rider.name.split(' ')[0]
  const driverWho = driverIsMe ? 'You' : first

  const days: RuleCheck =
    sharedDays.length > 0
      ? { ok: true, text: `Shared days: ${sharedDays.join(', ')}` }
      : { ok: false, text: 'No days in common' }

  const detourCheck: RuleCheck =
    detour <= driver.maxDetour
      ? { ok: true, text: `Adds ${detour} min to ${drive} (limit ${driver.maxDetour} min)` }
      : { ok: false, text: `Adds ${detour} min to ${drive}, over ${limit} ${driver.maxDetour} min limit` }

  let timing: RuleCheck
  if (riderEarly > EARLY_LIMIT_MIN) {
    timing = { ok: false, text: `${riderWho} would arrive ${riderEarly} min early (limit ${EARLY_LIMIT_MIN} min)` }
  } else if (driverEarly > EARLY_LIMIT_MIN) {
    timing = { ok: false, text: `${driverWho} would arrive ${driverEarly} min early (limit ${EARLY_LIMIT_MIN} min)` }
  } else {
    timing = { ok: true, text: 'Both arrive on time' }
  }

  // A woman passenger can cover other pickups on the same day in a group ride.
  const driverFits = (groupRide && activeRidePreference(driver) === 'another-woman') || meetsRidePreference(driver, [rider])
  const preference = driverFits && meetsRidePreference(rider, [driver])
    ? undefined
    : { ok: false, text: 'Does not meet the ride preference' }

  return {
    driver,
    rider,
    ok: days.ok && detourCheck.ok && timing.ok && !preference,
    sharedDays,
    detour,
    departTime: depart,
    pickupTime,
    riderArrival,
    driverArrival,
    riderEarly,
    driverEarly,
    riderKm: distanceKm(rStart, rEnd),
    checks: { days, detour: detourCheck, timing, preference },
  }
}

// How many rules pass, used to sort near misses so the closest come first.
export function score(m: MatchResult): number {
  return [m.checks.days, m.checks.detour, m.checks.timing].filter((c) => c.ok).length
}

export function suggestedContribution(m: MatchResult): { suggested: number; cap: number } {
  const roundHalf = (v: number) => Math.round(v * 2) / 2
  const cost = m.riderKm * COST_PER_KM
  const suggested = Math.max(3, roundHalf(cost))
  const cap = Math.max(suggested, roundHalf(cost * 1.5))
  return { suggested, cap }
}
