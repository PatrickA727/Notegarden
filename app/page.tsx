import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import HeroButtons from "@/components/HeroButtons"
import { Target, Eye, Zap, Music, BarChart3, Crosshair, Repeat, BarChart2, Clock, Flame, Map, Check } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { absolute: "Notegarden — Guitar Fretboard Trainer" },
  description:
    "Drill guitar fretboard notes with adaptive practice. Four modes, real-time accuracy tracking, weakness-targeting algorithm. Free in your browser.",
  alternates: { canonical: "/" },
}

const faqItems = [
  {
    q: "Is Notegarden free?",
    a: "Yes. Every practice mode is free with no trial limit. Signing in is optional and only used to save your progress across devices.",
  },
  {
    q: "Do I need an account to practice?",
    a: "No. You can use all four drill modes as a guest. An account is only needed if you want your stats and weakness map persisted between sessions.",
  },
  {
    q: "How long does it take to memorize the guitar fretboard?",
    a: "Most guitarists reach reliable note recall within a few weeks of short daily sessions. Notegarden's adaptive drills speed that up by spending more reps on the notes you miss most, this increases significantly if you accompany your practice sessions with a guitar in hand.",
  },
  {
    q: "What are the four practice modes?",
    a: "Identify (name a highlighted fret), Locate (find a named note on a given string), Sweep (five notes in order on one string), and Collector (find a single note on every string).",
  },
  {
    q: "What does it track?",
    a: "Per-mode accuracy, average response time, current and best streaks, and a 72-position fretboard heatmap so you can see exactly where you're weakest.",
  },
]

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
  const siteUrl = "https://notegardenmusic.com"
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Notegarden",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        url: siteUrl + "/",
        description:
          "Adaptive guitar fretboard trainer with four practice modes and weakness-targeting drills.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "Organization",
        name: "Notegarden",
        url: siteUrl + "/",
        logo: siteUrl + "/icon.svg",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center text-center px-6 py-28 min-h-[calc(100vh-65px)] overflow-hidden">
        {/* Layer 1: Dot grid — reduced opacity to blend with new layers */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(82,82,91,0.25) 1px, transparent 1px)`,
            backgroundSize: `28px 28px`,
          }}
        />
        {/* Layer 2: SVG grain — ultra-subtle organic texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="hero-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-noise)" />
        </svg>
        {/* Layer 3: Center zinc glow — soft bloom behind the headline */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(113,113,122,0.15) 0%, transparent 70%)`,
          }}
        />
        {/* Layer 4: Edge vignette — fades everything toward the edges */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 75% 75% at 50% 50%, transparent 20%, rgb(9,9,11) 75%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-6">
            Guitar Fretboard Practice
          </span>
          <h1 className="text-white text-5xl sm:text-6xl font-bold tracking-wide max-w-2xl leading-[1.1] mb-5">
            Ready to master your fretboard?
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-lg leading-relaxed mb-10">
            Most guitarists plateau because they&apos;re guessing. Notegarden drills you until every
            note on the neck becomes second nature.
          </p>
          <HeroButtons />
          <p className="flex items-center gap-2 text-sm text-zinc-500 mt-4">
            <Check className="w-3.5 h-3.5 shrink-0" />
            Best experienced with a guitar in hand
          </p>
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

      {/* Stats / Progress Tracking */}
      <section className="px-6 py-20 border-y border-zinc-800 bg-zinc-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-4 block">
            Progress Tracking
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Every rep, measured.
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto mb-14 leading-relaxed">
            Notegarden records the numbers that actually tell you how you&apos;re improving — not just whether you got it right.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: BarChart2,
                title: "Accuracy per mode",
                body: "Live correct-answer percentage across all four practice modes.",
              },
              {
                icon: Clock,
                title: "Response time",
                body: "Average seconds per question or round, tracked as you drill.",
              },
              {
                icon: Flame,
                title: "Streaks & bests",
                body: "Current hot streak and all-time personal record, per mode.",
              },
              {
                icon: Map,
                title: "72-position heatmap",
                body: "Per-fret accuracy overlaid on the fretboard so you see gaps at a glance.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-left flex flex-col gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-zinc-600 text-xs">
            Sign in to save your stats and pick up where you left off.
          </p>
        </div>
      </section>

      {/* Why memorize the fretboard? — SEO copy */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-4 block text-center">
            Fretboard Fundamentals
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-center">
            Why memorize the fretboard?
          </h2>
          <div className="space-y-5 text-zinc-400 text-base leading-relaxed">
            <p>
              Knowing every note on the guitar neck is the bridge between playing tabs and
              actually understanding what you&apos;re playing. It&apos;s what lets you read sheet
              music, build chords from intervals, improvise inside a key, and communicate with
              other musicians — all without pausing to count frets.
            </p>
            <p>
              Most players never get there because note repetition is slow and unfocused.
              Notegarden fixes that with a weakness-targeting algorithm, every position on the
              neck has its own accuracy tracker, and the drill biases toward the notes you are weak at. 
              Short, focused sessions beat long, scattered ones — ten minutes a day
              for a few weeks is usually enough to feel a real difference.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 border-y border-zinc-800 bg-zinc-900/40">
        <div className="max-w-3xl mx-auto">
          <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-4 block text-center">
            FAQ
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqItems.map(({ q, a }) => (
              <details
                key={q}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 open:border-zinc-700 transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-white font-medium text-sm">
                  <span>{q}</span>
                  <span className="text-zinc-500 text-lg leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-zinc-400 text-sm leading-relaxed">{a}</p>
              </details>
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
          <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-wide mb-4 leading-tight">
            Your fretboard isn&apos;t going<br className="hidden sm:block" /> to memorize itself.
          </h2>
          <p className="text-zinc-400 text-base mb-8">Start drilling now — no account needed.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <HeroButtons />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
