import { placeById } from '../data/places'
import { meetsRidePreference } from '../lib/ridePreferences'
import { DAYS, type Day, type Driver } from '../lib/types'
import { driverCandidates, driverGroupMeetsPreference, meAsDriver, meAsRider, planRoute, riderCandidates, type Answers, type Trip } from './plan'

export type SavedRoute = {
  id: string
  trip: Trip
  away?: { date: string; day: Day }
  checkedInOn?: string
}

export function getRide(a: Answers) {
  const isDriver = a.role === 'driver'
  const me = meAsRider(a)
  const driver = isDriver ? meAsDriver(a) : riderCandidates(me).find((d) => d.id === a.selectedIds[0])
  if (!driver) return null
  const riders = isDriver ? driverCandidates(driver).filter((r) => a.selectedIds.includes(r.id)) : [me]
  if (!riders.length || !driverGroupMeetsPreference(driver, riders)) return null
  const plan = planRoute(driver, riders, isDriver ? 'driver' : 'rider')
  if (plan.overLimit) return null
  const others = isDriver ? plan.riders : [driver]
  const days = isDriver ? a.days.filter((day) => plan.riders.some((rider) => plan.sharedDays[rider.id].includes(day))) : plan.sharedDays.me
  const time = isDriver ? plan.departTime : plan.stops.find((stop) => stop.kind === 'pickup')?.time ?? plan.departTime
  return { plan, others, days, time, isDriver }
}

export function tripFromAnswers({ role, startId, destinationId, arriveBy, days, selectedIds, maxDetour }: Answers): Trip {
  return { role, startId, destinationId, arriveBy, days, selectedIds, maxDetour }
}

export function routeName(trip: Trip) {
  const area = (id: string) => placeById(id).area.split(',')[0]
  return `${area(trip.startId)} → ${area(trip.destinationId)}`
}

const dayOf = (date: Date) => DAYS[(date.getDay() + 6) % 7]
export const dateKey = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')

export function serviceDates(now: Date) {
  // Include the same day next week and trips that leave the night before arrival.
  return Array.from({ length: 9 }, (_, offset) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    return { date, day: dayOf(date), key: dateKey(date) }
  })
}

function atTime(date: Date, minutes: number) {
  const time = new Date(date)
  time.setHours(0, Math.round(minutes), 0, 0)
  return time
}

export function findBackup(ride: NonNullable<ReturnType<typeof getRide>>, day: Day): Driver | undefined {
  const riders = ride.plan.riders.filter((r) => ride.plan.sharedDays[r.id].includes(day))
  const [first] = riders
  if (!first) return
  return riderCandidates({ ...first, days: [day] }).find((driver) => {
    if (driver.id === ride.plan.driver.id || driver.seats < riders.length) return false
    if (!riders.every((rider) => meetsRidePreference(rider, [driver, ...riders.filter((other) => other.id !== rider.id)]))) return false
    if (!meetsRidePreference(ride.plan.driver, [driver, ...riders])) return false
    const plan = planRoute(driver, riders)
    return !plan.overLimit && plan.warnings.length === 0
  })
}

export function upcomingTrip(routes: SavedRoute[], profile: Answers, now: Date) {
  const dates = serviceDates(now)
  const upcoming = routes.flatMap((route) => {
    const ride = getRide({ ...profile, ...route.trip })
    if (!ride) return []
    return dates.flatMap(({ date, day, key }) => {
      if (!ride.days.includes(day)) return []
      const isAway = route.away?.date === key
      const backup = isAway ? findBackup(ride, day) : undefined
      // Recalculate the pickup when a replacement driver is coming.
      const riders = ride.plan.riders.filter((r) => ride.plan.sharedDays[r.id].includes(day))
      const plan = backup || ride.isDriver
        ? planRoute(backup ?? ride.plan.driver, riders, ride.isDriver ? 'driver' : 'rider')
        : ride.plan
      const time = ride.isDriver ? plan.departTime : plan.stops.find((s) => s.kind === 'pickup')?.time ?? plan.departTime
      const starts = atTime(date, time)
      const ends = atTime(date, plan.arrival)
      if (ends < now) return []
      return [{ route, ride, plan, time, starts, key, isAway, backup }]
    })
  })
  return upcoming.sort((a, b) => a.starts.getTime() - b.starts.getTime()).at(0)
}
