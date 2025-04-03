"use client"

import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

  if (!isLoaded) {
    return null
  }

  // Set up auth token
  if (isSignedIn) {
    convex.setAuth(async () => {
      const token = await getToken()
      return token
    })
  }

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ConvexClientProvider>
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
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

import './globals.css'