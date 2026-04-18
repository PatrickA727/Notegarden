

import { BarChart2, Clock, Zap, Award } from "lucide-react"
import { type PracticeMode } from "@/types"

interface StatisticsProps {
  activeMode: PracticeMode
  identifyAttempts: number
  identifyCorrect: number
  identifyTotalTime: number
  identifyStreak: number
  identifyBestStreak: number
  locateAttempts: number
  locateCorrect: number
  locateTotalTime: number
  locateStreak: number
  locateBestStreak: number
  sweepAttempts: number
  sweepCorrect: number
  sweepRounds: number
  sweepTotalTime: number
  sweepStreak: number
  sweepBestStreak: number
  collectorAttempts: number
  collectorCorrect: number
  collectorRounds: number
  collectorTotalTime: number
  collectorStreak: number
  collectorBestStreak: number
}

const Statistics = ({ activeMode, identifyAttempts, identifyCorrect, identifyTotalTime, identifyStreak, identifyBestStreak, locateAttempts, locateCorrect, locateTotalTime, locateStreak, locateBestStreak, sweepAttempts, sweepCorrect, sweepRounds, sweepTotalTime, sweepStreak, sweepBestStreak, collectorAttempts, collectorCorrect, collectorRounds, collectorTotalTime, collectorStreak, collectorBestStreak }: StatisticsProps) => {
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
    if (activeMode === 'sweep')
      return sweepRounds === 0 ? '--' : `${(sweepTotalTime / sweepRounds / 1000).toFixed(1)}`
    if (activeMode === 'collector')
      return collectorRounds === 0 ? '--' : `${(collectorTotalTime / collectorRounds / 1000).toFixed(1)}`
    return '--'
  }
  const avgTimeDisplay = getAvgTimeDisplay()

  const getStreakDisplay = () => {
    if (activeMode === 'identify')  return String(identifyStreak)
    if (activeMode === 'locate')    return String(locateStreak)
    if (activeMode === 'sweep')     return String(sweepStreak)
    if (activeMode === 'collector') return String(collectorStreak)
    return '--'
  }
  const getBestStreakDisplay = () => {
    if (activeMode === 'identify')  return String(identifyBestStreak)
    if (activeMode === 'locate')    return String(locateBestStreak)
    if (activeMode === 'sweep')     return String(sweepBestStreak)
    if (activeMode === 'collector') return String(collectorBestStreak)
    return '--'
  }
  const streak = getStreakDisplay()
  const bestStreak = getBestStreakDisplay()

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