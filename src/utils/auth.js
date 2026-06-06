import {
  ADMIN_CREDENTIALS,
  STORAGE_KEYS,
  clearAdminSession,
  clearCurrentSession,
  createId,
  getAdminSession,
  getCurrentSession,
  getUsers,
  readJson,
  saveUsers,
  setAdminSession,
  setCurrentSession,
  stamp,
  writeJson,
} from './storage'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { syncCurrentSessionData } from './supabaseSync'
import {
  FIELD_LIMITS,
  validateFullName,
  validateIdentifier,
  validatePassword,
} from './validation'

const ADMIN_LOCKOUT_MS = 60 * 1000
const ADMIN_MAX_ATTEMPTS = 3

export function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function getUserById(userId) {
  return getUsers().find((user) => user.id === userId) ?? null
}

export function getCurrentUser() {
  const session = getCurrentSession()
  if (!session?.userId) return null
  return getUserById(session.userId)
}

export async function signupUser({ fullName, email, password, confirmPassword, avatar }) {
  const cleanName = fullName.trim()
  const cleanEmail = normalizeEmail(email)
  const nameError = validateFullName(cleanName)
  const identifierError = validateIdentifier(cleanEmail)
  const passwordError = validatePassword(password)

  if (nameError) return { error: nameError }
  if (identifierError) return { error: identifierError }
  if (passwordError) return { error: passwordError }
  if (!confirmPassword) return { error: 'Confirm password is required.' }

  if (password !== confirmPassword) {
    return { error: 'Passwords must match.' }
  }

  if (getUsers().some((user) => normalizeEmail(user.email) === cleanEmail)) {
    return { error: 'An account with that email already exists.' }
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          avatar: avatar || 'rainbow_guardian',
          role: null,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    await syncCurrentSessionData()

    return {
      user:
        data.user && {
          id: data.user.id,
          fullName: cleanName,
          email: cleanEmail,
          role: null,
          avatar: avatar || 'rainbow_guardian',
          createdAt: data.user.created_at ?? stamp(),
        },
    }
  }

  const user = {
    id: createId('user'),
    fullName: cleanName,
    email: cleanEmail,
    password,
    role: null,
    avatar: avatar || 'rainbow_guardian',
    createdAt: stamp(),
  }

  saveUsers([...getUsers(), user])
  setCurrentSession({ userId: user.id, role: null, createdAt: stamp() })

  return { user }
}

export async function loginUser({ email, password }) {
  const cleanEmail = normalizeEmail(email)
  const identifierError = validateIdentifier(cleanEmail)
  const passwordError = validatePassword(password)

  if (identifierError) return { error: identifierError }
  if (passwordError) return { error: passwordError }

  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error) return { error: error.message }

    const synced = await syncCurrentSessionData()
    if (synced.user?.status === 'disabled') {
      await supabase.auth.signOut()
      clearCurrentSession()
      return { error: 'This account has been disabled.' }
    }
    return { user: synced.user }
  }

  const user = getUsers().find(
    (item) => normalizeEmail(item.email) === cleanEmail && item.password === password
  )

  if (!user) return { error: 'Invalid login details.' }

  setCurrentSession({ userId: user.id, role: user.role, createdAt: stamp() })
  return { user }
}

export async function chooseRole(role) {
  const currentUser = getCurrentUser()
  if (!currentUser) return { error: 'Please sign in first.' }
  if (!['student', 'teacher'].includes(role)) return { error: 'Invalid role.' }

  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', currentUser.id)

    if (error) return { error: error.message }

    const synced = await syncCurrentSessionData()
    return { user: synced.user }
  }

  const users = getUsers().map((user) =>
    user.id === currentUser.id ? { ...user, role } : user
  )
  saveUsers(users)
  setCurrentSession({ userId: currentUser.id, role, createdAt: stamp() })

  return { user: { ...currentUser, role } }
}

export async function updateCurrentUser(updates) {
  const currentUser = getCurrentUser()
  if (!currentUser) return null

  if (isSupabaseConfigured) {
    const nextProfile = {
      full_name: updates.fullName ?? currentUser.fullName,
      avatar: updates.avatar ?? currentUser.avatar,
    }

    const { error } = await supabase
      .from('profiles')
      .update(nextProfile)
      .eq('id', currentUser.id)

    if (error) {
      throw error
    }

    await supabase.auth.updateUser({
      data: {
        full_name: nextProfile.full_name,
        avatar: nextProfile.avatar,
      },
    })

    const synced = await syncCurrentSessionData()
    return synced.user
  }

  const nextUser = { ...currentUser, ...updates }
  saveUsers(getUsers().map((user) => (user.id === currentUser.id ? nextUser : user)))
  setCurrentSession({ userId: nextUser.id, role: nextUser.role, createdAt: stamp() })
  return nextUser
}

export async function logoutUser() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut()
  }

  clearCurrentSession()
}

export function getAdminLoginGuard() {
  const guard = readJson(STORAGE_KEYS.adminLoginGuard, { attempts: 0, lockedUntil: null })
  const lockedUntil = guard.lockedUntil ? new Date(guard.lockedUntil).getTime() : 0

  if (lockedUntil && lockedUntil <= Date.now()) {
    writeJson(STORAGE_KEYS.adminLoginGuard, { attempts: 0, lockedUntil: null })
    return { attempts: 0, lockedUntil: null, locked: false, secondsRemaining: 0 }
  }

  return {
    ...guard,
    locked: Boolean(lockedUntil && lockedUntil > Date.now()),
    secondsRemaining: lockedUntil ? Math.ceil((lockedUntil - Date.now()) / 1000) : 0,
  }
}

export async function loginAdmin({ email, identifier, password }) {
  const rawIdentifier = identifier ?? email ?? ''
  const cleanIdentifier = normalizeEmail(rawIdentifier)
  const passwordError = validatePassword(password)
  if (!rawIdentifier.trim()) return { error: 'Admin username/email is required.' }
  if (passwordError) return { error: passwordError }

  const signInEmail =
    cleanIdentifier === 'admin' ? 'admin@numberlandquest.local' : cleanIdentifier

  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password,
    })

    if (!error) {
      const synced = await syncCurrentSessionData()
      if (synced.user?.status === 'disabled') {
        await supabase.auth.signOut()
        clearAdminSession()
        clearCurrentSession()
        return { error: 'This admin account has been disabled.' }
      }
      if (synced.user?.role !== 'admin') {
        await supabase.auth.signOut()
        clearAdminSession()
        clearCurrentSession()
        return { error: 'This account is not an admin account.' }
      }

      writeJson(STORAGE_KEYS.adminLoginGuard, { attempts: 0, lockedUntil: null })
      setAdminSession({ name: synced.user.fullName, createdAt: stamp() })
      return { ok: true }
    }
  } else {
    const identifierError = validateIdentifier(cleanIdentifier, 'Admin username/email')
    if (identifierError) return { error: identifierError }

    const matches =
      ADMIN_CREDENTIALS.identifiers.includes(cleanIdentifier) &&
      password === ADMIN_CREDENTIALS.password

    if (matches) {
      writeJson(STORAGE_KEYS.adminLoginGuard, { attempts: 0, lockedUntil: null })
      setAdminSession({ name: ADMIN_CREDENTIALS.name, createdAt: stamp() })
      return { ok: true }
    }
  }

  const guard = getAdminLoginGuard()
  if (guard.locked) {
    return { error: `Too many invalid attempts. Try again in ${guard.secondsRemaining} seconds.` }
  }

  const attempts = guard.attempts + 1
  if (attempts >= ADMIN_MAX_ATTEMPTS) {
    const lockedUntil = new Date(Date.now() + ADMIN_LOCKOUT_MS).toISOString()
    writeJson(STORAGE_KEYS.adminLoginGuard, { attempts: 0, lockedUntil })
    return { error: 'Too many invalid attempts. Admin login is locked for 60 seconds.' }
  }

  writeJson(STORAGE_KEYS.adminLoginGuard, { attempts, lockedUntil: null })
  return { error: `Invalid admin credentials. ${ADMIN_MAX_ATTEMPTS - attempts} attempt(s) remaining.` }
}

export function isAdminLoggedIn() {
  return Boolean(getAdminSession())
}

export async function logoutAdmin() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut()
  }
  clearAdminSession()
  clearCurrentSession()
}

export function getRedirectForUser(user) {
  if (!user?.role) return '/choose-role'
  if (user.role === 'teacher') return '/teacher/dashboard'
  return '/student/chapters'
}

export { FIELD_LIMITS }
