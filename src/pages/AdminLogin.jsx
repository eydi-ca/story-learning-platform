import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../components/forms/PasswordField'
import { FIELD_LIMITS, getAdminLoginGuard, loginAdmin } from '../utils/auth'

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const [guard, setGuard] = useState(getAdminLoginGuard())

  useEffect(() => {
    if (!guard.locked) return undefined
    const timer = window.setInterval(() => setGuard(getAdminLoginGuard()), 1000)
    return () => window.clearInterval(timer)
  }, [guard.locked])

  async function handleSubmit(event) {
    event.preventDefault()
    const result = await loginAdmin(form)
    if (result.error) {
      setError(result.error)
      setGuard(getAdminLoginGuard())
      return
    }
    navigate('/admin/dashboard')
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-black text-slate-950">Admin Login</h1>
      <form className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        {error ? <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-700">{error}</p> : null}
        {guard.locked ? (
          <p className="rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            Admin login is temporarily locked. Try again in {guard.secondsRemaining} seconds.
          </p>
        ) : null}
        <label className="block text-sm font-bold text-slate-700" htmlFor="admin-identifier">Admin username/email
          <input
            autoComplete="username"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            id="admin-identifier"
            maxLength={FIELD_LIMITS.identifierMax}
            placeholder="admin"
            value={form.identifier}
            onChange={(event) => setForm({ ...form, identifier: event.target.value })}
          />
        </label>
        <PasswordField
          id="admin-password"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />
        <button className="gold-button w-full rounded-lg px-4 py-3 font-bold" disabled={guard.locked}>
          Login
        </button>
        <p className="text-sm text-slate-500">Demo admin: <span className="font-bold">admin</span> / <span className="font-bold">admin123</span></p>
      </form>
    </section>
  )
}

export default AdminLogin
