import Modal from '../Modal'

function LogoutConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} title="Confirm logout" onClose={onClose}>
      <p className="text-[color:var(--muted)]">Are you sure you want to log out?</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="rounded-lg border border-[color:var(--border)] px-4 py-2 font-semibold text-[color:var(--brown)]" onClick={onClose}>
          Cancel
        </button>
        <button className="gold-button rounded-lg px-4 py-2 font-semibold" onClick={onConfirm}>
          Logout
        </button>
      </div>
    </Modal>
  )
}

export default LogoutConfirmModal
