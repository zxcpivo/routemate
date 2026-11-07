import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Avatar, Badge, Button, ButtonLink, Callout, EmptyState, Field, PrototypeBanner, RouteLine, WeekStrip } from '../components/ui'
import { personById } from '../data/demo'
import { placeById } from '../data/places'
import { formatMoney, formatTime } from '../lib/format'
import { matchPair } from '../lib/matching'
import { useStore } from '../lib/store'
import { DAYS, type Day, type Driver, type Rider } from '../lib/types'

// JS getDay(): 0 = Sunday. Our DAYS start on Monday.
const todayDay = (): Day => DAYS[(new Date().getDay() + 6) % 7]

function nextRideDay(shared: Day[], today: Day): Day | undefined {
  const start = DAYS.indexOf(today)
  for (let i = 0; i < 7; i++) {
    const d = DAYS[(start + i) % 7]
    if (shared.includes(d)) return d
  }
}

export default function MyRide() {
  const { profile, arrangement, markAway, clearAway, checkIn, endArrangement } = useStore()
  const location = useLocation()
  const justAccepted = (location.state as { justAccepted?: boolean } | null)?.justAccepted
  const [awayDay, setAwayDay] = useState<Day | ''>('')

  if (!profile) return <Navigate to="/" replace />

  const partner = arrangement && personById(arrangement.partnerId)
  if (!arrangement || !partner) {
    return (
      <div className="page">
        <h1 className="title">My ride</h1>
        <EmptyState
          icon="calendar"
          title="No regular ride yet"
          actions={
            <ButtonLink to="/matches" variant="primary">
              See matches
            </ButtonLink>
          }
        >
          When you and a match agree on a contribution, your weekly ride shows up here.
        </EmptyState>
      </div>
    )
  }

  const isRider = profile.role === 'rider'
  const first = partner.name.split(' ')[0]
  const driver = (isRider ? partner : profile) as Driver
  const rider = (isRider ? profile : partner) as Rider
  const m = matchPair(driver, rider)
  const today = todayDay()
  const next = nextRideDay(arrangement.days, today)
  const away = arrangement.away
  const backup = away?.backupId ? (personById(away.backupId) as Driver | undefined) : undefined
  const backupMatch = backup ? matchPair(backup, rider) : undefined
  const nextIsAway = away && next === away.day

  // Exact meeting point is shown now that both people accepted.
  const meeting = placeById(rider.startId)
  const destination = placeById(rider.destinationId)

  return (
    <div className="page">
      <h1 className="title">My ride</h1>

      {justAccepted && (
        <Callout tone="success" icon="check" title={`${first} accepted`}>
          You ride together on {arrangement.days.join(', ')} for {formatMoney(arrangement.contribution)} a ride. (Simulated for the demo.)
        </Callout>
      )}

      <section className="card card--flush" aria-labelledby="partner-h">
        <div className="card__section row">
          <Avatar name={partner.name} />
          <div style={{ flex: 1 }}>
            <p className="match-card__meta">{isRider ? 'Your driver' : 'Your rider'}</p>
            <h2 id="partner-h" className="match-card__name">
              {partner.name}
            </h2>
            <p className="match-card__meta">{partner.role === 'driver' ? partner.car : partner.blurb}</p>
          </div>
          <Badge tone="success" icon="shield">
            Accepted
          </Badge>
        </div>
        <div className="card__section stack">
          <WeekStrip shared={arrangement.days} today={today} away={away?.day} awayLabel={isRider ? 'driver away' : 'you are away'} />
          <div className="row-between small wrap">
            <span className="muted">Agreed contribution</span>
            <span className="num">
              <strong>{formatMoney(arrangement.contribution)}</strong> / ride ·{' '}
              <strong>{formatMoney(arrangement.contribution * arrangement.days.length)}</strong> / week
            </span>
          </div>
        </div>
      </section>

      {next && (
        <section className="card stack-lg" aria-labelledby="next-h">
          <div className="row-between">
            <h2 id="next-h" className="section-title">
              {next === today ? 'Today' : `Next ride · ${next}`}
            </h2>
            {nextIsAway ? (
              <Badge tone={backup ? 'info' : 'warning'} icon={backup ? 'swap' : 'alert'}>
                {backup ? 'Backup driver' : 'No driver yet'}
              </Badge>
            ) : (
              <Badge tone="success" icon="clock">
                On time
              </Badge>
            )}
          </div>

          {nextIsAway && backup && backupMatch ? (
            <RouteLine
              stops={[
                { kind: 'pickup', label: `${isRider ? 'You' : first} get${isRider ? '' : 's'} picked up by ${backup.name}`, place: meeting.name, time: formatTime(backupMatch.pickupTime) },
                { kind: 'end', label: 'Arrive', place: destination.name, time: formatTime(backupMatch.riderArrival) },
              ]}
            />
          ) : nextIsAway ? (
            <p className="muted small">We're still looking for a backup for {next}.</p>
          ) : (
            <RouteLine
              stops={[
                ...(isRider ? [] : [{ kind: 'start' as const, label: 'You leave', place: placeById(driver.startId).area, time: formatTime(m.departTime) }]),
                { kind: 'pickup', label: isRider ? `${first} picks you up` : `Pick up ${first}`, place: meeting.name, time: formatTime(m.pickupTime) },
                { kind: 'end', label: isRider ? 'You arrive' : `Drop off ${first}`, place: destination.name, time: formatTime(m.riderArrival) },
              ]}
            />
          )}

          <div aria-live="polite">
            {arrangement.checkedIn ? (
              <div className="checkin-done">
                <Icon name="check" /> {isRider ? 'Checked in' : `${first} checked in`} at {formatTime(nextIsAway && backupMatch ? backupMatch.riderArrival : m.riderArrival)} · on time
              </div>
            ) : (
              <Button variant="primary" size="lg" block icon="flag" onClick={checkIn}>
                {isRider ? "I've arrived" : `Simulate ${first} checking in`}
              </Button>
            )}
          </div>
        </section>
      )}

      <section className="card stack-lg" aria-labelledby="away-h">
        <h2 id="away-h" className="section-title">
          {isRider ? `${first} can't make it?` : "Can't drive one day?"}
        </h2>
        {away ? (
          <div className="stack">
            {backup ? (
              <Callout tone="info" icon="swap" title={`Backup on ${away.day}: ${backup.name}`}>
                {backup.car}. Pickup at {backupMatch && formatTime(backupMatch.pickupTime)} from the same meeting point, same contribution.
              </Callout>
            ) : (
              <Callout tone="warning" icon="alert" title={`No backup found for ${away.day}`}>
                No other driver on this route that day. {isRider ? 'Plan for transit on that day.' : `We've told ${first} so they can plan ahead.`}
              </Callout>
            )}
            <Button variant="ghost" onClick={clearAway}>
              Undo
            </Button>
          </div>
        ) : (
          <div className="stack">
            <Field label="Which day?" hint="We'll look for another driver on the same route that day.">
              {(p) => (
                <select className="input" value={awayDay} onChange={(e) => setAwayDay(e.target.value as Day)} {...p}>
                  <option value="">Choose a day</option>
                  {arrangement.days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Button disabled={!awayDay} icon="search" onClick={() => awayDay && markAway(awayDay)}>
              Find a backup
            </Button>
          </div>
        )}
      </section>

      <PrototypeBanner />

      <Button variant="danger" onClick={endArrangement}>
        End this arrangement
      </Button>
    </div>
  )
}
