import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { modeStats, weaknessBucket } from '@/db/schema'

export async function GET() {
  const session = await getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const userId = session.user.id

  const [stats, buckets] = await Promise.all([
    db.select().from(modeStats).where(eq(modeStats.userId, userId)),
    db.select().from(weaknessBucket).where(eq(weaknessBucket.userId, userId)),
  ])

  return NextResponse.json({ modeStats: stats, weaknessBuckets: buckets })
}
