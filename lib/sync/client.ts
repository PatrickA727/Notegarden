"use client"

import type { PracticeMode } from '@/types'

export type ModeDelta = {
  mode: PracticeMode
  attempts: number
  correct: number
  totalTimeMs: number
  rounds: number
  bestStreak: number
}

export type WeaknessDelta = {
  mode: PracticeMode
  key: string
  attempts: number
  correct: number
}

type Batch = { mode: ModeDelta[]; weakness: WeaknessDelta[] }

const pendingMode = new Map<PracticeMode, ModeDelta>()
const pendingWeakness = new Map<string, WeaknessDelta>()
let inFlight: { requestId: string; mode: ModeDelta[]; weakness: WeaknessDelta[] } | null = null
let enabled = false

const wkey = (mode: PracticeMode, key: string) => `${mode}|${key}`

function mergeMode(into: Map<PracticeMode, ModeDelta>, d: ModeDelta) {
  const existing = into.get(d.mode)
  if (!existing) {
    into.set(d.mode, { ...d })
    return
  }
  existing.attempts    += d.attempts
  existing.correct     += d.correct
  existing.totalTimeMs += d.totalTimeMs
  existing.rounds      += d.rounds
  existing.bestStreak   = Math.max(existing.bestStreak, d.bestStreak)
}

function mergeWeakness(into: Map<string, WeaknessDelta>, d: WeaknessDelta) {
  const k = wkey(d.mode, d.key)
  const existing = into.get(k)
  if (!existing) {
    into.set(k, { ...d })
    return
  }
  existing.attempts += d.attempts
  existing.correct  += d.correct
}

function drainPending(): Batch {
  const mode = Array.from(pendingMode.values())
  const weakness = Array.from(pendingWeakness.values())
  pendingMode.clear()
  pendingWeakness.clear()
  return { mode, weakness }
}

function requeue(batch: Batch) {
  for (const d of batch.mode) mergeMode(pendingMode, d)
  for (const d of batch.weakness) mergeWeakness(pendingWeakness, d)
}

export function setSyncEnabled(value: boolean) {
  enabled = value
  if (!enabled) {
    pendingMode.clear()
    pendingWeakness.clear()
    inFlight = null
  }
}

export function recordModeDelta(d: ModeDelta) {
  if (!enabled) return
  mergeMode(pendingMode, d)
}

export function recordWeaknessDelta(d: WeaknessDelta) {
  if (!enabled) return
  mergeWeakness(pendingWeakness, d)
}

export async function flush(): Promise<void> {
  if (!enabled || inFlight) return
  if (pendingMode.size === 0 && pendingWeakness.size === 0) return

  const batch = drainPending()
  const requestId = crypto.randomUUID()
  inFlight = { requestId, ...batch }

  try {
    const res = await fetch('/api/me/sync', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requestId, modeDeltas: batch.mode, weaknessDeltas: batch.weakness }),
      keepalive: true,
    })
    if (!res.ok) throw new Error(`sync failed: ${res.status}`)
    inFlight = null
  } catch {
    if (inFlight) requeue({ mode: inFlight.mode, weakness: inFlight.weakness })
    inFlight = null
  }
}

export function flushOnUnload(): void {
  if (!enabled) return
  if (pendingMode.size === 0 && pendingWeakness.size === 0) return

  const batch = drainPending()
  const requestId = crypto.randomUUID()
  const body = JSON.stringify({ requestId, modeDeltas: batch.mode, weaknessDeltas: batch.weakness })
  // sendBeacon ignores the response — server is idempotent on requestId so a duplicate (if the
  // periodic flush also lands) is safely deduped.
  navigator.sendBeacon('/api/me/sync', new Blob([body], { type: 'application/json' }))
}
