import "./globals.css";
import BfcacheReload from "@/components/BfcacheReload";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950">
        {/* Runs before React — reloads if returning from an aborted OAuth flow */}
        <script dangerouslySetInnerHTML={{ __html: `if(sessionStorage.getItem('oauth_pending')){sessionStorage.removeItem('oauth_pending');location.reload()}` }} />
        <BfcacheReload />
        {children}
      </body>
    </html>
  );
}
