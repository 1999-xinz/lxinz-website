import { NavLink } from 'react-router-dom'

export function FloatingOrbNav() {
  return (
    <details className="orb-nav">
      <summary className="orb-trigger" aria-label="展开导航">
        <span className="orb-core">LX</span>
      </summary>

      <div className="orb-panel">
        <p className="orb-label">神秘入口</p>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'orb-link orb-link-active' : 'orb-link'
          }
        >
          首页
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            isActive ? 'orb-link orb-link-active' : 'orb-link'
          }
        >
          博客
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'orb-link orb-link-active' : 'orb-link'
          }
        >
          关于
        </NavLink>
      </div>
    </details>
  )
}
