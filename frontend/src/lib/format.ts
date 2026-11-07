// Minutes after midnight <-> "8:45 AM" / "08:45".

export function formatTime(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const mm = String(m % 60).padStart(2, '0')
  const suffix = h24 < 12 ? 'AM' : 'PM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${mm} ${suffix}`
}

export function toInputTime(minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0')
  const m = String(minutes % 60).padStart(2, '0')
  return `${h}:${m}`
}

export function fromInputTime(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
}

export function formatMoney(dollars: number): string {
  return `$${dollars.toFixed(2)}`
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatDays(days: readonly string[]): string {
  return days.length === 0 ? 'No days' : days.join(' · ')
}
