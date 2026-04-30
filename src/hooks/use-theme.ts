import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'lxinz-blog-theme'

function getPreferredTheme() {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    getPreferredTheme(),
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return {
    isDark: theme === 'dark',
    theme,
    toggleTheme: () => {
      setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
    },
  }
}
