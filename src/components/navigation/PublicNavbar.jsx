import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { siteContent } from '../../data/siteContent'

function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-[color:var(--gold-soft)] text-[color:var(--brown)]' : 'text-[color:var(--muted)] hover:bg-[color:var(--beige)]'}`

  return (
    <header className="story-nav sticky top-0 z-30 border-b backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgb(216_185_120_/_0.9)] bg-[color:var(--gold-soft)] font-black text-[color:var(--brown)] shadow-[0_8px_18px_rgb(74_42_22_/_0.12)]">
            NQ
          </span>
          <span className="magic-heading text-lg font-black">{siteContent.name}</span>
        </Link>
          <button
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--cream)] px-3 py-2 text-sm font-black text-[color:var(--brown)] md:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/login" className={linkClass}>Login</NavLink>
        </div>
        </div>
        {open ? (
          <div className="mt-3 grid gap-2 border-t border-[rgb(216_185_120_/_0.55)] pt-3 md:hidden">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
            <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Login</NavLink>
          </div>
        ) : null}
      </nav>
    </header>
  )
}

export default PublicNavbar
