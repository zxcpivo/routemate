import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { placeById, type Place } from '../data/places'
import { Icon, type IconName } from './Icon'

// Type-ahead search over a local list of public places (stations, malls, campuses).
// Follows the ARIA combobox pattern: arrow keys move, Enter picks, Escape closes.

const MAX_RESULTS = 6

function matches(p: Place, words: string[]) {
  const text = `${p.area} ${p.name}`.toLowerCase()
  return words.every((w) => text.includes(w))
}

export function PlaceSearch({
  label,
  labelledBy,
  hint,
  value,
  onChange,
  options,
  icon = 'pin',
  placeholder,
}: {
  label?: string
  labelledBy?: string // use an existing heading as the label instead
  hint?: string
  value: string // place id
  onChange: (id: string) => void
  options: Place[] // in the order to suggest them
  icon?: IconName
  placeholder?: string
}) {
  const id = useId()
  const listId = `${id}-list`
  const hintId = hint ? `${id}-hint` : undefined
  const selected = value ? placeById(value) : null
  const [query, setQuery] = useState<string | null>(null) // null = not typing, show the selected place
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const results = useMemo(() => {
    const words = (query ?? '').toLowerCase().split(/\s+/).filter(Boolean)
    return options.filter((p) => matches(p, words)).slice(0, MAX_RESULTS)
  }, [query, options])

  const pick = (p: Place) => {
    onChange(p.id)
    setQuery(null)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) return setOpen(true)
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + step + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter' && open) {
      e.preventDefault() // don't submit the step
      if (results[active]) pick(results[active])
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      setOpen(false)
      setQuery(null)
    }
  }

  const showList = open && results.length > 0
  const noResults = open && query && results.length === 0

  return (
    <div className="field place-search">
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="place-search__box">
        <span className="place-search__icon" aria-hidden="true">
          <Icon name={icon} size={18} />
        </span>
        <input
          id={id}
          className="input place-search__input"
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-labelledby={labelledBy}
          aria-describedby={hintId}
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList ? `${listId}-${active}` : undefined}
          placeholder={placeholder}
          value={query ?? selected?.area ?? ''}
          onFocus={(e) => {
            e.target.select()
            setActive(0)
            setOpen(true)
          }}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onBlur={() => {
            setOpen(false)
            setQuery(null)
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <ul className="place-search__list" id={listId} role="listbox" hidden={!showList}>
        {results.map((p, i) => (
          <li
            key={p.id}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            className={`place-search__option${i === active ? ' is-active' : ''}`}
            onMouseDown={(e) => e.preventDefault()} // keep focus so blur doesn't close first
            onMouseEnter={() => setActive(i)}
            onClick={() => pick(p)}
          >
            <Icon name={p.kind === 'destination' ? 'flag' : 'pin'} size={16} />
            <span>
              <strong>{p.area}</strong>
              <span>{p.name}</span>
            </span>
          </li>
        ))}
      </ul>
      {noResults && (
        <span className="field__hint" role="status">
          No place matches “{query}”. Try a station, mall or campus, or drag the pin on the map.
        </span>
      )}
      {hint && !noResults && (
        <span className="field__hint" id={hintId}>
          {hint}
        </span>
      )}
    </div>
  )
}
