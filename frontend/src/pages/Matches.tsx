import { Navigate } from 'react-router-dom'
import { MatchCard } from '../components/MatchCard'
import { ButtonLink, Callout, EmptyState, PrototypeBanner } from '../components/ui'
import { personById } from '../data/demo'
import { placeById } from '../data/places'
import { formatDays, formatTime } from '../lib/format'
import { partnerOf, useStore } from '../lib/store'

export default function Matches() {
  const { profile, matches, arrangement } = useStore()
  if (!profile) return <Navigate to="/" replace />

  const good = matches.filter((m) => m.ok)
  const misses = matches.filter((m) => !m.ok)
  const isRider = profile.role === 'rider'
  const partner = arrangement && personById(arrangement.partnerId)

  return (
    <div className="page">
      <div className="stack">
        <h1 className="title">{isRider ? 'Drivers on your route' : 'Riders on your route'}</h1>
        <div className="card row-between" style={{ alignItems: 'flex-start' }}>
          <div className="small">
            <strong>
              {placeById(profile.startId).area} → {placeById(profile.destinationId).area}
            </strong>
            <div className="muted num">
              Arrive by {formatTime(profile.arriveBy)} · {formatDays(profile.days)}
              {profile.role === 'driver' && ` · up to ${profile.maxDetour} min detour`}
            </div>
          </div>
          <ButtonLink to={`/setup/${profile.role}`} variant="ghost" size="sm">
            Edit
          </ButtonLink>
        </div>
      </div>

      {partner && (
        <Callout tone="success" icon="check" title={`You ride with ${partner.name}`}>
          <ButtonLink to="/ride" variant="ghost" size="sm" style={{ marginLeft: 'calc(-1 * var(--space-3))' }}>
            Go to my ride
          </ButtonLink>
        </Callout>
      )}

      <PrototypeBanner />

      <section className="stack" aria-labelledby="matches-h">
        <h2 id="matches-h" className="section-title">
          {good.length} {good.length === 1 ? 'match' : 'matches'}
        </h2>
        {good.length === 0 ? (
          <EmptyState
            icon="search"
            title="No match on this route yet"
            actions={
              <ButtonLink to={`/setup/${profile.role}`} variant="primary">
                Change my trip
              </ButtonLink>
            }
          >
            {isRider
              ? 'Nobody is driving your route at a time that works. Try a meeting point closer to a main road, or an arrival time 15 minutes either way.'
              : 'No riders fit your route and detour limit right now. Try allowing a longer detour, or a different arrival time.'}
          </EmptyState>
        ) : (
          good.map((m) => <MatchCard key={partnerOf(m, profile).id} match={m} partner={partnerOf(m, profile)} myRole={profile.role} />)
        )}
      </section>

      {misses.length > 0 && (
        <section className="stack" aria-labelledby="misses-h">
          <div className="stack" style={{ gap: 'var(--space-1)' }}>
            <h2 id="misses-h" className="section-title">
              Not a match ({misses.length})
            </h2>
            <p className="muted small">Close by, but at least one matching rule fails.</p>
          </div>
          {misses.map((m) => (
            <MatchCard key={partnerOf(m, profile).id} match={m} partner={partnerOf(m, profile)} myRole={profile.role} />
          ))}
        </section>
      )}
    </div>
  )
}
