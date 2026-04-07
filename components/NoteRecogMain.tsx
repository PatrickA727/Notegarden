import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from './ui/input';
import { toSharp, toFlat } from "@/lib/utils";

interface NoteRecogProps {
  note: string
  randomize: () => void
}

const NoteRecogMain = ({ note, randomize }: NoteRecogProps) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = () => {
    const normalized = userInput.charAt(0).toUpperCase() + userInput.slice(1).toLowerCase();
    const flat = toFlat(note);
    const noteDisplay = flat ? `${note}/${flat}` : note;
    if (toSharp(normalized) === note) {
        alert("Correct! The note is " + noteDisplay);
    } else {
        alert("Incorrect. The correct note is " + noteDisplay);
    }
    setUserInput('');
    randomize();
  }

    return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg py-6 px-12">
            <p className="text-zinc-400 text-[13px] uppercase tracking-widest mb-4">
            What note is this?
            </p>
            <div className="flex items-center gap-3">
                <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
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
        </div>
    )
}

export default NoteRecogMain
