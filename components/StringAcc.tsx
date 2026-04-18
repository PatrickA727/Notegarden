import { type PracticeMode } from "@/types"
import { STRINGS } from "@/lib/utils"
import { WeaknessMap, getStringAccuracy, CHROMATIC } from "@/lib/weakness"

interface StringAccProps {
  activeMode: PracticeMode
  identifyWeakness: WeaknessMap
  locateWeakness: WeaknessMap
  sweepWeakness: WeaknessMap
  collectorWeakness: WeaknessMap
}

function getBarColor(pct: number): string {
  if (pct <= 50) return '#ef4444'
  if (pct <= 65) return '#f97316'
  if (pct <= 85) return '#eab308'
  return '#22c55e'
}

const StringAcc = ({ activeMode, identifyWeakness, locateWeakness, sweepWeakness, collectorWeakness }: StringAccProps) => {
  const isCollector = activeMode === 'collector'

  const items = isCollector
    ? [...CHROMATIC]
        .map(note => {
          const bucket = collectorWeakness[note]
          const accuracy = bucket && bucket.attempts > 0
            ? bucket.correct / bucket.attempts
            : null
          return { label: note, accuracy }
        })
        .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))
    : (() => {
        const weakness = activeMode === 'identify' ? identifyWeakness
                       : activeMode === 'locate'   ? locateWeakness
                       :                            sweepWeakness
        return STRINGS.map((name, si) => ({
          label: name.split(' ')[0],
          accuracy: getStringAccuracy(weakness, si),
        }))
      })()

  const title = isCollector ? 'Accuracy By Note' : 'Accuracy By String'

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 mt-3">
      <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-3 px-1">
        {title}
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const pct = item.accuracy !== null ? Math.round(item.accuracy * 100) : null
          return (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-zinc-200 text-sm font-medium w-8 text-center shrink-0">
                {item.label}
              </span>
              <div className="flex-1 h-2.5 bg-zinc-600 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: pct !== null ? `${pct}%` : '0%',
                    backgroundColor: pct !== null ? getBarColor(pct) : 'transparent',
                  }}
                />
              </div>
              <span className="text-zinc-400 text-xs w-8 text-right shrink-0">
                {pct !== null ? `${pct}%` : '--'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StringAcc
