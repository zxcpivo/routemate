// The HTML starts in light mode and restores a saved dark theme before first paint.

export type Theme = 'light' | 'dark'

const KEY = 'routemate-theme'

export const currentTheme = (): Theme => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* storage unavailable: the switch still works for this visit */
  }
}
