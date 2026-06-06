import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="font-semibold text-slate-700">Story Learning Platform</p>
          <p>Interactive story-based learning for classrooms and guided practice.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link to="/student/start" className="hover:text-slate-900">
            Student Entry
          </Link>
          <Link to="/teacher/login" className="hover:text-slate-900">
            Teacher Login
          </Link>
          <Link to="/admin/login" className="hover:text-slate-900">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
