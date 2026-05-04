// Setup before each test, ensures a clean DB, dummy session/users, etc.
import { config } from 'dotenv'
import path from 'node:path'
import { beforeEach, vi } from 'vitest'

config({ path: path.resolve(process.cwd(), '.env.test') })

vi.mock('@/lib/session', async () => {
  const { getCurrentUserId } = await import('./helpers/session')
  return {
    getSession: async () => {
      const id = getCurrentUserId()
      return id ? { user: { id } } : null
    },
  }
})

beforeEach(async () => {
  const { truncateAppTables, seedTestUsers } = await import('./helpers/db')
  const { setSessionUser } = await import('./helpers/session')
  setSessionUser(null)
  await truncateAppTables()
  await seedTestUsers()
})
