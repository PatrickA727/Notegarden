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
  setActiveStrings: React.Dispatch<React.SetStateAction<boolean[]>>
  randomize: () => void
  position: string
  sweepRandomize: () => void
}

const StartBtn = ({ mode, isRunning, onToggle, setHighlighted, setActiveStrings, randomize, position, sweepRandomize }: StartButtonProps) => {
  useEffect(() => {
    if (isRunning && mode === "identify") {
      setHighlighted({ [position]: true });
    }
  }, [position]);

  const handleToggle = () => {
    setHighlighted({})
    const newIsRunning = !isRunning
    onToggle(newIsRunning)

    if (newIsRunning) {
      if (mode === "collector") {
        setActiveStrings(Array(6).fill(true));
      } else if (mode === "identify") {
        randomize();
      } else if (mode === "sweep") {
        sweepRandomize();
      }
    }
  }

  return (
    <div className="pt-4">
      <Button
        onClick={handleToggle}
        className={`w-full font-semibold transition-colors duration-200 py-5 ${
          isRunning
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-white text-zinc-900 hover:bg-zinc-200"
        }`}
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
    </div>
  )
}

export default StartBtn
