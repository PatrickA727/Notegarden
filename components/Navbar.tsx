"use client"

import Image from 'next/image'
import Link from "next/link"

export default function Navbar() {
  const handleSignIn = async () => {
    console.log("sign in clicked");
  };

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
          <span className="text-white font-semibold text-md tracking-tight">Notegarden</span>
        </Link>

        <button
          onClick={handleSignIn}
          className="border border-zinc-700 text-zinc-300 text-sm font-medium px-5 py-2 rounded-full hover:border-zinc-500 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </nav>
  )
}