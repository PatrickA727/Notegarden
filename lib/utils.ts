import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const NOTES = ["A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab"]

const ENHARMONIC: Record<string, string> = {
  "Bb": "A#", "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#"
}
export const toSharp = (note: string): string => ENHARMONIC[note] ?? note;
export const STRINGS = ["E (high)", "B", "G", "D", "A", "E (low)"]


export const NOTES_FROM_OPEN: string[][] = [
  ["E","F","F#","G","G#","A","A#","B","C","C#","D","D#","E"],
  ["B","C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],
  ["G","G#","A","A#","B","C","C#","D","D#","E","F","F#","G"],
  ["D","D#","E","F","F#","G","G#","A","A#","B","C","C#","D"],
  ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#","A"],
  ["E","F","F#","G","G#","A","A#","B","C","C#","D","D#","E"],
];

export const generateNoteIndex = (activeStrings: boolean[]) => {
  const activeIndices = activeStrings.reduce<number[]>((acc, active, i) => {
    if (active) acc.push(i);
    return acc;
  }, []);
  const x = activeIndices[Math.floor(Math.random() * activeIndices.length)];
  const y = Math.floor(Math.random() * 12);
  const note = NOTES_FROM_OPEN[x][y + 1];
  return { key: `${x}-${y}`, note };
}
