import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Practice — Guitar Notes",
  description:
    "Practice guitar fretboard note recognition with four adaptive drill modes. Free, no signup required.",
  alternates: { canonical: "/practice/guitar-notes" },
  openGraph: {
    title: "Practice — Guitar Notes",
    description:
      "Practice guitar fretboard note recognition with four adaptive drill modes.",
    url: "/practice/guitar-notes",
  },
}

export default function PracticeGuitarNotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
