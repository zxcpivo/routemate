import { activeRidePreference, type RidePreference, type RidePreferences } from '../lib/ridePreferences'
import { Field } from './ui'

export function RidePreferenceFields({ profile, onChange, groupDriver = false }: {
  profile: RidePreferences
  onChange: (patch: Pick<RidePreferences, 'ridePreference'>) => void
  groupDriver?: boolean
}) {
  if (profile.gender !== 'woman') return null
  return (
    <Field label="Who would you like to ride with?" hint={groupDriver
      ? 'Your preference applies on each day you share a ride.'
      : 'For a ride with just you and a driver, either preference requires a woman as the driver.'}>
      {(props) => (
        <select className="input" value={activeRidePreference(profile)}
          onChange={(event) => onChange({ ridePreference: event.currentTarget.value as RidePreference })} {...props}>
          <option value="any">No preference</option>
          <option value="another-woman">At least one other woman</option>
          <option value="women-only">Women only</option>
        </select>
      )}
    </Field>
  )
}
