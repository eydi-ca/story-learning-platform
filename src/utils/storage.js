const STUDENT_KEY = 'story_app_student'
const PROGRESS_KEY = 'story_app_progress'
const ADMIN_KEY = 'story_app_admin_logged_in'

export function saveStudent(student) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student))
}

export function getStudent() {
  const data = localStorage.getItem(STUDENT_KEY)
  return data ? JSON.parse(data) : null
}

export function clearStudent() {
  localStorage.removeItem(STUDENT_KEY)
}

export function saveProgress(progressItem) {
  const existing = getAllProgress()

  const updated = [
    ...existing.filter(
      (item) =>
        !(
          item.studentId === progressItem.studentId &&
          item.chapterId === progressItem.chapterId
        )
    ),
    progressItem,
  ]

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated))
}

export function getAllProgress() {
  const data = localStorage.getItem(PROGRESS_KEY)
  return data ? JSON.parse(data) : []
}

export function getStudentProgress(studentId) {
  return getAllProgress().filter((item) => item.studentId === studentId)
}

export function loginAdmin() {
  localStorage.setItem(ADMIN_KEY, 'true')
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY)
}

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_KEY) === 'true'
}