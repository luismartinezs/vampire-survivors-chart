import { Roboto, Jacquard_12 } from 'next/font/google'

export const SansFont = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const JacquardFont = Jacquard_12({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jacquard',
  display: 'swap',
})
