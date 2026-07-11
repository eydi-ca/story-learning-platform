import { useEffect, useMemo, useState } from 'react'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function arraysMatch(left = [], right = []) {
  if (left.length !== right.length) return false
  return left.every((item, index) => item === right[index])
}

function buildInitialValue(answer = []) {
  if (!answer.length) {
    return {
      order: [],
      moves: 0,
    }
  }

  let nextOrder = shuffle(answer)
  let guard = 0

  while (arraysMatch(nextOrder, answer) && guard < 12) {
    nextOrder = shuffle(answer)
    guard += 1
  }

  return {
    order: nextOrder,
    moves: 0,
  }
}

function TilePuzzleActivity({ question, value, onChange }) {
  const rows = question.rows ?? 3
  const columns = question.columns ?? 3
  const answer = question.answer ?? []
  const tileCount = rows * columns
  const safeValue =
    value?.order?.length === tileCount ? value : buildInitialValue(answer)
  const order = safeValue.order
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [draggingIndex, setDraggingIndex] = useState(null)

  useEffect(() => {
    if (value?.order?.length !== tileCount) {
      onChange(safeValue)
    }
  }, [onChange, safeValue, tileCount, value])

  const solved = useMemo(() => arraysMatch(order, answer), [answer, order])

  function updateOrder(nextOrder) {
    onChange({
      order: nextOrder,
      moves: (safeValue.moves ?? 0) + 1,
    })
  }

  function swapTiles(fromIndex, toIndex) {
    if (fromIndex == null || toIndex == null || fromIndex === toIndex || solved) return

    const nextOrder = [...order]
    ;[nextOrder[fromIndex], nextOrder[toIndex]] = [nextOrder[toIndex], nextOrder[fromIndex]]
    updateOrder(nextOrder)
    setSelectedIndex(null)
    setDraggingIndex(null)
  }

  function handleTileClick(index) {
    if (solved) return
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

  return (
    <section className="space-y-5 rounded-[1rem] border border-white/10 bg-slate-950/40 p-4 shadow-[0_20px_50px_rgba(2,6,23,0.26)] sm:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-black text-white sm:text-xl">{question.question}</h2>
        <p className="max-w-3xl text-sm leading-6 text-white/80 sm:leading-7">
          {question.instruction}
        </p>
      </div>

      <div className="rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.88))] p-3 sm:p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/72 sm:text-[0.72rem]">
            Puzzle board
          </span>
          <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/72 sm:text-[0.72rem]">
            {safeValue.moves ?? 0} moves
          </span>
        </div>

        <div className="mx-auto w-full max-w-[22rem] sm:max-w-[30rem]">
          <div
            className="grid gap-1.5 rounded-[0.85rem] border border-white/10 bg-slate-950/70 p-1.5 sm:gap-2 sm:rounded-[1rem] sm:p-2"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {order.map((tileId, index) => {
              const tileNumber = Number(tileId)
              const backgroundColumn = tileNumber % columns
              const backgroundRow = Math.floor(tileNumber / columns)
              const selected = selectedIndex === index

              return (
                <button
                  key={`${tileId}-${index}`}
                  type="button"
                  draggable={!solved}
                  onClick={() => handleTileClick(index)}
                  onDragStart={() => setDraggingIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => swapTiles(draggingIndex, index)}
                  onDragEnd={() => setDraggingIndex(null)}
                  className={`relative aspect-square overflow-hidden rounded-[0.7rem] border transition ${
                    selected
                      ? 'border-amber-300 shadow-[0_0_0_2px_rgba(252,211,77,0.26)]'
                      : solved
                        ? 'border-emerald-300/60'
                        : 'border-white/12 hover:border-sky-300/60'
                  }`}
                  aria-label={`Puzzle tile ${index + 1}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${question.imageSrc})`,
                      backgroundSize: `${columns * 100}% ${rows * 100}%`,
                      backgroundPosition: `${(backgroundColumn / Math.max(columns - 1, 1)) * 100}% ${(backgroundRow / Math.max(rows - 1, 1)) * 100}%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(15,23,42,0.12))]" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-white/72">
            Drag tiles into place. On mobile, tap one tile, then tap another to swap them.
          </p>
          <span
            className={`rounded-full px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.18em] ${
              solved
                ? 'border border-emerald-300/45 bg-emerald-500/12 text-emerald-100'
                : 'border border-white/12 bg-white/8 text-white/68'
            }`}
          >
            {solved ? 'Puzzle solved' : 'Rebuild the map'}
          </span>
        </div>
      </div>
    </section>
  )
}

export default TilePuzzleActivity
