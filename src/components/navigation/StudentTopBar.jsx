import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import AvatarBadge from '../AvatarBadge'
import LogoutConfirmModal from './LogoutConfirmModal'
import { siteContent } from '../../data/siteContent'
import { getCurrentUser, logoutUser } from '../../utils/auth'
import { getOrSetActiveClass } from '../../utils/classUtils'

function StudentTopBar() {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const user = getCurrentUser()
  const activeClass = user ? getOrSetActiveClass(user.id) : null
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-[color:var(--gold-soft)] text-[color:var(--brown)]' : 'text-[color:var(--muted)] hover:bg-[color:var(--beige)]'}`

  return (
    <>
      <header className="story-nav sticky top-0 z-30 border-b backdrop-blur">
        <nav className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="magic-heading font-black">{siteContent.name}</div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <NavLink to="/student/chapters" className={linkClass}>Chapters</NavLink>
              <NavLink to="/student/progress" className={linkClass}>Progress</NavLink>
              <NavLink to="/student/profile" className={linkClass}>My Profile</NavLink>
              <div className="hidden items-center gap-2 rounded-lg bg-white/60 px-3 py-2 text-sm font-semibold text-[color:var(--muted)] sm:flex">
                <span>{activeClass?.classCode ?? 'No class'}</span>
                <AvatarBadge avatarId={user?.avatar} size="sm" />
              </div>
              <button className="rounded-lg px-3 py-2 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-[color:var(--beige)]" onClick={() => setConfirmOpen(true)}>
                Logout
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-2 text-sm font-semibold text-[color:var(--muted)] sm:hidden">
            <span>{activeClass?.classCode ?? 'No class'}</span>
            <AvatarBadge avatarId={user?.avatar} size="sm" />
          </div>
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
