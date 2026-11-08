import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEMO_DRIVERS, DEMO_RIDERS } from '../data/demo'
import { matchPair, score, type MatchResult } from './matching'
import { meetsRidePreference } from './ridePreferences'
import type { Arrangement, Commuter, Day, Driver, Rider } from './types'

// Prototype state: lives in this browser only (localStorage). No backend.

type State = {
  profile: Commuter | null
  arrangement: Arrangement | null
}

type Store = State & {
  saveProfile: (p: Commuter) => void
  agree: (partnerId: string, contribution: number, days: Day[]) => void
  markAway: (day: Day) => void
  clearAway: () => void
  checkIn: () => void
  endArrangement: () => void
  reset: () => void
  matches: MatchResult[] // everyone on the other side, best first
}

const KEY = 'routemate-prototype-v1'
const EMPTY: State = { profile: null, arrangement: null }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

const StoreContext = createContext<Store | null>(null)

// Match the current person against everyone on the other side.
export function matchesFor(profile: Commuter | null, exclude: string[] = []): MatchResult[] {
  if (!profile) return []
  const results =
    profile.role === 'rider'
      ? DEMO_DRIVERS.filter((d) => !exclude.includes(d.id)).map((d) => matchPair(d, profile as Rider))
      : DEMO_RIDERS.filter((r) => !exclude.includes(r.id)).map((r) => matchPair(profile as Driver, r))
  return results.sort((a, b) => Number(b.ok) - Number(a.ok) || score(b) - score(a) || a.detour - b.detour)
}

export function partnerOf(m: MatchResult, profile: Commuter): Commuter {
  return profile.role === 'rider' ? m.driver : m.rider
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: the demo still works for this visit */
    }
  }, [state])

  const store = useMemo<Store>(() => {
    const update = (fn: (s: State) => State) => setState(fn)
    return {
      ...state,
      matches: matchesFor(state.profile),
      saveProfile: (profile) => update(() => ({ profile, arrangement: null })),
      agree: (partnerId, contribution, days) =>
        update((s) => ({ ...s, arrangement: { partnerId, contribution, days, checkedIn: false, away: null } })),
      markAway: (day) =>
        update((s) => {
          if (!s.arrangement || !s.profile) return s
          // Rider: find another driver for that day.
          // Driver: find another driver who can take your rider that day.
          let backupId: string | null = null
          if (s.profile.role === 'rider') {
            const backup = matchesFor(s.profile, [s.arrangement.partnerId]).find((m) => m.ok && m.sharedDays.includes(day))
            backupId = backup ? backup.driver.id : null
          } else {
            const rider = DEMO_RIDERS.find((r) => r.id === s.arrangement!.partnerId)
            const driver = s.profile
            const backup = rider && DEMO_DRIVERS.map((d) => matchPair(d, rider))
              .find((m) => m.ok && m.sharedDays.includes(day) && meetsRidePreference(driver, [m.driver, rider]))
            backupId = backup ? backup.driver.id : null
          }
          return { ...s, arrangement: { ...s.arrangement, away: { day, backupId } } }
        }),
      clearAway: () => update((s) => (s.arrangement ? { ...s, arrangement: { ...s.arrangement, away: null } } : s)),
      checkIn: () => update((s) => (s.arrangement ? { ...s, arrangement: { ...s.arrangement, checkedIn: true } } : s)),
      endArrangement: () => update((s) => ({ ...s, arrangement: null })),
      reset: () => update(() => EMPTY),
    }
  }, [state])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const s = useContext(StoreContext)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
