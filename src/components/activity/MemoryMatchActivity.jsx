import { useEffect, useMemo, useState } from 'react'
import ActivityScriptPanel from './ActivityScriptPanel'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function buildInitialState(question) {
  const cards = (question.pairs ?? []).flatMap((pair) => [
    { cardId: `${pair.id}-a`, pairId: pair.id, label: pair.label },
    { cardId: `${pair.id}-b`, pairId: pair.id, label: pair.label },
  ])

  return {
    deck: shuffle(cards),
    solvedPairIds: [],
    classifications: {},
  }
}

function MemoryMatchActivity({ question, value, onChange }) {
  const [flippedCardIds, setFlippedCardIds] = useState([])
  const [pendingPairId, setPendingPairId] = useState(null)
  const [classificationError, setClassificationError] = useState('')
  const [mismatchPair, setMismatchPair] = useState([])
  const [showIntro, setShowIntro] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)

  const safeValue = useMemo(() => {
    if (value?.deck?.length) return value
    return buildInitialState(question)
  }, [question, value])

  const pairMap = useMemo(
    () => Object.fromEntries((question.pairs ?? []).map((pair) => [pair.id, pair])),
    [question.pairs]
  )

  useEffect(() => {
    if (!value?.deck?.length) {
      onChange(safeValue)
    }
  }, [onChange, safeValue, value])

  useEffect(() => {
    setShowIntro(true)
    setShowCompletion(false)
  }, [question.id])

  const solvedPairIds = safeValue.solvedPairIds ?? []
  const deck = safeValue.deck ?? []
  const allSolved = solvedPairIds.length === (question.pairs?.length ?? 0)
  const script = question.script ?? {}

  function updateValue(updates) {
    onChange({
      ...safeValue,
      ...updates,
    })
  }

  function handleCardClick(card) {
    if (pendingPairId) return
    if (flippedCardIds.includes(card.cardId)) return
    if (solvedPairIds.includes(card.pairId)) return
    if (flippedCardIds.length >= 2) return

    const nextFlipped = [...flippedCardIds, card.cardId]
    setFlippedCardIds(nextFlipped)

    if (nextFlipped.length !== 2) return

    const [firstId, secondId] = nextFlipped
    const firstCard = deck.find((item) => item.cardId === firstId)
    const secondCard = deck.find((item) => item.cardId === secondId)

    if (firstCard?.pairId === secondCard?.pairId) {
      window.setTimeout(() => {
        setPendingPairId(firstCard?.pairId ?? null)
      }, 280)
      return
    }

    setMismatchPair(nextFlipped)
    window.setTimeout(() => {
      setFlippedCardIds([])
      setMismatchPair([])
    }, 900)
  }

  function handleClassification(choice) {
    if (!pendingPairId) return

    const pair = pairMap[pendingPairId]
    if (!pair) return

    if (choice !== pair.classification) {
      setClassificationError('That classification is not correct yet. Choose again to unlock the pair.')
      return
    }

    updateValue({
      solvedPairIds: [...solvedPairIds, pendingPairId],
      classifications: {
        ...(safeValue.classifications ?? {}),
        [pendingPairId]: choice,
      },
    })
    setClassificationError('')
    setPendingPairId(null)
    setFlippedCardIds([])
    if (solvedPairIds.length + 1 === (question.pairs?.length ?? 0)) {
      setShowCompletion(true)
    }
  }

  function handleReset() {
    onChange(buildInitialState(question))
    setFlippedCardIds([])
    setPendingPairId(null)
    setClassificationError('')
    setMismatchPair([])
  }

  if (showIntro && script.opening) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.opening.title}
        lines={script.opening.lines}
        titleAudioSrc={script.opening.titleAudioSrc}
        lineAudioSrcs={script.opening.lineAudioSrcs}
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
        titleAudioSrc={script.completion.titleAudioSrc}
        lineAudioSrcs={script.completion.lineAudioSrcs}
        ctaLabel={script.completion.ctaLabel || 'Continue'}
        onContinue={null}
        tone="blue"
      />
    )
  }

  return (
    <section className="story-activity-card space-y-5 rounded-[1rem] p-5 sm:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-black text-white sm:text-xl">{question.question}</h2>
        <p className="max-w-3xl text-sm leading-6 text-white/80 sm:leading-7">
          {question.instruction}
        </p>
      </div>

      <div className="rounded-none border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.88))] p-3 sm:rounded-[1rem] sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
          <span className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/60">
            Memory match board
          </span>
          <span className="text-right text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/60">
            {solvedPairIds.length} / {question.pairs?.length ?? 0} pairs unlocked
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {deck.map((card) => {
            const isSolved = solvedPairIds.includes(card.pairId)
            const isFlipped = isSolved || flippedCardIds.includes(card.cardId)
            const isMismatch = mismatchPair.includes(card.cardId)

            return (
              <button
                key={card.cardId}
                type="button"
                className="interactive-button group aspect-[0.78] [perspective:1000px]"
                onClick={() => handleCardClick(card)}
                disabled={isSolved || Boolean(pendingPairId)}
              >
                <div
                  className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div
                    className={`absolute inset-0 flex items-center justify-center border p-1.5 text-center [backface-visibility:hidden] transition ${
                      isMismatch
                        ? 'border-red-300/55 bg-[linear-gradient(180deg,rgba(127,29,29,0.92),rgba(69,10,10,0.95))]'
                        : 'border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] group-hover:border-sky-300/45'
                    } rounded-none sm:rounded-[0.85rem]`}
                  >
                    <span className="text-xl font-black text-white/34 sm:text-2xl">?</span>
                  </div>

                  <div
                    className={`absolute inset-0 flex items-center justify-center border p-1.5 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] transition ${
                      isSolved
                        ? 'border-emerald-300/55 bg-[linear-gradient(180deg,rgba(6,78,59,0.95),rgba(2,44,34,0.98))] text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.16)]'
                        : isMismatch
                          ? 'border-red-300/55 bg-[linear-gradient(180deg,rgba(127,29,29,0.95),rgba(69,10,10,0.98))] text-white'
                          : 'border-amber-300/55 bg-[linear-gradient(180deg,rgba(120,53,15,0.95),rgba(68,28,8,0.98))] text-white shadow-[0_0_18px_rgba(251,191,36,0.12)]'
                    } rounded-none sm:rounded-[0.85rem]`}
                  >
                    <span className="text-[0.68rem] font-black leading-tight sm:text-sm md:text-base">
                      {card.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {pendingPairId ? (
          <div className="mt-5 rounded-[1rem] border border-amber-300/35 bg-amber-400/10 p-4">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-100/85">
              Classification prompt
            </p>
            <p className="mt-2 text-base font-semibold text-white">
              What kind of subset does <span className="font-black">{pairMap[pendingPairId]?.label}</span> belong to?
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="outline-magic-button interactive-button rounded-full px-4 py-2 text-sm font-bold text-white"
                onClick={() => handleClassification('Rational Number')}
              >
                Rational Number
              </button>
              <button
                type="button"
                className="outline-magic-button interactive-button rounded-full px-4 py-2 text-sm font-bold text-white"
                onClick={() => handleClassification('Irrational Number')}
              >
                Irrational Number
              </button>
            </div>
            {classificationError ? (
              <p className="mt-3 text-sm font-semibold text-red-200">{classificationError}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="outline-magic-button interactive-button rounded-full px-4 py-2 text-sm font-bold text-white"
            onClick={handleReset}
          >
            Restart board
          </button>
          {allSolved ? (
            <span className="rounded-full border border-emerald-300/45 bg-emerald-500/12 px-4 py-2 text-sm font-bold text-emerald-100">
              All pairs matched and classified
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default MemoryMatchActivity
