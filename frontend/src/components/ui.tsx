import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import { DAYS, type Day } from '../lib/types'
import { initials } from '../lib/format'

/* ---------- Button ---------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

function buttonClass(variant: ButtonVariant, size: ButtonSize, block?: boolean, loading?: boolean) {
  return [
    'btn',
    variant !== 'secondary' && `btn--${variant}`,
    size !== 'md' && `btn--${size}`,
    block && 'btn--block',
    loading && 'btn--loading',
  ]
    .filter(Boolean)
    .join(' ')
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  loading?: boolean
  icon?: IconName
}

export function Button({ variant = 'secondary', size = 'md', block, loading, icon, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClass(variant, size, block, loading)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className="btn__label row" style={{ gap: 'var(--space-2)' }}>
        {icon && <Icon name={icon} />}
        {children}
      </span>
    </button>
  )
}

export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  block,
  icon,
  children,
  ...rest
}: LinkProps & { variant?: ButtonVariant; size?: ButtonSize; block?: boolean; icon?: IconName }) {
  return (
    <Link className={buttonClass(variant, size, block)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </Link>
  )
}

/* ---------- SegmentedControl ---------- */

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string; icon?: IconName }[]
  value: T
  onChange: (v: T) => void
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (i + dir + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o, i) => {
        const selected = o.value === value
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className="segmented__option"
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {o.icon && <Icon name={o.icon} />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Field ---------- */

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: ReactNode
  error?: string
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {hint && (
        <span className="field__hint" id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field__error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  )
}

/* ---------- DayChips ---------- */

export function DayChips({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: Day[]
  onChange: (days: Day[]) => void
  error?: string
}) {
  const id = useId()
  const toggle = (d: Day) => onChange(value.includes(d) ? value.filter((x) => x !== d) : DAYS.filter((x) => x === d || value.includes(x)))
  return (
    <div className="field">
      <span className="field__label" id={`${id}-label`}>
        {label}
      </span>
      <div className="day-chips" role="group" aria-labelledby={`${id}-label`} aria-describedby={error ? `${id}-error` : undefined}>
        {DAYS.map((d) => (
          <button key={d} type="button" className="day-chip" aria-pressed={value.includes(d)} onClick={() => toggle(d)}>
            {d}
          </button>
        ))}
      </div>
      {error && (
        <span className="field__error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  )
}

/* ---------- Stepper ---------- */

export function Stepper({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = (v) => String(v),
}: {
  label: string
  hint?: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  format?: (v: number) => string
}) {
  const id = useId()
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step))
  return (
    <div className="field">
      <span className="field__label" id={`${id}-label`}>
        {label}
      </span>
      <div className="stepper" role="group" aria-labelledby={`${id}-label`}>
        <button type="button" className="stepper__btn" aria-label={`Decrease ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(clamp(value - step))}>
          −
        </button>
        <span className="stepper__value" aria-live="polite">
          {format(value)}
        </span>
        <button type="button" className="stepper__btn" aria-label={`Increase ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(clamp(value + step))}>
          +
        </button>
      </div>
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  )
}

/* ---------- Avatar, Badge, Stat ---------- */

export function Avatar({ name, size, you }: { name: string; size?: 'lg'; you?: boolean }) {
  return (
    <span className={['avatar', size && `avatar--${size}`, you && 'avatar--you'].filter(Boolean).join(' ')} aria-hidden="true">
      {initials(name)}
    </span>
  )
}

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary'

export function Badge({ tone = 'neutral', icon, children }: { tone?: Tone; icon?: IconName; children: ReactNode }) {
  return (
    <span className={`badge${tone !== 'neutral' ? ` badge--${tone}` : ''}`}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}

export function Stats({ children }: { children: ReactNode }) {
  return <dl className="stats">{children}</dl>
}

export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: 'success' | 'warning' | 'danger' }) {
  return (
    <div className={`stat${tone ? ` stat--${tone}` : ''}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

/* ---------- Banners, callouts, empty state ---------- */

export function PrototypeBanner() {
  return (
    <p className="proto-banner" role="note">
      <Icon name="info" size={16} />
      <span>
        <strong>Prototype.</strong> All people and trips here are made up. Requests and backups are simulated.
      </span>
    </p>
  )
}

export function Callout({
  tone,
  icon = 'info',
  title,
  children,
}: {
  tone?: 'success' | 'warning' | 'info'
  icon?: IconName
  title?: string
  children?: ReactNode
}) {
  return (
    <div className={`callout${tone ? ` callout--${tone}` : ''}`}>
      <Icon name={icon} />
      <div>
        {title && <strong>{title}</strong>}
        {children}
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, children, actions }: { icon: IconName; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="card empty">
      <span className="empty__icon">
        <Icon name={icon} size={26} />
      </span>
      <h2 className="empty__title">{title}</h2>
      {children && <div className="muted small">{children}</div>}
      {actions && <div className="row wrap" style={{ justifyContent: 'center' }}>{actions}</div>}
    </div>
  )
}

/* ---------- RouteLine ---------- */

export type RouteStop = { label: string; place: string; time?: string; kind: 'start' | 'pickup' | 'end' }

export function RouteLine({ stops }: { stops: RouteStop[] }) {
  return (
    <div className="route">
      {stops.map((s, i) => (
        <div key={i} style={{ display: 'contents' }}>
          <span className={`route__dot${s.kind === 'pickup' ? ' route__dot--pickup' : s.kind === 'end' ? ' route__dot--end' : ''}`} aria-hidden="true" />
          <span className="route__place">
            <span className="muted">{s.label}</span>
            <strong>{s.place}</strong>
          </span>
          <span className="route__time">{s.time}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------- WeekStrip ---------- */

export function WeekStrip({ shared, today, away, awayLabel = 'away' }: { shared: Day[]; today?: Day; away?: Day; awayLabel?: string }) {
  return (
    <ul className="week" aria-label="Your week">
      {DAYS.map((d) => {
        const isShared = shared.includes(d)
        const isAway = away === d
        const state = isAway ? awayLabel : isShared ? 'ride' : 'no ride'
        return (
          <li
            key={d}
            className={['week__day', isShared && 'week__day--shared', isAway && 'week__day--away', today === d && 'week__day--today'].filter(Boolean).join(' ')}
          >
            <span>{d}</span>
            <span className="week__dot" aria-hidden="true" />
            <span className="sr-only">
              {state}
              {today === d ? ', today' : ''}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
