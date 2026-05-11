import { STRINGS } from "@/lib/utils"

interface CollectorMainProps {
  note: string
  results: (boolean | null)[]
}

const CollectorMain = ({ note, results }: CollectorMainProps) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg py-6 px-4 lg:px-12">
      <p className="text-zinc-500 text-[13px] uppercase tracking-widest mb-4">
        Find this note on every string
      </p>
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-10">
        <p className="text-white text-4xl lg:text-6xl font-semibold">{note}</p>
        <div className="hidden lg:block w-px h-14 bg-zinc-700" />
        <div className="flex items-center gap-3 lg:gap-5 flex-wrap">
          {STRINGS.map((name, si) => {
            const result = results[si]
            const color =
              result === true ? "text-emerald-400" :
              result === false ? "text-red-400" :
              "text-zinc-500"
            return (
              <div key={si} className="flex flex-col items-center gap-1">
                <p className={`text-xs lg:text-sm font-semibold transition-colors ${color}`}>{name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CollectorMain
