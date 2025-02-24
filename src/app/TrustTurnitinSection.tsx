"use client"

import Image from "next/image"
import { useState } from "react"
import { WobbleCard } from "@/components/ui/wobble-card"
import { Button } from "@/components/ui/button"
import SignupForm from "./signup/SignupForm"

export function WobbleCardDemo() {
  const [showSignupForm, setShowSignupForm] = useState(false)

  return (
    <>
      {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full p-4">
        {/* First Card */}
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 bg-gradient-to-br from-pink-700 to-pink-900 min-h-[300px]"
          className="p-8"
        >
          <div className="flex flex-col justify-between h-full">
            <div className="max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Turnitin powers academic integrity</h2>
              <p className="text-neutral-200">
                With over 100,000 monthly active users, Turnitin is the most trusted platform for plagiarism checks.
              </p>
            </div>
            <div className="mt-8 relative h-32 lg:h-48 w-full">
              <Image
                src="/assets/logos/Turnitin_logo.svg"
                layout="fill"
                objectFit="contain"
                objectPosition="right bottom"
                alt="Turnitin logo"
              />
            </div>
          </div>
        </WobbleCard>

        {/* Second Card */}
        <WobbleCard containerClassName="col-span-1 bg-gradient-to-br from-purple-700 to-purple-900 min-h-[300px]">
          <div className="p-8 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">No fake AI, no false results.</h2>
              <p className="text-neutral-200">Turnitin ensures your work is original and free from plagiarism.</p>
            </div>
            <Image
              src="/placeholder.svg?height=100&width=100"
              width={100}
              height={100}
              alt="AI Icon"
              className="mt-8 self-end"
            />
          </div>
        </WobbleCard>

        {/* Third Card */}
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-blue-700 to-blue-900 min-h-[300px]">
          <div className="p-8 flex flex-col lg:flex-row justify-between items-center h-full">
            <div className="max-w-lg mb-8 lg:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Sign up for blazing-fast, cutting-edge Turnitin checks today!
              </h2>
              <p className="text-neutral-200 mb-6">
                Join over 100,000 monthly active users who trust Turnitin for plagiarism checks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowSignupForm(true)}
                >
                  Sign Up
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    window.location.href = "https://discord.gg/your-discord-link"
                  }}
                >
                  Join Discord
                </Button>
              </div>
            </div>
            <div className="relative h-48 w-full lg:w-1/3">
              <Image
                src="/linear.webp"
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                alt="Turnitin demo image"
                className="rounded-2xl"
              />
            </div>
          </div>
        </WobbleCard>
      </div>
    </>
  )
}

