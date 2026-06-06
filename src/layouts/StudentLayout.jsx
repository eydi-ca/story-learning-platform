import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import StudentTopBar from '../components/navigation/StudentTopBar'
import { syncCurrentSessionData } from '../utils/supabaseSync'

function StudentLayout() {
  const [ready, setReady] = useState(false)

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

  return (
    <div className="storybook-bg min-h-screen">
      <StudentTopBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default StudentLayout
