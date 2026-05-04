// Test-only session state. The mock factory in tests/setup.ts reads
// `currentUserId` to decide what `getSession()` returns. Tests call
// `setSessionUser(id)` to sign in as that user, or `setSessionUser(null)`
// to simulate unauthenticated.
let currentUserId: string | null = null

export function setSessionUser(userId: string | null): void {
  currentUserId = userId
}

export function getCurrentUserId(): string | null {
  return currentUserId
}
