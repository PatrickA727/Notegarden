import { useState } from "react"
import { STRINGS } from "@/lib/utils"
import { pickPosition, WeaknessMap } from "@/lib/weakness"

const useRandomNoteString = (activeStrings: boolean[], weakness: WeaknessMap) => {
  const pick = () => {
    const { key, note } = pickPosition(weakness, activeStrings)
    const si = parseInt(key.split("-")[0])
    return { note, string: STRINGS[si], key }
  }

  const [state, setState] = useState(pick)

  const randomize = () => setState(pick())

  return { note: state.note, string: state.string, key: state.key, randomize }
}

export default useRandomNoteString
