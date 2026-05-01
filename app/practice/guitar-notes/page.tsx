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
import { authClient } from "@/lib/auth-client"
import { recordModeDelta, recordWeaknessDelta, flush, flushOnUnload, setSyncEnabled } from "@/lib/sync/client"


const GuitarNotes = () => {
  useEffect(() => { sessionStorage.removeItem('oauth_pending') }, [])

  const { data: session } = authClient.useSession()
  const userId = session?.user?.id ?? null

  const [activeMode, setActiveMode] = useState<PracticeMode>("identify")
  const [isRunning, setIsRunning] = useState(false)

  const handleToggleRunning = (running: boolean) => {
    setIsRunning(running)
    if (!running) {
      setIdentifyStreak(0)
      setLocateStreak(0)
      setSweepStreak(0)
      setCollectorStreak(0)
      flush()
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
    const elapsed = identifyTimerStart !== null ? Date.now() - identifyTimerStart : 0
    if (identifyTimerStart !== null) {
      setIdentifyTotalTime(prev => prev + elapsed);
    }
    setIdentifyAttempts(prev => prev + 1);
    if (isCorrect) setIdentifyCorrect(prev => prev + 1);
    setIdentifyWeakness(prev => updateWeakness(prev, position, isCorrect));
    const nextStreak = isCorrect ? identifyStreak + 1 : 0
    const nextBest = Math.max(identifyBestStreak, nextStreak)
    if (isCorrect) {
      setIdentifyStreak(nextStreak)
      setIdentifyBestStreak(nextBest)
    } else {
      setIdentifyStreak(0)
    }
    recordModeDelta({ mode: 'identify', attempts: 1, correct: isCorrect ? 1 : 0, totalTimeMs: elapsed, rounds: 0, bestStreak: nextBest })
    recordWeaknessDelta({ mode: 'identify', key: position, attempts: 1, correct: isCorrect ? 1 : 0 })
  }

  const [locateTimerStart, setLocateTimerStart] = useState<number | null>(null);
  const [locateTotalTime, setLocateTotalTime] = useState(0);

  const handleLocateAnswer = (isCorrect: boolean, key: string) => {
    const elapsed = locateTimerStart !== null ? Date.now() - locateTimerStart : 0
    if (locateTimerStart !== null) {
      setLocateTotalTime(prev => prev + elapsed);
    }
    setLocateAttempts(prev => prev + 1);
    if (isCorrect) setLocateCorrect(prev => prev + 1);
    setLocateWeakness(prev => updateWeakness(prev, key, isCorrect));
    const nextStreak = isCorrect ? locateStreak + 1 : 0
    const nextBest = Math.max(locateBestStreak, nextStreak)
    if (isCorrect) {
      setLocateStreak(nextStreak)
      setLocateBestStreak(nextBest)
    } else {
      setLocateStreak(0)
    }
    recordModeDelta({ mode: 'locate', attempts: 1, correct: isCorrect ? 1 : 0, totalTimeMs: elapsed, rounds: 0, bestStreak: nextBest })
    recordWeaknessDelta({ mode: 'locate', key, attempts: 1, correct: isCorrect ? 1 : 0 })
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
    const weaknessKey = noteToKey(si, expected)
    setCollectorWeakness(prev => updateWeakness(prev, weaknessKey, correct))
    recordModeDelta({ mode: 'collector', attempts: 1, correct: correct ? 1 : 0, totalTimeMs: 0, rounds: 0, bestStreak: 0 })
    recordWeaknessDelta({ mode: 'collector', key: weaknessKey, attempts: 1, correct: correct ? 1 : 0 })

    const newResults = [...collectorResults]
    newResults[si] = correct
    setCollectorResults(newResults)

    if (newResults.every(r => r !== null)) {
      const elapsed = collectorTimerStart.current !== null ? Date.now() - collectorTimerStart.current : 0
      if (collectorTimerStart.current !== null) {
        setCollectorTotalTime(prev => prev + elapsed)
      }
      setCollectorRounds(prev => prev + 1)
      const roundCorrect = newResults.every(r => r === true)
      const nextStreak = roundCorrect ? collectorStreak + 1 : 0
      const nextBest = Math.max(collectorBestStreak, nextStreak)
      if (roundCorrect) {
        setCollectorStreak(nextStreak)
        setCollectorBestStreak(nextBest)
      } else {
        setCollectorStreak(0)
      }
      recordModeDelta({ mode: 'collector', attempts: 0, correct: 0, totalTimeMs: elapsed, rounds: 1, bestStreak: nextBest })
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
    const weaknessKey = noteToKey(sweepTargetSi, toSharp(sweepNotes[sweepStep]))
    setSweepWeakness(prev => updateWeakness(prev, weaknessKey, correct))
    recordModeDelta({ mode: 'sweep', attempts: 1, correct: correct ? 1 : 0, totalTimeMs: 0, rounds: 0, bestStreak: 0 })
    recordWeaknessDelta({ mode: 'sweep', key: weaknessKey, attempts: 1, correct: correct ? 1 : 0 })

    if (sweepStep === 4) {
      setSweepStep(5)
      const elapsed = sweepTimerStart.current !== null ? Date.now() - sweepTimerStart.current : 0
      if (sweepTimerStart.current !== null) {
        setSweepTotalTime(prev => prev + elapsed)
      }
      setSweepRounds(prev => prev + 1)
      const roundCorrect = newResults.every(r => r === true)
      const nextStreak = roundCorrect ? sweepStreak + 1 : 0
      const nextBest = Math.max(sweepBestStreak, nextStreak)
      if (roundCorrect) {
        setSweepStreak(nextStreak)
        setSweepBestStreak(nextBest)
      } else {
        setSweepStreak(0)
      }
      recordModeDelta({ mode: 'sweep', attempts: 0, correct: 0, totalTimeMs: elapsed, rounds: 1, bestStreak: nextBest })
      setTimeout(sweepRandomize, 1200)
    } else {
      setSweepStep(sweepStep + 1)
    }
  }

  // Hydrate from server on sign-in. Sync stays disabled until hydration completes
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      // Wipe progress on every userId transition
      setIdentifyAttempts(0)
      setIdentifyCorrect(0)
      setIdentifyTotalTime(0)
      setIdentifyStreak(0)
      setIdentifyBestStreak(0)
      setLocateAttempts(0)
      setLocateCorrect(0)
      setLocateTotalTime(0)
      setLocateStreak(0)
      setLocateBestStreak(0)
      setSweepAttempts(0)
      setSweepCorrect(0)
      setSweepTotalTime(0)
      setSweepRounds(0)
      setSweepStreak(0)
      setSweepBestStreak(0)
      setCollectorAttempts(0)
      setCollectorCorrect(0)
      setCollectorTotalTime(0)
      setCollectorRounds(0)
      setCollectorStreak(0)
      setCollectorBestStreak(0)
      setIdentifyWeakness({})
      setLocateWeakness({})
      setSweepWeakness({})
      setCollectorWeakness({})

      if (!userId) {
        setSyncEnabled(false)
        return
      }

      try {
        const res = await fetch('/api/me/state', { cache: 'no-store' })
        if (!res.ok || cancelled) return
        const data = await res.json() as {
          modeStats: Array<{ mode: PracticeMode; attempts: number; correct: number; totalTimeMs: number; rounds: number; bestStreak: number }>
          weaknessBuckets: Array<{ mode: PracticeMode; key: string; attempts: number; correct: number }>
        }
        if (cancelled) return
        for (const s of data.modeStats) {
          if (s.mode === 'identify') {
            setIdentifyAttempts(s.attempts)
            setIdentifyCorrect(s.correct)
            setIdentifyTotalTime(s.totalTimeMs)
            setIdentifyBestStreak(s.bestStreak)
          } else if (s.mode === 'locate') {
            setLocateAttempts(s.attempts)
            setLocateCorrect(s.correct)
            setLocateTotalTime(s.totalTimeMs)
            setLocateBestStreak(s.bestStreak)
          } else if (s.mode === 'sweep') {
            setSweepAttempts(s.attempts)
            setSweepCorrect(s.correct)
            setSweepTotalTime(s.totalTimeMs)
            setSweepRounds(s.rounds)
            setSweepBestStreak(s.bestStreak)
          } else if (s.mode === 'collector') {
            setCollectorAttempts(s.attempts)
            setCollectorCorrect(s.correct)
            setCollectorTotalTime(s.totalTimeMs)
            setCollectorRounds(s.rounds)
            setCollectorBestStreak(s.bestStreak)
          }
        }
        const id: WeaknessMap = {}, lo: WeaknessMap = {}, sw: WeaknessMap = {}, co: WeaknessMap = {}
        for (const b of data.weaknessBuckets) {
          const target = b.mode === 'identify' ? id : b.mode === 'locate' ? lo : b.mode === 'sweep' ? sw : co
          target[b.key] = { attempts: b.attempts, correct: b.correct }
        }
        setIdentifyWeakness(id)
        setLocateWeakness(lo)
        setSweepWeakness(sw)
        setCollectorWeakness(co)
        setSyncEnabled(true)
      } catch {}
    })()
    return () => { cancelled = true }
  }, [userId])

  // Periodic flush + flush on tab close. Only active when signed in.
  useEffect(() => {
    if (!userId) return
    const id = setInterval(() => { flush() }, 5000)
    const onBeforeUnload = () => { flushOnUnload() }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      clearInterval(id)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [userId])

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