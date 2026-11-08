import type { MatchProfile } from './affinity'

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export type Day = (typeof DAYS)[number]

export type Role = 'rider' | 'driver'

type BaseCommuter = MatchProfile & {
  id: string
  name: string
  blurb: string // who they are, e.g. "2nd-year nursing, works weekends"
  startId: string // rider: pickup meeting point; driver: starting point
  destinationId: string
  arriveBy: number // minutes after midnight
  days: Day[]
}

export type Rider = BaseCommuter & { role: 'rider' }

export type Driver = BaseCommuter & {
  role: 'driver'
  maxDetour: number // minutes
  seats: number
  car: string
}

export type Commuter = Rider | Driver

export type Arrangement = {
  partnerId: string
  contribution: number // dollars per ride, agreed in advance
  days: Day[]
  checkedIn: boolean
  away: { day: Day; backupId: string | null } | null
}
