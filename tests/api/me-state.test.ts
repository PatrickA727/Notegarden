import { describe, expect, it } from 'vitest'
import { GET } from '@/app/api/me/state/route'
import { db } from '@/lib/db'
import { modeStats, weaknessBucket } from '@/db/schema'
import { TEST_USER_A, TEST_USER_B } from '../helpers/db'
import { setSessionUser } from '../helpers/session'

// Describe: Groups a bunch of related tests together, usually for a specific function or endpoint.
// Expect: Assertion library used to check if values are what we expect.
// It: Defines an individual test case. The string describes what the test is checking.

describe('GET /api/me/state', () => {
  it('returns 401 when unauthenticated', async () => {
    setSessionUser(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns empty arrays for a signed-in user with no rows', async () => {
    setSessionUser(TEST_USER_A)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ modeStats: [], weaknessBuckets: [] })
  })

  it('returns rows for the current user when seeded', async () => {
    await db.insert(modeStats).values({
      userId: TEST_USER_A,
      mode: 'identify',
      attempts: 10,
      correct: 7,
      totalTimeMs: 12_000,
      rounds: 0,
      bestStreak: 4,
    })
    await db.insert(weaknessBucket).values({
      userId: TEST_USER_A,
      mode: 'identify',
      key: '0-3',
      attempts: 5,
      correct: 4,
    })

    setSessionUser(TEST_USER_A)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(body.modeStats).toHaveLength(1)
    expect(body.modeStats[0]).toMatchObject({
      mode: 'identify',
      attempts: 10,
      correct: 7,
      totalTimeMs: 12_000,
      rounds: 0,
      bestStreak: 4,
    })
    expect(body.weaknessBuckets).toHaveLength(1)
    expect(body.weaknessBuckets[0]).toMatchObject({
      mode: 'identify',
      key: '0-3',
      attempts: 5,
      correct: 4,
    })
  })

  it('does not leak other users data (cross-user isolation)', async () => {
    await db.insert(modeStats).values({
      userId: TEST_USER_B,
      mode: 'sweep',
      attempts: 99,
      correct: 99,
      totalTimeMs: 999,
      rounds: 9,
      bestStreak: 9,
    })

    setSessionUser(TEST_USER_A)
    const res = await GET()
    const body = await res.json()
    expect(body).toEqual({ modeStats: [], weaknessBuckets: [] })
  })

  it('does not include userId or updatedAt in the projection', async () => {
    await db.insert(modeStats).values({
      userId: TEST_USER_A,
      mode: 'locate',
      attempts: 1,
      correct: 1,
      totalTimeMs: 100,
      rounds: 0,
      bestStreak: 1,
    })
    await db.insert(weaknessBucket).values({
      userId: TEST_USER_A,
      mode: 'locate',
      key: '2-4',
      attempts: 1,
      correct: 1,
    })

    setSessionUser(TEST_USER_A)
    const res = await GET()
    const body = await res.json()

    for (const row of body.modeStats) {
      expect(row).not.toHaveProperty('userId')
      expect(row).not.toHaveProperty('updatedAt')
    }
    for (const row of body.weaknessBuckets) {
      expect(row).not.toHaveProperty('userId')
      expect(row).not.toHaveProperty('updatedAt')
    }
  })
})
