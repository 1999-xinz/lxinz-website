type ThemeToggleProps = {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="nav-action"
      onClick={onToggle}
      aria-label={isDark ? '切换到白天模式' : '切换到夜间模式'}
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}
