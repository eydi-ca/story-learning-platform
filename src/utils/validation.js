export const FIELD_LIMITS = {
  nameMax: 80,
  identifierMax: 64,
  passwordMin: 8,
  passwordMax: 32,
}

const identifierPattern = /^[a-zA-Z0-9._@-]+$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateIdentifier(identifier, label = 'Email or username') {
  const value = identifier.trim()

  if (!value) return `${label} is required.`
  if (value.length > FIELD_LIMITS.identifierMax) {
    return `${label} must be ${FIELD_LIMITS.identifierMax} characters or fewer.`
  }
  if (!identifierPattern.test(value)) {
    return `${label} can only use letters, numbers, dots, underscores, hyphens, and @.`
  }
  if (value.includes('@') && !emailPattern.test(value)) {
    return 'Please enter a valid email address.'
  }

  return ''
}

export function validatePassword(password) {
  if (!password) return 'Password is required.'
  if (password.length < FIELD_LIMITS.passwordMin) {
    return `Password must be at least ${FIELD_LIMITS.passwordMin} characters.`
  }
  if (password.length > FIELD_LIMITS.passwordMax) {
    return `Password must be ${FIELD_LIMITS.passwordMax} characters or fewer.`
  }
  return ''
}

export function validateFullName(fullName) {
  const value = fullName.trim()
  if (!value) return 'Full name is required.'
  if (value.length > FIELD_LIMITS.nameMax) {
    return `Full name must be ${FIELD_LIMITS.nameMax} characters or fewer.`
  }
  return ''
}
