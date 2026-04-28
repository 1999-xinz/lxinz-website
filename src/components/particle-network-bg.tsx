import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

const BASE_PARTICLES = 72
const MOBILE_PARTICLES = 42
const MAX_DPR = 1.5
const PARTICLE_SPEED = 0.18
const LINK_DISTANCE = 132
const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE

function readThemeAccentColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim()
}

export function ParticleNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const mediaReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    if (mediaReducedMotion.matches) {
      return undefined
    }

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) {
      return undefined
    }

    const isMobile = window.matchMedia('(max-width: 900px)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const particleCount = isMobile ? MOBILE_PARTICLES : BASE_PARTICLES

    let width = 0
    let height = 0
    let rafId = 0
    let isRunning = true
    let accent = readThemeAccentColor() || '#12624f'
    let strokeColor = accent
    let fillColor = accent

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() * 2 - 1) * PARTICLE_SPEED,
      vy: (Math.random() * 2 - 1) * PARTICLE_SPEED,
      r: 0.8 + Math.random() * 1.5,
    }))

    const placeParticles = () => {
      for (const particle of particles) {
        particle.x = Math.random() * width
        particle.y = Math.random() * height
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      placeParticles()
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x <= 0 || particle.x >= width) {
          particle.vx *= -1
        }

        if (particle.y <= 0 || particle.y >= height) {
          particle.vy *= -1
        }
      }

      context.strokeStyle = strokeColor

      for (let index = 0; index < particles.length; index += 1) {
        const source = particles[index]

        for (let next = index + 1; next < particles.length; next += 1) {
          const target = particles[next]
          const dx = source.x - target.x
          const dy = source.y - target.y
          const distanceSq = dx * dx + dy * dy

          if (distanceSq > LINK_DISTANCE_SQ) {
            continue
          }

          const alpha = 1 - distanceSq / LINK_DISTANCE_SQ
          context.globalAlpha = alpha * 0.38
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(source.x, source.y)
          context.lineTo(target.x, target.y)
          context.stroke()
        }
      }

      context.fillStyle = fillColor

      for (const particle of particles) {
        context.globalAlpha = 0.72
        context.beginPath()
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
        context.fill()
      }

      context.globalAlpha = 1

      if (isRunning) {
        rafId = window.requestAnimationFrame(draw)
      }
    }

    const restart = () => {
      accent = readThemeAccentColor() || '#12624f'
      strokeColor = accent
      fillColor = accent
      if (!isRunning) {
        isRunning = true
      }
      window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(draw)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false
        window.cancelAnimationFrame(rafId)
        return
      }
      restart()
    }

    const onResize = () => {
      resize()
      restart()
    }

    const onThemeMutation = () => {
      accent = readThemeAccentColor() || '#12624f'
      strokeColor = accent
      fillColor = accent
    }

    const observer = new MutationObserver(onThemeMutation)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    resize()
    restart()

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('resize', onResize)

    return () => {
      isRunning = false
      window.cancelAnimationFrame(rafId)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      className="particle-network-bg"
      ref={canvasRef}
      aria-hidden="true"
    />
  )
}
