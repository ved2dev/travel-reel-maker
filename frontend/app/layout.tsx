import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Reel Maker',
  description: 'Create amazing travel video reels from your photos and videos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}