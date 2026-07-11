import { useEffect, useMemo, useRef, useState } from 'react'
import sampleBackground from '../../assets/sample_background.png'
import ActivityScriptPanel from './ActivityScriptPanel'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function createInitialState(cards = []) {
  return {
    order: shuffle(cards.map((card) => card.id)),
    responses: {},
    failedAttempts: 0,
  }
}

function GatekeeperActivity({ question, value, onChange }) {
  const cards = question.cards ?? []
  const cardMap = useMemo(
    () => Object.fromEntries(cards.map((card) => [card.id, card])),
    [cards]
  )
  const safeValue = value?.order ? value : createInitialState(cards)
  const [feedback, setFeedback] = useState('')
  const [dragX, setDragX] = useState(0)
  const [animating, setAnimating] = useState(null)
  const [sceneFlash, setSceneFlash] = useState(null)
  const [showIntro, setShowIntro] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)
  const pointerStartRef = useRef(null)

  useEffect(() => {
    if (!value?.order) {
      onChange(safeValue)
    }
  }, [onChange, safeValue, value])

  useEffect(() => {
    setShowIntro(true)
    setShowCompletion(false)
  }, [question.id])

  const currentIndex = Object.keys(safeValue.responses ?? {}).length
  const currentCardId = safeValue.order?.[currentIndex]
  const currentCard = currentCardId ? cardMap[currentCardId] : null
  const completed = currentIndex >= cards.length
  const deckPreview = (safeValue.order ?? [])
    .slice(currentIndex, currentIndex + 3)
    .map((cardId) => cardMap[cardId])
    .filter(Boolean)

  function restartDeck(message) {
    onChange({
      ...createInitialState(cards),
      failedAttempts: (safeValue.failedAttempts ?? 0) + 1,
    })
    setFeedback(message)
    setDragX(0)
    setAnimating(null)
    pointerStartRef.current = null
  }

  function commitCorrectAction(action) {
    if (!currentCard) return

    const nextResponses = {
      ...(safeValue.responses ?? {}),
      [currentCard.id]: action,
    }

    onChange({
      ...safeValue,
      responses: nextResponses,
    })

    setFeedback(
      Object.keys(nextResponses).length === cards.length
        ? question.successMessage || question.feedback || ''
        : ''
    )
    if (Object.keys(nextResponses).length === cards.length) {
      setShowCompletion(true)
    }
    setDragX(0)
    setAnimating(null)
    setSceneFlash('success')
    window.setTimeout(() => setSceneFlash(null), 220)
  }

  function handleAction(action) {
    if (!currentCard || completed || animating) return

    const direction = action === 'accept' ? 'right' : 'left'

    if (action !== currentCard.correctAction) {
      setAnimating(direction === 'right' ? 'wrong-right' : 'wrong-left')
      setSceneFlash('error')
      window.setTimeout(() => {
        setSceneFlash(null)
        restartDeck(question.incorrectFeedback)
      }, 520)
      return
    }

    setAnimating(direction)
    window.setTimeout(() => commitCorrectAction(action), 280)
  }

  function handlePointerDown(event) {
    if (completed || animating || !currentCard) return
    pointerStartRef.current = event.clientX
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {}
  }

  function handlePointerMove(event) {
    if (pointerStartRef.current == null || completed || animating) return
    const nextDrag = event.clientX - pointerStartRef.current
    setDragX(Math.max(-150, Math.min(150, nextDrag)))
  }

  function handlePointerEnd() {
    if (pointerStartRef.current == null || completed || animating) return

    const releasedDrag = dragX
    pointerStartRef.current = null

    if (releasedDrag >= 70) {
      handleAction('accept')
      return
    }

    if (releasedDrag <= -70) {
      handleAction('reject')
      return
    }

    setDragX(0)
  }

  const topCardStyle = (() => {
    if (animating === 'right') {
      return {
        transform: 'translateX(130%) rotate(16deg)',
        opacity: 0,
        transition: 'transform 260ms ease, opacity 260ms ease',
      }
    }

    if (animating === 'left') {
      return {
        transform: 'translateX(-130%) rotate(-16deg)',
        opacity: 0,
        transition: 'transform 260ms ease, opacity 260ms ease',
      }
    }

    if (animating === 'wrong-right') {
      return {
        transform: 'translateX(18px) rotate(4deg)',
        transition: 'transform 90ms ease',
      }
    }

    if (animating === 'wrong-left') {
      return {
        transform: 'translateX(-18px) rotate(-4deg)',
        transition: 'transform 90ms ease',
      }
    }

    return {
      transform: `translateX(${dragX}px) rotate(${dragX / 18}deg)`,
      transition: pointerStartRef.current == null ? 'transform 180ms ease' : 'none',
    }
  })()

  const acceptActive = dragX > 28 && !animating
  const rejectActive = dragX < -28 && !animating
  const script = question.script ?? {}

  if (showIntro && script.opening) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.opening.title}
        lines={script.opening.lines}
        ctaLabel={script.opening.ctaLabel || 'Start'}
        onContinue={() => setShowIntro(false)}
        tone="blue"
      />
    )
  }

  if (showCompletion && script.completion) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.completion.title}
        lines={script.completion.lines}
        lineAudioSrcs={script.completion.lineAudioSrcs}
        ctaLabel={script.completion.ctaLabel || 'Continue'}
        onContinue={null}
        tone="blue"
      />
    )
  }

  return (
    <section className="story-activity-card space-y-5 rounded-[1rem] p-4 sm:space-y-6 sm:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-black text-white sm:text-xl">{question.question}</h2>
        <p className="max-w-3xl text-sm leading-6 text-white/80 sm:leading-7">
          {question.instruction}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[1.15rem] border border-white/12 bg-slate-950/72 p-2.5 shadow-[0_26px_64px_rgba(2,6,23,0.42)] sm:p-4">
        <div
          className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.22), rgba(15,23,42,0.74)), url(${question.gateBackground || sampleBackground})`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(191,219,254,0.18),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.48))]" />
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              sceneFlash === 'error'
                ? 'bg-red-500/18 opacity-100'
                : sceneFlash === 'success'
                  ? 'bg-emerald-400/14 opacity-100'
                  : 'opacity-0'
            }`}
          />

          <div className="relative flex min-h-[26rem] flex-col justify-between p-3 sm:min-h-[34rem] sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
              <div className="self-center rounded-full border border-cyan-200/20 bg-slate-950/58 px-3 py-1.5 text-[0.64rem] font-black uppercase tracking-[0.24em] text-cyan-100 shadow-[0_0_18px_rgba(56,189,248,0.12)] sm:px-4 sm:py-2 sm:text-[0.72rem] sm:tracking-[0.28em]">
                Whole Number Gate
              </div>

              <div className="self-center rounded-full border border-white/12 bg-slate-950/42 px-3 py-1.5 text-center text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/72 sm:px-4 sm:py-2 sm:text-[0.72rem] sm:tracking-[0.2em]">
                Swipe right to accept · left to reject
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-4 sm:gap-6">
              <div className="relative flex h-56 w-full max-w-[14rem] items-center justify-center sm:h-72 sm:max-w-xs">
                {deckPreview.slice(1).reverse().map((card, reverseIndex) => {
                  const index = deckPreview.length - reverseIndex - 1
                  const depth = index

                  return (
                    <div
                      key={card.id}
                      className="absolute flex h-44 w-32 items-center justify-center rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(226,232,240,0.9))] shadow-[0_16px_30px_rgba(2,6,23,0.22)] sm:h-60 sm:w-44 sm:rounded-[1.1rem]"
                      style={{
                        transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.04}) rotate(${depth % 2 === 0 ? 2 : -2}deg)`,
                        opacity: Math.max(0.28, 1 - depth * 0.24),
                        zIndex: 10 - depth,
                      }}
                    >
                      <span className="text-3xl font-black text-slate-900/18 sm:text-5xl">
                        {card.label}
                      </span>
                    </div>
                  )
                })}

                {currentCard ? (
                  <div
                    key={currentCard.id}
                    className={`absolute z-30 flex h-48 w-36 touch-pan-y select-none items-center justify-center rounded-[1.05rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] text-slate-950 shadow-[0_24px_50px_rgba(2,6,23,0.34)] sm:h-64 sm:w-48 sm:rounded-[1.2rem] ${
                      animating?.startsWith('wrong') ? 'gate-card-shake' : ''
                    }`}
                    style={topCardStyle}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerEnd}
                    onPointerCancel={handlePointerEnd}
                    onPointerLeave={() => {
                      if (pointerStartRef.current != null) handlePointerEnd()
                    }}
                  >
                    <span className="text-4xl font-black tracking-[0.03em] sm:text-6xl">
                      {currentCard.label}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="grid w-full max-w-md grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  className={`interactive-button rounded-[0.95rem] border px-3 py-2.5 text-[0.78rem] font-black uppercase tracking-[0.14em] transition sm:px-4 sm:py-3 sm:text-sm sm:tracking-[0.18em] ${
                    rejectActive
                      ? 'border-red-200/60 bg-red-500/34 text-red-50 shadow-[0_0_22px_rgba(239,68,68,0.28)]'
                      : 'border-red-300/28 bg-red-500/16 text-red-50 hover:bg-red-500/24'
                  }`}
                  disabled={completed || Boolean(animating)}
                  onClick={() => handleAction('reject')}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className={`interactive-button rounded-[0.95rem] border px-3 py-2.5 text-[0.78rem] font-black uppercase tracking-[0.14em] transition sm:px-4 sm:py-3 sm:text-sm sm:tracking-[0.18em] ${
                    acceptActive
                      ? 'border-emerald-200/60 bg-emerald-500/34 text-emerald-50 shadow-[0_0_22px_rgba(16,185,129,0.28)]'
                      : 'border-emerald-300/28 bg-emerald-500/16 text-emerald-50 hover:bg-emerald-500/24'
                  }`}
                  disabled={completed || Boolean(animating)}
                  onClick={() => handleAction('accept')}
                >
                  Accept
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <p className="text-sm font-semibold leading-6 text-white/76">
                {completed
                  ? 'The gate trial is complete. Alvin can move forward.'
                  : 'Swipe the top card or use the buttons to judge each number.'}
              </p>
              <span className="self-start rounded-full border border-white/10 bg-slate-950/38 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/72 sm:self-auto sm:text-[0.72rem] sm:tracking-[0.18em]">
                {currentIndex} / {cards.length} cleared
              </span>
            </div>
          </div>
        </div>
      </div>

      {feedback ? (
        <p
          className={`rounded-[0.85rem] border px-4 py-3 text-sm font-semibold leading-6 ${
            completed
              ? 'border-emerald-300/35 bg-emerald-500/10 text-emerald-100'
              : 'border-red-300/35 bg-red-500/10 text-red-100'
          }`}
        >
          {feedback}
        </p>
      ) : null}
    </section>
  )
}

export default GatekeeperActivity
