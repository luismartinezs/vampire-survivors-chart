import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { SansFont } from "@/fonts";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import Script from "next/script";

// cloudflare pages compat
export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Vampire Survivors Evolution Chart | Complete Weapon Evolution Guide",
  description: "Interactive cheatsheet for all weapon evolutions in Vampire Survivors. Find the best weapon combinations, evolution requirements, and upgrade paths.",
  metadataBase: new URL('https://vampire-survivors-evolution-chart.appforgelabs.com'),
  keywords: "Vampire Survivors, weapon evolution, game guide, evolution chart, weapon combinations",
  authors: [{ name: 'AppForgeLabs' }],
  openGraph: {
    type: 'website',
    title: 'Vampire Survivors Evolution Chart | Complete Weapon Evolution Guide',
    description: 'Interactive cheatsheet for all weapon evolutions in Vampire Survivors. Find the best weapon combinations and upgrade paths.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vampire Survivors Evolution Chart Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vampire Survivors Evolution Chart',
    description: 'Interactive cheatsheet for all weapon evolutions in Vampire Survivors',
    images: ['/og-image.png']
  },
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
  appleWebApp: {
    title: 'Vampire Survivors Evolution Chart'
  }
};

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="canonical" href={metadata.metadataBase?.toString()} />
      </head>
      <body
        className={cn(
          SansFont.className,
          "min-h-screen flex flex-col bg-primary-800 text-white"
        )}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        {process.env.NODE_ENV === "production" && (
          <Script
            defer
            src="https://umami-tau-tawny.vercel.app/script.js"
            data-website-id="6dc8f1b3-ff3b-4d1b-a15d-3cd5951bc845"
          />
        )}
      </body>
    </html>
  );
}
