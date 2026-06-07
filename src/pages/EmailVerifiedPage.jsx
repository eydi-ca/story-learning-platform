import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { clearCurrentSession } from '../utils/storage'
import { syncCurrentSessionData } from '../utils/supabaseSync'

function EmailVerifiedPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Verifying your email...')
  const [success, setSuccess] = useState(false)

  const authParams = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))

    return {
      code: searchParams.get('code'),
      tokenHash: searchParams.get('token_hash') ?? hashParams.get('token_hash'),
      type: searchParams.get('type') ?? hashParams.get('type'),
      accessToken: searchParams.get('access_token') ?? hashParams.get('access_token'),
      refreshToken: searchParams.get('refresh_token') ?? hashParams.get('refresh_token'),
      error: searchParams.get('error') ?? hashParams.get('error'),
      errorDescription:
        searchParams.get('error_description') ?? hashParams.get('error_description'),
    }
  }, [])

  useEffect(() => {
    let active = true

    async function handleVerification() {
      if (!isSupabaseConfigured) {
        if (active) {
          setSuccess(true)
          setStatus('Email verified. Redirecting to login...')
          window.setTimeout(() => navigate('/login', { replace: true }), 1600)
        }
        return
      }

      if (authParams.error) {
        if (active) {
          setStatus(authParams.errorDescription ?? 'This verification link is invalid or expired.')
        }
        return
      }

      try {
        if (authParams.accessToken && authParams.refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: authParams.accessToken,
            refresh_token: authParams.refreshToken,
          })
          if (error) throw error
        } else if (authParams.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(authParams.code)
          if (error) throw error
        } else if (authParams.tokenHash && authParams.type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: authParams.tokenHash,
            type: authParams.type,
          })
          if (error) throw error
        } else {
          throw new Error('This verification link is invalid or incomplete.')
        }

        await new Promise((resolve) => window.setTimeout(resolve, 900))
        const synced = await syncCurrentSessionData()
        if (!synced.user) {
          throw new Error('We could not confirm your verified session.')
        }

        await supabase.auth.signOut()
        clearCurrentSession()

        if (active) {
          setSuccess(true)
          setStatus('Email verified. Redirecting to login...')
          window.setTimeout(
            () =>
              navigate('/login', {
                replace: true,
                state: { message: 'Email verified successfully. You can now log in.' },
              }),
            1600
          )
        }
      } catch (error) {
        if (active) {
          setStatus(error.message || 'This verification link is invalid or expired.')
        }
      }
    }

    void handleVerification()

    return () => {
      active = false
    }
  }, [
    authParams.accessToken,
    authParams.code,
    authParams.error,
    authParams.errorDescription,
    authParams.refreshToken,
    authParams.tokenHash,
    authParams.type,
    navigate,
  ])

  return (
    <section className="mx-auto max-w-lg px-4 py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
            success ? 'bg-emerald-100' : 'bg-sky-100'
          }`}
        >
          {success ? '✓' : '...'}
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-950">
          {success ? 'Email verified' : 'Confirming email'}
        </h1>
        <p className="mt-3 text-slate-600">{status}</p>
        {!success ? (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
            <span>Loading...</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default EmailVerifiedPage
