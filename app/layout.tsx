"use client"

import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ConvexProvider client={convex}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster 
                position="top-center"
                toastOptions={{
                  style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                  className: 'dark-toast',
                }}
              />
            </ThemeProvider>
          </ConvexProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

import './globals.css'