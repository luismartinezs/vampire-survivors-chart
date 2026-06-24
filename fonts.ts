import { Roboto, Pixelify_Sans } from 'next/font/google'

export const SansFont = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
  display: 'swap',
})

// Pixel display face, used sparingly for hero numerals so they echo the
// pixel-art item icons. Scoped to the stats dashboard via PixelFont.variable.
export const PixelFont = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-pixel',
  display: 'swap',
})
