"use client"

import { authClient } from "@/lib/auth-client"

interface SignInButtonProps {
  className?: string
  label?: string
}

export default function SignInButton({ className, label = "Sign in with Google" }: SignInButtonProps) {
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/practice/guitar-notes",
    })
  }

  return (
    <button onClick={handleSignIn} className={className} type="button">
      {label}
    </button>
  )
}
