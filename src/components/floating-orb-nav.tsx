import { NavLink } from 'react-router-dom'
import { ThemeToggle } from './theme-toggle'

type FloatingOrbNavProps = {
  isDark: boolean
  onToggleTheme: () => void
}

export function FloatingOrbNav({ isDark, onToggleTheme }: FloatingOrbNavProps) {
  return (
    <details className="orb-nav">
      <summary className="orb-trigger" aria-label="展开导航">
        <span className="orb-core">LX</span>
      </summary>

      <div className="orb-panel">
        <p className="orb-label">Navigate</p>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'orb-link orb-link-active' : 'orb-link'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'orb-link orb-link-active' : 'orb-link'
          }
        >
          About
        </NavLink>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </details>
  )
}
