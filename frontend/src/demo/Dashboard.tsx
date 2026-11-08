import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Avatar, Badge, Button, Stat, Stats } from '../components/ui'
import { formatDays, formatMoney, formatTime } from '../lib/format'
import { navLinks } from './navLinks'
import type { Answers } from './plan'
import { RouteMap } from './RouteMap'
import { StepLayout, type StepId } from './Steps'
import { dateKey, findBackup, getRide, routeName, serviceDates, upcomingTrip, type SavedRoute } from './trips'

type DashboardProps = {
  profile: Answers
  routes: SavedRoute[]
  goTo: (step: StepId) => void
  addRoute: () => void
  updateRoute: (id: string, patch: Pick<SavedRoute, 'away' | 'checkedInOn'>) => void
}

export function Home({ profile, routes, goTo, addRoute, updateRoute, upcoming, now }: DashboardProps & {
  upcoming: ReturnType<typeof upcomingTrip>
  now: Date
}) {
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const hasDriverRoutes = routes.some(({ trip }) => trip.role === 'driver')

  return (
    <div className="demo-step">
      <div className="demo-body">
        <header className="home__head">
          <div>
            <p className="muted small">{greeting}</p>
            <h1 className="demo-title" tabIndex={-1}>{profile.name.split(' ')[0] || 'there'}</h1>
          </div>
          <Avatar name={profile.name || 'You'} you />
        </header>

        {upcoming ? (
          <NextTrip upcoming={upcoming} now={now} onCheckIn={() => updateRoute(upcoming.route.id, { checkedInOn: upcoming.key })} />
        ) : (
          <section className="card stack" aria-labelledby="home-next">
            <h2 id="home-next" className="section-title">Upcoming trip</h2>
            <p className="muted small">Your next trip will appear here once you save a route.</p>
          </section>
        )}

        <section className="card stack" aria-labelledby="home-routes">
          <div className="row-between">
            <h2 id="home-routes" className="section-title">Your routes</h2>
            <Badge>{routes.length} saved</Badge>
          </div>
          <p className="muted small">Set a separate schedule for another shift or the trip back.</p>
          <div className="row wrap">
            <Button icon="pin" onClick={addRoute}>Add a route</Button>
            <Button variant="ghost" onClick={() => goTo('routes')}>View all routes</Button>
          </div>
        </section>

        {routes.length > 0 && (
          <section className="card stack" aria-labelledby="home-backup">
            <h2 id="home-backup" className="section-title">Need a backup?</h2>
            <p className="muted small">Choose the route and day that need a replacement driver.</p>
            <Button onClick={() => goTo('backup')}>{hasDriverRoutes ? "Can't drive?" : 'Driver away?'}</Button>
          </section>
        )}
      </div>
    </div>
  )
}

function NextTrip({ upcoming, now, onCheckIn }: {
  upcoming: NonNullable<ReturnType<typeof upcomingTrip>>
  now: Date
  onCheckIn: () => void
}) {
  const { route, ride, plan, starts, time, key, isAway, backup } = upcoming
  const { isDriver } = ride
  const checkedIn = route.checkedInOn === key
  const startId = route.trip.startId
  const names = plan.riders.map((rider) => rider.name.split(' ')[0]).join(', ')
  const date = dateKey(starts) === dateKey(now) ? 'Today' : starts.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <section className="card stack home-next" aria-labelledby="home-next">
      <div className="row-between">
        <h2 id="home-next" className="section-title">Upcoming trip</h2>
        <Badge tone={isAway ? 'info' : 'success'} icon={isAway ? 'swap' : 'clock'}>
          {isAway ? (backup ? 'Backup' : 'Driver away') : 'Scheduled'}
        </Badge>
      </div>
      <div className="home__time">
        <span className="muted small">{date} · {isDriver ? (isAway ? 'Scheduled departure' : 'Leave at') : 'Pickup at'}</span>
        <strong className="num">{formatTime(time)}</strong>
        <span>{routeName(route.trip)}</span>
        <span className="muted small">Arrive by {formatTime(plan.arrival)} · {isDriver ? 'Driving' : 'Riding'}</span>
      </div>
      <p className="small">
        {isAway && !backup ? 'A replacement driver is still needed.'
          : isDriver && backup ? `${backup.name} is taking ${names}.`
          : isDriver ? `Picking up ${names}.`
          : `${plan.driver.name} picks you up · ${plan.driver.car}.`}
      </p>
      <div aria-live="polite">
        {checkedIn ? (
          <div className="checkin-done"><Icon name="check" /> {isDriver ? 'Passengers checked in' : 'Checked in'}</div>
        ) : !isDriver && (!isAway || backup) && (
          <Button variant="primary" block icon="flag" onClick={onCheckIn}>I've arrived</Button>
        )}
      </div>
      {(!isAway || (!isDriver && backup)) && (
        <details className="home-details">
          <summary>Map and directions</summary>
          <div className="stack">
            <RouteMap stops={plan.stops} />
            <div className="nav-links" role="group" aria-labelledby="nav-links-h">
              <span id="nav-links-h" className="field__label">{isDriver ? 'Open the route in' : 'Get to your pickup with'}</span>
              <div className="nav-links__row">
                {navLinks(plan.stops, isDriver, startId).map((l) => (
                  <a key={l.app} className="btn btn--sm" href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.app}, ${l.note} (opens in a new tab)`}>
                    {l.app}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </details>
      )}
      <Stats>
        <Stat label={isDriver ? 'Estimated monthly savings' : 'Estimated cost per ride'} value={isDriver ? `$${ride.plan.monthlySaving}` : formatMoney(plan.share)} />
        <Stat label="Rides a week on this route" value={ride.days.length} />
      </Stats>
    </section>
  )
}

export function RoutesStep({ profile, routes, goTo, addRoute, editRoute, addReturn }: DashboardProps & {
  editRoute: (route: SavedRoute) => void
  addReturn: (route: SavedRoute) => void
}) {
  return (
    <StepLayout title="Your routes" lede="Each route has its own schedule and routemates." cta="Add a route" onSubmit={addRoute}
      secondary={<Button variant="ghost" block onClick={() => goTo('home')}>Back to home</Button>}>
      {routes.map((route) => {
        const { trip } = route
        const ride = getRide({ ...profile, ...trip })
        const name = routeName(trip)
        const schedule = `Arrive by ${formatTime(trip.arriveBy)} · ${formatDays(trip.days)}`
        return (
          <section className="card stack" key={route.id}>
            <div className="row-between">
              <h2 className="demo-subtitle">{name}</h2>
              <Badge>{trip.role === 'driver' ? 'Driver' : 'Rider'}</Badge>
            </div>
            <p className="small muted">{schedule}</p>
            {ride && <p className="small">With {ride.others.map((o) => o.name).join(', ')}</p>}
            <div className="row wrap">
              <Button size="sm" aria-label={`Edit route ${name}, ${schedule}`} onClick={() => editRoute(route)}>Edit route</Button>
              <Button size="sm" variant="ghost" aria-label={`Add return route for ${name}, ${schedule}`} onClick={() => addReturn(route)}>Add return route</Button>
            </div>
          </section>
        )
      })}
    </StepLayout>
  )
}

export function BackupStep({ profile, routes, goTo, updateRoute, now }: DashboardProps & { now: Date }) {
  const [routeId, setRouteId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const route = routes.find((route) => route.id === routeId)
  const ride = route && getRide({ ...profile, ...route.trip })
  const dates = serviceDates(now).filter(({ date, day }) => {
    if (!ride || !ride.days.includes(day)) return false
    const arrival = new Date(date)
    arrival.setHours(0, Math.round(ride.plan.arrival), 0, 0)
    return arrival >= now
  }).slice(0, ride?.days.length ?? 0)
  const saved = dates.find(({ key }) => key === route?.away?.date)
  const backup = saved && ride ? findBackup(ride, saved.day) : undefined

  return (
    <StepLayout title="Find a backup" lede="Choose the route first, then the day a driver is away."
      secondary={<Button variant="ghost" block onClick={() => goTo('home')}>Back to home</Button>}>
      <div className="field">
        <label className="field__label" htmlFor="backup-route">Route</label>
        <select id="backup-route" className="input" value={routeId} onChange={(e) => {
          setRouteId(e.target.value)
          setSelectedDate('')
        }}>
          <option value="">Select a route</option>
          {routes.map(({ id, trip }) => <option key={id} value={id}>{routeName(trip)} · {formatTime(trip.arriveBy)} · {formatDays(trip.days)}</option>)}
        </select>
      </div>
      {route && (
        <>
          <div className="field">
            <label className="field__label" htmlFor="backup-day">{route.trip.role === 'driver' ? "When can't you drive?" : 'When is your driver away?'}</label>
            <select id="backup-day" className="input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
              <option value="">Select a day</option>
              {dates.map(({ date, key }) => <option key={key} value={key}>{date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</option>)}
            </select>
          </div>
          <Button variant="primary" icon="swap" disabled={!selectedDate} onClick={() => {
            const day = dates.find(({ key }) => key === selectedDate)
            if (day) updateRoute(route.id, { away: { date: day.key, day: day.day } })
          }}>Find a backup</Button>
          {saved && (
            <section className="card stack" aria-live="polite">
              <strong>{backup ? `Backup on ${saved.day}: ${backup.name}` : `No backup found for ${saved.day}`}</strong>
              <p className="muted small">{routeName(route.trip)}</p>
              <Button size="sm" variant="ghost" onClick={() => updateRoute(route.id, { away: undefined })}>Undo</Button>
            </section>
          )}
        </>
      )}
    </StepLayout>
  )
}
