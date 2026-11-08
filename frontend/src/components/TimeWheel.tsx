import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

// Drag-to-pick time: hour, minutes (in `step`-minute intervals) and AM/PM wheels.
// Touch and trackpads scroll natively with snap points; a mouse can drag; each wheel
// is a spinbutton, so arrow keys work too. Times are minutes after midnight.

const ROW = 44 // keep in sync with --wheel-row in components.css

export function Wheel({ label, items, index, onChange, min = 0 }: { label: string; items: string[]; index: number; onChange: (i: number) => void; min?: number }) {
  const el = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(index) // row under the band while scrolling
  const latest = useRef({ index, onChange })
  const settle = useRef(0)
  const drag = useRef<{ y: number; top: number; moved: boolean } | null>(null)
  const usedMouse = useRef(false) // mouse clicks are handled on release, taps by onClick

  useEffect(() => {
    latest.current = { index, onChange }
  })

  // Line up with the value from outside (first render, keyboard, other wheels).
  // That scroll is ours, so it must never be saved back as a new choice.
  const selfScroll = useRef(false)
  useEffect(() => {
    const node = el.current
    if (node && Math.round(node.scrollTop / ROW) !== index) {
      selfScroll.current = true
      node.scrollTop = index * ROW
    }
  }, [index])

  useEffect(() => () => window.clearTimeout(settle.current), [])

  const clamp = (i: number) => Math.max(0, Math.min(items.length - 1, i))
  const rowAt = () => clamp(Math.round((el.current?.scrollTop ?? 0) / ROW))

  const commitSoon = () => {
    window.clearTimeout(settle.current)
    settle.current = window.setTimeout(() => {
      const i = rowAt()
      if (i !== latest.current.index) latest.current.onChange(i)
    }, 140)
  }

  const onScroll = () => {
    setLive(rowAt())
    if (selfScroll.current) {
      selfScroll.current = false
      return
    }
    if (!drag.current) commitSoon()
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    usedMouse.current = e.pointerType === 'mouse'
    if (!usedMouse.current || !el.current) return // touch scrolls natively
    drag.current = { y: e.clientY, top: el.current.scrollTop, moved: false }
    el.current.setPointerCapture(e.pointerId)
    el.current.classList.add('is-dragging')
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || !el.current) return
    if (Math.abs(e.clientY - d.y) > 4) d.moved = true
    el.current.scrollTop = d.top - (e.clientY - d.y)
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || !el.current) return
    drag.current = null
    el.current.classList.remove('is-dragging')
    if (!d.moved) {
      // A click: the column holds the pointer, so find the row under it ourselves.
      const y = e.clientY - el.current.getBoundingClientRect().top + el.current.scrollTop
      go(Math.floor(y / ROW) - 2) // two rows of padding above the first item
      return
    }
    const i = rowAt()
    el.current.scrollTo({ top: i * ROW, behavior: 'smooth' })
    if (i !== latest.current.index) latest.current.onChange(i)
  }

  const go = (i: number) => {
    const next = clamp(i)
    if (next !== index) onChange(next)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowUp: index - 1, ArrowDown: index + 1, PageUp: index - 3, PageDown: index + 3, Home: 0, End: items.length - 1 }
    if (e.key in moves) {
      e.preventDefault()
      go(moves[e.key])
    }
  }

  return (
    <div
      ref={el}
      className="wheel"
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={min + items.length - 1}
      aria-valuenow={min + index}
      aria-valuetext={items[index]}
      onScroll={onScroll}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      {items.map((t, i) => (
        <div
          key={t}
          className={`wheel__item${i === live ? ' is-selected' : ''}`}
          aria-hidden="true"
          onClick={() => {
            if (!usedMouse.current) go(i)
          }}
        >
          {t}
        </div>
      ))}
    </div>
  )
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1))

export function TimeWheel({ label, value, onChange, step = 5 }: { label: string; value: number; onChange: (minutes: number) => void; step?: number }) {
  const minutes = Array.from({ length: 60 / step }, (_, i) => String(i * step).padStart(2, '0'))
  const v = Math.round(value / step) * step
  const h24 = Math.floor(v / 60) % 24
  const hourIdx = (h24 % 12 || 12) - 1
  const minIdx = (v % 60) / step
  const pm = h24 >= 12
  const set = (h: number, m: number, isPm: boolean) => onChange((((h + 1) % 12) + (isPm ? 12 : 0)) * 60 + m * step)

  return (
    <div className="time-wheel" role="group" aria-label={label}>
      <span className="time-wheel__band" aria-hidden="true" />
      <Wheel label="Hour" items={HOURS} index={hourIdx} onChange={(h) => set(h, minIdx, pm)} />
      <span className="time-wheel__colon" aria-hidden="true">
        :
      </span>
      <Wheel label="Minutes" items={minutes} index={minIdx} onChange={(m) => set(hourIdx, m, pm)} />
      <Wheel label="AM or PM" items={['AM', 'PM']} index={pm ? 1 : 0} onChange={(p) => set(hourIdx, minIdx, p === 1)} />
    </div>
  )
}
