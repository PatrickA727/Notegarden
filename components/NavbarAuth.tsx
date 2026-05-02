"use client"

import { authClient } from "@/lib/auth-client"
import { UserCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"

export default function NavbarAuth() {
  const { data: session, isPending } = authClient.useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (!isPending && session) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          type="button"
        >
          <UserCircle size={26} strokeWidth={1.5} />
        </button>
        {open && (
          <div className="absolute right-0 top-9 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 min-w-[120px] z-50">
            <button
              onClick={async () => {
                await authClient.signOut()
                window.location.href = '/'
              }}
              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              type="button"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    )
  }

  const onPractice = pathname?.startsWith("/practice") ?? false
  const handleSignIn = () => {
    sessionStorage.setItem('oauth_pending', '1')
    authClient.signIn.social({ provider: "google", callbackURL: "/practice/guitar-notes" })
  }

  if (onPractice) {
    return (
      <button
        onClick={handleSignIn}
        className="group bg-zinc-50 text-zinc-900 text-sm font-semibold px-5 py-2 rounded-full hover:bg-zinc-200 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
        type="button"
      >
        <span>Save Progress</span>
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="border border-zinc-700 text-zinc-300 text-sm font-medium px-5 py-2 rounded-full hover:border-zinc-500 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer"
      type="button"
    >
      Sign In
    </button>
  )
}
