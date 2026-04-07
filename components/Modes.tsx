"use client"

import { useState } from "react"
import { Music, Search, ArrowLeftRight, ListChecks } from "lucide-react"
import { type PracticeMode } from "@/types"

interface Mode {
  id: PracticeMode
  icon: React.ReactNode
  title: string
  description: string
}

const modes: Mode[] = [
  {
    id: "identify",
    icon: <Music className="w-5 h-5" />,
    title: "Note Recognition",
    description: "Identify the highlighted note",
  },
  {
    id: "locate",
    icon: <Search className="w-5 h-5" />,
    title: "Locate the note",
    description: "Find the note on the fretboard",
  },
  {
    id: "sweep",
    icon: <ArrowLeftRight className="w-5 h-5" />,
    title: "Note sweep",
    description: "Find the notes on the given string",
  },
  {
    id: "collector",
    icon: <ListChecks className="w-5 h-5" />,
    title: "Collect the notes",
    description: "Find the note on every string",
  },
]

interface ModeSelectorProps {
  onModeChange?: (mode: PracticeMode) => void
  isRunning: boolean
}

const Modes = ({ onModeChange, isRunning }: ModeSelectorProps) => {
  const [selected, setSelected] = useState<PracticeMode>("identify")

  const handleSelect = (mode: PracticeMode) => {
    setSelected(mode)
    onModeChange?.(mode)
    console.log("Current mode:", mode)
  }

  return (
    <div className="flex flex-col gap-3 px-4">
      <h2 className="text-zinc-300 text-sm font-semibold uppercase tracking-widest mb-1 px-1">
        Practice Mode
      </h2>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => handleSelect(mode.id)}
          disabled={isRunning === true}
          className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg border transition-all duration-200 text-left disabled:opacity-70
            ${selected === mode.id
              ? "bg-zinc-700 border-zinc-500 text-white"
              : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-750 hover:text-zinc-200 hover:border-zinc-600"
            }`}
        >
          <div className={`shrink-0 ${selected === mode.id ? "text-white" : "text-zinc-500"}`}>
            {mode.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{mode.title}</span>
            <span className="text-xs text-zinc-500">{mode.description}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

export default Modes