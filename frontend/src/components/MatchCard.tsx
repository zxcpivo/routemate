import { Link } from 'react-router-dom'
import { placeById } from '../data/places'
import { formatTime } from '../lib/format'
import type { MatchResult } from '../lib/matching'
import type { Commuter, Role } from '../lib/types'
import { Icon } from './Icon'
import { Avatar, Badge, Stat, Stats } from './ui'

export function MatchCard({ match, partner, myRole }: { match: MatchResult; partner: Commuter; myRole: Role }) {
  const area = placeById(partner.startId).area
  const checks = [match.checks.days, match.checks.detour, match.checks.timing]

  const header = (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <Avatar name={partner.name} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row-between">
          <span className="match-card__name">{partner.name}</span>
          {match.ok ? (
            <Badge tone="success" icon="check">
              Match
            </Badge>
          ) : (
            <Badge tone="neutral">Not a match</Badge>
          )}
        </div>
        <p className="match-card__meta">{partner.blurb}</p>
        <p className="match-card__meta row" style={{ gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
          <Icon name="pin" size={14} />
          {myRole === 'rider' ? 'Leaves from' : 'Meets near'} {area}
        </p>
      </div>
    </div>
  )

  if (!match.ok) {
    return (
      <div className="card match-card match-card--miss">
        {header}
        <ul className="reasons" aria-label="Why this isn't a match">
          {checks.map((c, i) => (
            <li key={i} className={c.ok ? 'ok' : 'fail'}>
              <Icon name={c.ok ? 'check' : 'x'} size={14} />
              {c.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const early = myRole === 'rider' ? match.riderEarly : match.driverEarly
  return (
    <Link to={`/matches/${partner.id}`} className="card match-card" aria-label={`${partner.name}, see match details`}>
      {header}
      <Stats>
        <Stat label="Pickup" value={formatTime(match.pickupTime)} />
        <Stat label={early > 0 ? `Arrive (${early} early)` : 'Arrive'} value={formatTime(myRole === 'rider' ? match.riderArrival : match.driverArrival)} tone="success" />
        <Stat label="Detour" value={`${match.detour} min`} />
      </Stats>
      <div className="row-between">
        <span className="row wrap" style={{ gap: 'var(--space-1)' }}>
          {match.sharedDays.map((d) => (
            <Badge key={d} tone="primary">
              {d}
            </Badge>
          ))}
        </span>
        <Icon name="arrowRight" />
      </div>
    </Link>
  )
}
