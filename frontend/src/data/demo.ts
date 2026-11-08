// Made-up people and trips for the prototype. None of these are real people
// or interview results.

import type { Driver, Rider } from '../lib/types'

const t = (h: number, m = 0) => h * 60 + m

export const DEMO_DRIVERS: Driver[] = [
  { id: 'd-priya', gender: 'woman', age: 32, interests: ['Podcasts', 'Cooking', 'Reading'], role: 'driver', name: 'Priya S.', blurb: 'Biology master’s student with weekday labs', car: 'Grey Honda Civic', startId: 'bramalea', destinationId: 'york-keele', arriveBy: t(8, 45), days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], maxDetour: 12, seats: 2 },
  { id: 'd-daniel', gender: 'man', age: 23, interests: ['Gaming', 'Tech', 'Music'], role: 'driver', name: 'Daniel O.', blurb: '4th-year engineering student', car: 'Blue Toyota Corolla', startId: 'brampton-dt', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Mon', 'Wed', 'Fri'], maxDetour: 10, seats: 3 },
  { id: 'd-aisha', gender: 'woman', age: 26, interests: ['Reading', 'Coffee', 'Photography'], role: 'driver', name: 'Aisha K.', blurb: 'Grad student, teaching assistant on Tue/Thu', car: 'White Hyundai Elantra', startId: 'square-one', destinationId: 'york-keele', arriveBy: t(8, 30), days: ['Tue', 'Thu'], maxDetour: 15, seats: 1 },
  { id: 'd-marco', gender: 'man', age: 41, interests: ['Cars', 'Fitness', 'Sports'], role: 'driver', name: 'Marco R.', blurb: 'Mature history student with morning seminars', car: 'Black Ford Escape', startId: 'woodbridge', destinationId: 'york-keele', arriveBy: t(8, 50), days: ['Mon', 'Tue', 'Wed', 'Thu'], maxDetour: 5, seats: 2 },
  { id: 'd-lena', gender: 'woman', age: 21, interests: ['Music', 'Movies & TV', 'Art'], role: 'driver', name: 'Lena T.', blurb: 'Part-time student, starts late', car: 'Red Mazda 3', startId: 'rexdale', destinationId: 'york-keele', arriveBy: t(10, 30), days: ['Mon', 'Wed', 'Thu'], maxDetour: 10, seats: 3 },
  { id: 'd-jordan', gender: 'undisclosed', age: 24, interests: ['Sports', 'Fitness', 'Outdoors'], role: 'driver', name: 'Jordan P.', blurb: 'Kinesiology student, works at the gym on campus', car: 'Silver Kia Forte', startId: 'kipling', destinationId: 'york-keele', arriveBy: t(8, 55), days: ['Mon', 'Wed'], maxDetour: 10, seats: 2 },
  { id: 'd-grace', gender: 'woman', age: 37, interests: ['Cooking', 'Travel', 'Podcasts'], role: 'driver', name: 'Grace L.', blurb: 'Education student on campus every weekday', car: 'Green Subaru Crosstrek', startId: 'richmond-hill', destinationId: 'york-keele', arriveBy: t(8, 45), days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], maxDetour: 10, seats: 2 },
  { id: 'd-omar', gender: 'man', age: 30, interests: ['Cars', 'Travel', 'Tech'], role: 'driver', name: 'Omar H.', blurb: 'Aviation student with early lectures', car: 'White Nissan Rogue', startId: 'malton', destinationId: 'york-keele', arriveBy: t(6, 0), days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], maxDetour: 10, seats: 3 },
  { id: 'd-wei', gender: 'man', age: 22, interests: ['Coffee', 'Gaming', 'Music'], role: 'driver', name: 'Wei C.', blurb: 'Business student with evening tutorials', car: 'Grey Toyota RAV4', startId: 'scarborough', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Tue', 'Thu', 'Fri'], maxDetour: 10, seats: 2 },
]

export const DEMO_RIDERS: Rider[] = [
  { id: 'r-sofia', gender: 'woman', age: 19, interests: ['Music', 'Coffee', 'Art'], role: 'rider', name: 'Sofia M.', blurb: '1st-year nursing, labs at 9', startId: 'bramalea', destinationId: 'york-keele', arriveBy: t(8, 50), days: ['Mon', 'Wed', 'Fri'] },
  { id: 'r-kevin', gender: 'man', age: 22, interests: ['Gaming', 'Coffee', 'Podcasts'], role: 'rider', name: 'Kevin A.', blurb: 'Psychology student with tutorials on Tuesdays and Thursdays', startId: 'malton', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Tue', 'Thu'] },
  { id: 'r-amara', gender: 'woman', age: 25, interests: ['Travel', 'Reading', 'Cooking'], role: 'rider', name: 'Amara N.', blurb: 'Accounting student', startId: 'square-one', destinationId: 'york-keele', arriveBy: t(8, 30), days: ['Mon', 'Tue', 'Wed'] },
  { id: 'r-tyler', gender: 'undisclosed', age: 23, interests: ['Movies & TV', 'Photography', 'Art'], role: 'rider', name: 'Tyler B.', blurb: 'Film student, morning studio blocks', startId: 'woodbridge', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Mon', 'Wed'] },
  { id: 'r-nadia', gender: 'woman', age: 29, interests: ['Reading', 'Music', 'Outdoors'], role: 'rider', name: 'Nadia F.', blurb: 'English student with morning lectures', startId: 'rexdale', destinationId: 'york-keele', arriveBy: t(8, 55), days: ['Mon', 'Tue', 'Wed', 'Thu'] },
  { id: 'r-ethan', gender: 'man', age: 20, interests: ['Gaming', 'Tech', 'Movies & TV'], role: 'rider', name: 'Ethan W.', blurb: 'Computer science, classes at 10', startId: 'maple', destinationId: 'york-keele', arriveBy: t(9, 50), days: ['Tue', 'Thu'] },
  { id: 'r-fatima', gender: 'woman', age: 32, interests: ['Cooking', 'Podcasts', 'Travel'], role: 'rider', name: 'Fatima Z.', blurb: 'Social work student and part-time caregiver', startId: 'malton', destinationId: 'york-keele', arriveBy: t(8, 50), days: ['Mon', 'Wed'] },
  { id: 'r-luis', gender: 'man', age: 24, interests: ['Sports', 'Fitness', 'Outdoors'], role: 'rider', name: 'Luis G.', blurb: 'Kinesiology student with morning labs', startId: 'unionville', destinationId: 'york-keele', arriveBy: t(9, 0), days: ['Mon', 'Wed', 'Fri'] },
]

// Starting profiles so the demo works with one tap. People can change everything.
export const DEFAULT_RIDER: Omit<Rider, 'id'> = {
  role: 'rider',
  name: 'You',
  blurb: '2nd-year student with morning classes',
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
