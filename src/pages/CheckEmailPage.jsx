import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { resendSignupVerification } from '../utils/auth'

function CheckEmailPage() {
  const location = useLocation()
  const email = location.state?.email ?? 'your email address'
  const message = location.state?.message ?? 'Please check your email to continue.'
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function handleResend() {
    setFeedback('')
    setError('')
    setIsSending(true)

    const result = await resendSignupVerification(email)
    if (result.error) {
      setError(result.error)
      setIsSending(false)
      return
    }

    setFeedback(result.message)
    setIsSending(false)
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          ✉
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-950">Check your email</h1>
        <p className="mt-3 text-slate-600">{message}</p>
        <p className="mt-2 text-sm text-slate-500">
          We sent a verification link to <span className="font-semibold text-slate-700">{email}</span>.
        </p>

        {feedback ? (
          <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{feedback}</p>
        ) : null}
        {error ? (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60"
            onClick={() => void handleResend()}
            disabled={isSending}
          >
            {isSending ? 'Resending...' : 'Resend verification email'}
          </button>
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to="/login">
            Return to login
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Check spam or junk if the message does not appear within a minute.
        </p>
      </div>
    </section>
  )
}

export default CheckEmailPage
