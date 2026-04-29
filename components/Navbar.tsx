import Image from 'next/image'
import Link from "next/link"
import NavbarAuth from "@/components/NavbarAuth"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/75 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-7 py-4 max-w-6xl mx-auto">
        <Link href={"/"} className="flex items-center gap-3">
          <Image
            src="/nobg_note.png"
            alt="Notegarden logo"
            width={20}
            height={20}
            className="object-contain opacity-90"
          />
          <span className="text-white font-semibold text-lg tracking-tight">Notegarden</span>
        </Link>

        <NavbarAuth />
      </div>
    </nav>
  )
}