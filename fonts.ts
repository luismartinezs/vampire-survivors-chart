import { Roboto } from 'next/font/google'

export const SansFont = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
  display: 'swap',
})
