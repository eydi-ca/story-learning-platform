import { Link } from 'react-router-dom'
import { siteContent } from '../../data/siteContent'

function Footer() {
  return (
    <footer className="border-t border-[rgb(216_185_120_/_0.8)] bg-[color:var(--beige)]">
      <div className="mx-auto grid max-w-5xl gap-4 px-5 py-6 text-center text-sm text-[color:var(--muted)] md:grid-cols-[1fr_auto] md:items-start md:text-left">
        <div className="mx-auto max-w-2xl md:mx-0">
          <p className="magic-heading font-black">{siteContent.name}</p>
          <p className="mt-1 max-w-2xl">{siteContent.footer.description}</p>
          <p className="mt-1">Contact: {siteContent.footer.email}</p>
          <p className="mt-1">{siteContent.footer.copyright}</p>
        </div>
        <div className="mx-auto flex flex-col gap-1 font-semibold text-[color:var(--brown)] md:mx-0">
          <p className="mb-0.5 text-xs font-black uppercase tracking-wide text-[color:var(--muted)]">Links</p>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
