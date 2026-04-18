import { pickPosition, WeaknessMap } from "@/lib/weakness"
import { useState } from "react"

const useNoteRecognitionGetNote = (activeStrings: boolean[], weakness: WeaknessMap) => {
    const [{ key: position, note }, setState] = useState(() => pickPosition(weakness, activeStrings));

    const randomize = () => {
        setState(pickPosition(weakness, activeStrings));
    };

    return { position, note, randomize };
}

export default useNoteRecognitionGetNote
