import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button, DayChips, Field, PrototypeBanner, SegmentedControl, Stepper } from '../components/ui'
import { DEFAULT_DRIVER, DEFAULT_RIDER } from '../data/demo'
import { PLACES } from '../data/places'
import { fromInputTime, toInputTime } from '../lib/format'
import { useStore } from '../lib/store'
import type { Commuter, Day, Role } from '../lib/types'

const meetingPoints = PLACES.filter((p) => p.kind === 'meeting')
const destinations = PLACES.filter((p) => p.kind === 'destination')

export default function Setup() {
  const { role: roleParam } = useParams()
  if (roleParam !== 'rider' && roleParam !== 'driver') return <Navigate to="/" replace />
  // key resets the form when switching role
  return <SetupForm key={roleParam} role={roleParam} />
}

function SetupForm({ role }: { role: Role }) {
  const { profile, saveProfile } = useStore()
  const navigate = useNavigate()

  const initial: Commuter =
    profile && profile.role === role ? profile : role === 'rider' ? { ...DEFAULT_RIDER, id: 'me' } : { ...DEFAULT_DRIVER, id: 'me' }

  const [startId, setStartId] = useState(initial.startId)
  const [destinationId, setDestinationId] = useState(initial.destinationId)
  const [arriveBy, setArriveBy] = useState(initial.arriveBy)
  const [days, setDays] = useState<Day[]>(initial.days)
  const [maxDetour, setMaxDetour] = useState(initial.role === 'driver' ? initial.maxDetour : DEFAULT_DRIVER.maxDetour)
  const [seats, setSeats] = useState(initial.role === 'driver' ? initial.seats : DEFAULT_DRIVER.seats)
  const [triedSubmit, setTriedSubmit] = useState(false)

  const daysError = triedSubmit && days.length === 0 ? 'Pick at least one day.' : undefined

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTriedSubmit(true)
    if (days.length === 0) return
    const base = { id: 'me', name: 'You', startId, destinationId, arriveBy, days }
    const next: Commuter =
      role === 'rider'
        ? { ...base, role: 'rider', blurb: DEFAULT_RIDER.blurb }
        : { ...base, role: 'driver', blurb: DEFAULT_DRIVER.blurb, car: DEFAULT_DRIVER.car, maxDetour, seats }
    saveProfile(next)
    navigate('/matches')
  }

  const isRider = role === 'rider'

  return (
    <form className="page page--with-bar" onSubmit={submit} noValidate>
      <div className="stack">
        <h1 className="title">Your regular trip</h1>
        <p className="muted">We use this to find people on the same route at the same time. You can change it later.</p>
      </div>

      <SegmentedControl<Role>
        label="I am a"
        value={role}
        onChange={(r) => navigate(`/setup/${r}`, { replace: true })}
        options={[
          { value: 'rider', label: 'Rider', icon: 'user' },
          { value: 'driver', label: 'Driver', icon: 'car' },
        ]}
      />

      <div className="card stack-lg">
        <Field
          label={isRider ? 'Pickup meeting point' : 'Starting point'}
          hint={isRider ? 'Pick a spot near home. Drivers only see the area until you both accept.' : 'Where you usually leave from. Riders only see the area.'}
        >
          {(p) => (
            <select className="input" value={startId} onChange={(e) => setStartId(e.target.value)} {...p}>
              {meetingPoints.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.area}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Destination">
          {(p) => (
            <select className="input" value={destinationId} onChange={(e) => setDestinationId(e.target.value)} {...p}>
              {destinations.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.area}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Need to arrive by" hint={isRider ? 'When your class or shift starts, minus the walk from drop-off.' : 'When you need to be there.'}>
          {(p) => (
            <input
              type="time"
              className="input"
              value={toInputTime(arriveBy)}
              step={300}
              onChange={(e) => e.target.value && setArriveBy(fromInputTime(e.target.value))}
              {...p}
            />
          )}
        </Field>

        <DayChips label="Which days?" value={days} onChange={setDays} error={daysError} />
      </div>

      {!isRider && (
        <div className="card stack-lg">
          <Stepper
            label="Maximum detour"
            hint="The most extra time you'll spend picking up and dropping off. 10 minutes is a good start."
            value={maxDetour}
            onChange={setMaxDetour}
            min={5}
            max={30}
            step={5}
            format={(v) => `${v} min`}
          />
          <Stepper label="Seats to offer" value={seats} onChange={setSeats} min={1} max={4} format={(v) => `${v} seat${v === 1 ? '' : 's'}`} />
        </div>
      )}

      <PrototypeBanner />

      <div className="action-bar">
        <div className="action-bar__inner">
          <Button type="submit" variant="primary" size="lg" block icon="search">
            {isRider ? 'Find drivers' : 'Find riders'}
          </Button>
        </div>
      </div>
    </form>
  )
}
