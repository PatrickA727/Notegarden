import { type PracticeMode } from "@/types"
import NoteRecogMain from "./NoteRecogMain"
import LocateNoteMain from "./LocateNoteMain"
import SweepMain from "./SweepMain"
import CollectorMain from "./CollectorMain"

interface MainBarProps {
  mode: PracticeMode
  isRunning: boolean
  position: string
  note: string
  randomize: () => void
  highlighted: Record<string, boolean>
  setHighlighted: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  activeStrings: boolean[]
  sweepNotes: string[]
  sweepTargetSi: number
  sweepStep: number
  sweepResults: (boolean | null)[]
  collectorNote: string
  collectorResults: (boolean | null)[]
  onIdentifyAnswer: (isCorrect: boolean) => void
  onIdentifyTimerRestart: () => void
  onLocateAnswer: (isCorrect: boolean) => void
  onLocateTimerRestart: () => void
}

const MainBar = ({ mode, isRunning, position, note, randomize, highlighted, setHighlighted, activeStrings, sweepNotes, sweepTargetSi, sweepStep, sweepResults, collectorNote, collectorResults, onIdentifyAnswer, onIdentifyTimerRestart, onLocateAnswer, onLocateTimerRestart }: MainBarProps) => {
  if (!isRunning) return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
      <h2 className="text-white text-2xl font-bold mb-3 px-1 tracking-wide">
        Ready To Practice?
      </h2>
      <p className="text-zinc-400 text-sm mb-2 px-1">
        Select a practice mode and click the start button to begin.
      </p>
    </div>
  )

  if (mode === "identify") return <NoteRecogMain key={position} note={note} randomize={randomize} onAnswer={onIdentifyAnswer} onTimerRestart={onIdentifyTimerRestart} />
  if (mode === "locate") return <LocateNoteMain highlighted={highlighted} setHighlighted={setHighlighted} activeStrings={activeStrings} onAnswer={onLocateAnswer} onTimerRestart={onLocateTimerRestart} />
  if (mode === "sweep") return <SweepMain notes={sweepNotes} targetSi={sweepTargetSi} step={sweepStep} results={sweepResults} />
  if (mode === "collector") return <CollectorMain note={collectorNote} results={collectorResults} />
}

export default MainBar