import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/navigation/PublicNavbar'
import Footer from '../components/navigation/Footer'

function PublicLayout() {
  return (
    <div className="storybook-bg flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
