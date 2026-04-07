"use client"

import Image from 'next/image'
export default function Navbar() {

    const handleSignIn = async () => {
    console.log("sign in clicked");
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-500 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-full">
        <div className="flex items-center gap-3">
            <Image
              src="/nobg_note.png"
              alt="Notegarden logo"
              width={18}
              height={18}
              className="object-contain"
            />
          <span className="text-white font-semibold text-xl">Notegarden</span>
        </div>

        <button
          onClick={handleSignIn}
          className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-semibold px-5 py-1.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-zinc-200 hover:border-zinc-400 active:scale-95 active:bg-zinc-300"
        >
          Sign In
        </button>
      </div>
    </nav>
  )
}