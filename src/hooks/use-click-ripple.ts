import { useEffect } from 'react'

export function useClickRipple() {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return
      }

      if (event.pointerType === 'touch') {
        return
      }

      const ripple = document.createElement('span')
      ripple.className = 'cursor-ripple'
      ripple.style.left = `${event.clientX}px`
      ripple.style.top = `${event.clientY}px`

      const remove = () => {
        ripple.removeEventListener('animationend', remove)
        ripple.remove()
      }

      ripple.addEventListener('animationend', remove)
      document.body.appendChild(ripple)
    }

    document.addEventListener('pointerdown', handlePointerDown, {
      passive: true,
    })

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])
}
