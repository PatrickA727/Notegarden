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
import { NOTES, NOTES_FROM_OPEN, toSharp, random } from "@/lib/utils"

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
  
  const [identifyAttempts, setIdentifyAttempts] = useState(0);
  const [identifyCorrect, setIdentifyCorrect] = useState(0);

  const [identifyTimerStart, setIdentifyTimerStart] = useState<number | null>(null);
  const [identifyTotalTime, setIdentifyTotalTime] = useState(0);

  const handleIdentifyAnswer = (isCorrect: boolean) => {
    if (identifyTimerStart !== null) {
      setIdentifyTotalTime(prev => prev + (Date.now() - identifyTimerStart));
    }
    setIdentifyAttempts(prev => prev + 1);
    if (isCorrect) setIdentifyCorrect(prev => prev + 1);
  }

  const [locateAttempts, setLocateAttempts] = useState(0);
  const [locateCorrect, setLocateCorrect] = useState(0);

  const [locateTimerStart, setLocateTimerStart] = useState<number | null>(null);
  const [locateTotalTime, setLocateTotalTime] = useState(0);

  const handleLocateAnswer = (isCorrect: boolean) => {
    if (locateTimerStart !== null) {
      setLocateTotalTime(prev => prev + (Date.now() - locateTimerStart));
    }
    setLocateAttempts(prev => prev + 1);
    if (isCorrect) setLocateCorrect(prev => prev + 1);
  }

  const [collectorNote, setCollectorNote] = useState<string>(() => random(NOTES))
  const [collectorResults, setCollectorResults] = useState<(boolean | null)[]>(Array(6).fill(null))
  const [collectorFlashFret, setCollectorFlashFret] = useState<{ key: string; correct: boolean } | null>(null)

  const collectorRandomize = () => {
    setCollectorNote(random(NOTES))
    setCollectorResults(Array(6).fill(null))
  }

  const [collectorAttempts, setCollectorAttempts] = useState(0);
  const [collectorCorrect, setCollectorCorrect] = useState(0);

  const handleCollectorFretClick = (si: number, fi: number) => {
    if (collectorResults[si] !== null) return
    const clicked = toSharp(NOTES_FROM_OPEN[si][fi + 1])
    const expected = toSharp(collectorNote)
    const correct = clicked === expected
    const key = `${si}-${fi}`

    setCollectorFlashFret({ key, correct })
    setTimeout(() => setCollectorFlashFret(null), 500)

    if (correct) setCollectorCorrect(prev => prev + 1)
    setCollectorAttempts(prev => prev + 1)

    const newResults = [...collectorResults]
    newResults[si] = correct
    setCollectorResults(newResults)

    if (newResults.every(r => r !== null)) {
      setTimeout(collectorRandomize, 1200)
    }
  }

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

  const [sweepAttempts, setSweepAttempts] = useState(0);
  const [sweepCorrect, setSweepCorrect] = useState(0);

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

    if (correct) setSweepCorrect(prev => prev + 1)
    setSweepAttempts(prev => prev + 1)

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
                  sweepRandomize={sweepRandomize}
                  collectorRandomize={collectorRandomize}
                  startIdentifyTimer={() => setIdentifyTimerStart(Date.now())}
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
            collectorNote={collectorNote}
            collectorResults={collectorResults}
            onIdentifyAnswer={handleIdentifyAnswer}
            onIdentifyTimerRestart={() => setIdentifyTimerStart(Date.now())}
            onLocateAnswer={handleLocateAnswer}
            onLocateTimerRestart={() => setLocateTimerStart(Date.now())}
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
              onCollectorFretClick={handleCollectorFretClick}
              collectorFlashFret={collectorFlashFret}
              />
            </div>
          </main>

          <aside className="w-80 bg-zinc-950 text-white flex justify-center pt-20">
            <div className="w-70">
              <Statistics
              activeMode={activeMode}
              identifyAttempts={identifyAttempts}
              identifyCorrect={identifyCorrect}
              identifyTotalTime={identifyTotalTime}
              locateAttempts={locateAttempts}
              locateCorrect={locateCorrect}
              locateTotalTime={locateTotalTime}
              sweepAttempts={sweepAttempts}
              sweepCorrect={sweepCorrect}
              collectorAttempts={collectorAttempts}
              collectorCorrect={collectorCorrect}
              />
              <StringAcc></StringAcc>
            </div>
          </aside>
        </div>
    </div>
  )
}

export default GuitarNotes