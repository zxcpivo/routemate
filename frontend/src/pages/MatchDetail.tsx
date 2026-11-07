import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Avatar, Badge, Button, Callout, PrototypeBanner, RouteLine, Stepper } from '../components/ui'
import { placeById } from '../data/places'
import { formatMoney, formatTime } from '../lib/format'
import { COST_PER_KM, suggestedContribution } from '../lib/matching'
import { partnerOf, useStore } from '../lib/store'

export default function MatchDetail() {
  const { id } = useParams()
  const { profile, matches, agree } = useStore()
  const navigate = useNavigate()
  const match = matches.find((m) => profile && partnerOf(m, profile).id === id)
  const { suggested, cap } = match ? suggestedContribution(match) : { suggested: 0, cap: 0 }
  const [contribution, setContribution] = useState(suggested)
  const [sending, setSending] = useState(false)

  if (!profile) return <Navigate to="/" replace />
  if (!match || !match.ok) return <Navigate to="/matches" replace />

  const partner = partnerOf(match, profile)
  const isRider = profile.role === 'rider'
  const first = partner.name.split(' ')[0]
  const { driver, rider } = match
  const checks = [match.checks.days, match.checks.detour, match.checks.timing]

  const send = () => {
    setSending(true)
    // Simulated: the other person accepts after a moment.
    window.setTimeout(() => {
      agree(partner.id, contribution, match.sharedDays)
      navigate('/ride', { state: { justAccepted: true } })
    }, 900)
  }

  return (
    <div className="page page--with-bar">
      <Link to="/matches" className="back-link">
        <Icon name="arrowLeft" size={16} /> All matches
      </Link>

      <div className="row">
        <Avatar name={partner.name} size="lg" />
        <div className="stack" style={{ gap: 'var(--space-1)' }}>
          <h1 className="title">{partner.name}</h1>
          <p className="muted small">{partner.blurb}</p>
          {partner.role === 'driver' && (
            <span className="row small muted" style={{ gap: 'var(--space-1)' }}>
              <Icon name="car" size={14} /> {partner.car} · {partner.seats} seat{partner.seats === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>

      <section className="card stack-lg" aria-labelledby="trip-h">
        <div className="row-between">
          <h2 id="trip-h" className="section-title">
            Your shared trip
          </h2>
          <span className="row wrap" style={{ gap: 'var(--space-1)' }}>
            {match.sharedDays.map((d) => (
              <Badge key={d} tone="primary">
                {d}
              </Badge>
            ))}
          </span>
        </div>
        <RouteLine
          stops={[
            { kind: 'start', label: isRider ? `${first} leaves` : 'You leave', place: placeById(driver.startId).area, time: formatTime(match.departTime) },
            { kind: 'pickup', label: isRider ? 'You get picked up' : `Pick up ${first}`, place: placeById(rider.startId).area, time: formatTime(match.pickupTime) },
            { kind: 'end', label: isRider ? 'You arrive' : `${first} arrives`, place: placeById(rider.destinationId).area, time: formatTime(match.riderArrival) },
          ]}
        />
        <ul className="reasons" aria-label="Why this is a match">
          {checks.map((c, i) => (
            <li key={i} className="ok">
              <Icon name="check" size={14} />
              {c.text}
            </li>
          ))}
        </ul>
      </section>

      <Callout icon="shield" title="Exact meeting point after you both accept">
        Until then you each see only the approximate area.
      </Callout>

      <section className="card stack-lg" aria-labelledby="pay-h">
        <h2 id="pay-h" className="section-title">
          Contribution per ride
        </h2>
        <Stepper
          label={isRider ? 'You pay per ride' : 'Rider pays per ride'}
          value={contribution}
          onChange={setContribution}
          min={2}
          max={cap}
          step={0.5}
          format={formatMoney}
        />
        <p className="muted small">
          Suggested {formatMoney(suggested)} for about {Math.round(match.riderKm)} km at an example {formatMoney(COST_PER_KM)}/km running cost. Capped at{' '}
          {formatMoney(cap)} so it stays a share of costs. That's {formatMoney(contribution * match.sharedDays.length)} a week for{' '}
          {match.sharedDays.length} ride{match.sharedDays.length === 1 ? '' : 's'}.
        </p>
        <p className="muted small">For comparison, a TTC tap is $3.30.</p>
      </section>

      <PrototypeBanner />

      <div className="action-bar">
        <div className="action-bar__inner">
          <Button variant="primary" size="lg" block loading={sending} onClick={send}>
            {isRider ? `Ask ${first} for a ride` : `Offer ${first} a seat`}
          </Button>
        </div>
      </div>
    </div>
  )
}
