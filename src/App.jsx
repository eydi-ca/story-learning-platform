import { Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from '.pages/LandingPage'
import StudentStart from '.pages/StudentStart'
import ChapterSelection from '.pages/ChapterSelection'
import ChapterPage from '.pages/ChapterPage'
import ResultPage from '.pages/ResultPage'

import AdminLogin from '.pages/AdminLogin'
import AdminDashboard from '.pages/AdminDashboard'
import AdminStudents from '.pages/AdminStudents'
import AdminStudentDetails from '.pages/AdminStudentDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/student" element={<StudentStart />} />
      <Route path-="/student/chapters" element={<ChapterSelection />} />
      <Route path="/student/chapters/:chapterId" element={<ChapterPage />} />
      <Route path="/student/results" element={<ResultPage />} />
      
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/students" element={<AdminStudents />} />
      <Route path="/admin/students/:studentId" element={<AdminStudentDetails />} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App