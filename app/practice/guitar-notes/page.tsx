"use client"

import Navbar from "@/components/Navbar"
import Modes from "@/components/Modes"
import { type PracticeMode } from "@/types"
import Statistics from "@/components/Statistics"
import StringAcc from "@/components/StringAcc"
import MainBar from "@/components/MainBar"
import Fretboard from "@/components/Fretboard"
import { useState } from "react"
import StartBtn from "@/components/StartBtn"
import useNoteRecognitionGetNote from "@/hooks/useNoteRecognitionGetNote"
import { NOTES, NOTES_FROM_OPEN, toSharp } from "@/lib/utils"

const randomSweepNotes = (count: number): string[] => {
  const shuffled = [...NOTES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const randomActiveSi = (activeStrings: boolean[]): number => {
  const activeIndices = activeStrings.reduce<number[]>((acc, active, i) => {
    if (active) acc.push(i);
    return acc;
  }, []);
  return activeIndices[Math.floor(Math.random() * activeIndices.length)];
}

const GuitarNotes = () => {
  const [activeMode, setActiveMode] = useState<PracticeMode>("identify")
  const [isRunning, setIsRunning] = useState(false)
  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
  const [activeStrings, setActiveStrings] = useState<boolean[]>(Array(6).fill(true));
  const { position, note, randomize } = useNoteRecognitionGetNote(activeStrings);

  const [sweepNotes, setSweepNotes] = useState<string[]>(() => randomSweepNotes(5))
  const [sweepTargetSi, setSweepTargetSi] = useState<number>(() => Math.floor(Math.random() * 6))
  const [sweepStep, setSweepStep] = useState(0)
  const [sweepResults, setSweepResults] = useState<(boolean | null)[]>(Array(5).fill(null))
  const [flashFret, setFlashFret] = useState<{ key: string; correct: boolean } | null>(null)

  const sweepRandomize = () => {
    setSweepNotes(randomSweepNotes(5))
    setSweepTargetSi(randomActiveSi(activeStrings))
    setSweepStep(0)
    setSweepResults(Array(5).fill(null))
  }

  const handleSweepFretClick = (si: number, fi: number) => {
    if (si !== sweepTargetSi || sweepStep >= 5) return
    const clicked = toSharp(NOTES_FROM_OPEN[si][fi + 1])
    const expected = toSharp(sweepNotes[sweepStep])
    const correct = clicked === expected
    const key = `${si}-${fi}`

    setFlashFret({ key, correct })
    setTimeout(() => setFlashFret(null), 500)

    const newResults = [...sweepResults]
    newResults[sweepStep] = correct
    setSweepResults(newResults)

    if (sweepStep === 4) {
      setSweepStep(5)
      setTimeout(sweepRandomize, 1200)
    } else {
      setSweepStep(sweepStep + 1)
    }
  }

  return (
    <div>
        <Navbar></Navbar>
        <div className="flex h-screen">
          <aside className="w-80 bg-zinc-950 text-white flex items-start justify-center pt-20">
            <div className="w-77">
              <Modes onModeChange={setActiveMode} isRunning={isRunning} />
                <div className="px-4">
                  <StartBtn
                  mode={activeMode}
                  isRunning={isRunning}
                  onToggle={setIsRunning}
                  setHighlighted={setHighlighted}
                  setActiveStrings={setActiveStrings}
                  randomize={randomize}
                  position={position}
                  />
                </div>
            </div>
          </aside>

          <main className="flex-1 bg-zinc-950 text-white pt-20 text-center">
            <MainBar
            mode={activeMode}
            isRunning={isRunning}
            position={position}
            note={note}
            randomize={randomize}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            activeStrings={activeStrings}
            sweepNotes={sweepNotes}
            sweepTargetSi={sweepTargetSi}
            sweepStep={sweepStep}
            sweepResults={sweepResults}
            />
            <div className="pt-5">
              <Fretboard
              mode={activeMode}
              isRunning={isRunning}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
              activeStrings={activeStrings}
              setActiveStrings={setActiveStrings}
              onSweepFretClick={handleSweepFretClick}
              flashFret={flashFret}
              sweepTargetSi={sweepTargetSi}
              />
            </div>
          </main>

          <aside className="w-80 bg-zinc-950 text-white flex justify-center pt-20">
            <div className="w-70">
              <Statistics />
              <StringAcc></StringAcc>
            </div>
          </aside>
        </div>
    </div>
  )
}

export default GuitarNotes