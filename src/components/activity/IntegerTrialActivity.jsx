import { useEffect, useMemo, useRef, useState } from 'react'
import ActivityScriptPanel from './ActivityScriptPanel'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function arraysMatch(left = [], right = []) {
  if (left.length !== right.length) return false
  return left.every((item, index) => item === right[index])
}

function buildPuzzleAnswer(rows, columns) {
  return Array.from({ length: rows * columns }, (_, index) => String(index))
}

function buildPuzzleState(rows, columns) {
  const answer = buildPuzzleAnswer(rows, columns)
  let nextOrder = shuffle(answer)
  let guard = 0

  while (arraysMatch(nextOrder, answer) && guard < 16) {
    nextOrder = shuffle(answer)
    guard += 1
  }

  return {
    rows,
    columns,
    answer,
    order: nextOrder,
    solved: false,
    moves: 0,
  }
}

function buildInitialValue() {
  return {
    stageIndex: 0,
    stageAnswers: {},
    obtainedItems: [],
    currentStagePassed: false,
    stageFeedback: '',
    puzzle: null,
    completionAcknowledged: false,
  }
}

function getChoiceLabel(index) {
  return ['A', 'B', 'C', 'D'][index] ?? `${index + 1}`
}

function buildFallbackStagesFromPrompts(question) {
  const prompts = Array.isArray(question.prompts) ? question.prompts.slice(0, 6) : []
  const itemMeta = [
    { id: 'map-stage', itemId: 'map', itemLabel: 'Map' },
    { id: 'torch-stage', itemId: 'torch', itemLabel: 'Torch' },
    { id: 'key-stage', itemId: 'key', itemLabel: 'Key' },
  ]

  return itemMeta
    .map((item, index) => ({
      ...item,
      prompts: prompts.slice(index * 2, index * 2 + 2),
    }))
    .filter((stage) => stage.prompts.length > 0)
}

function IntegerTrialActivity({ question, value, onChange }) {
  const stages = useMemo(() => {
    if (Array.isArray(question.stages) && question.stages.length > 0) {
      return question.stages
    }

    return buildFallbackStagesFromPrompts(question)
  }, [question])
  const safeValue = useMemo(
    () => ({
      ...buildInitialValue(),
      ...(value ?? {}),
      stageAnswers: value?.stageAnswers ?? {},
      obtainedItems: value?.obtainedItems ?? [],
      puzzle: value?.puzzle ?? null,
      completionAcknowledged: value?.completionAcknowledged ?? false,
    }),
    [value]
  )
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [swapFlash, setSwapFlash] = useState([])
  const [screen, setScreen] = useState('opening')
  const [completedStage, setCompletedStage] = useState(null)
  const swapTimerRef = useRef(null)

  useEffect(() => {
    if (!value) {
      onChange(safeValue)
    }
  }, [onChange, safeValue, value])

  useEffect(() => {
    setScreen('opening')
    setCompletedStage(null)
  }, [question.id])

  useEffect(() => {
    return () => {
      if (swapTimerRef.current) {
        window.clearTimeout(swapTimerRef.current)
      }
    }
  }, [])

  const stageIndex = Math.min(safeValue.stageIndex ?? 0, Math.max(stages.length - 1, 0))
  const currentStage = stages[stageIndex] ?? null
  const currentPrompts = currentStage?.prompts ?? []
  const allItemsCollected = stages.length > 0 && safeValue.obtainedItems.length >= stages.length
  const puzzle = safeValue.puzzle
  const puzzleSolved = Boolean(puzzle?.solved)
  const script = question.script ?? {}

  useEffect(() => {
    if (allItemsCollected && puzzleSolved && !safeValue.completionAcknowledged) {
      setScreen('puzzle-solved')
    }
  }, [allItemsCollected, puzzleSolved, safeValue.completionAcknowledged])

  function updateValue(updates) {
    onChange({
      ...safeValue,
      ...updates,
    })
  }

  function getStageAnswer(questionId) {
    return safeValue.stageAnswers[currentStage?.id]?.[questionId]
  }

  function handleChoice(questionId, choice) {
    const nextStageAnswers = {
      ...(safeValue.stageAnswers[currentStage.id] ?? {}),
      [questionId]: choice,
    }

    const nextStageAnswersMap = {
      ...safeValue.stageAnswers,
      [currentStage.id]: nextStageAnswers,
    }

    const answeredAll = currentPrompts.every((prompt) => Boolean(nextStageAnswers[prompt.id]))
    const stagePassed =
      answeredAll &&
      currentPrompts.every((prompt) => nextStageAnswers[prompt.id] === prompt.answer)

    if (answeredAll && stagePassed) {
      const nextObtainedItems = safeValue.obtainedItems.includes(currentStage.itemId)
        ? safeValue.obtainedItems
        : [...safeValue.obtainedItems, currentStage.itemId]
      const unlockedPuzzle =
        nextObtainedItems.length === stages.length && !safeValue.puzzle
          ? buildPuzzleState(4, 4)
          : safeValue.puzzle

      updateValue({
        stageAnswers: nextStageAnswersMap,
        obtainedItems: nextObtainedItems,
        currentStagePassed: true,
        stageFeedback: `You obtained the ${currentStage.itemLabel}.`,
        stageIndex:
          nextObtainedItems.length === stages.length
            ? safeValue.stageIndex
            : Math.min(stageIndex + 1, stages.length - 1),
        puzzle: unlockedPuzzle,
      })
      setCompletedStage(currentStage)
      setScreen('stage-complete')
      return
    }

    if (answeredAll && !stagePassed) {
      updateValue({
        stageAnswers: {
          ...safeValue.stageAnswers,
          [currentStage.id]: {},
        },
        currentStagePassed: false,
        stageFeedback: `Not quite right. Repeat the two ${currentStage.itemLabel.toLowerCase()} questions to try again.`,
      })
      return
    }

    updateValue({
      stageAnswers: nextStageAnswersMap,
      stageFeedback: '',
      currentStagePassed: false,
    })
  }

  function handleContinueAfterItem() {
    if (!completedStage) return

    updateValue({
      currentStagePassed: false,
      stageFeedback:
        safeValue.obtainedItems.length === stages.length
          ? 'All items obtained. Solve the final map puzzle.'
          : '',
    })

    if (safeValue.obtainedItems.length === stages.length) {
      setScreen('final-intro')
      return
    }

    setCompletedStage(null)
    setScreen('stage-intro')
  }

  function swapTiles(fromIndex, toIndex) {
    if (!puzzle || fromIndex == null || toIndex == null || fromIndex === toIndex || puzzle.solved) {
      return
    }

    const nextOrder = [...puzzle.order]
    ;[nextOrder[fromIndex], nextOrder[toIndex]] = [nextOrder[toIndex], nextOrder[fromIndex]]
    const solved = arraysMatch(nextOrder, puzzle.answer)

    updateValue({
      puzzle: {
        ...puzzle,
        order: nextOrder,
        solved,
        moves: (puzzle.moves ?? 0) + 1,
      },
    })
    setSelectedIndex(null)
    setDraggingIndex(null)
    setSwapFlash([fromIndex, toIndex])

    if (swapTimerRef.current) {
      window.clearTimeout(swapTimerRef.current)
    }

    swapTimerRef.current = window.setTimeout(() => {
      setSwapFlash([])
    }, 220)
  }

  function handleTileClick(index) {
    if (!puzzle || puzzle.solved) return

    if (selectedIndex == null) {
      setSelectedIndex(index)
      return
    }

    if (selectedIndex === index) {
      setSelectedIndex(null)
      return
    }

    swapTiles(selectedIndex, index)
  }

  const rows = puzzle?.rows ?? 4
  const columns = puzzle?.columns ?? 4
  const tileCount = rows * columns
  const activeStageScript = script.stages?.[stageIndex]
  const completedStageIndex = completedStage
    ? stages.findIndex((stage) => stage.id === completedStage.id)
    : -1
  const completedStageScript =
    completedStageIndex >= 0 ? script.stageSuccess?.[completedStageIndex] : null

  if (screen === 'opening' && script.opening) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.opening.title}
        lines={script.opening.lines}
        lineAudioSrcs={script.opening.lineAudioSrcs}
        ctaLabel={script.opening.ctaLabel || 'Start'}
        onContinue={() => setScreen('stage-intro')}
        tone="blue"
      />
    )
  }

  if (!allItemsCollected && screen === 'stage-intro' && activeStageScript) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={activeStageScript.title}
        lines={activeStageScript.lines}
        lineAudioSrcs={activeStageScript.lineAudioSrcs}
        ctaLabel={activeStageScript.ctaLabel || 'Begin stage'}
        onContinue={() => setScreen('playing')}
        tone="blue"
      />
    )
  }

  if (screen === 'stage-complete' && completedStageScript) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={completedStageScript.title}
        lines={completedStageScript.lines}
        lineAudioSrcs={completedStageScript.lineAudioSrcs}
        ctaLabel={completedStageScript.ctaLabel || 'Continue'}
        onContinue={handleContinueAfterItem}
        tone="blue"
      />
    )
  }

  if (screen === 'final-intro' && script.finalChallenge) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.finalChallenge.title}
        lines={script.finalChallenge.lines}
        lineAudioSrcs={script.finalChallenge.lineAudioSrcs}
        ctaLabel={script.finalChallenge.ctaLabel || 'Begin final challenge'}
        onContinue={() => setScreen('puzzle')}
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

  return (
    <section className="space-y-5 rounded-[1rem] border border-white/10 bg-slate-950/40 p-4 shadow-[0_20px_50px_rgba(2,6,23,0.26)] sm:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-black text-white sm:text-xl">{question.question}</h2>
        <p className="max-w-3xl text-sm leading-6 text-white/80 sm:leading-7">
          {question.instruction}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stages.map((stage, index) => {
          const obtained = safeValue.obtainedItems.includes(stage.itemId)
          const active = !allItemsCollected && index === stageIndex

          return (
            <div
              key={stage.id}
              className={`rounded-[0.95rem] border px-4 py-3 ${
                obtained
                  ? 'border-emerald-300/45 bg-emerald-500/10'
                  : active
                    ? 'border-amber-300/45 bg-amber-400/10'
                    : 'border-white/10 bg-white/5'
              }`}
            >
              <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/58">
                Item {index + 1}
              </p>
              <p className="mt-1 text-sm font-black text-white">{stage.itemLabel}</p>
              <p className="mt-1 text-sm text-white/70">
                {obtained ? 'Obtained' : active ? 'Current challenge' : 'Locked'}
              </p>
            </div>
          )
        })}
      </div>

      {!allItemsCollected && screen === 'playing' ? (
        <div className="space-y-4">
          <div className="rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.84))] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/58">
                  Current item
                </p>
                <p className="mt-1 text-lg font-black text-white">{currentStage?.itemLabel}</p>
              </div>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/72">
                2 questions required
              </span>
            </div>
          </div>

          {currentPrompts.map((prompt, promptIndex) => (
            <article
              key={prompt.id}
              className="rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.84))] p-4 sm:p-5"
            >
              <p className="text-sm font-black leading-7 text-white sm:text-base">
                {promptIndex + 1}. {prompt.question}
              </p>
              <div className="mt-3 grid gap-2">
                {prompt.choices.map((choice, choiceIndex) => {
                  const active = getStageAnswer(prompt.id) === choice

                  return (
                    <button
                      key={choice}
                      type="button"
                      className={`interactive-button rounded-[0.9rem] border px-4 py-3 text-left text-sm font-semibold transition sm:text-[0.95rem] ${
                        active
                          ? 'border-amber-300/70 bg-amber-400/12 text-amber-50 shadow-[0_0_0_1px_rgba(252,211,77,0.2)]'
                          : 'border-white/10 bg-white/6 text-white/82 hover:border-sky-300/40 hover:bg-white/10'
                      }`}
                      onClick={() => handleChoice(prompt.id, choice)}
                    >
                      <span className="mr-2 font-black text-white/60">{getChoiceLabel(choiceIndex)}.</span>
                      {choice}
                    </button>
                  )
                })}
              </div>
            </article>
          ))}

          {safeValue.stageFeedback ? (
            <p
              className={`rounded-[0.9rem] border px-4 py-3 text-sm font-semibold ${
                safeValue.currentStagePassed
                  ? 'border-emerald-300/40 bg-emerald-500/10 text-emerald-100'
                  : 'border-red-300/40 bg-red-500/10 text-red-100'
              }`}
            >
              {safeValue.stageFeedback}
            </p>
          ) : null}

          {safeValue.currentStagePassed ? (
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="gold-button interactive-button rounded-full px-5 py-3 text-sm font-bold"
                onClick={handleContinueAfterItem}
              >
                {safeValue.obtainedItems.length === stages.length ? 'Show final puzzle' : 'Continue'}
              </button>
            </div>
          ) : null}
        </div>
      ) : screen === 'puzzle' || screen === 'puzzle-solved' ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.84))] p-4">
            <div>
              <p className="text-sm font-black text-white">All items obtained</p>
              <p className="mt-1 text-sm text-white/72">
                Map, torch, and key are ready. Restore the final 4x4 town map.
              </p>
            </div>
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/72">
              {puzzle?.moves ?? 0} moves
            </span>
          </div>

          <div className="rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.88))] p-3 sm:p-4">
            <div className="mx-auto w-full max-w-[21rem] sm:max-w-[28rem] md:max-w-[34rem]">
              <div className="relative aspect-square overflow-hidden rounded-[0.9rem] border border-white/10 bg-slate-950/80">
                {screen === 'puzzle-solved' ? (
                  <img
                    src={question.imageSrc}
                    alt="Completed treasure map"
                    className="h-full w-full object-cover"
                  />
                ) : null}
                {screen !== 'puzzle-solved' ? Array.from({ length: tileCount }).map((_, index) => {
                  const tileId = puzzle?.order?.[index]
                  if (tileId == null) return null

                  const tileNumber = Number(tileId)
                  const targetColumn = tileNumber % columns
                  const targetRow = Math.floor(tileNumber / columns)
                  const currentColumn = index % columns
                  const currentRow = Math.floor(index / columns)
                  const selected = selectedIndex === index
                  const flashing = swapFlash.includes(index)

                  return (
                    <button
                      key={tileId}
                      type="button"
                      draggable={!puzzleSolved}
                      onClick={() => handleTileClick(index)}
                      onDragStart={() => setDraggingIndex(index)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => swapTiles(draggingIndex, index)}
                      onDragEnd={() => setDraggingIndex(null)}
                      className={`absolute overflow-hidden border transition-[left,top,transform,box-shadow,border-color] duration-200 ease-out ${
                        selected
                          ? 'z-20 border-amber-300 shadow-[0_0_0_2px_rgba(252,211,77,0.24)]'
                          : puzzleSolved
                            ? 'border-emerald-300/55'
                            : 'border-white/12 hover:border-sky-300/55'
                      } ${flashing ? 'scale-[1.03]' : 'scale-100'}`}
                      style={{
                        width: `${100 / columns}%`,
                        height: `${100 / rows}%`,
                        left: `${(currentColumn * 100) / columns}%`,
                        top: `${(currentRow * 100) / rows}%`,
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-no-repeat"
                        style={{
                          backgroundImage: `url(${question.imageSrc})`,
                          backgroundSize: `${columns * 100}% ${rows * 100}%`,
                          backgroundPosition: `${(targetColumn / Math.max(columns - 1, 1)) * 100}% ${(targetRow / Math.max(rows - 1, 1)) * 100}%`,
                        }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(15,23,42,0.12))]" />
                    </button>
                  )
                }) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold leading-6 text-white/72">
                {screen === 'puzzle-solved'
                  ? 'The full map is restored. Review it first, then continue when you are ready.'
                  : 'Drag tiles into place. On mobile, tap one tile, then tap another to swap them.'}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.18em] ${
                    puzzleSolved
                      ? 'border border-emerald-300/45 bg-emerald-500/12 text-emerald-100'
                      : 'border border-white/12 bg-white/8 text-white/68'
                  }`}
                >
                  {puzzleSolved ? 'Map solved' : 'Restore the map'}
                </span>

              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default IntegerTrialActivity
