import Modal from './Modal'

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onClose,
  onConfirm,
}) {
  const confirmClass =
    tone === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-slate-900 text-white hover:bg-slate-800'

  return (
    <Modal open={open} title={title} onClose={onClose} size="max-w-lg">
      <p className="text-sm leading-6 text-slate-600">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className="admin-secondary-button px-4 py-2.5 text-sm font-medium">
          {cancelLabel}
        </button>
        <button type="button" onClick={onConfirm} className={`admin-primary-button px-4 py-2.5 text-sm font-medium ${confirmClass}`}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
