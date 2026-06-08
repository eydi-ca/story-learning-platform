import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import AvatarBadge from '../AvatarBadge'
import LogoutConfirmModal from './LogoutConfirmModal'
import { siteContent } from '../../data/siteContent'
import { getCurrentUser, logoutUser } from '../../utils/auth'
import { getOrSetActiveClass } from '../../utils/classUtils'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

function StudentTopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const user = getCurrentUser()
  const activeClass = user ? getOrSetActiveClass(user.id) : null

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-[color:var(--gold-soft)] text-[color:var(--brown)]'
        : 'text-[color:var(--muted)] hover:bg-[color:var(--beige)]'
    }`

  return (
    <>
      <header className="story-nav sticky top-0 z-40 border-b backdrop-blur">
        <nav className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgb(216_185_120_/_0.9)] bg-[color:var(--gold-soft)] font-black text-[color:var(--brown)] shadow-[0_8px_18px_rgb(74_42_22_/_0.12)]">
                NQ
              </div>
              <div className="min-w-0">
                <p className="truncate magic-heading text-lg font-black">{siteContent.name}</p>
                <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]/80">
                  Student Portal
                </p>
              </div>
            </div>

            <div className="hidden items-center justify-end gap-2 md:flex">
              <NavLink to="/student/chapters" className={linkClass}>
                Chapters
              </NavLink>
              <NavLink to="/student/progress" className={linkClass}>
                Progress
              </NavLink>
              <NavLink to="/student/profile" className={linkClass}>
                My Profile
              </NavLink>
              <div className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 text-sm font-semibold text-[color:var(--muted)]">
                <span>{activeClass?.classCode ?? 'No class'}</span>
                <AvatarBadge avatarId={user?.avatar} size="sm" />
              </div>
              <button
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-[color:var(--beige)]"
                onClick={() => setConfirmOpen(true)}
                type="button"
              >
                Logout
              </button>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--cream)] text-[color:var(--brown)] md:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {open ? (
            <div className="mt-3 grid gap-2 border-t border-[rgb(216_185_120_/_0.55)] pt-3 md:hidden">
              <div className="mb-1 flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 text-sm font-semibold text-[color:var(--muted)]">
                <span>{activeClass?.classCode ?? 'No class'}</span>
                <AvatarBadge avatarId={user?.avatar} size="sm" />
              </div>
              <NavLink to="/student/chapters" className={linkClass}>
                Chapters
              </NavLink>
              <NavLink to="/student/progress" className={linkClass}>
                Progress
              </NavLink>
              <NavLink to="/student/profile" className={linkClass}>
                My Profile
              </NavLink>
              <button
                className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[color:var(--muted)] transition hover:bg-[color:var(--beige)]"
                onClick={() => setConfirmOpen(true)}
                type="button"
              >
                Logout
              </button>
            </div>
          ) : null}
        </nav>
      </header>
      <LogoutConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await logoutUser()
          navigate('/')
        }}
      />
    </>
  )
}

export default StudentTopBar
