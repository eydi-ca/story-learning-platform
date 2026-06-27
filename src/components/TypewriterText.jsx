import { useEffect, useRef, useState } from 'react'

function TypewriterText({
  text,
  speed = 18,
  durationMs = null,
  start = true,
  skip = 0,
  resetKey = 0,
  onComplete,
  showCursor = true,
}) {
  const [visibleText, setVisibleText] = useState('')
  const completedRef = useRef(false)
  const previousSkipRef = useRef(skip)
  const onCompleteRef = useRef(onComplete)
  const intervalRef = useRef(null)

  function clearTypingTimer() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    clearTypingTimer()
    completedRef.current = false
    setVisibleText('')

    if (!start) {
      return undefined
    }

    const totalDuration = Math.max(durationMs ?? text.length * speed, 0)

    if (!text.length || totalDuration === 0) {
      setVisibleText(text)
      if (!completedRef.current) {
        completedRef.current = true
        onCompleteRef.current?.()
      }
      return undefined
    }

    const startTime = window.performance.now()
    const stepMs = 20

    intervalRef.current = window.setInterval(() => {
      const elapsed = window.performance.now() - startTime
      const progress = Math.min(elapsed / totalDuration, 1)
      const nextLength = Math.min(text.length, Math.max(1, Math.ceil(progress * text.length)))

      setVisibleText((currentValue) => {
        if (currentValue.length === nextLength) {
          return currentValue
        }

        return text.slice(0, nextLength)
      })

      if (progress >= 1 || nextLength >= text.length) {
        clearTypingTimer()
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current?.()
        }
      }
    }, stepMs)

    return () => clearTypingTimer()
  }, [durationMs, resetKey, speed, start, text])

  useEffect(() => {
    if (previousSkipRef.current === skip) return
    previousSkipRef.current = skip
    if (!start) return
    if (visibleText === text) return
    clearTypingTimer()
    setVisibleText(text)
    if (!completedRef.current) {
      completedRef.current = true
      onCompleteRef.current?.()
    }
  }, [skip, start, text, visibleText])

  return (
    <span>
      {visibleText}
      {showCursor && visibleText.length < text.length ? (
        <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-current align-middle" />
      ) : null}
    </span>
  )
}

export default TypewriterText
