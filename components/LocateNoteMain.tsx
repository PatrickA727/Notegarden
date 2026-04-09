import { useState } from "react"
import useRandomNoteString from "@/hooks/useRandomNoteString"
import { NOTES_FROM_OPEN, STRINGS, toSharp } from "@/lib/utils"

interface LocateNoteMainProps {
  highlighted: Record<string, boolean>
  setHighlighted: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  activeStrings: boolean[]
  onAnswer: (isCorrect: boolean) => void
}

const LocateNoteMain = ({ highlighted, setHighlighted, activeStrings, onAnswer }: LocateNoteMainProps) => {
  const { note, string, randomizeNote, randomizeString } = useRandomNoteString(activeStrings);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const handleEnter = () => {
    const key = Object.keys(highlighted)[0];
    if (!key) return;

    const [si, fi] = key.split("-").map(Number);
    const selectedNote = NOTES_FROM_OPEN[si][fi + 1];
    const selectedString = STRINGS[si];

    const isCorrect = toSharp(selectedNote) === toSharp(note) && selectedString === string;
    onAnswer(isCorrect);
    setResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      randomizeNote();
      randomizeString();
      setHighlighted({});
      setResult(null);
    } else {
      const correctSi = STRINGS.indexOf(string);
      const correctFretIndex = NOTES_FROM_OPEN[correctSi].findIndex((n, i) => i > 0 && n === toSharp(note));
      const correctFi = correctFretIndex - 1;
      setHighlighted({ [`${correctSi}-${correctFi}`]: true });
      setTimeout(() => {
        randomizeNote();
        randomizeString();
        setHighlighted({});
        setResult(null);
      }, 1500);
    }
  }

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg py-6 px-12">
      <p className="text-zinc-500 text-[13px] uppercase tracking-widest mb-4">
        Find this note
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">String</p>
            <p className="text-white text-3xl font-semibold">{string}</p>
          </div>
          <div className="w-px h-14 bg-zinc-700" />
          <div>
            <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">Note</p>
            <p className="text-white text-3xl font-semibold">{note}</p>
          </div>
        </div>
        <button
          onClick={handleEnter}
          disabled={Object.keys(highlighted).length === 0}
          className="text-zinc-400 hover:text-zinc-200 text-[12px] uppercase tracking-widest transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
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
