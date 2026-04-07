import { STRINGS } from "@/lib/utils"

interface CollectorMainProps {
  note: string
  results: (boolean | null)[]
}

const CollectorMain = ({ note, results }: CollectorMainProps) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg py-6 px-12">
      <p className="text-zinc-500 text-[13px] uppercase tracking-widest mb-4">
        Find this note on every string
      </p>
      <div className="flex items-center gap-10">
        <p className="text-white text-6xl font-semibold">{note}</p>
        <div className="w-px h-14 bg-zinc-700" />
        <div className="flex items-center gap-5">
          {STRINGS.map((name, si) => {
            const result = results[si]
            const color =
              result === true ? "text-emerald-400" :
              result === false ? "text-red-400" :
              "text-zinc-500"
            return (
              <div key={si} className="flex flex-col items-center gap-1">
                <p className={`text-sm font-semibold transition-colors ${color}`}>{name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CollectorMain
