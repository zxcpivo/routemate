export type Gender = 'woman' | 'man' | 'undisclosed'
export type RidePreference = 'any' | 'another-woman' | 'women-only'

export type RidePreferences = {
  gender?: Gender
  ridePreference?: RidePreference
}

export function activeRidePreference(profile: RidePreferences): RidePreference {
  return profile.gender === 'woman' ? profile.ridePreference ?? 'any' : 'any'
}

export function meetsRidePreference(profile: RidePreferences, others: RidePreferences[]): boolean {
  switch (activeRidePreference(profile)) {
    case 'another-woman':
      return others.some((person) => person.gender === 'woman')
    case 'women-only':
      return others.length > 0 && others.every((person) => person.gender === 'woman')
    default:
      return true
  }
}
