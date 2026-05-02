"use client"

import { Button } from "@/components/ui/button"
import { Play, Square } from "lucide-react"
import { useEffect } from "react"
import { type PracticeMode } from "@/types"
interface StartButtonProps {
  mode: PracticeMode
  isRunning: boolean
  onToggle: (value: boolean) => void
  setHighlighted: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  activeStrings: boolean[]
  setActiveStrings: React.Dispatch<React.SetStateAction<boolean[]>>
  randomize: () => void
  position: string
  sweepRandomize: () => void
  collectorRandomize: () => void
  startIdentifyTimer: () => void
}

const StartBtn = ({ mode, isRunning, onToggle, setHighlighted, activeStrings, setActiveStrings, randomize, position, sweepRandomize, collectorRandomize, startIdentifyTimer }: StartButtonProps) => {
  const canStart = mode === "collector" || activeStrings.some(Boolean)

  useEffect(() => {
    if (isRunning && mode === "identify") {
      setHighlighted({ [position]: true });
    }
  }, [position, isRunning]);

  const handleToggle = () => {
    if (!isRunning && !canStart) return
    setHighlighted({})
    const newIsRunning = !isRunning
    onToggle(newIsRunning)

    if (newIsRunning) {
      if (mode === "collector") {
        setActiveStrings(Array(6).fill(true));
        collectorRandomize();
      } else if (mode === "identify") {
        randomize();
        startIdentifyTimer();
      } else if (mode === "sweep") {
        sweepRandomize();
      }
    }
  }

  return (
    <div className="pt-4">
      <Button
        onClick={handleToggle}
        disabled={!isRunning && !canStart}
        className={`w-full font-semibold transition-colors duration-200 py-5 ${
          isRunning
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-white text-zinc-900 hover:bg-zinc-200"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {isRunning ? (
          <>
            <Square className="w-4 h-4 mr-1" />
            Stop Practice
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-1" />
            Start Practice
          </>
        )}
      </Button>
      {!isRunning && !canStart && (
        <p className="text-zinc-500 text-xs text-center mt-2">
          Enable at least one string to start
        </p>
      )}
    </div>
  )
}

export default StartBtn
