import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow_Semi_Condensed, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_KR({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
  preload: false,
})

const barlow = Barlow_Semi_Condensed({
  weight: ['500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-num',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '2027년도 성사중학교 전교회장 선거 개표방송',
  description: '2027년도 성사중학교 전교회장 선거 실시간 개표방송',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#121d35',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`bg-background ${noto.variable} ${barlow.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
