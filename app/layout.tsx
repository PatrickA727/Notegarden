import "./globals.css";
import BfcacheReload from "@/components/BfcacheReload";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950`}>
        {/* Runs before React — reloads if returning from an aborted OAuth flow */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: `if(sessionStorage.getItem('oauth_pending')){sessionStorage.removeItem('oauth_pending');location.reload()}` }}
        />
        <BfcacheReload />
        {children}
      </body>
    </html>
  );
}
