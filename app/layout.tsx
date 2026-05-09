import "./globals.css";
import BfcacheReload from "@/components/BfcacheReload";
import { Inter } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

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
