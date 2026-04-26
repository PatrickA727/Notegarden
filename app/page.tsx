import Navbar from "@/components/Navbar"
import Image from "next/image"
import Link from "next/link"
import { Target, Eye, Zap, Music, BarChart3, Crosshair, Repeat } from "lucide-react"

const modes = [
  {
    icon: Eye,
    tag: "01",
    name: "Identify",
    description:
      "A note lights up on the fretboard. You name it. Simple, fast, and the foundational drill for building instant recall across the neck.",
  },
  {
    icon: Target,
    tag: "02",
    name: "Locate",
    description:
      "You're given a string and a note name — find it on the neck. Reinforces the reverse direction: from name to position.",
  },
  {
    icon: Zap,
    tag: "03",
    name: "Sweep",
    description:
      "Five notes, one string, in order. Each click locks in your answer. A round-based drill that builds fluency across a single string fast.",
  },
  {
    icon: Music,
    tag: "04",
    name: "Collector",
    description:
      "One note, every string. Find it across the entire neck. The hardest mode — and the most rewarding.",
  },
]

const adaptiveFeatures = [
  {
    icon: BarChart3,
    title: "Tracks every answer",
    body: "Builds a live accuracy map across all 72 fret positions as you drill.",
  },
  {
    icon: Crosshair,
    title: "Targets weak spots",
    body: "Questions are weighted toward where you struggle most. Miss a note, see it more.",
  },
  {
    icon: Repeat,
    title: "Keeps mastery sharp",
    body: "Positions you've nailed still appear occasionally. Nothing fades once learned.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center text-center px-6 py-28 min-h-[calc(100vh-65px)] overflow-hidden">
        {/* Dot grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(82,82,91,0.4) 1px, transparent 1px)`,
            backgroundSize: `28px 28px`,
          }}
        />
        {/* Radial vignette — fades dots toward edges, focuses center */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 75% 75% at 50% 50%, transparent 20%, rgb(9,9,11) 75%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-6">
            Guitar Theory Practice
          </span>
          <h1 className="text-white text-5xl sm:text-6xl font-bold tracking-tight max-w-2xl leading-[1.1] mb-5">
            Ready to master your fretboard?
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-lg leading-relaxed mb-10">
            Most guitarists plateau because they&apos;re guessing. Notegarden drills you until every
            note on the neck becomes second nature.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/practice/guitar-notes"
              className="bg-zinc-50 text-zinc-900 text-sm font-semibold px-7 py-3 rounded-lg hover:bg-zinc-200 active:scale-[0.98] transition-all duration-150"
            >
              Start Practicing
            </Link>
            <button className="border border-zinc-700 text-zinc-200 text-sm font-semibold px-7 py-3 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 active:scale-[0.98] transition-all duration-150 cursor-pointer">
              Sign in with Google
            </button>
          </div>
        </div>
      </section>

      {/* Adaptive feature section */}
      <section className="px-6 py-20 border-y border-zinc-800 bg-zinc-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-4 block">
            Adaptive Training
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Focus on your weaknesses
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto mb-14 leading-relaxed">
            Notegarden tracks every answer and automatically shifts focus toward the notes and
            positions you struggle with most.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {adaptiveFeatures.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left flex flex-col gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mode cards */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-4 block text-center">
            Practice Modes
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold text-center tracking-tight mb-3">
            Four ways to drill
          </h2>
          <p className="text-zinc-500 text-sm text-center mb-12">
            Each mode targets a different angle of fretboard mastery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modes.map(({ icon: Icon, tag, name, description }) => (
              <div
                key={name}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col gap-4 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-zinc-300" />
                  </div>
                  <span className="text-zinc-700 text-xs font-mono">{tag}</span>
                </div>
                <div>
                  <span className="text-white font-semibold block mb-1.5">{name}</span>
                  <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section className="relative px-6 py-28 text-center overflow-hidden border-t border-zinc-800">
        {/* Dot grid mirrored from hero */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(82,82,91,0.3) 1px, transparent 1px)`,
            backgroundSize: `28px 28px`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 70% 80% at 50% 100%, transparent 10%, rgb(9,9,11) 70%)`,
          }}
        />
        <div className="relative z-10">
          <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Your fretboard isn&apos;t going<br className="hidden sm:block" /> to memorize itself.
          </h2>
          <p className="text-zinc-400 text-base mb-8">Start drilling now — no account needed.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/practice/guitar-notes"
              className="bg-zinc-50 text-zinc-900 text-sm font-semibold px-7 py-3 rounded-lg hover:bg-zinc-200 active:scale-[0.98] transition-all duration-150"
            >
              Start Practicing
            </Link>
            <button className="border border-zinc-700 text-zinc-200 text-sm font-semibold px-7 py-3 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 active:scale-[0.98] transition-all duration-150 cursor-pointer">
              Sign in with Google
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/nobg_note.png"
              alt="Notegarden logo"
              width={16}
              height={16}
              className="object-contain"
            />
            <span className="text-white font-semibold text-sm">Notegarden</span>
          </div>

          <div className="flex items-center gap-5 text-zinc-500 text-xs">
            <a
              href="https://github.com/PatrickA727"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:patrick.a7787@gmail.com"
              className="hover:text-zinc-300 transition-colors"
            >
              Contact
            </a>
            <span>© {new Date().getFullYear()} Notegarden</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
