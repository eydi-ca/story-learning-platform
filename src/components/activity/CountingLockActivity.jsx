import { useEffect, useMemo, useState } from 'react'
import ActivityScriptPanel from './ActivityScriptPanel'

function getRoundStatus(round, value = {}) {
  return round.slots.every((slot) => value[slot.id] === slot.answer)
}

function getFirstIncompleteRoundIndex(rounds, value = {}) {
  const index = rounds.findIndex((round) => !getRoundStatus(round, value))
  return index === -1 ? rounds.length - 1 : index
}

function getInitialChoice(slot) {
  const incorrectChoices = slot.choices.filter((choice) => choice !== slot.answer)
  const startingPool = incorrectChoices.length > 0 ? incorrectChoices : slot.choices
  return startingPool[Math.floor(Math.random() * startingPool.length)]
}

function getGlowTone(index, solved) {
  if (solved) {
    return 'text-emerald-300 drop-shadow-[0_0_3px_rgba(110,231,183,0.48)] [text-shadow:0_0_6px_rgba(110,231,183,0.5),0_0_14px_rgba(16,185,129,0.28)]'
  }

  const tones = [
    'text-orange-300 drop-shadow-[0_0_3px_rgba(253,186,116,0.5)] [text-shadow:0_0_6px_rgba(251,146,60,0.52),0_0_14px_rgba(249,115,22,0.28)]',
    'text-sky-300 drop-shadow-[0_0_3px_rgba(125,211,252,0.5)] [text-shadow:0_0_6px_rgba(56,189,248,0.52),0_0_14px_rgba(14,165,233,0.28)]',
    'text-lime-300 drop-shadow-[0_0_3px_rgba(190,242,100,0.5)] [text-shadow:0_0_6px_rgba(163,230,53,0.52),0_0_14px_rgba(132,204,22,0.28)]',
    'text-amber-200 drop-shadow-[0_0_3px_rgba(253,230,138,0.5)] [text-shadow:0_0_6px_rgba(250,204,21,0.52),0_0_14px_rgba(234,179,8,0.3)]',
    'text-fuchsia-300 drop-shadow-[0_0_3px_rgba(240,171,252,0.5)] [text-shadow:0_0_6px_rgba(232,121,249,0.52),0_0_14px_rgba(217,70,239,0.28)]',
    'text-cyan-300 drop-shadow-[0_0_3px_rgba(103,232,249,0.5)] [text-shadow:0_0_6px_rgba(34,211,238,0.52),0_0_14px_rgba(6,182,212,0.28)]',
  ]

  return tones[index % tones.length]
}

function CountingLockActivity({ question, value = {}, onChange, onRoundChange = null }) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [screen, setScreen] = useState('opening')
  const [rollingSlots, setRollingSlots] = useState({})
  const rounds = question.rounds ?? []

  const unlockedRoundIndex = useMemo(
    () => getFirstIncompleteRoundIndex(rounds, value),
    [rounds, value]
  )
  const currentRound = rounds[currentRoundIndex] ?? null
  const currentRoundComplete = currentRound ? getRoundStatus(currentRound, value) : false
  const finalRound = currentRoundIndex === rounds.length - 1
  const slotCount = currentRound?.slots?.length ?? 0

  useEffect(() => {
    onRoundChange?.(currentRoundIndex)
  }, [currentRoundIndex, onRoundChange])

  useEffect(() => {
    setCurrentRoundIndex((current) => Math.min(current, unlockedRoundIndex))
  }, [unlockedRoundIndex])

  useEffect(() => {
    setScreen('opening')
  }, [question.id])

  useEffect(() => {
    if (!currentRound) return undefined

    const missingSlots = currentRound.slots.filter((slot) => !value[slot.id])
    if (missingSlots.length === 0) return undefined

    const nextValues = { ...value }
    let changed = false

    missingSlots.forEach((slot) => {
      nextValues[slot.id] = getInitialChoice(slot)
      changed = true
    })

    if (changed) {
      onChange(nextValues)
    }

    return undefined
  }, [currentRound, onChange, value])

  function rotateSlot(slot, direction) {
    if (!currentRound || currentRoundComplete) return

    const currentChoice = value[slot.id] ?? slot.choices[0]
    const currentIndex = slot.choices.findIndex((choice) => choice === currentChoice)
    const safeIndex = currentIndex === -1 ? 0 : currentIndex
    const nextIndex =
      direction === 'up'
        ? (safeIndex - 1 + slot.choices.length) % slot.choices.length
        : (safeIndex + 1) % slot.choices.length
    const nextChoice = slot.choices[nextIndex]

    setRollingSlots((current) => ({
      ...current,
      [slot.id]: {
        direction,
        token: Date.now(),
      },
    }))

    onChange({
      ...value,
      [slot.id]: nextChoice,
    })

    if (
      currentRound.slots.every((roundSlot) => {
        const candidate = roundSlot.id === slot.id ? nextChoice : value[roundSlot.id]
        return candidate === roundSlot.answer
      })
    ) {
      setFeedback('')
      return
    }

    setFeedback('Keep rolling each slot until only counting numbers remain in the lock.')
  }

  if (!currentRound) return null

  const script = question.script ?? {}
  const roundIntro = script.rounds?.[currentRoundIndex]
  const roundSuccess = script.roundSuccess?.[currentRoundIndex]

  if (screen === 'opening' && script.opening) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.opening.title}
        lines={script.opening.lines}
        lineAudioSrcs={script.opening.lineAudioSrcs}
        ctaLabel={script.opening.ctaLabel || 'Start'}
        onContinue={() => setScreen('round-intro')}
        tone="blue"
      />
    )
  }

  if (screen === 'round-intro' && roundIntro) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={roundIntro.title}
        lines={roundIntro.lines}
        lineAudioSrcs={roundIntro.lineAudioSrcs}
        ctaLabel={roundIntro.ctaLabel || 'Begin round'}
        onContinue={() => setScreen('playing')}
        tone="blue"
      />
    )
  }

  if (screen === 'between-rounds' && roundSuccess) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={roundSuccess.title}
        lines={roundSuccess.lines}
        lineAudioSrcs={roundSuccess.lineAudioSrcs}
        ctaLabel={roundSuccess.ctaLabel || 'Continue'}
        onContinue={() => {
          setCurrentRoundIndex((current) => Math.min(current + 1, rounds.length - 1))
          setScreen('round-intro')
        }}
        tone="blue"
      />
    )
  }

  if (screen === 'complete' && script.completion) {
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

  const numberSizeClass =
    slotCount >= 6
      ? 'text-[1.55rem] sm:text-[2.2rem] lg:text-5xl'
      : slotCount === 5
        ? 'text-[1.9rem] sm:text-[2.5rem] lg:text-5xl'
        : 'text-[2.2rem] sm:text-[2.9rem] lg:text-5xl'
  const arrowButtonClass =
    slotCount >= 5
      ? 'h-8 w-8 text-sm sm:h-10 sm:w-10 sm:text-lg'
      : 'h-9 w-9 text-base sm:h-10 sm:w-10 sm:text-lg'
  const valueHeightClass = slotCount >= 5 ? 'h-16 sm:h-24' : 'h-20 sm:h-24'
  const mobileSlotWidth =
    slotCount >= 6 ? '5.5rem' : slotCount === 5 ? '6rem' : slotCount === 4 ? '6.4rem' : '6.8rem'

  return (
    <section className="story-activity-card space-y-5 rounded-[1rem] p-4 sm:space-y-6 sm:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-black text-white sm:text-xl">{question.question}</h2>
        <p className="max-w-3xl text-sm leading-6 text-white/80 sm:leading-7">
          {question.instruction}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),rgba(7,11,27,0.98)_54%)] px-3 py-5 shadow-[0_30px_70px_rgba(2,6,23,0.45)] sm:px-6 sm:py-8">
        <div className="pointer-events-none mx-auto mb-4 h-14 w-28 rounded-t-[999px] border-[8px] border-b-0 border-slate-300/80 bg-transparent shadow-[0_0_0_2px_rgba(255,255,255,0.06)_inset] sm:mb-5 sm:h-20 sm:w-36 sm:border-[10px]" />

        <div className="mx-auto max-w-5xl rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(25,31,48,0.96),rgba(7,10,20,0.98))] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_rgba(2,6,23,0.32)] sm:px-4 sm:py-4">
          {slotCount >= 4 ? (
            <p className="mb-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/42 sm:hidden">
              Swipe sideways to view all slots
            </p>
          ) : null}
          <div
            className={`${slotCount >= 4 ? 'overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : ''}`}
          >
            <div
              className="grid gap-2 sm:gap-3"
              style={{
                gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))`,
                minWidth: slotCount >= 4 ? `calc(${mobileSlotWidth} * ${slotCount})` : undefined,
              }}
            >
            {currentRound.slots.map((slot, slotIndex) => {
              const solved = currentRoundComplete
              const currentChoice = value[slot.id] ?? ''
              const rollingSlot = rollingSlots[slot.id]
              const rollClass =
                rollingSlot?.direction === 'up'
                  ? 'counting-lock-number-roll-up'
                  : rollingSlot?.direction === 'down'
                    ? 'counting-lock-number-roll-down'
                    : ''

              return (
                <div
                  key={slot.id}
                  className="flex min-w-0 flex-col items-center gap-1.5 rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-1.5 py-2 sm:gap-2 sm:border-transparent sm:bg-transparent sm:px-0 sm:py-0"
                >
                  <button
                    type="button"
                    aria-label={`Increase ${slot.id}`}
                    disabled={solved}
                    className={`interactive-button flex items-center justify-center rounded-[0.7rem] border font-black transition ${arrowButtonClass} ${
                      solved
                        ? 'cursor-default border-emerald-300/25 bg-emerald-400/10 text-emerald-100/60'
                        : 'border-white/15 bg-white/8 text-white hover:border-[rgb(255_216_107_/_0.45)] hover:bg-white/14'
                    }`}
                    onClick={() => rotateSlot(slot, 'up')}
                  >
                    ▲
                  </button>

                  <div className={`counting-lock-reel-window flex w-full items-center justify-center px-1 text-center ${valueHeightClass}`}>
                    <span
                      key={`${slot.id}-${currentChoice}-${rollingSlot?.token ?? 'still'}`}
                      className={`break-words font-black leading-none transition ${numberSizeClass} ${getGlowTone(
                        slotIndex,
                        solved
                      )} ${rollClass}`}
                    >
                      {currentChoice}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={`Decrease ${slot.id}`}
                    disabled={solved}
                    className={`interactive-button flex items-center justify-center rounded-[0.7rem] border font-black transition ${arrowButtonClass} ${
                      solved
                        ? 'cursor-default border-emerald-300/25 bg-emerald-400/10 text-emerald-100/60'
                        : 'border-white/15 bg-white/8 text-white hover:border-[rgb(255_216_107_/_0.45)] hover:bg-white/14'
                    }`}
                    onClick={() => rotateSlot(slot, 'down')}
                  >
                    ▼
                  </button>
                </div>
              )
            })}
            </div>
          </div>
        </div>
      </div>

      {feedback ? (
        <p className="rounded-[0.85rem] border border-amber-300/35 bg-amber-500/10 px-4 py-3 text-sm font-semibold leading-6 text-amber-100">
          {feedback}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold leading-6 text-white/75">
          {currentRoundComplete
            ? finalRound
              ? 'Every slot is unlocked. You can now submit the activity.'
              : 'That lock is solved. Continue when you are ready for the next round.'
            : 'Use the arrows to roll each slot until the correct counting number appears.'}
        </p>

        {!finalRound && currentRoundComplete ? (
          <button
            type="button"
            className="gold-button interactive-button self-start rounded-full px-4 py-2 text-sm font-bold sm:self-auto"
            onClick={() => setScreen('between-rounds')}
          >
            Next round
          </button>
        ) : null}

        {finalRound && currentRoundComplete ? (
          <button
            type="button"
            className="gold-button interactive-button self-start rounded-full px-4 py-2 text-sm font-bold sm:self-auto"
            onClick={() => setScreen('complete')}
          >
            Finish mission
          </button>
        ) : null}
      </div>
    </section>
  )
}

export default CountingLockActivity
