"use client"

import { useEffect } from "react"

export default function BfcacheReload() {
  useEffect(() => {
    // Handles bfcache restore — inline script in layout.tsx handles the fresh-load case
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted && sessionStorage.getItem('oauth_pending')) {
        sessionStorage.removeItem('oauth_pending')
        window.location.reload()
      }
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  return null
}
