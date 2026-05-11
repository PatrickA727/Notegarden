import { useState, useEffect } from "react"
import useRandomNoteString from "@/hooks/useRandomNoteString"
import { NOTES_FROM_OPEN, STRINGS, toSharp } from "@/lib/utils"
import { WeaknessMap } from "@/lib/weakness"

interface LocateNoteMainProps {
  highlighted: Record<string, boolean>
  setHighlighted: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  activeStrings: boolean[]
  weakness: WeaknessMap
  onAnswer: (isCorrect: boolean, key: string) => void
  onTimerRestart: () => void
  onFeedbackChange: (active: boolean) => void
}

const LocateNoteMain = ({ highlighted, setHighlighted, activeStrings, weakness, onAnswer, onTimerRestart, onFeedbackChange }: LocateNoteMainProps) => {
  const { note, string, key: targetKey, randomize } = useRandomNoteString(activeStrings, weakness);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    onTimerRestart();
  }, []);

  useEffect(() => {
    onFeedbackChange(result === 'incorrect');
  }, [result]);

  useEffect(() => () => onFeedbackChange(false), []);

  const handleEnter = () => {
    const clickedKey = Object.keys(highlighted)[0];
    if (!clickedKey) return;

    const [si, fi] = clickedKey.split("-").map(Number);
    const selectedNote = NOTES_FROM_OPEN[si][fi + 1];
    const selectedString = STRINGS[si];

    const isCorrect = toSharp(selectedNote) === toSharp(note) && selectedString === string;
    onAnswer(isCorrect, targetKey);
    setResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      randomize();
      setHighlighted({});
      setResult(null);
      onTimerRestart();
    } else {
      setHighlighted({ [targetKey]: true });
      setTimeout(() => {
        randomize();
        setHighlighted({});
        setResult(null);
        onTimerRestart();
      }, 1500);
    }
  }

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg py-6 px-4 lg:px-12">
      <p className="text-zinc-500 text-[13px] uppercase tracking-widest mb-4">
        Find this note
      </p>
      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="flex items-center gap-4 lg:gap-6">
          <div>
            <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">String</p>
            <p className="text-white text-3xl font-semibold">{string}</p>
          </div>
          <div className="hidden lg:block w-px h-14 bg-zinc-700" />
          <div>
            <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">Note</p>
            <p className="text-white text-3xl font-semibold">{note}</p>
          </div>
        </div>
        <button
          onClick={handleEnter}
          disabled={Object.keys(highlighted).length === 0 || result !== null}
          className="w-full lg:w-auto text-zinc-400 hover:text-zinc-200 text-[12px] uppercase tracking-widest transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed border lg:border-0 border-zinc-700 hover:border-zinc-500 rounded-md py-2 lg:py-0 lg:rounded-none"
        >
          Enter
        </button>
      </div>
      {result && (
        <p className={`text-sm mt-4 ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
          {result === 'correct' ? 'Correct!' : `Incorrect! The correct answer is ${note} on the ${string} string.`}
        </p>
      )}
    </div>
  )
}

export default LocateNoteMain
