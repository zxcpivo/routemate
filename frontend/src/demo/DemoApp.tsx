import { useEffect, useRef, useState } from 'react'
import { Brand } from '../components/Brand'
import { Icon } from '../components/Icon'
import { ThemeSwitch } from '../components/ui'
import { DEFAULT_ANSWERS, ROLE_DEFAULTS, type Answers } from './plan'
import {
  AccountStep,
  ChooseStep,
  DoneStep,
  HomeStep,
  PitchStep,
  RoleStep,
  RouteStep,
  StartStep,
  TimeStep,
  Welcome,
  type StepId,
  type StepProps,
} from './Steps'
import '../styles/demo.css'

type StepDef = { id: StepId; name: string; Component: (p: StepProps) => React.ReactNode; note: string }

// Order of the guided demo. "note" is shown beside the phone on big screens,
// so whoever is presenting (or a judge trying it alone) knows what each step shows.
const STEPS: StepDef[] = [
  { id: 'welcome', name: 'Welcome', Component: Welcome, note: 'Routemate matches people who have a fixed start time with drivers already making the same trip.' },
  { id: 'role', name: 'Driver or rider', Component: RoleStep, note: 'One app for both sides. Drivers already make the trip; riders need a reliable way to make it.' },
  { id: 'start', name: 'Starting point & Destination', Component: StartStep, note: 'Riders choose a meeting point, not their home address. We start with one campus: matching works best when many people share a destination.' },
  { id: 'time', name: 'Arrival time', Component: TimeStep, note: 'Fixed start times are the core: every match has to get everyone there on time, on the same days each week.' },
  { id: 'pitch', name: 'Your savings', Component: PitchStep, note: 'Show the value before asking for an account: money back for drivers, time and reliability for riders.' },
  { id: 'account', name: 'Create account', Component: AccountStep, note: 'The account comes after the value is clear. Matches only see a first name and an approximate area.' },
  { id: 'choose', name: 'Choose matches', Component: ChooseStep, note: 'Drivers choose who to pick up and can adjust their detour limit (10 minutes by default). Routemate keeps the whole route inside it.' },
  { id: 'route', name: 'Shared route', Component: RouteStep, note: 'One shared route with pickup times. The cost is split evenly with the driver and agreed up front.' },
  { id: 'done', name: 'Done', Component: DoneStep, note: 'Same people, same days, every week. If the driver is away, Routemate finds a backup.' },
  { id: 'home', name: 'Home', Component: HomeStep, note: 'Once everything is set up, the app opens on the week ahead: next pickup, check-in, and a backup when someone is away.' },
]

// Screens with no Back arrow or progress bar.
const OUTSIDE_PROGRESS: StepId[] = ['welcome', 'done', 'home']

const KEY = 'routemate-demo-v1'
type Saved = { step: StepId; answers: Answers }

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Saved
      // Destination used to be its own step; it now shares the Starting point screen.
      if ((saved.step as string) === 'destination') saved.step = 'start'
      return saved
    }
  } catch {
    /* ignore: start fresh */
  }
  return { step: 'welcome', answers: DEFAULT_ANSWERS }
}

// Changing any of these means earlier passenger/driver picks may no longer fit.
const TRIP_KEYS: (keyof Answers)[] = ['role', 'destinationId', 'startId', 'arriveBy', 'days']

export default function DemoApp() {
  const [{ step, answers }, setSaved] = useState<Saved>(load)
  const [history, setHistory] = useState<StepId[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ step, answers }))
    } catch {
      /* storage unavailable: the demo still works */
    }
  }, [step, answers])

  useEffect(() => {
    // New step: move focus to its heading for keyboard and screen reader users.
    bodyRef.current?.querySelector('h1')?.focus({ preventScroll: true })
    bodyRef.current?.querySelector('.demo-body')?.scrollTo(0, 0)
  }, [step])

  const index = STEPS.findIndex((s) => s.id === step)
  const current = STEPS[index] ?? STEPS[0]

  const set = (patch: Partial<Answers>) =>
    setSaved((s) => {
      let answers = { ...s.answers, ...patch }
      if (patch.role && patch.role !== s.answers.role) answers = { ...answers, ...ROLE_DEFAULTS[patch.role] }
      if (!('selectedIds' in patch) && TRIP_KEYS.some((k) => k in patch)) answers.selectedIds = []
      return { ...s, answers }
    })

  const goTo = (id: StepId) => {
    setHistory((h) => [...h, step])
    setSaved((s) => ({ ...s, step: id }))
  }
  const next = () => goTo(STEPS[Math.min(index + 1, STEPS.length - 1)].id)
  const back = () => {
    const prev = history[history.length - 1] ?? STEPS[Math.max(index - 1, 0)].id
    setHistory((h) => h.slice(0, -1))
    setSaved((s) => ({ ...s, step: prev }))
  }
  const restart = () => {
    setHistory([])
    setSaved({ step: 'welcome', answers: DEFAULT_ANSWERS })
  }

  // Progress counts the question steps only (not welcome, done or home).
  const total = STEPS.filter((s) => !OUTSIDE_PROGRESS.includes(s.id)).length
  const showChrome = !OUTSIDE_PROGRESS.includes(step)
  const Step = current.Component

  return (
    <div className="demo-stage">
      <div className="phone" ref={bodyRef}>
        {showChrome && (
          <div className="demo-top">
            <button type="button" className="icon-btn" onClick={back} aria-label="Back">
              <Icon name="arrowLeft" />
            </button>
            <div
              className="progress"
              role="progressbar"
              aria-label="Demo progress"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={index}
              aria-valuetext={`Step ${index} of ${total}: ${current.name}`}
            >
              <span style={{ width: `${(index / total) * 100}%` }} />
            </div>
            <span className="demo-count num">
              {index}/{total}
            </span>
          </div>
        )}
        <div className="demo-anim" key={step}>
          <Step a={answers} set={set} next={next} goTo={goTo} restart={restart} />
        </div>
      </div>

      <aside className="presenter" aria-label="About this step">
        <div className="logo">
          <Brand />
        </div>
        <p className="presenter__tag">Clickable prototype · UNHack 2026</p>
        <ol className="presenter__steps">
          {STEPS.map((s, i) => (
            <li key={s.id} className={i === index ? 'is-current' : i < index ? 'is-done' : ''} aria-current={i === index ? 'step' : undefined}>
              <span className="presenter__dot" aria-hidden="true">
                {i < index ? <Icon name="check" size={12} /> : null}
              </span>
              {s.name}
            </li>
          ))}
        </ol>
        <p className="presenter__note">{current.note}</p>
        <p className="presenter__tip">
          <Icon name="info" size={14} /> Every screen has answers filled in, so you can just keep tapping. People and trips are made up.
        </p>
        <div className="presenter__actions">
          <button type="button" className="btn btn--sm" onClick={restart}>
            Restart demo
          </button>
          <ThemeSwitch />
        </div>
      </aside>
    </div>
  )
}
