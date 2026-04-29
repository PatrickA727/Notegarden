"use client"

import { authClient } from "@/lib/auth-client"
import Link from "next/link"

export default function HeroButtons() {
  const { data: session, isPending } = authClient.useSession()

  if (!isPending && session) {
    return (
      <Link
        href="/practice/guitar-notes"
        className="bg-zinc-50 text-zinc-900 text-sm font-semibold px-7 py-3 rounded-lg hover:bg-zinc-200 active:scale-[0.98] transition-all duration-150"
      >
        Continue Practicing →
      </Link>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <Link
        href="/practice/guitar-notes"
        className="bg-zinc-50 text-zinc-900 text-sm font-semibold px-7 py-3 rounded-lg hover:bg-zinc-200 active:scale-[0.98] transition-all duration-150"
      >
        Start Practicing
      </Link>
      <button
        onClick={() => { sessionStorage.setItem('oauth_pending', '1'); authClient.signIn.social({ provider: "google", callbackURL: "/practice/guitar-notes" }) }}
        className="border border-zinc-700 text-zinc-200 text-sm font-semibold px-7 py-3 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        type="button"
      >
        Sign In with Google
      </button>
    </div>
  )
}
