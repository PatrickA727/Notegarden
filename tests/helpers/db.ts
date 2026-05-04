import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { user } from '@/db/schema'

export const TEST_USER_A = 'test-user-a'
export const TEST_USER_B = 'test-user-b'

export async function truncateAppTables(): Promise<void> {
  await db.execute(sql`
    TRUNCATE TABLE
      sync_request,
      weakness_bucket,
      mode_stats,
      "session",
      "account",
      "user"
    RESTART IDENTITY CASCADE
  `)
}

export async function seedTestUsers(): Promise<void> {
  await db
    .insert(user)
    .values([
      { id: TEST_USER_A, name: 'Test A', email: 'a@test.local' },
      { id: TEST_USER_B, name: 'Test B', email: 'b@test.local' },
    ])
}
