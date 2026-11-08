export const MIN_AGE = 18
export const MAX_AGE = 120

export type MatchProfile = { age?: number; interests?: string[] }

export function sharedInterests(a: MatchProfile, b: MatchProfile) {
  return a.interests?.filter((interest) => b.interests?.includes(interest)) ?? []
}

export function compareAffinity(me: MatchProfile, a: MatchProfile, b: MatchProfile) {
  const shared = sharedInterests(me, b).length - sharedInterests(me, a).length
  const age = me.age
  if (shared || age === undefined) return shared
  const ageDistance = (person: MatchProfile) => person.age === undefined ? Infinity : Math.abs(age - person.age)
  const first = ageDistance(a)
  const second = ageDistance(b)
  return first === second ? 0 : first - second
}
