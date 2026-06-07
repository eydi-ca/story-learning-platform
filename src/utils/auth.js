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
  validateEmailAddress,
  validateFullName,
  validatePassword,
} from './validation'

const ADMIN_LOCKOUT_MS = 60 * 1000
const ADMIN_MAX_ATTEMPTS = 3

function toFriendlyAuthError(error, fallbackMessage) {
  if (!error) return fallbackMessage

  const message = error.message || fallbackMessage
  const normalized = message.toLowerCase()

  if (normalized.includes('email not confirmed')) {
    return 'Please verify your email first. Check your email inbox.'
  }

  if (normalized.includes('invalid login credentials')) {
    return 'Incorrect email or password.'
  }

  if (normalized.includes('database error saving new user')) {
    return 'Account creation is failing in Supabase right now. Please check your Auth email settings and database trigger setup.'
  }

  if (normalized.includes('profile record')) {
    return 'Your email was verified, but your profile is still being prepared. Please try logging in again.'
  }

  if (error.status === 500 || normalized.includes('unexpected_failure')) {
    return fallbackMessage
  }

  return message
}

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
  const emailError = validateEmailAddress(cleanEmail)
  const passwordError = validatePassword(password)

  if (nameError) return { error: nameError }
  if (emailError) return { error: emailError }
  if (passwordError) return { error: passwordError }
  if (!confirmPassword) return { error: 'Confirm password is required.' }

  if (password !== confirmPassword) {
    return { error: 'Passwords must match.' }
  }

  if (!isSupabaseConfigured && getUsers().some((user) => normalizeEmail(user.email) === cleanEmail)) {
    return { error: 'An account with that email already exists.' }
  }

  if (isSupabaseConfigured) {
    try {
      const emailRedirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/verified`
          : undefined

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: cleanName,
            avatar: avatar || 'rainbow_guardian',
            role: null,
          },
        },
      })

      if (error) {
        return { error: toFriendlyAuthError(error, 'Unable to create your account right now.') }
      }

      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          error:
            'An account with that email already exists. Please verify that email or try logging in instead.',
        }
      }

      if (!data.session) {
        return {
          pendingVerification: true,
          message: 'Check your email inbox and verify your account before logging in.',
        }
      }

      const synced = await syncCurrentSessionData()
      if (!synced.user) {
        return { error: 'Your account was created, but we could not finish signing you in.' }
      }

      return {
        user:
          data.user && {
            id: data.user.id,
            fullName: synced.user.fullName ?? cleanName,
            email: synced.user.email ?? cleanEmail,
            role: synced.user.role ?? null,
            avatar: synced.user.avatar ?? (avatar || 'rainbow_guardian'),
            createdAt: data.user.created_at ?? stamp(),
          },
      }
    } catch (error) {
      return {
        error: toFriendlyAuthError(error, 'Unable to create your account right now.'),
      }
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

export async function resendSignupVerification(email) {
  const cleanEmail = normalizeEmail(email)
  const emailError = validateEmailAddress(cleanEmail)
  if (emailError) return { error: emailError }

  if (!isSupabaseConfigured) {
    return { error: 'Email verification resend is only available when Supabase Auth is enabled.' }
  }

  try {
    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/verified`
        : undefined

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: {
        emailRedirectTo,
      },
    })

    if (error) {
      return { error: toFriendlyAuthError(error, 'We could not resend the verification email right now.') }
    }

    return { ok: true, message: 'Verification email sent. Please check your inbox and spam folder.' }
  } catch (error) {
    return {
      error: toFriendlyAuthError(error, 'We could not resend the verification email right now.'),
    }
  }
}

export async function loginUser({ email, password }) {
  const cleanEmail = normalizeEmail(email)
  const emailError = validateEmailAddress(cleanEmail)
  const passwordError = validatePassword(password)

  if (emailError) return { error: emailError }
  if (passwordError) return { error: passwordError }

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        return { error: toFriendlyAuthError(error, 'Unable to sign in right now.') }
      }

      const synced = await syncCurrentSessionData()
      if (!synced.user) {
        return { error: 'We could not load your account profile after login.' }
      }
      if (synced.user?.status === 'disabled') {
        await supabase.auth.signOut()
        clearCurrentSession()
        return { error: 'This account has been disabled.' }
      }
      return { user: synced.user }
    } catch (error) {
      return {
        error: toFriendlyAuthError(error, 'Unable to sign in right now.'),
      }
    }
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

export async function changeCurrentUserPassword({ currentPassword, newPassword, confirmPassword }) {
  const currentUser = getCurrentUser()
  if (!currentUser) return { error: 'Please sign in first.' }

  const currentPasswordError = validatePassword(currentPassword)
  const newPasswordError = validatePassword(newPassword)

  if (currentPasswordError) return { error: 'Current password is required.' }
  if (newPasswordError) return { error: newPasswordError }
  if (!confirmPassword) return { error: 'Confirm password is required.' }
  if (newPassword !== confirmPassword) return { error: 'New passwords must match.' }
  if (currentPassword === newPassword) return { error: 'New password must be different from the current password.' }

  if (isSupabaseConfigured) {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      })

      if (signInError) {
        return { error: 'Current password is incorrect.' }
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        return { error: toFriendlyAuthError(error, 'Unable to update password right now.') }
      }

      return { ok: true }
    } catch (error) {
      return { error: toFriendlyAuthError(error, 'Unable to update password right now.') }
    }
  }

  const users = getUsers()
  const currentLocalUser = users.find((user) => user.id === currentUser.id)
  if (!currentLocalUser || currentLocalUser.password !== currentPassword) {
    return { error: 'Current password is incorrect.' }
  }

  saveUsers(
    users.map((user) => (user.id === currentUser.id ? { ...user, password: newPassword } : user))
  )

  return { ok: true }
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
  const cleanEmail = normalizeEmail(email ?? identifier ?? '')
  const emailError = validateEmailAddress(cleanEmail, 'Admin email')
  const passwordError = validatePassword(password)
  if (emailError) return { error: emailError }
  if (passwordError) return { error: passwordError }

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (!error) {
        const synced = await syncCurrentSessionData()
        if (!synced.user) {
          return { error: 'We could not load your admin profile after login.' }
        }
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
    } catch (error) {
      return {
        error: toFriendlyAuthError(error, 'Unable to sign in right now.'),
      }
    }
  } else {
    const matches =
      ADMIN_CREDENTIALS.identifiers.includes(cleanEmail) &&
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
  if (user?.role === 'admin') return '/admin/dashboard'
  if (!user?.role) return '/choose-role'
  if (user.role === 'teacher') return '/teacher/dashboard'
  return '/student/chapters'
}

export { FIELD_LIMITS }
