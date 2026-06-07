import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AvatarBadge from '../components/AvatarBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { getCurrentUser, logoutUser } from '../utils/auth'
import { syncCurrentSessionData } from '../utils/supabaseSync'

const TEACHER_SIDEBAR_KEY = 'story_teacher_sidebar_collapsed'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ collapsed = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 13h7V4H4zm9 7h7v-9h-7zm0-11h7V4h-7zM4 20h7v-5H4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClassIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7.5 12 4l9 3.5L12 11 3 7.5Zm3 3.83v4.5c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TeacherLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const teacher = getCurrentUser()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(TEACHER_SIDEBAR_KEY) === 'true'
  )

  const navigation = useMemo(
    () => [
      {
        label: 'Dashboard',
        to: '/teacher/dashboard',
        icon: <DashboardIcon />,
        subtitle: 'Classroom overview, trends, and student progress',
      },
      {
        label: 'Classes',
        to: '/teacher/classes',
        icon: <ClassIcon />,
        subtitle: 'Create class codes and review each student roster',
      },
      {
        label: 'Profile',
        to: '/teacher/profile',
        icon: <ProfileIcon />,
        subtitle: 'Manage your teacher identity and account details',
      },
    ],
    []
  )

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

  useEffect(() => {
    localStorage.setItem(TEACHER_SIDEBAR_KEY, String(collapsed))
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  if (!ready) {
    return <div className="teacher-shell" />
  }

  const currentSection = navigation.find((item) => location.pathname.startsWith(item.to)) ?? {
    label: 'Teacher',
    subtitle: 'Manage classes and guide student progress.',
  }

  const linkClass = ({ isActive }) =>
    `teacher-nav-link rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'teacher-nav-link-active' : ''}`

  return (
    <>
      <div className="teacher-shell">
        <div className="flex min-h-screen">
          <aside
            className={`teacher-sidebar teacher-sidebar-transition fixed inset-y-0 left-0 z-40 flex ${
              collapsed ? 'w-[92px]' : 'w-[292px]'
            } -translate-x-full flex-col lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : ''}`}
          >
            <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-sm font-black text-white shadow-sm">
                  TQ
                </div>
                <div className={`overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100/80">Teacher Portal</p>
                  <h1 className="mt-1 text-base font-black tracking-tight text-white">Numberland Quest</h1>
                </div>
              </div>
              <button
                type="button"
                className="teacher-sidebar-icon-button hidden h-10 w-10 items-center justify-center rounded-2xl lg:inline-flex"
                onClick={() => setCollapsed((value) => !value)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronIcon collapsed={collapsed} />
              </button>
              <button
                type="button"
                className="teacher-sidebar-icon-button inline-flex h-10 w-10 items-center justify-center rounded-2xl lg:hidden"
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
              >
                <ChevronIcon />
              </button>
            </div>

            <div className="border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <AvatarBadge avatarId={teacher?.avatar} size="sm" />
                <div className={`overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0 lg:w-0' : 'w-auto opacity-100'}`}>
                  <p className="text-sm font-semibold text-white">Hello {teacher?.fullName?.split(' ')[0] ?? 'Teacher'}</p>
                  <p className="mt-1 text-sm text-amber-100/80">{teacher?.email ?? 'Teacher account'}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  <span className="shrink-0 text-inherit">{item.icon}</span>
                  <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${collapsed ? 'w-0 opacity-0 lg:w-0' : 'w-auto opacity-100'}`}>
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-white/10 p-3">
              <button
                type="button"
                className="teacher-nav-link w-full rounded-xl px-3 py-2.5 text-sm font-semibold"
                onClick={() => setConfirmOpen(true)}
              >
                <span className="shrink-0 text-inherit">
                  <LogoutIcon />
                </span>
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${collapsed ? 'w-0 opacity-0 lg:w-0' : 'w-auto opacity-100'}`}>
                  Logout
                </span>
              </button>
            </div>
          </aside>

          {mobileOpen ? (
            <button
              type="button"
              className="teacher-overlay fixed inset-0 z-30 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation overlay"
            />
          ) : null}

          <div className={`flex min-h-screen flex-1 flex-col transition-all duration-200 lg:ml-[292px] ${collapsed ? 'lg:ml-[92px]' : 'lg:ml-[292px]'}`}>
            <header className="sticky top-0 z-20 border-b border-[color:var(--border)]/60 bg-[color:var(--cream)]/90 backdrop-blur">
              <div className="px-4 py-4 sm:px-6 lg:px-8">
                <div className="teacher-topbar-panel flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="teacher-secondary-button inline-flex h-10 w-10 items-center justify-center rounded-2xl lg:hidden"
                      onClick={() => setMobileOpen(true)}
                      aria-label="Open navigation"
                    >
                      <MenuIcon />
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                          Teacher Workspace
                        </span>
                        <span className="text-sm text-[color:var(--muted)]/60">/</span>
                        <span className="text-sm font-semibold text-[color:var(--muted)]">{currentSection.label}</span>
                      </div>
                      <h2 className="mt-2 text-xl font-black tracking-tight text-[color:var(--brown)]">{currentSection.label}</h2>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">{currentSection.subtitle}</p>
                    </div>
                  </div>
                  <div className="hidden min-w-[240px] text-right sm:block">
                    <p className="text-sm font-semibold text-[color:var(--brown)]">Hello {teacher?.fullName?.split(' ')[0] ?? 'Teacher'}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">Guide your students through every chapter with confidence.</p>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out of teacher portal?"
        message="You will need to log in again to continue managing your classes."
        confirmLabel="Sign out"
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
