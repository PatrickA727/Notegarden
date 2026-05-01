import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { modeStats, weaknessBucket, syncRequest } from '@/db/schema'

const modeEnum = z.enum(['identify', 'locate', 'sweep', 'collector'])
const COUNT_CAP = 100_000
const TIME_MS_CAP = 86_400_000                                      // 24h in ms — caps a single flush, not lifetime totals (those keep growing via SUM)
const countInt = z.number().int().nonnegative().max(COUNT_CAP)
const timeMsInt = z.number().int().nonnegative().max(TIME_MS_CAP)

const KEY_REGEX = /^[0-5]-(?:[0-9]|1[01])$/

const bodySchema = z.object({
  requestId: z.uuid(),
  modeDeltas: z.array(
    z.object({
      mode: modeEnum,
      attempts: countInt,
      correct: countInt,
      totalTimeMs: timeMsInt,
      rounds: countInt,
      bestStreak: countInt,
    }).refine(d => d.correct <= d.attempts, 'correct > attempts')
  ).max(4),
  weaknessDeltas: z.array(
    z.object({
      mode: modeEnum,
      key: z.string().regex(KEY_REGEX, 'invalid key'),
      attempts: countInt,
      correct: countInt,
    }).refine(d => d.correct <= d.attempts, 'correct > attempts')
  ).max(288),
})

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })
  const userId = session.user.id

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { requestId, modeDeltas, weaknessDeltas } = parsed.data

  if (modeDeltas.length === 0 && weaknessDeltas.length === 0) {
    return NextResponse.json({ error: 'empty payload' }, { status: 400 })
  }

  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(syncRequest)
        .values({ requestId, userId })
        .onConflictDoNothing({ target: [syncRequest.userId, syncRequest.requestId] })
        .returning({ requestId: syncRequest.requestId })

      if (inserted.length === 0) return { deduped: true }

      for (const d of modeDeltas) {
        // First-time insert writes absolute values; subsequent calls add deltas / take MAX of bestStreak.
        await tx.insert(modeStats).values({
          userId,
          mode: d.mode,
          attempts: d.attempts,
          correct: d.correct,
          totalTimeMs: d.totalTimeMs,
          rounds: d.rounds,
          bestStreak: d.bestStreak,
        }).onConflictDoUpdate({
          target: [modeStats.userId, modeStats.mode],
          set: {
            attempts:    sql`${modeStats.attempts}    + ${d.attempts}`,
            correct:     sql`${modeStats.correct}     + ${d.correct}`,
            totalTimeMs: sql`${modeStats.totalTimeMs} + ${d.totalTimeMs}`,
            rounds:      sql`${modeStats.rounds}      + ${d.rounds}`,
            bestStreak:  sql`GREATEST(${modeStats.bestStreak}, ${d.bestStreak})`,
            updatedAt:   sql`now()`,
          },
        })
      }

      for (const d of weaknessDeltas) {
        await tx.insert(weaknessBucket).values({
          userId,
          mode: d.mode,
          key: d.key,
          attempts: d.attempts,
          correct: d.correct,
        }).onConflictDoUpdate({
          target: [weaknessBucket.userId, weaknessBucket.mode, weaknessBucket.key],
          set: {
            attempts:  sql`${weaknessBucket.attempts} + ${d.attempts}`,
            correct:   sql`${weaknessBucket.correct}  + ${d.correct}`,
            updatedAt: sql`now()`,
          },
        })
      }

      return { deduped: false }
    })

    return NextResponse.json({ ok: true, ...(result.deduped && { deduped: true }) })
  } catch {
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
