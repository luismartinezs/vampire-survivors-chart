import "@/styles/globals.css";
import type { Metadata } from "next";
import { SansFont } from "@/fonts";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

// cloudflare pages compat
export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Vampire Survivors Evolution Chart",
  description: "A cheatsheet of all weapon evolutions in Vampire Survivors",
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ]
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Vampire Survivors Evolution Chart'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          SansFont.className,
          "bg-primary-800 text-white antialiased"
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
