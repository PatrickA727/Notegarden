"use client"

import Image from 'next/image'

export default function Navbar() {
  const handleSignIn = async () => {
    console.log("sign in clicked");
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/75 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Image
            src="/nobg_note.png"
            alt="Notegarden logo"
            width={15}
            height={15}
            className="object-contain opacity-90"
          />
          <span className="text-white font-semibold text-sm tracking-tight">Notegarden</span>
        </div>

        <button
          onClick={handleSignIn}
          className="border border-zinc-700 text-zinc-300 text-xs font-medium px-4 py-1.5 rounded-full hover:border-zinc-500 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </nav>
  )
}