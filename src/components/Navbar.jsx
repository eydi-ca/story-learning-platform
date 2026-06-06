import { NavLink } from 'react-router-dom'

function getNavLinkClass(isActive) {
  return [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-slate-900 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')
}

function Navbar({ brand, subtitle, links, action }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <NavLink to="/" className="text-lg font-black tracking-tight text-indigo-700">
            {brand}
          </NavLink>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {action ? (
            <button
              type="button"
              onClick={action.onClick}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {action.label}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Navbar
