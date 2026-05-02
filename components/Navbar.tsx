import Link from "next/link"
import NavbarAuth from "@/components/NavbarAuth"
import IconFretGrid from "@/components/IconFretGrid"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/75 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-7 py-3 max-w-6xl mx-auto">
        <Link href={"/"} className="flex items-center gap-3">
          <IconFretGrid size={41} />
          <span className="text-white font-semibold text-[1.375rem] tracking-tight">Notegarden</span>
        </Link>

        <NavbarAuth />
      </div>
    </nav>
  )
}