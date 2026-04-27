import { Outlet } from 'react-router-dom'
import { FloatingOrbNav } from '../components/floating-orb-nav'
import { IntroGate } from '../components/intro-gate'
import { useTheme } from '../hooks/use-theme'

export function RootLayout() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <IntroGate>
      <div className="site-shell">
        <FloatingOrbNav isDark={isDark} onToggleTheme={toggleTheme} />

        <header className="site-header">
          <div>
            <p className="eyebrow">Lxinz Blog</p>
            <h1 className="site-title">Canvas, Motion, Code.</h1>
          </div>
          <p className="site-summary">
            一个用于放置博客、视觉实验、交互动画与游戏小作品的前端站点。
          </p>
        </header>

        <main className="page-shell">
          <Outlet />
        </main>
      </div>
    </IntroGate>
  )
}
