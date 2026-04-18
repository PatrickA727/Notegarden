import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from './ui/input';
import { toSharp, toFlat } from "@/lib/utils";

interface NoteRecogProps {
  note: string
  randomize: () => void
  onAnswer: (isCorrect: boolean) => void
  onTimerRestart: () => void
}

const NoteRecogMain = ({ note, randomize, onAnswer, onTimerRestart }: NoteRecogProps) => {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const handleSubmit = () => {
    const normalized = userInput.charAt(0).toUpperCase() + userInput.slice(1).toLowerCase();
    const isCorrect = toSharp(normalized) === note;
    onAnswer(isCorrect);
    setResult(isCorrect ? 'correct' : 'incorrect');
    setUserInput('');
    setTimeout(() => { randomize(); onTimerRestart(); }, 1000);
  }

  const flat = toFlat(note);
  const noteDisplay = flat ? `${note}/${flat}` : note;

    return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg py-6 px-12">
            <p className="text-zinc-400 text-[13px] uppercase tracking-widest mb-4">
            What note is this?
            </p>
            <div className="flex items-center gap-3">
                <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && userInput.trim() && !result) handleSubmit() }}
                    disabled={!!result}
                    placeholder="A, C#, Bb..."
                    className="bg-transparent border-0 border-b border-zinc-600 rounded-none text-white placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:border-zinc-400 px-0 transition-colors duration-200"
                    autoFocus
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!userInput.trim()}
                    className="bg-transparent border border-zinc-600 hover:border-zinc-400 hover:bg-zinc-700 text-zinc-300 hover:text-white font-normal px-5 rounded-md transition-all duration-200 disabled:opacity-50"
                >
                    Enter
                </Button>
            </div>
            {result && (
              <p className={`text-sm mt-3 ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {result === 'correct' ? `Correct! The note is ${noteDisplay}` : `Incorrect. The correct note is ${noteDisplay}`}
              </p>
            )}
        </div>
    )
}

export default NoteRecogMain
