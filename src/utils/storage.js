import { demoClasses, demoMemberships, demoProgress, demoUsers } from '../data/demoData'
import { isSupabaseConfigured } from '../lib/supabase'

export const STORAGE_KEYS = {
  users: 'story_app_users',
  session: 'story_app_session',
  adminSession: 'story_app_admin_session',
  adminLoginGuard: 'story_app_admin_login_guard',
  classes: 'story_app_classes',
  memberships: 'story_app_memberships',
  progress: 'story_app_progress',
  results: 'story_app_results',
  activeClass: 'story_app_active_class',
}

export const ADMIN_CREDENTIALS = {
  identifiers: ['admin', 'admin@numberlandquest.local'],
  password: 'admin123',
  name: 'Platform Admin',
}

export function readJson(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function isoNow() {
  return new Date().toISOString()
}

export function ensureSeedData() {
  if (isSupabaseConfigured) return

  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    writeJson(STORAGE_KEYS.users, demoUsers)
  } else {
    const users = readJson(STORAGE_KEYS.users, [])
    const mergedUsers = [
      ...users,
      ...demoUsers.filter((demoUser) => !users.some((user) => user.email === demoUser.email)),
    ]
    writeJson(STORAGE_KEYS.users, mergedUsers)
  }

  if (!localStorage.getItem(STORAGE_KEYS.classes)) {
    writeJson(STORAGE_KEYS.classes, demoClasses)
  } else {
    const classes = readJson(STORAGE_KEYS.classes, [])
    const mergedClasses = [
      ...classes,
      ...demoClasses.filter(
        (demoClass) => !classes.some((classroom) => classroom.classCode === demoClass.classCode)
      ),
    ]
    writeJson(STORAGE_KEYS.classes, mergedClasses)
  }

  if (!localStorage.getItem(STORAGE_KEYS.memberships)) {
    writeJson(STORAGE_KEYS.memberships, demoMemberships)
  } else {
    const memberships = readJson(STORAGE_KEYS.memberships, [])
    const mergedMemberships = [
      ...memberships,
      ...demoMemberships.filter(
        (demoMembership) =>
          !memberships.some(
            (membership) =>
              membership.studentId === demoMembership.studentId &&
              membership.classId === demoMembership.classId
          )
      ),
    ]
    writeJson(STORAGE_KEYS.memberships, mergedMemberships)
  }

  if (!localStorage.getItem(STORAGE_KEYS.progress)) {
    writeJson(STORAGE_KEYS.progress, demoProgress)
  }
  if (!localStorage.getItem(STORAGE_KEYS.results)) writeJson(STORAGE_KEYS.results, [])
}

export function getUsers() {
  ensureSeedData()
  return readJson(STORAGE_KEYS.users, [])
}

export function saveUsers(users) {
  writeJson(STORAGE_KEYS.users, users)
}

export function getClasses() {
  ensureSeedData()
  return readJson(STORAGE_KEYS.classes, [])
}

export function saveClasses(classes) {
  writeJson(STORAGE_KEYS.classes, classes)
}

export function getMemberships() {
  ensureSeedData()
  return readJson(STORAGE_KEYS.memberships, [])
}

export function saveMemberships(memberships) {
  writeJson(STORAGE_KEYS.memberships, memberships)
}

export function getProgressRecords() {
  ensureSeedData()
  return readJson(STORAGE_KEYS.progress, [])
}

export function saveProgressRecords(progress) {
  writeJson(STORAGE_KEYS.progress, progress)
}

export function getResults() {
  ensureSeedData()
  return readJson(STORAGE_KEYS.results, [])
}

export function saveResults(results) {
  writeJson(STORAGE_KEYS.results, results)
}

export function getCurrentSession() {
  ensureSeedData()
  return readJson(STORAGE_KEYS.session, null)
}

export function setCurrentSession(session) {
  writeJson(STORAGE_KEYS.session, session)
}

export function clearCurrentSession() {
  localStorage.removeItem(STORAGE_KEYS.session)
}

export function getAdminSession() {
  return readJson(STORAGE_KEYS.adminSession, null)
}

export function setAdminSession(session) {
  writeJson(STORAGE_KEYS.adminSession, session)
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEYS.adminSession)
}

export function getActiveClassId(studentId) {
  const activeMap = readJson(STORAGE_KEYS.activeClass, {})
  return activeMap[studentId] ?? null
}

export function setActiveClassId(studentId, classId) {
  const activeMap = readJson(STORAGE_KEYS.activeClass, {})
  writeJson(STORAGE_KEYS.activeClass, { ...activeMap, [studentId]: classId })
}

export function stamp() {
  return isoNow()
}
