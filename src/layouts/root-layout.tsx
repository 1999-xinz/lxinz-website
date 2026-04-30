import { Outlet, useLocation } from 'react-router-dom'
import { FloatingOrbNav } from '../components/floating-orb-nav'
import { IntroGate } from '../components/intro-gate'
import { ParticleNetworkBg } from '../components/particle-network-bg'
import { ThemeToggle } from '../components/theme-toggle'

export function RootLayout() {
  const location = useLocation()
  const isBlogModule =
    location.pathname === '/' ||
    location.pathname === '/blog' ||
    location.pathname.startsWith('/posts/')
  const shouldHideHeader = isBlogModule

  return (
    <IntroGate>
      <div
        className={isBlogModule ? 'site-shell site-shell-blog' : 'site-shell'}
      >
        <ParticleNetworkBg />
        <FloatingOrbNav />

        {shouldHideHeader ? null : (
          <header className="site-header">
            <div>
              <p className="eyebrow">Lxinz Blog</p>
              <h1 className="site-title">Canvas, Motion, Code.</h1>
            </div>
            <p className="site-summary">
              一个用于放置博客、视觉实验、交互动画与游戏小作品的前端站点。
            </p>
          </header>
        )}

        <main
          className={isBlogModule ? 'page-shell page-shell-blog' : 'page-shell'}
        >
          <Outlet />
        </main>

        <ThemeToggle />
      </div>
    </IntroGate>
  )
}
