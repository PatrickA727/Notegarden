import "./globals.css";
import BfcacheReload from "@/components/BfcacheReload";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950`}>
        {/* Runs before React hydrates — reloads if returning from an aborted OAuth flow */}
        <Script src="/oauth-reload.js" strategy="beforeInteractive" />
        <BfcacheReload />
        {children}
      </body>
    </html>
  );
}
