import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Brand } from '../components/Brand'
import { Icon, type IconName } from '../components/Icon'
import { Avatar, Badge, Button, DayChips, Field, Stat, Stats, Stepper, WeekStrip } from '../components/ui'
import { PlaceSearch } from '../components/PlaceSearch'
import { AppleIcon, GoogleIcon } from '../components/SocialIcons'
import { TimeWheel } from '../components/TimeWheel'
import { SEARCHABLE_PLACES, placeById } from '../data/places'
import { formatMoney, formatTime } from '../lib/format'
import { distanceKm, driveMin, matchPair } from '../lib/matching'
import { DAYS, type Day, type Driver, type Rider, type Role } from '../lib/types'
import { RouteMap } from './RouteMap'
import { TripMap } from './TripMap'
import { navLinks } from './navLinks'
import {
  DETOUR_RANGE,
  MAX_DETOUR,
  ROLE_DEFAULTS,
  driverCandidates,
  meAsDriver,
  meAsRider,
  planRoute,
  riderCandidates,
  riderTimes,
  suggestRiders,
  type Answers,
} from './plan'

export type StepProps = {
  a: Answers
  set: (patch: Partial<Answers>) => void
  next: () => void
  goTo: (id: StepId) => void
  restart: () => void
}

export type StepId = 'welcome' | 'role' | 'start' | 'home' | 'time' | 'pitch' | 'account' | 'choose' | 'route' | 'done'

const firstName = (name: string) => name.split(' ')[0]

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

/* ---------- Shared step layout ---------- */

function StepLayout({
  title,
  lede,
  children,
  cta,
  ctaDisabled,
  loading,
  onSubmit,
  secondary,
}: {
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  cta?: string
  ctaDisabled?: boolean
  loading?: boolean
  onSubmit?: () => void
  secondary?: ReactNode
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!ctaDisabled && !loading) onSubmit?.()
  }
  return (
    <form className="demo-step" onSubmit={submit} noValidate>
      <div className="demo-body">
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <h1 className="demo-title" tabIndex={-1}>
            {title}
          </h1>
          {lede && <p className="demo-lede">{lede}</p>}
        </div>
        {children}
      </div>
      {(cta || secondary) && (
        <div className="demo-foot">
          {cta && (
            <Button type="submit" variant="primary" size="lg" block disabled={ctaDisabled} loading={loading}>
              {cta}
            </Button>
          )}
          {secondary}
        </div>
      )}
    </form>
  )
}

/* ---------- Option tiles (native radio / checkbox, styled) ---------- */

function Tile({
  type = 'radio',
  name,
  checked,
  disabled,
  onChange,
  children,
  size = 'md',
}: {
  type?: 'radio' | 'checkbox'
  name: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
  children: ReactNode
  size?: 'md' | 'lg' | 'sm'
}) {
  return (
    <label className={`tile tile--${size}${disabled ? ' tile--disabled' : ''}`}>
      <input type={type} name={name} className="sr-only" checked={checked} disabled={disabled} onChange={onChange} />
      {children}
      <span className={`tile__check tile__check--${type}`} aria-hidden="true">
        <Icon name="check" size={14} />
      </span>
    </label>
  )
}

/* ---------- Demo preview control ----------
   The demo always finds matches. Screens that would only appear when something
   goes wrong are reached with this button, so testers can still see them. */

function DemoPreview({ text, label, onClick }: { text: string; label: string; onClick: () => void }) {
  return (
    <div className="demo-preview">
      <span>
        <Icon name="info" size={14} /> {text}
      </span>
      <Button size="sm" onClick={onClick}>
        {label}
      </Button>
    </div>
  )
}

/* ---------- 0. Welcome ---------- */

export function Welcome({ next }: StepProps) {
  return (
    <StepLayout
      title={
        <span className="demo-welcome">
          <Brand decorative />
          <span>
            Wanna be my <em>routemate?</em>
          </span>
        </span>
      }
      lede="Get to class or your shift on time with someone already making the same trip. Drivers share the cost of the drive. Riders get a reliable lift."
      cta="Start the demo"
      onSubmit={next}
    >
      <ul className="demo-points">
        <li>
          <Icon name="clock" /> Matched on your exact arrival time
        </li>
        <li>
          <Icon name="car" /> Drivers set their own detour limit ({MAX_DETOUR} min by default)
        </li>
        <li>
          <Icon name="shield" /> Meeting points instead of home addresses
        </li>
      </ul>
      <p className="demo-note">
        <Icon name="info" size={14} /> Demo: the people and trips are made up, and nothing you enter leaves this device.
      </p>
    </StepLayout>
  )
}

/* ---------- 1. Role ---------- */

const ROLE_OPTIONS: { value: Role; icon: IconName; title: string; sub: string }[] = [
  { value: 'driver', icon: 'car', title: 'I drive', sub: 'I have a car and seats to share' },
  { value: 'rider', icon: 'user', title: 'I need a ride', sub: "I don't have a car for this trip" },
]

export function RoleStep({ a, set, next }: StepProps) {
  return (
    <StepLayout title="How do you get there?" lede="Pick one. You can switch later.">
      <div className="stack" role="radiogroup" aria-label="Driver or rider">
        {ROLE_OPTIONS.map((o) => (
          <Tile
            key={o.value}
            name="role"
            size="lg"
            checked={a.role === o.value}
            onChange={() => {
              set({ role: o.value })
              next()
            }}
          >
            <span className="tile__icon">
              <Icon name={o.icon} size={26} />
            </span>
            <span className="tile__text">
              <strong>{o.title}</strong>
              <span>{o.sub}</span>
            </span>
          </Tile>
        ))}
      </div>
    </StepLayout>
  )
}

/* ---------- 2. Starting point & destination ---------- */

// Suggestions in order: places demo commuters use first, then other public spots.
const START_OPTIONS = SEARCHABLE_PLACES.filter((p) => p.kind === 'meeting')
const DESTINATION_OPTIONS = SEARCHABLE_PLACES.filter((p) => p.kind === 'destination')

export function StartStep({ a, set, next }: StepProps) {
  const isDriver = a.role === 'driver'
  const startQuestion = isDriver ? 'Where do you start?' : 'Where can you be picked up?'
  const startId = a.startId || ROLE_DEFAULTS[a.role ?? 'driver'].startId
  const km = distanceKm(placeById(startId), placeById(a.destinationId))
  const min = Math.round(driveMin(placeById(startId), placeById(a.destinationId)))
  return (
    <StepLayout
      title={<span id="start-q">{startQuestion}</span>}
      lede={isDriver ? 'The area you usually leave from.' : 'Pick a public meeting point near you, like a station or plaza. Drivers never see your home address.'}
      cta="Continue"
      ctaDisabled={!a.startId}
      onSubmit={next}
    >
      <PlaceSearch
        labelledBy="start-q"
        value={a.startId}
        onChange={(startId) => set({ startId })}
        options={START_OPTIONS}
        placeholder="Search a station, mall or area"
      />
      <h2 className="demo-subtitle" id="destination-q">
        What is your destination?
      </h2>
      <PlaceSearch
        labelledBy="destination-q"
        value={a.destinationId}
        onChange={(destinationId) => set({ destinationId })}
        options={DESTINATION_OPTIONS}
        icon="flag"
        placeholder="Search your campus or workplace"
      />
      <div className="stack" style={{ gap: 'var(--space-2)' }}>
        <TripMap
          startId={startId}
          destinationId={a.destinationId}
          startLabel={isDriver ? 'Starting point' : 'Meeting point'}
          onMoveStart={(id) => set({ startId: id })}
          onMoveDestination={(id) => set({ destinationId: id })}
        />
        <p className="trip-map__caption">
          <span>
            <span className="trip-map__key trip-map__key--start" aria-hidden="true" /> {placeById(startId).area.split(',')[0]}
          </span>
          <span>
            <span className="trip-map__key trip-map__key--end" aria-hidden="true" /> {placeById(a.destinationId).area.split(',')[0]}
          </span>
          <span className="num">
            About {Math.round(km)} km · {min} min drive
          </span>
        </p>
        <p className="demo-note">
          <Icon name="info" size={14} /> Drag either pin to move it. Times are estimates.
        </p>
      </div>
    </StepLayout>
  )
}

/* ---------- 3. Time ---------- */

export function TimeStep({ a, set, next }: StepProps) {
  return (
    <StepLayout
      title="When do you need to be there?"
      lede="Your class or shift start, minus the walk from drop-off. Drag to choose."
      cta="Find my matches"
      ctaDisabled={a.days.length === 0}
      onSubmit={next}
    >
      <p className="time-summary" aria-live="polite">
        Arrive by <strong className="num">{formatTime(a.arriveBy)}</strong>
      </p>
      <TimeWheel label="Arrive by" value={a.arriveBy} onChange={(arriveBy) => set({ arriveBy })} />
      <DayChips label="Which days?" value={a.days} onChange={(days) => set({ days })} error={a.days.length === 0 ? 'Pick at least one day.' : undefined} />
    </StepLayout>
  )
}

/* ---------- 5. Pitch: the value before sign-up ---------- */

// Earlier arrivals to offer a driver when nobody fits their time, closest first.
const EARLIER_BY = [10, 20, 30]

function earlierOptions(a: Answers) {
  return EARLIER_BY.map((m) => a.arriveBy - m)
    .filter((t) => t >= 0)
    .flatMap((t) => {
      const me = { ...meAsDriver(a), arriveBy: t }
      const candidates = driverCandidates(me)
      const riders = suggestRiders(me, candidates)
      return riders.length ? [{ time: t, earlier: a.arriveBy - t, count: candidates.length, plan: planRoute(me, riders) }] : []
    })
}

export function PitchStep({ a, set, next, goTo }: StepProps) {
  const isDriver = a.role === 'driver'
  const [previewEmpty, setPreviewEmpty] = useState(false)
  const data = useMemo(() => {
    if (isDriver) {
      const me = meAsDriver(a)
      const candidates = driverCandidates(me)
      const plan = planRoute(me, suggestRiders(me, candidates))
      return { count: candidates.length, plan }
    }
    const me = meAsRider(a)
    const candidates = riderCandidates(me)
    const plan = candidates[0] ? planRoute(candidates[0], [me], 'rider') : null
    return { count: candidates.length, plan }
  }, [a, isDriver])
  const showEmpty = previewEmpty || data.count === 0 || !data.plan
  const earlier = useMemo(() => (showEmpty && isDriver ? earlierOptions(a) : []), [a, isDriver, showEmpty])

  if (showEmpty || !data.plan) {
    return (
      <StepLayout
        title="No one on your route yet"
        lede={`We couldn't find ${isDriver ? 'riders' : 'a driver'} going your way to arrive by ${formatTime(a.arriveBy)}. This is normal when a route is new.`}
        cta="Try another starting point"
        onSubmit={() => goTo('start')}
        secondary={
          <Button variant="ghost" block onClick={() => goTo('time')}>
            Change my arrival time
          </Button>
        }
      >
        {earlier.length > 0 ? (
          <section className="stack" aria-labelledby="earlier-h">
            <h2 id="earlier-h" className="demo-subtitle">
              Could you arrive a little earlier?
            </h2>
            <p className="demo-lede">Riders are going your way at these times.</p>
            <ul className="time-options">
              {earlier.map((o) => (
                <li key={o.time}>
                  <button
                    type="button"
                    className="time-option"
                    onClick={() => {
                      set({ arriveBy: o.time })
                      setPreviewEmpty(false)
                    }}
                  >
                    <span className="time-option__time num">{formatTime(o.time)}</span>
                    <span className="time-option__meta">
                      <strong>
                        {o.earlier} min earlier · {o.count} {o.count === 1 ? 'rider' : 'riders'}
                      </strong>
                      <span>
                        +{o.plan.detour} min to your drive · save about ${o.plan.monthlySaving}/month
                      </span>
                    </span>
                    <Icon name="arrowRight" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <div className="empty-art" aria-hidden="true">
            <Icon name="search" size={40} />
          </div>
        )}
        {previewEmpty && <DemoPreview text="Preview of the no-match screen." label="Back to my matches" onClick={() => setPreviewEmpty(false)} />}
      </StepLayout>
    )
  }

  const emptyPreview = (
    <DemoPreview
      text="Demo always finds matches."
      label={`Preview: no ${isDriver ? 'riders' : 'drivers'} found`}
      onClick={() => setPreviewEmpty(true)}
    />
  )
  const plan = data.plan
  if (isDriver) {
    const n = plan.riders.length
    return (
      <StepLayout title="Good news" cta="Create my account" onSubmit={next}>
        <div className="pitch">
          <span className="pitch__label">You could save about</span>
          <span className="pitch__big num">
            ${plan.monthlySaving}
            <small>/month</small>
          </span>
          <span className="pitch__label">on gas</span>
        </div>
        <div className="pitch-row">
          <div className="pitch-chip">
            <Icon name="clock" />
            <span>
              <strong>+{plan.detour} min</strong> to your drive
            </span>
          </div>
          <div className="pitch-chip">
            <Icon name="user" />
            <span>
              <strong>
                {data.count} {data.count === 1 ? 'rider' : 'riders'}
              </strong>{' '}
              on your route
            </span>
          </div>
        </div>
        <p className="demo-note">
          Based on {n} {n === 1 ? 'rider' : 'riders'} splitting the trip cost evenly with you, at an example $0.20/km for gas and running costs. You'll
          never add more than {meAsDriver(a).maxDetour} minutes, and you can change that limit later.
        </p>
        {emptyPreview}
      </StepLayout>
    )
  }

  const times = riderTimes(meAsRider(a))
  const saved = times.transit - times.car
  return (
    <StepLayout
      title="Good news"
      lede={`${data.count} ${data.count === 1 ? 'driver is' : 'drivers are'} already making your trip.`}
      cta="Create my account"
      onSubmit={next}
    >
      <div className="trip-compare">
        <div className="trip-compare__row">
          <span className="trip-compare__label">Your trip now</span>
          <span className="trip-compare__value num">{times.transit} min</span>
          <span className="trip-compare__sub">by transit, each way</span>
        </div>
        <div className="trip-compare__row trip-compare__row--new">
          <span className="trip-compare__label">With a routemate</span>
          <span className="trip-compare__value num">{times.car} min</span>
          <span className="trip-compare__sub">
            <Icon name="clock" size={14} /> {saved} min faster each way
          </span>
        </div>
      </div>
      <dl className="pitch-facts">
        <div>
          <dt>
            <Icon name="shield" /> Reliability
          </dt>
          <dd>Arrive by {formatTime(a.arriveBy)} with the same driver every week. Backup if they're away.</dd>
        </div>
        <div>
          <dt>
            <Icon name="dollar" /> Cost
          </dt>
          <dd>
            <strong className="num">{formatMoney(plan.share)}</strong> a ride, agreed up front
          </dd>
        </div>
      </dl>
      <p className="demo-note">
        Times are estimates. The contribution is the trip cost split evenly with the driver. For comparison, a TTC tap is $3.30.
      </p>
      {emptyPreview}
    </StepLayout>
  )
}

/* ---------- 6. Account ---------- */

export function AccountStep({ a, set, next }: StepProps) {
  const [consent, setConsent] = useState(Boolean(a.name))
  const [tried, setTried] = useState(false)
  const [loading, setLoading] = useState(false)
  const nameError = tried && !a.name.trim() ? 'Enter your first name.' : undefined
  const emailError = tried && !/^\S+@\S+\.\S+$/.test(a.email) ? 'Enter a valid email.' : undefined
  const consentError = tried && !consent ? 'Tick this box to continue.' : undefined

  const submit = () => {
    setTried(true)
    if (!a.name.trim() || !/^\S+@\S+\.\S+$/.test(a.email) || !consent) return
    setLoading(true)
    window.setTimeout(next, 700) // simulated account creation
  }

  // Simulated: the provider hands back a name and email. Consent is still the user's tick.
  const social = () => {
    set({ name: 'Alex Chen', email: 'alex.demo@example.com' })
    setTried(true)
    if (!consent) return
    setLoading(true)
    window.setTimeout(next, 700)
  }

  return (
    <StepLayout
      title="Create your account"
      lede="So your matches know who's picking them up, or who they're picking up."
      cta="Create account"
      loading={loading}
      onSubmit={submit}
      secondary={
        <Button
          variant="ghost"
          block
          onClick={() => {
            set({ name: 'Alex Chen', email: 'alex.demo@example.com' })
            setConsent(true)
          }}
        >
          Fill in demo details
        </Button>
      }
    >
      <div className="stack" style={{ gap: 'var(--space-2)' }}>
        <Button block onClick={social} disabled={loading}>
          <AppleIcon /> Continue with Apple
        </Button>
        <Button block onClick={social} disabled={loading}>
          <GoogleIcon /> Continue with Google
        </Button>
      </div>
      <div className="or-divider" role="separator">
        <span>or use your email</span>
      </div>
      <Field label="First and last name" error={nameError}>
        {(p) => <input className="input" autoComplete="off" value={a.name} onChange={(e) => set({ name: e.target.value })} {...p} />}
      </Field>
      <Field label="School or work email" hint="We'd use this to confirm you study or work there." error={emailError}>
        {(p) => <input className="input" type="email" autoComplete="off" value={a.email} onChange={(e) => set({ email: e.target.value })} {...p} />}
      </Field>
      <label className="check">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={consentError ? true : undefined} />
        <span>Matches can see my first name and the area I start from. My exact meeting point is shared only after we both accept.</span>
      </label>
      {consentError && <span className="field__error">{consentError}</span>}
      <p className="demo-note">
        <Icon name="info" size={14} /> Demo only: no account is created and nothing is sent.
      </p>
    </StepLayout>
  )
}

/* ---------- 7. Choose ---------- */

export function ChooseStep(props: StepProps) {
  return props.a.role === 'driver' ? <ChoosePassengers {...props} /> : <ChooseDriver {...props} />
}

function ChoosePassengers({ a, set, next }: StepProps) {
  const me = meAsDriver(a)
  const candidates = driverCandidates(me)

  // Start with a suggested set the first time this screen opens.
  useEffect(() => {
    if (a.selectedIds.length === 0) set({ selectedIds: suggestRiders(me, candidates).map((r) => r.id) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selected = candidates.filter((r) => a.selectedIds.includes(r.id))
  const plan = planRoute(me, selected)
  const full = selected.length >= me.seats
  const toggle = (id: string) =>
    set({ selectedIds: a.selectedIds.includes(id) ? a.selectedIds.filter((x) => x !== id) : [...a.selectedIds, id] })

  return (
    <StepLayout
      title={`Hi ${firstName(a.name)}, pick your passengers`}
      lede={`Up to ${me.seats} seats. We've picked the ones that fit best.`}
      cta={selected.length ? 'See my route' : 'Pick at least one'}
      ctaDisabled={selected.length === 0 || plan.overLimit}
      onSubmit={next}
    >
      <Stepper
        label="Detour limit"
        hint="The most extra time you'll add to your drive for pickups."
        value={me.maxDetour}
        min={DETOUR_RANGE.min}
        max={DETOUR_RANGE.max}
        format={(v) => `${v} min`}
        editable
        unit="min"
        onChange={(maxDetour) => set({ maxDetour })}
      />
      <div className="stack" role="group" aria-label="Passengers">
        {candidates.map((r) => {
          const m = matchPair(me, r)
          const checked = a.selectedIds.includes(r.id)
          return (
            <Tile key={r.id} type="checkbox" name="passengers" checked={checked} disabled={!checked && full} onChange={() => toggle(r.id)}>
              <Avatar name={r.name} />
              <span className="tile__text">
                <strong>{r.name}</strong>
                <span>{r.blurb}</span>
                <span className="tile__meta">
                  <Icon name="pin" size={12} /> {placeById(r.startId).area.split(',')[0]} · +{m.detour} min · {m.sharedDays.join(' ')}
                </span>
              </span>
            </Tile>
          )
        })}
      </div>
      <div className={`demo-summary${plan.overLimit ? ' demo-summary--warn' : ''}`} aria-live="polite">
        {plan.overLimit ? (
          <div className="demo-summary__warn">
            <span>
              <Icon name="alert" /> +{plan.detour} min is over your {me.maxDetour} min limit. Remove someone or raise the limit.
            </span>
            {plan.detour <= DETOUR_RANGE.max && (
              <Button size="sm" variant="primary" onClick={() => set({ maxDetour: plan.detour })}>
                Raise my limit to {plan.detour} min
              </Button>
            )}
          </div>
        ) : (
          <>
            <span>
              <strong>+{plan.detour} min</strong> to your drive
            </span>
            <span>
              Save <strong>${plan.monthlySaving}/mo</strong>
            </span>
          </>
        )}
      </div>
    </StepLayout>
  )
}

function ChooseDriver({ a, set, next }: StepProps) {
  const me = meAsRider(a)
  const candidates = riderCandidates(me)

  useEffect(() => {
    if (a.selectedIds.length === 0 && candidates[0]) set({ selectedIds: [candidates[0].id] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StepLayout
      title={`Hi ${firstName(a.name)}, pick your driver`}
      lede="Same driver, same days, every week."
      cta="See my route"
      ctaDisabled={a.selectedIds.length === 0}
      onSubmit={next}
    >
      <div className="stack" role="radiogroup" aria-label="Driver">
        {candidates.map((d) => {
          const m = matchPair(d, me)
          const plan = planRoute(d, [me], 'rider')
          return (
            <Tile key={d.id} name="driver" checked={a.selectedIds[0] === d.id} onChange={() => set({ selectedIds: [d.id] })}>
              <Avatar name={d.name} />
              <span className="tile__text">
                <strong>{d.name}</strong>
                <span>
                  {d.blurb} · {d.car}
                </span>
                <span className="tile__meta">
                  <Icon name="clock" size={12} /> Pickup {formatTime(m.pickupTime)} · {formatMoney(plan.share)}/ride · {m.sharedDays.join(' ')}
                </span>
              </span>
            </Tile>
          )
        })}
      </div>
    </StepLayout>
  )
}

/* ---------- 8. Route ---------- */

function useRoute(a: Answers) {
  return useMemo(() => {
    if (a.role === 'driver') {
      const me = meAsDriver(a)
      const plan = planRoute(me, driverCandidates(me).filter((r) => a.selectedIds.includes(r.id)))
      return { plan, others: plan.riders as (Rider | Driver)[] } // in pickup order
    }
    const me = meAsRider(a)
    const driver = riderCandidates(me).find((d) => d.id === a.selectedIds[0])
    if (!driver) return null
    return { plan: planRoute(driver, [me], 'rider'), others: [driver] as (Rider | Driver)[] }
  }, [a])
}

export function RouteStep({ a, next, goTo }: StepProps) {
  const route = useRoute(a)
  const [sending, setSending] = useState(false)
  const [previewEmpty, setPreviewEmpty] = useState(false)
  if (previewEmpty || !route) {
    return (
      <StepLayout title="Pick a match first" lede="Your route appears once you've chosen who to ride with." cta="Back to matches" onSubmit={() => goTo('choose')}>
        {previewEmpty && <DemoPreview text="Preview of the screen shown with nobody selected." label="Back to my route" onClick={() => setPreviewEmpty(false)} />}
      </StepLayout>
    )
  }
  const { plan, others } = route
  const isDriver = a.role === 'driver'
  const names = joinNames(others.map((o) => firstName(o.name)))
  const days = isDriver ? a.days.filter((d) => others.some((o) => o.days.includes(d))) : plan.sharedDays.me

  const share = () => {
    setSending(true)
    window.setTimeout(next, 1100) // simulated: everyone accepts
  }

  return (
    <StepLayout
      title="Your shared route"
      lede={isDriver ? 'Check it over, then share it with your passengers.' : `Check it over, then send it to ${names}.`}
      cta={isDriver ? (others.length > 1 ? `Share route with ${others.length} passengers` : `Share route with ${names}`) : `Send to ${names}`}
      loading={sending}
      onSubmit={share}
    >
      <RouteMap stops={plan.stops} />
      <ol className="timeline">
        {plan.stops.map((s, i) => {
          const isMe = isDriver ? s.kind === 'start' : s.kind === 'pickup'
          const label =
            s.kind === 'start'
              ? isDriver
                ? 'You leave'
                : `${firstName(s.who)} leaves`
              : s.kind === 'pickup'
                ? isMe
                  ? 'You get picked up'
                  : `Pick up ${firstName(s.who)}`
                : 'Everyone arrives'
          return (
            <li key={i} className={`timeline__item timeline__item--${s.kind}`}>
              <span className="timeline__time num">{formatTime(s.time)}</span>
              <span className="timeline__dot" aria-hidden="true" />
              <span>
                <strong>{label}</strong>
                <span className="muted small"> · {placeById(s.placeId).area.split(',')[0]}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <div className="pitch-row">
        <div className="pitch-chip">
          <Icon name="calendar" />
          <span>
            <strong>{days.join(' ')}</strong>
          </span>
        </div>
        <div className="pitch-chip">
          <Icon name="dollar" />
          <span>
            {isDriver ? (
              <>
                Save <strong>${plan.monthlySaving}/mo</strong>
              </>
            ) : (
              <>
                <strong>{formatMoney(plan.share)}</strong> a ride
              </>
            )}
          </span>
        </div>
      </div>
      {isDriver && (
        <p className="demo-note">
          +{plan.detour} min to your drive. Each passenger pays {formatMoney(plan.share)} a ride, agreed up front.
        </p>
      )}
      <DemoPreview text="Demo control." label="Preview: nobody selected" onClick={() => setPreviewEmpty(true)} />
    </StepLayout>
  )
}

/* ---------- 9. Done ---------- */

export function DoneStep({ a, next, restart }: StepProps) {
  const route = useRoute(a)
  if (!route) return null
  const { plan, others } = route
  const isDriver = a.role === 'driver'
  const myTime = isDriver ? plan.departTime : plan.stops.find((s) => s.who === meAsRider(a).name && s.kind === 'pickup')?.time ?? plan.departTime

  return (
    <StepLayout
      title={
        <span className="done-head">
          <span className="done-check" aria-hidden="true">
            <Icon name="check" size={32} />
          </span>
          {isDriver ? 'Route shared!' : 'Request accepted!'}
        </span>
      }
      lede={isDriver ? 'Your passengers said yes. See you on the road.' : 'Your driver said yes. See you at the meeting point.'}
      cta="Go to my home"
      onSubmit={next}
      secondary={
        <Button variant="ghost" block onClick={restart}>
          Restart the demo
        </Button>
      }
    >
      <div className="card stack">
        {others.map((o) => (
          <div key={o.id} className="row">
            <Avatar name={o.name} />
            <span style={{ flex: 1 }}>
              <strong>{o.name}</strong>
              <span className="muted small" style={{ display: 'block' }}>
                {isDriver ? `Pickup ${formatTime(plan.stops.find((s) => s.who === o.name)?.time ?? 0)}` : (o as Driver).car}
              </span>
            </span>
            <Badge tone="success" icon="check">
              Accepted
            </Badge>
          </div>
        ))}
      </div>
      <div className="card stack" style={{ gap: 'var(--space-2)' }}>
        <span className="section-title">Every week</span>
        <span>
          <strong>{isDriver ? `Leave at ${formatTime(myTime)}` : `Pickup at ${formatTime(myTime)}`}</strong>, arrive by {formatTime(plan.arrival)}
        </span>
        <span className="muted small">
          {isDriver ? `You get back about $${plan.monthlySaving} a month` : `${formatMoney(plan.share)} a ride, about $${plan.monthlyCost} a month`}
        </span>
      </div>
      <ul className="demo-points demo-points--small">
        <li>
          <Icon name="swap" /> {isDriver ? "Can't drive one day? We find your passengers a backup." : 'Driver away? We find you a backup.'}
        </li>
        <li>
          <Icon name="flag" /> {isDriver ? 'Passengers check in when they arrive.' : 'Check in when you arrive.'}
        </li>
        <li>
          <Icon name="shield" /> Exact meeting points are now shared with your group only.
        </li>
      </ul>
      <p className="demo-note">
        <Icon name="info" size={14} /> Simulated for the demo.
      </p>
    </StepLayout>
  )
}

/* ---------- 10. Home: the app once everything is set up ---------- */

// JS getDay(): 0 = Sunday. DAYS start on Monday.
const todayDay = (): Day => DAYS[(new Date().getDay() + 6) % 7]

function nextRideDay(days: Day[], today: Day): Day | undefined {
  const start = DAYS.indexOf(today)
  for (let i = 0; i < 7; i++) {
    const d = DAYS[(start + i) % 7]
    if (days.includes(d)) return d
  }
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function HomeStep({ a, goTo, restart }: StepProps) {
  const route = useRoute(a)
  const [checkedIn, setCheckedIn] = useState(false)
  const [awayPick, setAwayPick] = useState<Day | ''>('')
  const [away, setAway] = useState<Day | null>(null)

  if (!route) {
    return <StepLayout title="Pick a match first" cta="Back to matches" onSubmit={() => goTo('choose')} />
  }

  const { plan, others } = route
  const isDriver = a.role === 'driver'
  const me = meAsRider(a)
  const days = isDriver ? a.days.filter((d) => others.some((o) => o.days.includes(d))) : plan.sharedDays.me
  const today = todayDay()
  const next = nextRideDay(days, today)
  const names = joinNames(others.map((o) => firstName(o.name)))
  const myTime = isDriver ? plan.departTime : (plan.stops.find((s) => s.who === me.name && s.kind === 'pickup')?.time ?? plan.departTime)
  const myPlace = placeById(a.startId)

  // Simulated: another driver on the route covers the away day (the demo always finds one).
  const backup = away ? riderCandidates(me).find((d) => !others.some((o) => o.id === d.id)) : undefined
  const nextIsAway = away !== null && next === away

  return (
    <div className="demo-step">
      <div className="demo-body">
        <header className="home__head">
          <div>
            <p className="muted small">{greeting()}</p>
            <h1 className="demo-title" tabIndex={-1}>
              {firstName(a.name || 'there')}
            </h1>
          </div>
          <Avatar name={a.name || 'You'} you />
        </header>

        <section className="card stack" aria-labelledby="home-next">
          <div className="row-between">
            <h2 id="home-next" className="section-title">
              {next === today ? 'Today' : next ? `Next ride · ${next}` : 'Next ride'}
            </h2>
            {nextIsAway ? (
              <Badge tone="info" icon="swap">
                Backup
              </Badge>
            ) : (
              <Badge tone="success" icon="clock">
                On time
              </Badge>
            )}
          </div>
          <div className="home__time">
            <span className="muted small">{isDriver ? 'Leave at' : 'Pickup at'}</span>
            <strong className="num">{formatTime(myTime)}</strong>
            <span className="muted small">
              {myPlace.area.split(',')[0]} · arrive by {formatTime(plan.arrival)}
            </span>
          </div>
          <RouteMap stops={plan.stops} />
          <p className="small">
            {nextIsAway && backup
              ? isDriver
                ? `${firstName(backup.name)} drives ${names} that day.`
                : `${firstName(backup.name)} picks you up that day.`
              : isDriver
                ? `Picking up ${names}.`
                : `${names} picks you up · ${(others[0] as Driver).car}.`}
          </p>
          <div className="nav-links" role="group" aria-labelledby="nav-links-h">
            <span id="nav-links-h" className="field__label">
              {isDriver ? 'Open the route in' : 'Get to your pickup with'}
            </span>
            <div className="nav-links__row">
              {navLinks(plan.stops, isDriver, me.startId).map((l) => (
                <a key={l.app} className="btn btn--sm" href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.app}, ${l.note} (opens in a new tab)`}>
                  {l.app}
                </a>
              ))}
            </div>
            {isDriver && <span className="field__hint">Google Maps loads every pickup. Apple Maps and Waze open the first stop.</span>}
          </div>
          <div aria-live="polite">
            {checkedIn ? (
              <div className="checkin-done">
                <Icon name="check" /> {isDriver ? 'Everyone checked in' : 'Checked in'} at {formatTime(plan.arrival - 2)} · on time
              </div>
            ) : (
              <Button variant="primary" block icon="flag" onClick={() => setCheckedIn(true)}>
                {isDriver ? (others.length > 1 ? 'Simulate passengers checking in' : `Simulate ${names} checking in`) : "I've arrived"}
              </Button>
            )}
          </div>
        </section>

        <section className="card stack" aria-labelledby="home-week">
          <h2 id="home-week" className="section-title">
            This week
          </h2>
          <WeekStrip shared={days} today={today} away={away ?? undefined} awayLabel={isDriver ? 'you are away' : 'driver away'} />
          {away ? (
            <div className="row-between small wrap">
              <span>
                <Icon name="swap" size={14} /> Backup on {away}: <strong>{backup?.name}</strong>
              </span>
              <Button size="sm" variant="ghost" onClick={() => setAway(null)}>
                Undo
              </Button>
            </div>
          ) : (
            <div className="field">
              <label className="field__label" htmlFor="home-away">
                {isDriver ? "Can't drive one day?" : 'Driver away one day?'}
              </label>
              <div className="row">
                <select id="home-away" className="input" value={awayPick} onChange={(e) => setAwayPick(e.target.value as Day | '')}>
                  <option value="">Pick a day</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Button disabled={!awayPick} onClick={() => awayPick && setAway(awayPick)}>
                  Find a backup
                </Button>
              </div>
            </div>
          )}
        </section>

        <Stats>
          {isDriver ? (
            <>
              <Stat label="Back each month" value={`$${plan.monthlySaving}`} tone="success" />
              <Stat label="Added to your drive" value={`+${plan.detour} min`} />
            </>
          ) : (
            <>
              <Stat label="Per ride" value={formatMoney(plan.share)} />
              <Stat label="Each month" value={`$${plan.monthlyCost}`} />
            </>
          )}
          <Stat label="Rides a week" value={days.length} />
        </Stats>

        <section className="card stack" aria-labelledby="home-mates">
          <h2 id="home-mates" className="section-title">
            Your routemates
          </h2>
          {others.map((o) => (
            <div key={o.id} className="row">
              <Avatar name={o.name} />
              <span style={{ flex: 1 }}>
                <strong>{o.name}</strong>
                <span className="muted small" style={{ display: 'block' }}>
                  {isDriver ? `Pickup ${formatTime(plan.stops.find((s) => s.who === o.name)?.time ?? 0)} · ${placeById(o.startId).name}` : (o as Driver).car}
                </span>
              </span>
            </div>
          ))}
          <p className="muted small">
            <Icon name="shield" size={14} /> Exact meeting points are shared with your group only.
          </p>
        </section>

        <div className="row wrap">
          <Button size="sm" icon="pin" onClick={() => goTo('start')}>
            Edit my trip
          </Button>
          <Button size="sm" variant="ghost" onClick={restart}>
            Restart the demo
          </Button>
        </div>
        <p className="demo-note">
          <Icon name="info" size={14} /> Check-ins and backups are simulated for the demo.
        </p>
      </div>
    </div>
  )
}
