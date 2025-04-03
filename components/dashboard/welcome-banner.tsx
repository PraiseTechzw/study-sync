"use client"

import { useUser } from "@clerk/nextjs"

export default function WelcomeBanner() {
  const { user } = useUser()
  const firstName = user?.firstName || "there"

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 rounded-lg">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Welcome back, {firstName}!
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Ready to continue your learning journey? Check out your upcoming study sessions and join a study group to enhance your learning experience.
          </p>
        </div>
      </div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
} 