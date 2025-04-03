import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

const publicRoutes = ["/", "/sign-in", "/sign-up"]
const isPublicRoute = createRouteMatcher(publicRoutes)
const isAuthRoute = createRouteMatcher(["/sign-in", "/sign-up"])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (userId) {
    // If trying to access auth pages while logged in, redirect to dashboard
    if (isAuthRoute(req)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  } else {
    // If trying to access protected routes while logged out
    if (!isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
