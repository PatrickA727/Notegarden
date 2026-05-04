import { describe, expect, it } from 'vitest'
import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { POST } from '@/app/api/me/sync/route'
import { db } from '@/lib/db'
import { modeStats, weaknessBucket, syncRequest } from '@/db/schema'
import { TEST_USER_A, TEST_USER_B } from '../helpers/db'
import { setSessionUser } from '../helpers/session'
import { postJson, postRaw } from '../helpers/request'

function modeDelta(overrides: Partial<{
  mode: 'identify' | 'locate' | 'sweep' | 'collector'
  attempts: number
  correct: number
  totalTimeMs: number
  rounds: number
  bestStreak: number
}> = {}) {
  return {
    mode: 'identify' as const,
    attempts: 1,
    correct: 1,
    totalTimeMs: 1000,
    rounds: 0,
    bestStreak: 1,
    ...overrides,
  }
}

async function getModeRow(userId: string, mode: 'identify' | 'locate' | 'sweep' | 'collector') {
  const rows = await db
    .select()
    .from(modeStats)
    .where(and(eq(modeStats.userId, userId), eq(modeStats.mode, mode)))
  return rows[0]
}

describe('POST /api/me/sync', () => {
  describe('auth and input validation', () => {
    it('returns 401 when unauthenticated', async () => {
      setSessionUser(null)
      const res = await POST(postJson({ requestId: randomUUID(), modeDeltas: [modeDelta()], weaknessDeltas: [] }))
      expect(res.status).toBe(401)
    })

    it('returns 400 on invalid JSON', async () => {
      setSessionUser(TEST_USER_A)
      const res = await POST(postRaw('{not json'))
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toBe('invalid json')
    })

    it('returns 400 on empty payload', async () => {
      setSessionUser(TEST_USER_A)
      const res = await POST(postJson({ requestId: randomUUID(), modeDeltas: [], weaknessDeltas: [] }))
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toBe('empty payload')
    })

    it('returns 400 when attempts exceed cap', async () => {
      setSessionUser(TEST_USER_A)
      const res = await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [modeDelta({ attempts: 100_001, correct: 0 })],
          weaknessDeltas: [],
        }),
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 on bad weakness key', async () => {
      setSessionUser(TEST_USER_A)
      const badKeys = ['6-3', '0-12', 'abc', '0', '-3']
      for (const key of badKeys) {
        const res = await POST(
          postJson({
            requestId: randomUUID(),
            modeDeltas: [],
            weaknessDeltas: [{ mode: 'identify', key, attempts: 1, correct: 0 }],
          }),
        )
        expect(res.status, `key=${key} should be rejected`).toBe(400)
      }
    })

    it('returns 400 when correct > attempts', async () => {
      setSessionUser(TEST_USER_A)
      const res = await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [modeDelta({ attempts: 2, correct: 5 })],
          weaknessDeltas: [],
        }),
      )
      expect(res.status).toBe(400)
    })
  })

  describe('UPSERT arithmetic', () => {
    it('first-time call inserts the row with absolute values', async () => {
      setSessionUser(TEST_USER_A)
      const res = await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [modeDelta({ attempts: 5, correct: 4, totalTimeMs: 10_000, rounds: 0, bestStreak: 3 })],
          weaknessDeltas: [],
        }),
      )
      expect(res.status).toBe(200)

      const row = await getModeRow(TEST_USER_A, 'identify')
      expect(row).toMatchObject({ attempts: 5, correct: 4, totalTimeMs: 10_000, rounds: 0, bestStreak: 3 })
    })

    it('subsequent call adds deltas to existing row', async () => {
      setSessionUser(TEST_USER_A)
      await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [modeDelta({ attempts: 3, correct: 2, totalTimeMs: 5_000, rounds: 0, bestStreak: 2 })],
          weaknessDeltas: [],
        }),
      )
      await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [modeDelta({ attempts: 4, correct: 3, totalTimeMs: 7_000, rounds: 0, bestStreak: 5 })],
          weaknessDeltas: [],
        }),
      )

      const row = await getModeRow(TEST_USER_A, 'identify')
      expect(row).toMatchObject({ attempts: 7, correct: 5, totalTimeMs: 12_000, rounds: 0, bestStreak: 5 })
    })

    it('bestStreak takes MAX and never decreases', async () => {
      setSessionUser(TEST_USER_A)
      await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [modeDelta({ attempts: 1, correct: 1, bestStreak: 5 })],
          weaknessDeltas: [],
        }),
      )
      await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [modeDelta({ attempts: 1, correct: 1, bestStreak: 3 })],
          weaknessDeltas: [],
        }),
      )

      const row = await getModeRow(TEST_USER_A, 'identify')
      expect(row.bestStreak).toBe(5)
    })

    it('weakness_bucket UPSERT sums attempts and correct on the same key', async () => {
      setSessionUser(TEST_USER_A)
      await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [],
          weaknessDeltas: [{ mode: 'identify', key: '0-3', attempts: 2, correct: 1 }],
        }),
      )
      await POST(
        postJson({
          requestId: randomUUID(),
          modeDeltas: [],
          weaknessDeltas: [{ mode: 'identify', key: '0-3', attempts: 3, correct: 2 }],
        }),
      )

      const rows = await db
        .select()
        .from(weaknessBucket)
        .where(
          and(
            eq(weaknessBucket.userId, TEST_USER_A),
            eq(weaknessBucket.mode, 'identify'),
            eq(weaknessBucket.key, '0-3'),
          ),
        )
      expect(rows).toHaveLength(1)
      expect(rows[0]).toMatchObject({ attempts: 5, correct: 3 })
    })
  })

  describe('idempotency', () => {
    it('dedupes a duplicate requestId; totals unchanged', async () => {
      setSessionUser(TEST_USER_A)
      const requestId = randomUUID()
      const payload = {
        requestId,
        modeDeltas: [modeDelta({ attempts: 4, correct: 3, totalTimeMs: 8_000, bestStreak: 2 })],
        weaknessDeltas: [],
      }

      const first = await POST(postJson(payload))
      expect(first.status).toBe(200)
      const firstBody = await first.json()
      expect(firstBody).toEqual({ ok: true })

      const second = await POST(postJson(payload))
      expect(second.status).toBe(200)
      const secondBody = await second.json()
      expect(secondBody).toEqual({ ok: true, deduped: true })

      const row = await getModeRow(TEST_USER_A, 'identify')
      expect(row).toMatchObject({ attempts: 4, correct: 3, totalTimeMs: 8_000, bestStreak: 2 })
    })

    it('cross-user requestId independence: same UUID for two users both apply', async () => {
      const requestId = randomUUID()
      const payload = {
        requestId,
        modeDeltas: [modeDelta({ attempts: 1, correct: 1 })],
        weaknessDeltas: [],
      }

      setSessionUser(TEST_USER_A)
      const aRes = await POST(postJson(payload))
      expect(aRes.status).toBe(200)
      expect(await aRes.json()).toEqual({ ok: true })

      setSessionUser(TEST_USER_B)
      const bRes = await POST(postJson(payload))
      expect(bRes.status).toBe(200)
      expect(await bRes.json()).toEqual({ ok: true })

      const aRow = await getModeRow(TEST_USER_A, 'identify')
      const bRow = await getModeRow(TEST_USER_B, 'identify')
      expect(aRow?.attempts).toBe(1)
      expect(bRow?.attempts).toBe(1)

      const syncRows = await db.select().from(syncRequest).where(eq(syncRequest.requestId, requestId))
      expect(syncRows).toHaveLength(2)
    })
  })

  describe('concurrency', () => {
    it('10 parallel syncs from the same user sum exactly (atomic UPDATE)', async () => {
      setSessionUser(TEST_USER_A)
      const N = 10

      const results = await Promise.all(
        Array.from({ length: N }, () =>
          POST(
            postJson({
              requestId: randomUUID(),
              modeDeltas: [modeDelta({ attempts: 1, correct: 1, totalTimeMs: 100, bestStreak: 1 })],
              weaknessDeltas: [],
            }),
          ),
        ),
      )
      for (const r of results) expect(r.status).toBe(200)

      const row = await getModeRow(TEST_USER_A, 'identify')
      expect(row?.attempts).toBe(N)
      expect(row?.correct).toBe(N)
      expect(row?.totalTimeMs).toBe(N * 100)
    })
  })
})
