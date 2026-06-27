import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import StudentTopBar from '../components/navigation/StudentTopBar'
import { syncCurrentSessionData } from '../utils/supabaseSync'

function StudentLayout() {
  const [ready, setReady] = useState(false)
  const location = useLocation()

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

  if (!ready) {
    return <div className="storybook-bg min-h-screen" />
  }

  const isImmersiveStoryRoute =
    location.pathname === '/student/prologue' ||
    location.pathname.startsWith('/student/chapter/')

  return (
    <div className="storybook-bg min-h-screen">
      <StudentTopBar />
      <main className={`mx-auto max-w-6xl px-4 ${isImmersiveStoryRoute ? 'py-2' : 'py-8'}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default StudentLayout
