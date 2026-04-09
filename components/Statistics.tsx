

import { BarChart2, Clock, Zap, Award } from "lucide-react"

interface StatisticsProps {
  identifyAttempts: number
  identifyCorrect: number
}

const Statistics = ({ identifyAttempts, identifyCorrect }: StatisticsProps) => {
  const accuracyDisplay = identifyAttempts === 0
    ? '--'
    : `${Math.round((identifyCorrect / identifyAttempts) * 100)}`
  const avgTime = "12"
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
          <span className="text-white text-lg font-semibold">{accuracyDisplay}{identifyAttempts > 0 ? ' %' : ''}</span>
        </div>

        {/* Avg Time */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs">
            <Clock className="w-4 h-4" />
            <span>Avg Time</span>
          </div>
          <span className="text-white text-lg font-semibold">{avgTime} s</span>
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