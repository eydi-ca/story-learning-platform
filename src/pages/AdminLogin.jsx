import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../components/forms/PasswordField'
import { FIELD_LIMITS, getAdminLoginGuard, loginAdmin } from '../utils/auth'

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [guard, setGuard] = useState(getAdminLoginGuard())
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!guard.locked) return undefined
    const timer = window.setInterval(() => setGuard(getAdminLoginGuard()), 1000)
    return () => window.clearInterval(timer)
  }, [guard.locked])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await loginAdmin(form)
      if (result.error) {
        setError(result.error)
        setGuard(getAdminLoginGuard())
        return
      }
      navigate('/admin/dashboard')
    } catch {
      setError('We could not complete your admin login. Please try again.')
      setGuard(getAdminLoginGuard())
    } finally {
      setIsSubmitting(false)
    }
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
        <label className="block text-sm font-bold text-slate-700" htmlFor="admin-email">Admin email
          <input
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            id="admin-email"
            inputMode="email"
            maxLength={FIELD_LIMITS.emailMax}
            placeholder="admin@example.com"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <PasswordField
          id="admin-password"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />
        <button className="gold-button w-full rounded-lg px-4 py-3 font-bold" disabled={guard.locked || isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Login'}
        </button>
        <p className="text-sm text-slate-500">Use your admin email and password.</p>
      </form>
    </section>
  )
}

export default AdminLogin
