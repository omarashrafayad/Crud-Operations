// src/app/layout.tsx
import type { Metadata } from 'next'
import Providers from '@/store/Providers'
import './globals.css'

export const metadata: Metadata = { title: 'App', description: 'CRUD' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
