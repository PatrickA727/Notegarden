import { generateNoteIndex } from "@/lib/utils";
import { useState } from "react"

const useNoteRecognitionGetNote = (activeStrings: boolean[]) => {
    const [{ key: position, note }, setState] = useState(generateNoteIndex(activeStrings));

    const randomize = () => {
        setState(generateNoteIndex(activeStrings));
    };

    return { position, note, randomize };
}

export default useNoteRecognitionGetNote
