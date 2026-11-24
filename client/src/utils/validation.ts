const BLOCKED_LOCAL_PARTS = new Set([
  'test',
  'testing',
  'fake',
  'asdf',
  'qwerty',
  'none',
  'na',
  'null',
  'noemail',
  'example',
  'sample',
  'demo',
  'abc',
  'xyz',
  '123',
  '1234',
  '12345',
])

const BLOCKED_DOMAINS = new Set([
  'test.com',
  'example.com',
  'example.org',
  'example.net',
  'fake.com',
  'asdf.com',
  'qwerty.com',
  'mailinator.com',
  'tempmail.com',
  'throwaway.com',
  'domain.com',
  'email.com',
  'none.com',
  'invalid.com',
  'localhost.com',
])

const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Validates that an email address is syntactically sound and not an obvious placeholder/nonsense value.
 */
export function getEmailValidationError(rawEmail: string): string | null {
  const email = rawEmail.trim().toLowerCase()

  if (!email) {
    return 'Email address is required.'
  }

  if (email.length > 254 || !STRICT_EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address (e.g. name@hospital.org).'
  }

  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) {
    return 'Please enter a valid email address.'
  }

  if (
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    domain.startsWith('.') ||
    domain.endsWith('.') ||
    domain.includes('..')
  ) {
    return 'Please enter a valid email address.'
  }

  const domainParts = domain.split('.')
  const tld = domainParts[domainParts.length - 1]
  const sld = domainParts[domainParts.length - 2] || ''

  if (!tld || !/^[a-z]{2,12}$/.test(tld)) {
    return 'Please enter a valid email domain.'
  }

  if (/^\d+$/.test(sld) || sld.length < 2) {
    return 'Please enter a valid email domain.'
  }

  if (BLOCKED_DOMAINS.has(domain)) {
    return 'Please enter your real work or personal email address.'
  }

  if (BLOCKED_LOCAL_PARTS.has(localPart) && sld === localPart) {
    return 'Please enter your real work or personal email address.'
  }

  return null
}

export function isValidEmail(rawEmail: string): boolean {
  return getEmailValidationError(rawEmail) === null
}
