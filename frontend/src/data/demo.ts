// Made-up people and trips for the prototype. None of these are real people
// or interview results.

import type { Driver, Rider } from '../lib/types'

const t = (h: number, m = 0) => h * 60 + m

export const DEMO_DRIVERS: Driver[] = [
  { id: 'd-priya', role: 'driver', name: 'Priya S.', blurb: 'Lab technician at York, drives in every weekday', car: 'Grey Honda Civic', startId: 'bramalea', destinationId: 'york-keele', arriveBy: t(8, 45), days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], maxDetour: 12, seats: 2 },
  { id: 'd-daniel', role: 'driver', name: 'Daniel O.', blurb: '4th-year engineering student', car: 'Blue Toyota Corolla', startId: 'brampton-dt', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Mon', 'Wed', 'Fri'], maxDetour: 10, seats: 3 },
  { id: 'd-aisha', role: 'driver', name: 'Aisha K.', blurb: 'Grad student, teaching assistant on Tue/Thu', car: 'White Hyundai Elantra', startId: 'square-one', destinationId: 'york-keele', arriveBy: t(8, 30), days: ['Tue', 'Thu'], maxDetour: 15, seats: 1 },
  { id: 'd-marco', role: 'driver', name: 'Marco R.', blurb: 'Facilities staff, early shift', car: 'Black Ford Escape', startId: 'woodbridge', destinationId: 'york-keele', arriveBy: t(8, 50), days: ['Mon', 'Tue', 'Wed', 'Thu'], maxDetour: 5, seats: 2 },
  { id: 'd-lena', role: 'driver', name: 'Lena T.', blurb: 'Part-time student, starts late', car: 'Red Mazda 3', startId: 'rexdale', destinationId: 'york-keele', arriveBy: t(10, 30), days: ['Mon', 'Wed', 'Thu'], maxDetour: 10, seats: 3 },
  { id: 'd-jordan', role: 'driver', name: 'Jordan P.', blurb: 'Kinesiology student, works at the gym on campus', car: 'Silver Kia Forte', startId: 'kipling', destinationId: 'york-keele', arriveBy: t(8, 55), days: ['Mon', 'Wed'], maxDetour: 10, seats: 2 },
  { id: 'd-grace', role: 'driver', name: 'Grace L.', blurb: 'Admin staff at York', car: 'Green Subaru Crosstrek', startId: 'richmond-hill', destinationId: 'york-keele', arriveBy: t(8, 45), days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], maxDetour: 10, seats: 2 },
  { id: 'd-omar', role: 'driver', name: 'Omar H.', blurb: 'Ground crew at Pearson', car: 'White Nissan Rogue', startId: 'malton', destinationId: 'pearson-t1', arriveBy: t(6, 0), days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], maxDetour: 10, seats: 3 },
  { id: 'd-wei', role: 'driver', name: 'Wei C.', blurb: 'Business student, works evenings', car: 'Grey Toyota RAV4', startId: 'scarborough', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Tue', 'Thu', 'Fri'], maxDetour: 10, seats: 2 },
]

export const DEMO_RIDERS: Rider[] = [
  { id: 'r-sofia', role: 'rider', name: 'Sofia M.', blurb: '1st-year nursing, labs at 9', startId: 'bramalea', destinationId: 'york-keele', arriveBy: t(8, 50), days: ['Mon', 'Wed', 'Fri'] },
  { id: 'r-kevin', role: 'rider', name: 'Kevin A.', blurb: 'Psychology student, works at a café on weekends', startId: 'malton', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Tue', 'Thu'] },
  { id: 'r-amara', role: 'rider', name: 'Amara N.', blurb: 'Accounting student', startId: 'square-one', destinationId: 'york-keele', arriveBy: t(8, 30), days: ['Mon', 'Tue', 'Wed'] },
  { id: 'r-tyler', role: 'rider', name: 'Tyler B.', blurb: 'Film student, morning studio blocks', startId: 'woodbridge', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Mon', 'Wed'] },
  { id: 'r-nadia', role: 'rider', name: 'Nadia F.', blurb: 'Works the 9 AM shift at the campus bookstore', startId: 'rexdale', destinationId: 'york-keele', arriveBy: t(8, 55), days: ['Mon', 'Tue', 'Wed', 'Thu'] },
  { id: 'r-ethan', role: 'rider', name: 'Ethan W.', blurb: 'Computer science, classes at 10', startId: 'maple', destinationId: 'york-keele', arriveBy: t(9, 50), days: ['Tue', 'Thu'] },
  { id: 'r-fatima', role: 'rider', name: 'Fatima Z.', blurb: 'Social work student and part-time caregiver', startId: 'malton', destinationId: 'york-keele', arriveBy: t(8, 50), days: ['Mon', 'Wed'] },
  { id: 'r-luis', role: 'rider', name: 'Luis G.', blurb: 'Kinesiology student, gym job on campus', startId: 'unionville', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Mon', 'Wed', 'Fri'] },
]

// Starting profiles so the demo works with one tap. People can change everything.
export const DEFAULT_RIDER: Omit<Rider, 'id'> = {
  role: 'rider',
  name: 'You',
  blurb: '2nd-year student, works part-time',
  startId: 'malton',
  destinationId: 'york-keele',
  arriveBy: t(8, 50),
  days: ['Mon', 'Wed', 'Thu'],
}

export const DEFAULT_DRIVER: Omit<Driver, 'id'> = {
  role: 'driver',
  name: 'You',
  blurb: 'Drives to campus most weekdays',
  car: 'Your car',
  startId: 'brampton-dt',
  destinationId: 'york-keele',
  arriveBy: t(9, 0),
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  maxDetour: 10,
  seats: 3,
}

export const ALL_PEOPLE = [...DEMO_DRIVERS, ...DEMO_RIDERS]
export const personById = (id: string) => ALL_PEOPLE.find((p) => p.id === id)
