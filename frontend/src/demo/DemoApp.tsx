import { useEffect, useRef, useState } from 'react'
import { Brand } from '../components/Brand'
import { Icon } from '../components/Icon'
import { DEMO_SESSION_KEY, DEMO_STUDENTS, demoStudentById, type StudentDetails } from '../data/studentVerification'
import { Field, ThemeSwitch } from '../components/ui'
import { DEFAULT_ANSWERS, ROLE_DEFAULTS, type Answers } from './plan'
import { BackupStep, Home, RoutesStep } from './Dashboard'
import { getRide, tripFromAnswers, upcomingTrip, type SavedRoute } from './trips'
import {
  AccountStep,
  ChooseStep,
  DoneStep,
  PitchStep,
  ProfileStep,
  RoleStep,
  RouteStep,
  StartStep,
  TimeStep,
  Welcome,
  type StepId,
  type StepProps,
} from './Steps'
import '../styles/demo.css'

type StepDef = { id: StepId; name: string; Component?: (p: StepProps) => React.ReactNode; note: string }

// Order of the guided demo. "note" is shown beside the phone on big screens,
// so whoever is presenting (or a judge trying it alone) knows what each step shows.
const STEPS: StepDef[] = [
  { id: 'welcome', name: 'Welcome', Component: Welcome, note: 'Routemate helps university students share recurring rides to campus.' },
  { id: 'role', name: 'Driver or rider', Component: RoleStep, note: 'One app for both sides. Drivers already make the trip; riders need a reliable way to make it.' },
  { id: 'start', name: 'Starting point & Destination', Component: StartStep, note: 'Riders choose a meeting point, not their home address. We start with one campus: matching works best when many people share a destination.' },
  { id: 'time', name: 'Arrival time', Component: TimeStep, note: 'Fixed start times are the core: every match has to get everyone there on time, on the same days each week.' },
  { id: 'pitch', name: 'Your savings', Component: PitchStep, note: 'Show the value before asking for an account: money back for drivers, time and reliability for riders.' },
  { id: 'account', name: 'Create account', note: 'University email and student ID establish the student profile. Use the fictional records in Demo controls to try verification.' },
  { id: 'profile', name: 'Age, interests & ride preferences', Component: ProfileStep, note: 'Ride preferences are available when the student record lists the user as a woman. Age and interests help order eligible students.' },
  { id: 'choose', name: 'Choose matches', Component: ChooseStep, note: 'Drivers choose who to pick up and can adjust their detour limit (10 minutes by default). Routemate keeps the whole route inside it.' },
  { id: 'route', name: 'Shared route', Component: RouteStep, note: 'One shared route with pickup times. The cost is split evenly with the driver and agreed up front.' },
  { id: 'done', name: 'Done', Component: DoneStep, note: 'Same people, same days, every week. If the driver is away, Routemate finds a backup.' },
  { id: 'home', name: 'Home', note: 'Home shows the next trip across all your routes, with route management and backups close by.' },
  { id: 'routes', name: 'Your routes', note: 'Save separate schedules for different class days and the trip home.' },
  { id: 'backup', name: 'Find a backup', note: 'Pick a route before choosing the day that needs a replacement driver.' },
]

const FIRST_ROUTE: StepId[] = ['role', 'start', 'time', 'pitch', 'account', 'profile', 'choose', 'route']
const MANAGE_ROUTE: StepId[] = ['role', 'start', 'time', 'choose', 'route']

type Saved = {
  step: StepId
  answers: Answers
  routes: SavedRoute[]
  draft?: { editId?: string }
}

const INITIAL: Saved = { step: 'welcome', answers: DEFAULT_ANSWERS, routes: [] }

function load(): Saved {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Saved
      // Older demos used a separate destination step and kept only one trip.
      const previousStep = (saved.step as string) === 'destination' ? 'start' : saved.step
      const { email: _legacyEmail, ...savedAnswers } = saved.answers as Answers & { email?: string }
      const answers = { ...DEFAULT_ANSWERS, ...savedAnswers }
      const verifiedStudent = demoStudentById(answers.verifiedStudentId)
      if (verifiedStudent) answers.gender = verifiedStudent.gender
      const step = !verifiedStudent && !saved.draft && ['profile', 'choose', 'route'].includes(previousStep)
        ? 'account'
        : previousStep
      const routes = saved.routes ?? (
        (step === 'home' || step === 'done') && answers.selectedIds.length
          ? [{ id: 'route-1', trip: tripFromAnswers(answers) }]
          : []
      )
      return { ...saved, step, answers, routes }
    }
  } catch {
    /* storage unavailable: start fresh */
  }
  return INITIAL
}

// Changing these fields means earlier picks may no longer fit.
const MATCH_KEYS: (keyof Answers)[] = ['role', 'destinationId', 'startId', 'arriveBy', 'days', 'age', 'interests', 'gender', 'ridePreference', 'verifiedStudentId']

export default function DemoApp() {
  const [saved, setSaved] = useState<Saved>(load)
  const { step, answers, routes, draft } = saved
  const bodyRef = useRef<HTMLDivElement>(null)
  const presenterRef = useRef<HTMLElement>(null)
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false)
  const [previewEmpty, setPreviewEmpty] = useState(false)
  const [account, setAccount] = useState<StudentDetails>(() => {
    const student = demoStudentById(answers.verifiedStudentId)
    return { name: answers.name, email: student?.email ?? '', studentId: student?.studentId ?? '' }
  })
  const [consent, setConsent] = useState(Boolean(demoStudentById(answers.verifiedStudentId)))
  const [sampleId, setSampleId] = useState(DEMO_STUDENTS[0].id)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    try {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(saved))
    } catch {
      /* storage unavailable: the demo still works */
    }
  }, [saved])

  useEffect(() => {
    if (mobileControlsOpen) {
      presenterRef.current?.querySelector('h2')?.focus({ preventScroll: true })
      return
    }
    bodyRef.current?.querySelector('h1')?.focus({ preventScroll: true })
    bodyRef.current?.querySelector('.demo-body')?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }, [step, previewEmpty, mobileControlsOpen])

  useEffect(() => {
    if (step !== 'home') return
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [step])

  const current = STEPS.find((s) => s.id === step) ?? STEPS[0]
  const sequence = draft ? MANAGE_ROUTE : FIRST_ROUTE
  const index = sequence.indexOf(step)
  const position = index + 1
  const total = sequence.length
  const presenterSteps = STEPS.filter(({ id }) => {
    if (draft) return sequence.includes(id)
    return id === step || (id !== 'routes' && id !== 'backup')
  })
  const presenterIndex = presenterSteps.indexOf(current)
  const Step = current.Component
  const upcoming = step === 'home' ? upcomingTrip(routes, answers, now) : undefined

  const set = (patch: Partial<Answers>) =>
    setSaved((s) => {
      const roleDefaults = !s.draft && patch.role && patch.role !== s.answers.role ? ROLE_DEFAULTS[patch.role] : undefined
      const updated = { ...s.answers, ...roleDefaults, ...patch }
      if (MATCH_KEYS.some((key) => key in patch && updated[key] !== s.answers[key])) updated.selectedIds = []
      return { ...s, answers: updated }
    })

  const goTo = (step: StepId) => {
    setPreviewEmpty(false)
    if (step === 'home' || step === 'backup') setNow(new Date())
    setSaved((s) => ({ ...s, step }))
  }
  const next = () => {
    if (step === 'welcome') return goTo('role')
    if (step === 'done') return goTo('home')
    if (step === 'route') {
      setSaved((s) => {
        if (s.step !== 'route') return s
        if (!getRide(s.answers)) return s
        const editedId = s.draft?.editId
        const route = { id: editedId ?? `route-${s.routes.length + 1}`, trip: tripFromAnswers(s.answers) }
        const routes = editedId ? s.routes.map((r) => r.id === editedId ? route : r) : [...s.routes, route]
        return { step: 'done', answers: s.answers, routes }
      })
      return
    }
    goTo(sequence[index + 1])
  }

  const cancelDraft = () => setSaved((s) => ({ ...s, step: 'routes', draft: undefined }))
  const back = () => {
    if (index > 0) return goTo(sequence[index - 1])
    if (draft) return cancelDraft()
    goTo('welcome')
  }

  const beginRoute = (source?: SavedRoute, kind?: 'edit' | 'return') => {
    setSaved((s) => {
      const base = source?.trip ?? s.routes[0]?.trip ?? tripFromAnswers(DEFAULT_ANSWERS)
      const trip = kind === 'return'
        ? { ...base, startId: base.destinationId, destinationId: base.startId, arriveBy: 18 * 60 }
        : base
      return {
        ...s,
        step: 'role',
        draft: { editId: kind === 'edit' ? source?.id : undefined },
        answers: { ...s.answers, ...trip, selectedIds: kind === 'edit' ? trip.selectedIds : [] },
      }
    })
  }

  const updateRoute = (id: string, patch: Pick<SavedRoute, 'away' | 'checkedInOn'>) =>
    setSaved((s) => ({ ...s, routes: s.routes.map((route) => route.id === id ? { ...route, ...patch } : route) }))
  const restart = () => {
    setMobileControlsOpen(false)
    setPreviewEmpty(false)
    setSaved(INITIAL)
    setAccount({ name: '', email: '', studentId: '' })
    setConsent(false)
    setSampleId(DEMO_STUDENTS[0].id)
    window.scrollTo(0, 0)
  }
  const fillDemoDetails = () => {
    const student = demoStudentById(sampleId)
    if (!student) return
    setAccount({ name: student.name, email: student.email, studentId: student.studentId })
    setConsent(true)
    setMobileControlsOpen(false)
    bodyRef.current?.querySelector('h1')?.focus()
  }
  const stepProps = { a: answers, set, next, goTo, managing: Boolean(draft), previewEmpty }
  const previewLabel = step === 'pitch'
    ? (previewEmpty ? 'Back to my matches' : `Preview: no ${answers.role === 'driver' ? 'riders' : 'drivers'} found`)
    : (previewEmpty ? 'Back to my route' : 'Preview: nobody selected')
  const dashboard = { profile: answers, routes, goTo, addRoute: () => beginRoute(), updateRoute }

  return (
    <div className={mobileControlsOpen ? 'demo-stage demo-stage--controls' : 'demo-stage'}>
      <div className="phone" ref={bodyRef}>
        {index >= 0 && (
          <div className="demo-top">
            <button type="button" className="icon-btn" onClick={back} aria-label="Back">
              <Icon name="arrowLeft" />
            </button>
            <div
              className="progress"
              role="progressbar"
              aria-label="Setup progress"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={position}
              aria-valuetext={`Step ${position} of ${total}: ${current.name}`}
            >
              <span style={{ width: `${(position / total) * 100}%` }} />
            </div>
            <span className="demo-count num">
              {position}/{total}
            </span>
            {draft && <button type="button" className="btn btn--ghost btn--sm" onClick={cancelDraft}>Cancel</button>}
          </div>
        )}
        <div className="demo-anim" key={`${step}-${previewEmpty}`}>
          {Step && <Step {...stepProps} />}
          {step === 'account' && <AccountStep {...stepProps} account={account} setAccount={setAccount} consent={consent} setConsent={setConsent} />}
          {step === 'home' && <Home {...dashboard} upcoming={upcoming} now={now} />}
          {step === 'routes' && <RoutesStep {...dashboard} editRoute={(route) => beginRoute(route, 'edit')} addReturn={(route) => beginRoute(route, 'return')} />}
          {step === 'backup' && <BackupStep {...dashboard} now={now} />}
        </div>
      </div>

      <aside className="presenter" id="demo-presenter" aria-label="Demo presenter panel" ref={presenterRef}>
        <div className="logo">
          <Brand />
        </div>
        <p className="presenter__tag">Clickable prototype · UNHack 2026</p>
        <details className="presenter__walkthrough">
          <summary>Walkthrough · {current.name}</summary>
          <ol className="presenter__steps">
            {presenterSteps.map((s, i) => (
              <li key={s.id} className={i === presenterIndex ? 'is-current' : i < presenterIndex ? 'is-done' : ''} aria-current={s.id === current.id ? 'step' : undefined}>
                <span className="presenter__dot" aria-hidden="true">{i < presenterIndex && <Icon name="check" size={12} />}</span>
                {s.name}
              </li>
            ))}
          </ol>
          <p className="presenter__note">{current.note}</p>
        </details>
        <section className="presenter__controls stack" aria-labelledby="presenter-controls">
          <h2 id="presenter-controls" className="section-title" tabIndex={-1}>Demo controls</h2>
          <p className="presenter__tip">
            <Icon name="info" size={14} /> People and trips are fictional. Accounts, ride requests and check-ins are simulated.
          </p>
          {step === 'account' && (
            <Field label="Sample student record">
              {(props) => (
                <select className="input" value={sampleId} onChange={(event) => setSampleId(event.currentTarget.value)} {...props}>
                  {DEMO_STUDENTS.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.label}</option>)}
                </select>
              )}
            </Field>
          )}
          <div className="presenter__actions">
            {(step === 'pitch' || step === 'route') && (
              <button type="button" className="btn btn--sm" onClick={() => {
                setPreviewEmpty(!previewEmpty)
                setMobileControlsOpen(false)
              }}>
                {previewLabel}
              </button>
            )}
            {step === 'account' && (
              <button type="button" className="btn btn--sm" onClick={fillDemoDetails}>
                Fill in demo details
              </button>
            )}
            {upcoming?.ride.isDriver && upcoming.route.checkedInOn !== upcoming.key && (!upcoming.isAway || upcoming.backup) && (
              <button type="button" className="btn btn--sm" onClick={() => {
                updateRoute(upcoming.route.id, { checkedInOn: upcoming.key })
                setMobileControlsOpen(false)
              }}>
                Simulate passengers checking in
              </button>
            )}
            <button type="button" className="btn btn--sm" onClick={restart}>
              Restart demo
            </button>
            <ThemeSwitch />
          </div>
        </section>
      </aside>
      <button
        type="button"
        className="presenter__toggle"
        aria-controls="demo-presenter"
        aria-expanded={mobileControlsOpen}
        onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
      >
        {mobileControlsOpen ? 'Back to app' : 'Demo controls'}
      </button>
    </div>
  )
}
