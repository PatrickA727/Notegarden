import { useState } from "react"
import { Minus, X } from "lucide-react"
import { PracticeMode } from "@/types";
import { NOTES_FROM_OPEN } from "@/lib/utils";
import { WeaknessMap } from "@/lib/weakness";

const STRING_NAMES = ["E", "B", "G", "D", "A", "E"];
const THICKNESSES = [1, 1.2, 1.6, 2, 2.4, 2.8];
const FRET_COUNT = 12;
const SINGLE_DOTS = new Set([3, 5, 7, 9]);
const DOUBLE_DOT = 12;


interface FretboardProps {
  mode: PracticeMode
  isRunning: boolean
  highlighted: Record<string, boolean>
  setHighlighted: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  activeStrings: boolean[]
  setActiveStrings: React.Dispatch<React.SetStateAction<boolean[]>>
  onSweepFretClick?: (si: number, fi: number) => void
  flashFret?: { key: string; correct: boolean } | null
  sweepTargetSi?: number
  onCollectorFretClick?: (si: number, fi: number) => void
  collectorFlashFret?: { key: string; correct: boolean } | null
  identifyWeakness: WeaknessMap
  locateWeakness: WeaknessMap
  sweepWeakness: WeaknessMap
  collectorWeakness: WeaknessMap
}

const Fretboard = ({ mode, isRunning, highlighted, setHighlighted, activeStrings, setActiveStrings, onSweepFretClick, flashFret, sweepTargetSi, onCollectorFretClick, collectorFlashFret, identifyWeakness, locateWeakness, sweepWeakness, collectorWeakness }: FretboardProps) => {
  const [showHeatmap, setShowHeatmap] = useState(false)

  const getHeatmapColor = (pct: number): string => {
    if (pct <= 50) return '#ef4444'
    if (pct <= 65) return '#f97316'
    if (pct <= 85) return '#eab308'
    return '#22c55e'
  }

  const activeWeakness =
    mode === 'identify' ? identifyWeakness :
    mode === 'locate'   ? locateWeakness   :
    mode === 'sweep'    ? sweepWeakness    :
                          collectorWeakness
  const toggleString = (si: number) => {
    if (isRunning && mode === "collector") {
      setActiveStrings(Array(6).fill(true));
      return;
    } else if (isRunning && mode !== "collector") {
      return;
    }

    const next = [...activeStrings];
    next[si] = !next[si];
    setActiveStrings(next);
    if (activeStrings[si]) {
      setHighlighted((prev) => {
        const n = { ...prev };
        Object.keys(n).forEach((k) => {
          if (k.startsWith(`${si}-`)) delete n[k];  // Clear highlighted frets for this string
        });
        return n;
      });
    }
  };

  const toggleFret = (si: number, fi: number) => {      // String index and Fret index
    const key = `${si}-${fi}`;
    setHighlighted((prev) => {
      const n = { ...prev };
      if (n[key]) delete n[key];
      else n[key] = true;
      return n;
    });
  };

  const toggleLocateNoteFret = (si: number, fi: number) => {
    const key = `${si}-${fi}`;
    setHighlighted({ [key]: true });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono select-none">
      {!isRunning && (
        <div className="flex justify-start mb-2">
          <button
            onClick={() => setShowHeatmap(h => !h)}
            className={`text-xs px-3 py-1 rounded-md border transition-all duration-200 ${
              showHeatmap
                ? 'bg-zinc-700 border-zinc-500 text-zinc-200'
                : 'bg-transparent border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500'
            }`}
          >
            Heatmap
          </button>
        </div>
      )}
      <div className="flex items-stretch gap-2.5">

        {/* String Toggles */}
        <div className="flex flex-col justify-around pt-[22px] pb-5">
          {STRING_NAMES.map((_, si) => (
            <button
              key={si}
              onClick={() => toggleString(si)}
              className={`w-[26px] h-[26px] rounded-md border flex items-center justify-center transition-all ${ // Dynamic css
                isRunning
                  ? "bg-zinc-500 border-zinc-700 opacity-40 cursor-not-allowed"
                  : activeStrings[si]
                    ? "bg-zinc-50 border-zinc-300"
                    : "bg-zinc-800 border-zinc-700"
              }`}
            >
              {activeStrings[si] ? (
                <Minus size={12} stroke="#27272a" />
              ) : (
                <X size={12} stroke={isRunning ? "#27272a" : "#52525b"} />
              )}
            </button>
          ))}
        </div>

        {/* Fretboard */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Fret numbers */}
          <div className="flex mb-[5px]">
            <div className="w-[18px] shrink-0" />
            {Array.from({ length: FRET_COUNT }, (_, i) => (
              <div key={i} className="flex-1 text-center text-[10px] text-zinc-500">
                {i + 1}
              </div>
            ))}
          </div>

          {/* String rows */}
          <div className="bg-[#1c1917] border border-[#292524] border-b-0 rounded-t overflow-hidden">
            {STRING_NAMES.map((name, si) => {
              const isActive = activeStrings[si];
              const isSweepInactive = mode === "sweep" && isRunning && si !== sweepTargetSi;
              return (
                <div
                  key={si}
                  className={`flex items-center h-[38px] ${si < 5 ? "border-b border-[#292524]" : ""} ${isSweepInactive ? "opacity-30" : ""}`}
                >
                  {/* Nut */}
                  <div className="w-[18px] h-full bg-zinc-700 border-r-[3px] border-zinc-400 flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-zinc-400 font-semibold">{name}</span>
                  </div>

                  {/* Fret cells */}
                  {Array.from({ length: FRET_COUNT }, (_, i) => {     // Create new array. Make 12 elements. And map over it.
                    const fi = i;
                    const key = `${si}-${fi}`;
                    const isLit = !!highlighted[key] && isActive && !isRunning;     // Check if current fret is highlighted and string is active
                    const isClickable = isActive && (
                      !isRunning ||
                      (isRunning && mode === "locate") ||
                      (isRunning && mode === "sweep" && !isSweepInactive) ||
                      (isRunning && mode === "collector")
                    );
                    return (
                      <div
                        key={fi}
                        className={`flex-1 h-full relative flex items-center justify-center border-r border-zinc-600 last:border-r-0 transition-colors ${
                          isClickable ? "cursor-pointer hover:bg-white/[0.05]" : "cursor-default"
                        }`}
                        onClick={() => {
                          if (activeStrings[si] && !isRunning && !showHeatmap) {
                            toggleFret(si, fi)
                          } else if (activeStrings[si] && isRunning && mode === "locate") {
                            toggleLocateNoteFret(si, fi)
                          } else if (isRunning && mode === "sweep" && !isSweepInactive) {
                            onSweepFretClick?.(si, fi)
                          } else if (isRunning && mode === "collector") {
                            onCollectorFretClick?.(si, fi)
                          }
                        }}
                      >
                        {/* String line */}
                        <div
                          className="absolute left-0 right-0 pointer-events-none"
                          style={{
                            height: THICKNESSES[si],
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: isActive ? "#d4d4d8" : "#3f3f46",
                            transition: "background .2s",
                          }}
                        />

                        {/* Note highlight */}
                        {isLit && (
                          <div
                            className="w-[26px] h-[26px] rounded-full bg-zinc-50 border border-zinc-300 flex items-center justify-center text-[10px] font-bold text-zinc-900 relative z-20"
                            style={{ animation: "fbpop .14s ease" }}
                          >
                            {NOTES_FROM_OPEN[si][fi]}
                          </div>
                        )}

                        {/* Note recognition mode */}
                        {isRunning && mode === "identify" && !!highlighted[key] && isActive && (
                          <div
                            className="w-[26px] h-[26px] rounded-full bg-zinc-50 border border-zinc-300 flex items-center justify-center text-[10px] font-bold text-zinc-900 relative z-20"
                            style={{ animation: "fbpop .14s ease" }}
                          >
                          </div>
                        )}

                        {/* Locate mode */}
                        {isRunning && mode === "locate" && !!highlighted[key] && isActive && (
                          <div
                            className="w-[26px] h-[26px] rounded-full bg-zinc-50 border border-zinc-300 flex items-center justify-center text-[10px] font-bold text-zinc-900 relative z-20"
                            style={{ animation: "fbpop .14s ease" }}
                          >
                          </div>
                        )}

                        {/* Sweep mode flash */}
                        {isRunning && mode === "sweep" && flashFret?.key === key && (
                          <div
                            className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold relative z-20 ${
                              flashFret.correct ? "bg-emerald-400 text-emerald-900" : "bg-red-400 text-red-900"
                            }`}
                            style={{ animation: "fbpop .14s ease" }}
                          />
                        )}

                        {/* Collector mode flash */}
                        {isRunning && mode === "collector" && collectorFlashFret?.key === key && (
                          <div
                            className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold relative z-20 ${
                              collectorFlashFret.correct ? "bg-emerald-400 text-emerald-900" : "bg-red-400 text-red-900"
                            }`}
                            style={{ animation: "fbpop .14s ease" }}
                          />
                        )}

                        {/* Heatmap dot */}
                        {!isRunning && showHeatmap && (() => {
                          const bucket = activeWeakness[key]
                          const pct = bucket && bucket.attempts > 0
                            ? Math.round(bucket.correct / bucket.attempts * 100)
                            : null
                          return (
                            <div
                              className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold relative z-20"
                              style={{
                                backgroundColor: pct !== null ? getHeatmapColor(pct) : '#52525b',
                                opacity: pct !== null ? 0.85 : 0.4,
                              }}
                            >
                              {pct !== null ? `${pct}%` : ''}
                            </div>
                          )
                        })()}

                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Position dots row */}
          <div className="flex h-4 bg-[#1c1917] border border-[#292524] border-t-zinc-700 rounded-b">
            <div className="w-[18px] shrink-0 border-r-[3px] border-zinc-400" />
            {Array.from({ length: FRET_COUNT }, (_, i) => {
              const fi = i + 1;
              return (
                <div key={fi} className="flex-1 flex items-center justify-center gap-[3px]">
                  {SINGLE_DOTS.has(fi) && (
                    <div className="w-[5px] h-[5px] rounded-full bg-zinc-600" />
                  )}
                  {fi === DOUBLE_DOT && (
                    <>
                      <div className="w-[5px] h-[5px] rounded-full bg-zinc-600" />
                      <div className="w-[5px] h-[5px] rounded-full bg-zinc-600" />
                    </>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Note Animation*/}
      <style>{` 
        @keyframes fbpop {                                  
          from { transform: scale(.4); opacity: 0; }                 
          to   { transform: scale(1);  opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Fretboard;