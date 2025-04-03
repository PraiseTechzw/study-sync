import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StudySync - Collaborative Learning Platform",
  description:
    "Connect with classmates, schedule study sessions, and improve your academic performance with StudySync.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  
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
  )
}

import './globals.css'