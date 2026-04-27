import { useEffect, useRef, useState } from 'react'

const INTRO_LINES = [
  {
    prompt: 'lxinz@website:~$',
    command: 'pnpm run dev',
  },
  {
    output: 'Portfolio runtime booting...',
  },
  {
    output: 'Mounting blog routes...',
  },
  {
    output: 'Linking canvas modules...',
  },
  {
    output: 'Streaming interactive playground...',
  },
  {
    output: 'System ready: welcome to lxinz.blog',
  },
]

const INTRO_COMPLETE_DELAY = 950

type IntroGateProps = {
  children: React.ReactNode
}

export function IntroGate({ children }: IntroGateProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)
  const [visibleLength, setVisibleLength] = useState(0)
  const isSkippingRef = useRef(false)

  const completeIntro = () => {
    isSkippingRef.current = true
    setIsComplete(true)
  }

  useEffect(() => {
    if (isComplete || isSkippingRef.current) {
      return undefined
    }

    const currentLine = INTRO_LINES[lineIndex]
    const currentText = currentLine.prompt
      ? `${currentLine.prompt} ${currentLine.command}`
      : currentLine.output

    if (!currentText) {
      return undefined
    }

    if (visibleLength < currentText.length) {
      const typingTimer = window.setTimeout(() => {
        setVisibleLength((currentLength) => currentLength + 1)
      }, 34)

      return () => {
        window.clearTimeout(typingTimer)
      }
    }

    if (lineIndex < INTRO_LINES.length - 1) {
      const nextLineTimer = window.setTimeout(() => {
        setLineIndex((currentLineIndex) => currentLineIndex + 1)
        setVisibleLength(0)
      }, 220)

      return () => {
        window.clearTimeout(nextLineTimer)
      }
    }

    const completeTimer = window.setTimeout(() => {
      setIsComplete(true)
    }, INTRO_COMPLETE_DELAY)

    return () => {
      window.clearTimeout(completeTimer)
    }
  }, [isComplete, lineIndex, visibleLength])

  if (isComplete) {
    return children
  }

  const renderedLines = INTRO_LINES.map((line, index) => {
    if (index > lineIndex) {
      return {
        command: '',
        output: '',
        prompt: line.prompt ?? '',
      }
    }

    if (index < lineIndex) {
      return {
        command: line.command ?? '',
        output: line.output ?? '',
        prompt: line.prompt ?? '',
      }
    }

    if (line.prompt) {
      const promptLength = line.prompt.length + 1

      return {
        command:
          visibleLength > promptLength
            ? (line.command ?? '').slice(0, visibleLength - promptLength)
            : '',
        output: '',
        prompt: line.prompt,
      }
    }

    return {
      command: '',
      output: (line.output ?? '').slice(0, visibleLength),
      prompt: '',
    }
  })

  return (
    <div className="intro-gate" role="presentation">
      <div className="intro-grid" />
      <button
        type="button"
        className="intro-skip"
        onPointerDown={(event) => {
          event.preventDefault()
          event.stopPropagation()
          completeIntro()
        }}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          completeIntro()
        }}
      >
        Skip Animation &raquo;
      </button>
      <div className="intro-panel">
        <div className="intro-screen">
          {renderedLines.map((text, index) => {
            const line = INTRO_LINES[index]
            const isCurrentLine = index === lineIndex

            return (
              <p
                key={`${index}-${line.prompt ?? line.output ?? 'intro-line'}`}
                className={
                  line.prompt ? 'intro-line intro-line-command' : 'intro-line'
                }
              >
                {line.prompt ? (
                  <>
                    <span className="intro-prompt">{text.prompt}</span>{' '}
                    <span className="intro-command">{text.command}</span>
                  </>
                ) : (
                  <span>{text.output}</span>
                )}

                {isCurrentLine ? <span className="intro-cursor" /> : null}
              </p>
            )
          })}
        </div>

        <div className="intro-footer">
          <p className="intro-hint">Initializing motion system...</p>
          <p className="intro-mark">LXINZ BLOG / REACT / CANVAS / PLAYGROUND</p>
        </div>
        <div className="intro-glow" />
      </div>
    </div>
  )
}
