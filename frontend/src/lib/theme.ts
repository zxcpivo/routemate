// Light / dark mode. The page always carries data-theme="light" or "dark" on <html>,
// set by the inline script in index.html before first paint. A saved choice wins;
// without one the theme follows the device setting.

export type Theme = 'light' | 'dark'

const KEY = 'routemate-theme'

function saved(): Theme | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

const system = (): Theme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export const currentTheme = (): Theme => (document.documentElement.dataset.theme as Theme) ?? system()

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* storage unavailable: the switch still works for this visit */
  }
}

// Keep following the device setting until someone picks a theme.
export function followSystemTheme() {
  document.documentElement.dataset.theme = saved() ?? system()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!saved()) document.documentElement.dataset.theme = system()
  })
}
