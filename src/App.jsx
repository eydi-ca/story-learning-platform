import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'
import StudentLayout from './layouts/StudentLayout'
import TeacherLayout from './layouts/TeacherLayout'
import AboutPage from './pages/AboutPage'
import ActivityPage from './pages/ActivityPage'
import AdminClassStudents from './pages/AdminClassStudents'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminReports from './pages/AdminReports'
import AdminStudents from './pages/AdminStudents'
import AdminTeacherClasses from './pages/AdminTeacherClasses'
import AdminTeachers from './pages/AdminTeachers'
import ChapterPage from './pages/ChapterPage'
import ChooseRolePage from './pages/ChooseRolePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ResultPage from './pages/ResultPage'
import SignupPage from './pages/SignupPage'
import StudentChaptersPage from './pages/StudentChaptersPage'
import StudentJoinClassPage from './pages/StudentJoinClassPage'
import StudentProfile from './pages/StudentProfile'
import StudentProfileSettings from './pages/StudentProfileSettings'
import StudentProgressPage from './pages/StudentProgressPage'
import TeacherClassStudents from './pages/TeacherClassStudents'
import TeacherClasses from './pages/TeacherClasses'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherProfile from './pages/TeacherProfile'
import TeacherProfileSettings from './pages/TeacherProfileSettings'
import { getCurrentUser, isAdminLoggedIn } from './utils/auth'

function RoleGuard({ role, children }) {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  if (!user.role) return <Navigate to="/choose-role" replace />
  if (user.role !== role) {
    return <Navigate to={user.role === 'student' ? '/student/chapters' : '/teacher/dashboard'} replace />
  }
  return children
}

function AdminGuard({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/choose-role" element={<ChooseRolePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      <Route path="/student" element={<RoleGuard role="student"><StudentLayout /></RoleGuard>}>
        <Route index element={<Navigate to="/student/chapters" replace />} />
        <Route path="join-class" element={<StudentJoinClassPage />} />
        <Route path="chapters" element={<StudentChaptersPage />} />
        <Route path="chapter/:chapterId" element={<ChapterPage />} />
        <Route path="chapter/:chapterId/activity" element={<ActivityPage />} />
        <Route path="result/:chapterId" element={<ResultPage />} />
        <Route path="progress" element={<StudentProgressPage />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="profile/settings" element={<StudentProfileSettings />} />
      </Route>

      <Route path="/teacher" element={<RoleGuard role="teacher"><TeacherLayout /></RoleGuard>}>
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="classes/:classId/students" element={<TeacherClassStudents />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="profile/settings" element={<TeacherProfileSettings />} />
      </Route>

      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="teachers/:teacherId/classes" element={<AdminTeacherClasses />} />
        <Route path="classes/:classId/students" element={<AdminClassStudents />} />
        <Route path="students" element={<AdminStudents />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
