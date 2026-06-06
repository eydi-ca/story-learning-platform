import { useState } from 'react'
import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import AvatarBadge from '../components/AvatarBadge'
import LogoutConfirmModal from '../components/navigation/LogoutConfirmModal'
import { getCurrentUser, logoutUser } from '../utils/auth'
import { syncCurrentSessionData } from '../utils/supabaseSync'

function TeacherLayout() {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const teacher = getCurrentUser()
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
                <div className="magic-heading font-black">Teacher Portal</div>
                <p className="text-sm text-[color:var(--muted)]">
                  {teacher?.fullName ?? 'Teacher'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <NavLink to="/teacher/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/teacher/classes" className={linkClass}>
                  Classes
                </NavLink>
                <NavLink to="/teacher/profile" className={linkClass}>
                  Profile
                </NavLink>
                <div className="hidden items-center gap-2 rounded-lg bg-white/60 px-3 py-2 sm:flex">
                  <AvatarBadge avatarId={teacher?.avatar} size="sm" />
                </div>
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
          await logoutUser()
          navigate('/login')
        }}
      />
    </>
  )
}

export default TeacherLayout
