

import { BarChart2, Clock, Zap, Award } from "lucide-react"
import { type PracticeMode } from "@/types"

interface StatisticsProps {
  activeMode: PracticeMode
  identifyAttempts: number
  identifyCorrect: number
  identifyTotalTime: number
  locateAttempts: number
  locateCorrect: number
  locateTotalTime: number
  sweepAttempts: number
  sweepCorrect: number
  collectorAttempts: number
  collectorCorrect: number
}

const Statistics = ({ activeMode, identifyAttempts, identifyCorrect, identifyTotalTime, locateAttempts, locateCorrect, locateTotalTime, sweepAttempts, sweepCorrect, collectorAttempts, collectorCorrect }: StatisticsProps) => {
  const getAccuracyDisplay = () => {
    if (activeMode === 'identify')
      return identifyAttempts === 0 ? '--' : `${Math.round((identifyCorrect / identifyAttempts) * 100)} %`
    if (activeMode === 'locate')
      return locateAttempts === 0 ? '--' : `${Math.round((locateCorrect / locateAttempts) * 100)} %`
    if (activeMode === 'sweep')      
      return sweepAttempts === 0 ? '--' : `${Math.round((sweepCorrect / sweepAttempts) * 100)} %`
    if (activeMode === 'collector')
      return collectorAttempts === 0 ? '--' : `${Math.round((collectorCorrect / collectorAttempts) * 100)} %`
    return '--'
  }
  const accuracyDisplay = getAccuracyDisplay()
  const getAvgTimeDisplay = () => {
    if (activeMode === 'identify')
      return identifyAttempts === 0 ? '--' : `${(identifyTotalTime / identifyAttempts / 1000).toFixed(1)}`
    if (activeMode === 'locate')
      return locateAttempts === 0 ? '--' : `${(locateTotalTime / locateAttempts / 1000).toFixed(1)}`
    return '--'
  }
  const avgTimeDisplay = getAvgTimeDisplay()
  const streak = "5"
  const bestStreak = "10"

  return (
    <div>
      <h2 className="text-zinc-300 text-sm font-semibold uppercase tracking-widest mb-1 px-1">
        User Statistics
      </h2>

      <div className="grid grid-cols-2 gap-3 py-3">
        {/* Accuracy */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs">
            <BarChart2 className="w-4 h-4" />
            <span>Accuracy</span>
          </div>
          <span className="text-white text-lg font-semibold">{accuracyDisplay}</span>
        </div>

        {/* Avg Time */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs">
            <Clock className="w-4 h-4" />
            <span>Avg Time</span>
          </div>
          <span className="text-white text-lg font-semibold">{avgTimeDisplay}{avgTimeDisplay !== '--' ? ' s' : ''}</span>
        </div>

        {/* Streak */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs">
            <Zap className="w-4 h-4" />
            <span>Streak</span>
          </div>
          <span className="text-white text-lg font-semibold">{streak}</span>
        </div>

        {/* Best Streak */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs">
            <Award className="w-4 h-4" />
            <span>Best Streak</span>
          </div>
          <span className="text-white text-lg font-semibold">{bestStreak}</span>
        </div>
      </div>
    </div>
  )
}

export default Statistics