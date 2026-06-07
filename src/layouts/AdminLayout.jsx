import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import { getCurrentUser, logoutAdmin } from '../utils/auth'
import { syncCurrentSessionData } from '../utils/supabaseSync'

const SIDEBAR_KEY = 'story_admin_sidebar_collapsed'
const ADMIN_BRAND_KEY = 'story_admin_brand'

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

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 20V10m6 10V4m6 16v-7" strokeLinecap="round" />
    </svg>
  )
}

function TeacherIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8.5 10v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Zm7.4-2.7.1-.8-.1-.8 2-1.6-2-3.4-2.4 1a8 8 0 0 0-1.4-.8l-.4-2.6h-4l-.4 2.6a8 8 0 0 0-1.4.8l-2.4-1-2 3.4 2 1.6-.1.8.1.8-2 1.6 2 3.4 2.4-1c.4.3.9.5 1.4.8l.4 2.6h4l.4-2.6c.5-.2 1-.5 1.4-.8l2.4 1 2-3.4-2-1.6Z" strokeLinecap="round" strokeLinejoin="round" />
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

function LogoPlaceholder({ collapsed }) {
  const savedBrand = JSON.parse(localStorage.getItem(ADMIN_BRAND_KEY) || '{"shortMark":"NQ","name":"Numberland Quest"}')

  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-sm font-semibold text-white">
        {savedBrand.shortMark || 'NQ'}
      </div>
      <div className={`overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">Admin Workspace</p>
        <h1 className="mt-1 text-base font-semibold tracking-tight text-white">{savedBrand.name || 'Numberland Quest'}</h1>
      </div>
    </div>
  )
}

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_KEY) === 'true')
  const [brandVersion, setBrandVersion] = useState(0)

  const navigation = useMemo(
    () => [
      { label: 'Dashboard', to: '/admin/dashboard', icon: <DashboardIcon />, subtitle: 'Overview, metrics, and platform signals' },
      { label: 'Reports', to: '/admin/reports', icon: <ReportIcon />, subtitle: 'Performance summaries and chapter insights' },
      { label: 'Teachers', to: '/admin/teachers', icon: <TeacherIcon />, subtitle: 'Open a teacher, then drill into classes and students' },
      { label: 'Settings', to: '/admin/settings', icon: <SettingsIcon />, subtitle: 'Admin account, branding, and security settings' },
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
    localStorage.setItem(SIDEBAR_KEY, String(collapsed))
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleBrandUpdated = () => setBrandVersion((value) => value + 1)
    window.addEventListener('admin-brand-updated', handleBrandUpdated)
    return () => window.removeEventListener('admin-brand-updated', handleBrandUpdated)
  }, [])

  if (!ready) {
    return <div className="admin-shell" />
  }

  const currentSection = navigation.find((item) => location.pathname.startsWith(item.to)) ?? {
    label: 'Admin',
    subtitle: 'Manage the platform workspace.',
  }

  const linkClass = ({ isActive }) =>
    `admin-nav-link rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'admin-nav-link-active' : ''}`

  return (
    <>
      <div className="admin-shell">
        <div className="flex min-h-screen">
          <aside
            className={`admin-sidebar admin-sidebar-transition fixed inset-y-0 left-0 z-40 flex ${
              collapsed ? 'w-[88px]' : 'w-[280px]'
            } -translate-x-full flex-col lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : ''}`}
          >
            <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-4 py-4">
              <div key={brandVersion}>
                <LogoPlaceholder collapsed={collapsed} />
              </div>
              <button
                type="button"
                className="admin-sidebar-icon-button hidden h-9 w-9 items-center justify-center rounded-lg lg:inline-flex"
                onClick={() => setCollapsed((value) => !value)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronIcon collapsed={collapsed} />
              </button>
              <button
                type="button"
                className="admin-sidebar-icon-button inline-flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
              >
                <ChevronIcon />
              </button>
            </div>

            <div className="border-b border-white/10 px-4 py-4">
              <p className={`text-sm font-medium text-slate-100 transition-opacity duration-200 ${collapsed ? 'opacity-0 lg:hidden' : 'opacity-100'}`}>
                Hello {user?.fullName?.split(' ')[0] ?? 'Admin'}
              </p>
              <p className={`mt-1 text-sm text-slate-300 transition-opacity duration-200 ${collapsed ? 'opacity-0 lg:hidden' : 'opacity-100'}`}>
                {user?.email ?? 'Administrator'}
              </p>
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
                className="admin-nav-link w-full rounded-lg px-3 py-2 text-sm font-medium"
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
              className="admin-overlay fixed inset-0 z-30 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation overlay"
            />
          ) : null}

          <div className={`flex min-h-screen flex-1 flex-col transition-all duration-200 lg:ml-[280px] ${collapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'}`}>
            <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f7f5]/95 backdrop-blur">
              <div className="px-4 py-4 sm:px-6 lg:px-8">
                <div className="admin-topbar-panel flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="admin-secondary-button inline-flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
                      onClick={() => setMobileOpen(true)}
                      aria-label="Open navigation"
                    >
                      <MenuIcon />
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Administration
                        </span>
                        <span className="text-sm text-slate-400">/</span>
                        <span className="text-sm font-medium text-slate-500">{currentSection.label}</span>
                      </div>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{currentSection.label}</h2>
                      <p className="mt-1 text-sm text-slate-600">{currentSection.subtitle}</p>
                    </div>
                  </div>
                  <div className="hidden min-w-[240px] text-right sm:block">
                    <p className="text-sm font-medium text-slate-900">Hello {user?.fullName?.split(' ')[0] ?? 'Admin'}</p>
                    <p className="mt-1 text-sm text-slate-500">{user?.email ?? 'Administrator'}</p>
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
        title="Sign out of admin workspace?"
        message="You will need to log in again to continue managing the platform."
        confirmLabel="Sign out"
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
