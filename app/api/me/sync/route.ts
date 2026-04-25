import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { modeStats, weaknessBucket, syncRequest } from '@/db/schema'

const modeEnum = z.enum(['identify', 'locate', 'sweep', 'collector'])
const nonNegInt = z.number().int().nonnegative()

const bodySchema = z.object({
  requestId: z.uuid(),
  modeDeltas: z.array(
    z.object({
      mode: modeEnum,
      attempts: nonNegInt,
      correct: nonNegInt,
      totalTimeMs: nonNegInt,
      rounds: nonNegInt,
      bestStreak: nonNegInt,
    }).refine(d => d.correct <= d.attempts, 'correct > attempts')   // Adds custom validation to ensure correct is not greater than attempts
  ).max(4),                                                         // Since this is an array of mode deltas, we can limit it to 4 (one per mode)
  weaknessDeltas: z.array(
    z.object({
      mode: modeEnum,
      key: z.string().min(1).max(8),
      attempts: nonNegInt,
      correct: nonNegInt,
    }).refine(d => d.correct <= d.attempts, 'correct > attempts')
  ).max(228),
})

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })
  const userId = session.user.id

  const parsed = bodySchema.safeParse(await request.json())     // Parse and validates request JSON with bodySchema
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { requestId, modeDeltas, weaknessDeltas } = parsed.data

  const result = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(syncRequest)
      .values({ requestId, userId })
      .onConflictDoNothing({ target: syncRequest.requestId })
      .returning({ requestId: syncRequest.requestId })              // If duplicate dont raise error, just return empty result

    if (inserted.length === 0) return { deduped: true }

    for (const d of modeDeltas) {
      await tx.insert(modeStats).values({   // Try to insert new row, if conflict update existing row by adding the deltas
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
          updatedAt:   new Date(),
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
          updatedAt: new Date(),
        },
      })
    }

    return { deduped: false }
  })

  return NextResponse.json({ ok: true, ...(result.deduped && { deduped: true }) })
}
