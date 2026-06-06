import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/navigation/PublicNavbar'
import Footer from '../components/navigation/Footer'

function PublicLayout() {
  return (
    <div className="storybook-bg min-h-screen">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
