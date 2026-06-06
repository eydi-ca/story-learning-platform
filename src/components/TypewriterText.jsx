import { useEffect, useState } from 'react'

function TypewriterText({ text, speed = 18 }) {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
    let currentIndex = 0
    const timer = window.setInterval(() => {
      currentIndex += 1
      setVisibleText(text.slice(0, currentIndex))

      if (currentIndex >= text.length) {
        window.clearInterval(timer)
      }
    }, speed)

    return () => window.clearInterval(timer)
  }, [speed, text])

  return (
    <span>
      {visibleText}
      {visibleText.length < text.length ? (
        <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-current align-middle" />
      ) : null}
    </span>
  )
}

export default TypewriterText
