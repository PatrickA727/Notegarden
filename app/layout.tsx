import "./globals.css";
import BfcacheReload from "@/components/BfcacheReload";
import { Inter } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://notegardenmusic.com"),
  title: {
    default: "Notegarden — Guitar Fretboard Trainer",
    template: "%s — Notegarden",
  },
  description:
    "Adaptive guitar fretboard trainer that targets your weakest notes. Free, browser-based note recognition drills with real-time accuracy tracking.",
  applicationName: "Notegarden",
  keywords: [
    "guitar fretboard trainer",
    "memorize guitar notes",
    "guitar note recognition",
    "fretboard memorization",
    "learn guitar fretboard",
    "guitar practice app",
  ],
  authors: [{ name: "Notegarden" }],
  creator: "Notegarden",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Notegarden",
    title: "Notegarden — Guitar Fretboard Trainer",
    description:
      "Adaptive guitar fretboard trainer that targets your weakest notes. Free, browser-based.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notegarden — Guitar Fretboard Trainer",
    description: "Adaptive guitar fretboard trainer that targets your weakest notes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Swap once notegardenmusic.com is registered in Google Search Console.
  verification: { google: "TODO_GSC_TOKEN" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading the nonce here forces dynamic rendering, which is required for
  // Next.js to apply the middleware-issued CSP nonce to its inline hydration
  // scripts. Without this, the prerendered HTML's inline scripts have no
  // nonce and CSP blocks them at runtime, breaking React hydration entirely.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950`}>
        {/* Runs before React hydrates — reloads if returning from an aborted OAuth flow */}
        <Script src="/oauth-reload.js" strategy="beforeInteractive" nonce={nonce} />
        <BfcacheReload />
        {children}
      </body>
    </html>
  );
}
