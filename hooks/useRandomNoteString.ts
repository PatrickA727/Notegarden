import { useState } from "react"
import { random, NOTES, STRINGS } from "@/lib/utils"

const useRandomNoteString = (activeStrings: boolean[]) => {
  const activeStringNames = () => STRINGS.filter((_, i) => activeStrings[i]);
  const [note, setNote] = useState(() => random(NOTES));
  const [string, setString] = useState(() => random(activeStringNames()));

  const randomizeNote = () => {
    setNote(random(NOTES));
  };

  const randomizeString = () => {
    setString(random(activeStringNames()));
  };

  return { note, string, randomizeNote, randomizeString };
}

export default useRandomNoteString