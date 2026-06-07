function Modal({ open, title, children, onClose, size = 'max-w-2xl' }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`admin-modal-surface w-full ${size} p-6 shadow-2xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="admin-icon-button h-9 w-9 text-lg font-medium text-slate-500"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
