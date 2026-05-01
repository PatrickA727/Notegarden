import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { modeStats, weaknessBucket } from '@/db/schema'

const NO_STORE = { 'Cache-Control': 'private, no-store' }

export async function GET() {
  const session = await getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401, headers: NO_STORE })

  const userId = session.user.id

  try {
    const [stats, buckets] = await Promise.all([
      db
        .select({
          mode: modeStats.mode,
          attempts: modeStats.attempts,
          correct: modeStats.correct,
          totalTimeMs: modeStats.totalTimeMs,
          rounds: modeStats.rounds,
          bestStreak: modeStats.bestStreak,
        })
        .from(modeStats)
        .where(eq(modeStats.userId, userId)),
      db
        .select({
          mode: weaknessBucket.mode,
          key: weaknessBucket.key,
          attempts: weaknessBucket.attempts,
          correct: weaknessBucket.correct,
        })
        .from(weaknessBucket)
        .where(eq(weaknessBucket.userId, userId)),
    ])

    return NextResponse.json({ modeStats: stats, weaknessBuckets: buckets }, { headers: NO_STORE })
  } catch {
    return NextResponse.json({ error: 'internal' }, { status: 500, headers: NO_STORE })
  }
}
