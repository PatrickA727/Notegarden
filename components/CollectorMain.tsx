import { useState } from "react"
import { random, NOTES } from "@/lib/utils"
import useRandomNoteString from "@/hooks/useRandomNoteString"

const CollectorMain = () => {
  // const { note, randomizeNote } = useRandomNoteString()

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg py-6 px-12">
      <p className="text-zinc-500 text-[13px] uppercase tracking-widest mb-4">
        Find this note on every string
      </p>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-white text-6xl font-semibold">{}</p>
          </div>
        </div>
        {/* <button
          onClick={randomizeNote}
          className="text-zinc-600 hover:text-zinc-400 text-[12px] uppercase tracking-widest transition-colors duration-200"
        >
          Enter
        </button> */}
      </div>
    </div>
  )
}

export default CollectorMain