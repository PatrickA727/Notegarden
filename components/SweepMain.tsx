import { STRINGS } from "@/lib/utils"

interface SweepMainProps {
  notes: string[]
  targetSi: number
  step: number
  results: (boolean | null)[]
}

const SweepMain = ({ notes, targetSi, step, results }: SweepMainProps) => {
  const targetString = STRINGS[targetSi]

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg py-6 px-4 lg:px-12">
      <p className="text-zinc-500 text-[13px] uppercase tracking-widest mb-4">
        Play these notes in sequence (left to right)
      </p>
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-10">
        <div>
          <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">String</p>
          <p className="text-white text-3xl font-semibold">{targetString}</p>
        </div>
        <div className="hidden lg:block w-px h-14 bg-zinc-700" />
        <div>
          <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-3">Notes</p>
          <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
            {notes.map((note, i) => {
              const result = results[i]
              const color =
                result === true ? "text-emerald-400" :
                result === false ? "text-red-400" :
                i === step ? "text-white" :
                "text-zinc-500"
              return (
                <p key={i} className={`text-xl lg:text-2xl font-semibold transition-colors ${color}`}>
                  {note}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SweepMain
