"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Modes from "@/components/Modes"
import { type PracticeMode } from "@/types"
import Statistics from "@/components/Statistics"
import StringAcc from "@/components/StringAcc"
import MainBar from "@/components/MainBar"
import Fretboard from "@/components/Fretboard"
import { useState, useRef, useEffect } from "react"
import StartBtn from "@/components/StartBtn"
import useNoteRecognitionGetNote from "@/hooks/useNoteRecognitionGetNote"
import { NOTES, NOTES_FROM_OPEN, toSharp, random } from "@/lib/utils"
import { WeaknessMap, updateWeakness, pickSweepString, pickSweepNotes, pickCollectorNote, noteToKey } from "@/lib/weakness"


const GuitarNotes = () => {
  useEffect(() => { sessionStorage.removeItem('oauth_pending') }, [])

  const [activeMode, setActiveMode] = useState<PracticeMode>("identify")
  const [isRunning, setIsRunning] = useState(false)

  const handleToggleRunning = (running: boolean) => {
    setIsRunning(running)
    if (!running) {
      setIdentifyStreak(0)
      setLocateStreak(0)
      setSweepStreak(0)
      setCollectorStreak(0)
    }
  }
  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
  const [activeStrings, setActiveStrings] = useState<boolean[]>(Array(6).fill(true));
  const [identifyWeakness, setIdentifyWeakness] = useState<WeaknessMap>({})
  const [locateWeakness, setLocateWeakness] = useState<WeaknessMap>({})
  const [sweepWeakness, setSweepWeakness] = useState<WeaknessMap>({})
  const [collectorWeakness, setCollectorWeakness] = useState<WeaknessMap>({})

  // Refs so that sweepRandomize/collectorRandomize always read the latest weakness
  // even when called from a stale setTimeout closure.
  const sweepWeaknessRef = useRef<WeaknessMap>({})
  const collectorWeaknessRef = useRef<WeaknessMap>({})
  useEffect(() => { sweepWeaknessRef.current = sweepWeakness }, [sweepWeakness])
  useEffect(() => { collectorWeaknessRef.current = collectorWeakness }, [collectorWeakness])

  const { position, note, randomize } = useNoteRecognitionGetNote(activeStrings, identifyWeakness);

  const [identifyAttempts, setIdentifyAttempts] = useState(0);
  const [identifyCorrect, setIdentifyCorrect] = useState(0);
  const [identifyStreak, setIdentifyStreak] = useState(0);
  const [identifyBestStreak, setIdentifyBestStreak] = useState(0);

  const [locateAttempts, setLocateAttempts] = useState(0);
  const [locateCorrect, setLocateCorrect] = useState(0);
  const [locateStreak, setLocateStreak] = useState(0);
  const [locateBestStreak, setLocateBestStreak] = useState(0);

  const [sweepStreak, setSweepStreak] = useState(0);
  const [sweepBestStreak, setSweepBestStreak] = useState(0);

  const [collectorStreak, setCollectorStreak] = useState(0);
  const [collectorBestStreak, setCollectorBestStreak] = useState(0);

  const [identifyTimerStart, setIdentifyTimerStart] = useState<number | null>(null);
  const [identifyTotalTime, setIdentifyTotalTime] = useState(0);

  const handleIdentifyAnswer = (isCorrect: boolean) => {
    if (identifyTimerStart !== null) {
      setIdentifyTotalTime(prev => prev + (Date.now() - identifyTimerStart));
    }
    setIdentifyAttempts(prev => prev + 1);
    if (isCorrect) setIdentifyCorrect(prev => prev + 1);
    setIdentifyWeakness(prev => updateWeakness(prev, position, isCorrect));
    if (isCorrect) {
      const next = identifyStreak + 1
      setIdentifyStreak(next)
      setIdentifyBestStreak(prev => Math.max(prev, next))
    } else {
      setIdentifyStreak(0)
    }
  }

  const [locateTimerStart, setLocateTimerStart] = useState<number | null>(null);
  const [locateTotalTime, setLocateTotalTime] = useState(0);

  const handleLocateAnswer = (isCorrect: boolean, key: string) => {
    if (locateTimerStart !== null) {
      setLocateTotalTime(prev => prev + (Date.now() - locateTimerStart));
    }
    setLocateAttempts(prev => prev + 1);
    if (isCorrect) setLocateCorrect(prev => prev + 1);
    setLocateWeakness(prev => updateWeakness(prev, key, isCorrect));
    if (isCorrect) {
      const next = locateStreak + 1
      setLocateStreak(next)
      setLocateBestStreak(prev => Math.max(prev, next))
    } else {
      setLocateStreak(0)
    }
  }

  const [collectorNote, setCollectorNote] = useState<string>(() => random(NOTES))
  const [collectorResults, setCollectorResults] = useState<(boolean | null)[]>(Array(6).fill(null))
  const [collectorFlashFret, setCollectorFlashFret] = useState<{ key: string; correct: boolean } | null>(null)

  const collectorRandomize = () => {
    setCollectorNote(pickCollectorNote(collectorWeaknessRef.current))
    setCollectorResults(Array(6).fill(null))
    collectorTimerStart.current = Date.now()
  }

  const [collectorAttempts, setCollectorAttempts] = useState(0);
  const [collectorCorrect, setCollectorCorrect] = useState(0);
  const [collectorRounds, setCollectorRounds] = useState(0);
  const collectorTimerStart = useRef<number | null>(null);
  const [collectorTotalTime, setCollectorTotalTime] = useState(0);

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
    setCollectorWeakness(prev => updateWeakness(prev, noteToKey(si, expected), correct))

    const newResults = [...collectorResults]
    newResults[si] = correct
    setCollectorResults(newResults)

    if (newResults.every(r => r !== null)) {
      if (collectorTimerStart.current !== null) {
        setCollectorTotalTime(prev => prev + (Date.now() - collectorTimerStart.current!))
      }
      setCollectorRounds(prev => prev + 1)
      const roundCorrect = newResults.every(r => r === true)
      if (roundCorrect) {
        const next = collectorStreak + 1
        setCollectorStreak(next)
        setCollectorBestStreak(prev => Math.max(prev, next))
      } else {
        setCollectorStreak(0)
      }
      setTimeout(collectorRandomize, 1200)
    }
  }

  const [sweepNotes, setSweepNotes] = useState<string[]>(() => pickSweepNotes({}, 0, 5))
  const [sweepTargetSi, setSweepTargetSi] = useState<number>(() => Math.floor(Math.random() * 6))
  const [sweepStep, setSweepStep] = useState(0)
  const [sweepResults, setSweepResults] = useState<(boolean | null)[]>(Array(5).fill(null))
  const [flashFret, setFlashFret] = useState<{ key: string; correct: boolean } | null>(null)

  const sweepRandomize = () => {
    const newSi = pickSweepString(sweepWeaknessRef.current, activeStrings)
    setSweepNotes(pickSweepNotes(sweepWeaknessRef.current, newSi, 5))
    setSweepTargetSi(newSi)
    setSweepStep(0)
    setSweepResults(Array(5).fill(null))
    sweepTimerStart.current = Date.now()
  }

  const [sweepAttempts, setSweepAttempts] = useState(0);
  const [sweepCorrect, setSweepCorrect] = useState(0);
  const [sweepRounds, setSweepRounds] = useState(0);

  const sweepTimerStart = useRef<number | null>(null);
  const [sweepTotalTime, setSweepTotalTime] = useState(0);

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
    setSweepWeakness(prev => updateWeakness(prev, noteToKey(sweepTargetSi, toSharp(sweepNotes[sweepStep])), correct))

    if (sweepStep === 4) {
      setSweepStep(5)
      if (sweepTimerStart.current !== null) {
        setSweepTotalTime(prev => prev + (Date.now() - sweepTimerStart.current!))
      }
      setSweepRounds(prev => prev + 1)
      const roundCorrect = newResults.every(r => r === true)
      if (roundCorrect) {
        const next = sweepStreak + 1
        setSweepStreak(next)
        setSweepBestStreak(prev => Math.max(prev, next))
      } else {
        setSweepStreak(0)
      }
      setTimeout(sweepRandomize, 1200)
    } else {
      setSweepStep(sweepStep + 1)
    }
  }

  return (
    <div>
        <Navbar></Navbar>
        <div className="flex h-screen pt-5">
          <aside className="w-80 bg-zinc-950 text-white flex items-start justify-center pt-20">
            <div className="w-77">
              <Modes onModeChange={setActiveMode} isRunning={isRunning} />
                <div className="px-4">
                  <StartBtn
                  mode={activeMode}
                  isRunning={isRunning}
                  onToggle={handleToggleRunning}
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
            locateWeakness={locateWeakness}
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
              identifyWeakness={identifyWeakness}
              locateWeakness={locateWeakness}
              sweepWeakness={sweepWeakness}
              collectorWeakness={collectorWeakness}
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
              sweepRounds={sweepRounds}
              sweepTotalTime={sweepTotalTime}
              collectorAttempts={collectorAttempts}
              collectorCorrect={collectorCorrect}
              collectorRounds={collectorRounds}
              collectorTotalTime={collectorTotalTime}
              identifyStreak={identifyStreak}
              identifyBestStreak={identifyBestStreak}
              locateStreak={locateStreak}
              locateBestStreak={locateBestStreak}
              sweepStreak={sweepStreak}
              sweepBestStreak={sweepBestStreak}
              collectorStreak={collectorStreak}
              collectorBestStreak={collectorBestStreak}
              />
              <StringAcc
              activeMode={activeMode}
              identifyWeakness={identifyWeakness}
              locateWeakness={locateWeakness}
              sweepWeakness={sweepWeakness}
              collectorWeakness={collectorWeakness}
              />
            </div>
          </aside>
        </div>
      <Footer />
    </div>
  )
}

export default GuitarNotes