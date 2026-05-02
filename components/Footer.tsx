import IconFretGrid from "@/components/IconFretGrid"

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 px-7 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <IconFretGrid size={41} />
          <span className="text-white font-semibold text-[1.375rem] tracking-tight">Notegarden</span>
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
  )
}
