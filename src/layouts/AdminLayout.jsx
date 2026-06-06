import { useState } from 'react'
import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import LogoutConfirmModal from '../components/navigation/LogoutConfirmModal'
import { logoutAdmin } from '../utils/auth'
import { syncCurrentSessionData } from '../utils/supabaseSync'

function AdminLayout() {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-[color:var(--gold-soft)] text-[color:var(--brown)]'
        : 'text-[color:var(--muted)] hover:bg-[color:var(--beige)]'
    }`

  useEffect(() => {
    let mounted = true
    syncCurrentSessionData()
      .catch(() => {})
      .finally(() => {
        if (mounted) setReady(true)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (!ready) {
    return <div className="storybook-bg min-h-screen" />
  }

  return (
    <>
      <div className="storybook-bg min-h-screen">
        <header className="story-nav sticky top-0 z-30 border-b backdrop-blur">
          <nav className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="magic-heading font-black">Admin Console</div>
                <p className="text-sm text-[color:var(--muted)]">System management</p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <NavLink to="/admin/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/reports" className={linkClass}>
                  Reports
                </NavLink>
                <NavLink to="/admin/teachers" className={linkClass}>
                  Teachers
                </NavLink>
                <NavLink to="/admin/students" className={linkClass}>
                  Students
                </NavLink>
                <button
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-[color:var(--beige)]"
                  onClick={() => setConfirmOpen(true)}
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </main>
      </div>
      <LogoutConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await logoutAdmin()
          navigate('/admin/login')
        }}
      />
    </>
  )
}

export default AdminLayout
