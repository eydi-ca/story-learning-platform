function DragOrderActivity({ question, value = [], onChange, dragging, setDragging }) {
  const availableItems = question.items.filter((item) => !value.includes(item))

  function addItem(item) {
    if (value.includes(item)) return
    onChange([...value, item])
  }

  function removeItem(item) {
    onChange(value.filter((entry) => entry !== item))
  }

  function moveItem(index, direction) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= value.length) return
    const updated = [...value]
    ;[updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]]
    onChange(updated)
  }

  function handleDropInsert(index, item) {
    if (!item) return
    if (value.includes(item)) {
      const filtered = value.filter((entry) => entry !== item)
      filtered.splice(index, 0, item)
      onChange(filtered)
      return
    }

    const updated = [...value]
    updated.splice(index, 0, item)
    onChange(updated)
  }

  return (
    <section className="story-activity-card story-activity-entrance space-y-5 rounded-[1rem] p-5 sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/65">
          Drag and order
        </p>
        <h2 className="mt-2 text-lg font-black text-white">
          {question.instruction || question.question}
        </h2>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-white/72">Available tiles</p>
        <div className="flex flex-wrap gap-3">
          {availableItems.map((item) => (
            <button
              key={item}
              type="button"
              draggable
              onDragStart={() => setDragging(item)}
              onDragEnd={() => setDragging(null)}
              onClick={() => addItem(item)}
              className="story-drag-tile interactive-button rounded-[1rem] px-4 py-3 text-base font-black text-white"
            >
              {item}
            </button>
          ))}
          {!availableItems.length ? (
            <div className="rounded-[1rem] border border-dashed border-white/20 px-4 py-3 text-sm font-semibold text-white/68">
              All tiles placed
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`story-drop-zone rounded-[1rem] border-2 border-dashed p-4 sm:p-5 ${
          dragging ? 'story-drop-zone-active' : ''
        }`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => {
          if (!dragging) return
          addItem(dragging)
          setDragging(null)
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white/72">Arrange from first to last</p>
          <button
            type="button"
            className="outline-magic-button interactive-button rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]"
            onClick={() => onChange([])}
          >
            Reset
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {value.length ? (
            value.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="story-drop-item flex flex-col gap-3 rounded-[1rem] border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                draggable
                onDragStart={() => setDragging(item)}
                onDragEnd={() => setDragging(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  handleDropInsert(index, dragging)
                  setDragging(null)
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(255_216_107_/_0.24)] text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-base font-black text-white">{item}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="story-mini-action rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]"
                    onClick={() => moveItem(index, -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="story-mini-action rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]"
                    onClick={() => moveItem(index, 1)}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="story-mini-action rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]"
                    onClick={() => removeItem(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1rem] bg-white/6 px-4 py-6 text-center text-sm font-semibold text-white/68">
              Drag the tiles here or tap each tile to build the correct order.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default DragOrderActivity
