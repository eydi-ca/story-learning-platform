import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { siteContent } from '../../data/siteContent'

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

function PublicNavbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

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
    <header className="story-nav sticky top-0 z-40 border-b backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgb(216_185_120_/_0.9)] bg-[color:var(--gold-soft)] font-black text-[color:var(--brown)] shadow-[0_8px_18px_rgb(74_42_22_/_0.12)]">
              NQ
            </span>
            <span className="truncate magic-heading text-lg font-black">{siteContent.name}</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
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
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          </div>
        ) : null}
      </nav>
    </header>
  )
}

export default PublicNavbar
