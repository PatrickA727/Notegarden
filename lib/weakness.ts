import { NOTES_FROM_OPEN, STRINGS, toSharp } from "@/lib/utils"

export type WeaknessBucket = { attempts: number; correct: number }
export type WeaknessMap = Record<string, WeaknessBucket>

const FLOOR = 0.1

// Weight formula: (1 - accuracy) + FLOOR. Cold start (0 attempts) = maximally weak.
export function getWeight(bucket: WeaknessBucket | undefined): number {
  if (!bucket || bucket.attempts === 0) return 1.0 + FLOOR
  return (1 - bucket.correct / bucket.attempts) + FLOOR
}

function weightedPick<T>(items: T[], weightFn: (item: T) => number): T {
  const total = items.reduce((sum, item) => sum + weightFn(item), 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= weightFn(item)
    if (r <= 0) return item
  }
  return items[items.length - 1]
}

// For identify + locate: pick a weighted (si, fi) position from active strings.
export function pickPosition(
  weakness: WeaknessMap,
  activeStrings: boolean[]
): { key: string; note: string } {
  const positions: { si: number; fi: number }[] = []
  for (let si = 0; si < 6; si++) {
    if (!activeStrings[si]) continue
    for (let fi = 0; fi < 12; fi++) {
      positions.push({ si, fi })
    }
  }
  const picked = weightedPick(positions, ({ si, fi }) => getWeight(weakness[`${si}-${fi}`]))
  return {
    key: `${picked.si}-${picked.fi}`,
    note: NOTES_FROM_OPEN[picked.si][picked.fi + 1],
  }
}

// For sweep tier 1: pick a string index weighted by the mean of its 12 position weights.
export function pickSweepString(
  weakness: WeaknessMap,
  activeStrings: boolean[]
): number {
  const activeIndices = activeStrings.reduce<number[]>((acc, active, i) => {
    if (active) acc.push(i)
    return acc
  }, [])
  return weightedPick(activeIndices, (si) => {
    let sum = 0
    for (let fi = 0; fi < 12; fi++) sum += getWeight(weakness[`${si}-${fi}`])
    return sum / 12
  })
}

// For sweep tier 2: pick `count` notes (without replacement) from string si,
// weighted by position weakness. Returns note names from NOTES_FROM_OPEN.
export function pickSweepNotes(
  weakness: WeaknessMap,
  si: number,
  count: number
): string[] {
  let pool = Array.from({ length: 12 }, (_, fi) => fi)
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const fi = weightedPick(pool, (fi) => getWeight(weakness[`${si}-${fi}`]))
    result.push(NOTES_FROM_OPEN[si][fi + 1])
    pool = pool.filter((f) => f !== fi)
  }
  return result
}

// For collector: pick from the 12 chromatic pitch classes (enharmonics collapsed via toSharp).
export const CHROMATIC = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

// Collector weakness is keyed by "si-fi" like identify/locate/sweep. This sums the
// 6 position buckets whose note matches `pitchClass` so we can show a per-note view.
export function aggregateNoteBucket(weakness: WeaknessMap, pitchClass: string): WeaknessBucket {
  let attempts = 0
  let correct = 0
  for (let si = 0; si < 6; si++) {
    for (let fi = 0; fi < 12; fi++) {
      if (toSharp(NOTES_FROM_OPEN[si][fi + 1]) === pitchClass) {
        const b = weakness[`${si}-${fi}`]
        if (b) {
          attempts += b.attempts
          correct += b.correct
        }
      }
    }
  }
  return { attempts, correct }
}

export function pickCollectorNote(weakness: WeaknessMap): string {
  return weightedPick(CHROMATIC, (note) => getWeight(aggregateNoteBucket(weakness, note)))
}

// Immutable bucket update — returns a new WeaknessMap with the key's bucket updated.
export function updateWeakness(
  weakness: WeaknessMap,
  key: string,
  isCorrect: boolean
): WeaknessMap {
  const prev = weakness[key] ?? { attempts: 0, correct: 0 }
  return {
    ...weakness,
    [key]: {
      attempts: prev.attempts + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    },
  }
}

// Derive the "si-fi" key for a given note on a given string.
// Used by sweep (to record weakness for the target note, not the clicked fret).
export function noteToKey(si: number, noteSharp: string): string {
  const fi = NOTES_FROM_OPEN[si].slice(1).indexOf(noteSharp)
  return `${si}-${fi}`
}

// Derive the string index from a string name.
export function stringNameToSi(stringName: string): number {
  return STRINGS.indexOf(stringName)
}

// Aggregate raw counts across all 12 fret positions on a string.
// Returns null if no attempts on any position (cold start).
export function getStringAccuracy(weakness: WeaknessMap, si: number): number | null {
  let totalAttempts = 0
  let totalCorrect = 0
  for (let fi = 0; fi < 12; fi++) {
    const bucket = weakness[`${si}-${fi}`]
    if (bucket) {
      totalAttempts += bucket.attempts
      totalCorrect += bucket.correct
    }
  }
  if (totalAttempts === 0) return null
  return totalCorrect / totalAttempts
}
