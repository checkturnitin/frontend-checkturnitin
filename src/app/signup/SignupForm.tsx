"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { serverURL } from "@/utils/utils"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import gsap from "gsap"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"

interface SignupFormProps {
  onClose: () => void
}

export default function SignupForm({ onClose }: SignupFormProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const googleLoginRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const referral = new URLSearchParams(window.location.search).get("referral")
    if (referral) {
      setReferralCode(referral)
    }

    if (formRef.current) {
      gsap.fromTo(formRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" })
    }

    // Preload Google Sign-In script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.onload = () => setIsGoogleLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      const tokenId = response.credential

      if (!tokenId) {
        throw new Error("Token ID is undefined")
      }

      const config = {
        method: "POST",
        url: `${serverURL}/users/google-auth`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: {
          tokenId: tokenId,
          approval_state: "approved",
          referralCode: referralCode,
        },
      }

      const res = await axios(config)

      if (res.status === 200) {
        const { token, user } = res.data
        toast.success("Welcome to Aiplagreport! 🎉", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "8px",
          },
        })
        localStorage.setItem("token", token)
        window.location.href = user.type === "admin" ? "/admin" : "/"
      } else {
        throw new Error("Failed to authenticate with the server")
      }
    } catch (error) {
      console.error("Google authentication error:", error)
      toast.error("Oops! Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: "#fff",
          color: "#000",
          borderRadius: "8px",
        },
      })
    }
  }

  const handleGoogleError = () => {
    toast.error("Unable to sign in with Google. Please try again.", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: "8px",
      },
    })
  }

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const triggerGoogleLogin = () => {
    if (googleLoginRef.current) {
      const googleLoginButton = googleLoginRef.current.querySelector("button") as HTMLButtonElement | null
      if (googleLoginButton) {
        googleLoginButton.click()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
      onClick={handleBackgroundClick}
    >
      <Card
        ref={formRef}
        className="w-full max-w-5xl h-auto md:h-[32rem] bg-white dark:bg-gray-800 text-black dark:text-white overflow-hidden relative rounded-lg shadow-xl"
      >
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="flex flex-col md:flex-row h-full relative z-10">
          {/* Left Side */}
          <div className="flex-1 p-4 md:p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
            <CardHeader className="text-center mb-4 md:mb-8 flex flex-col justify-center items-center">
              <Image
                src="/assets/logos/checkturnitin.svg"
                alt="Aiplagreport Logo"
                width={80}
                height={80}
                className="mb-2 md:mb-4 md:w-[120px] md:h-[120px]"
              />
              <CardTitle className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-indigo-900 dark:text-indigo-100 mb-2">
                Aiplagreport
              </CardTitle>
              <p className="text-lg md:text-xl lg:text-2xl text-indigo-700 dark:text-indigo-300">
                Get authentic Turnitin AI and plagiarism reports in minutes
              </p>
            </CardHeader>
            <div className="mt-4 md:mt-8 text-center">
              <p className="text-sm text-indigo-600 dark:text-indigo-400">
                Join thousands of users ensuring academic integrity with Aiplagreport
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 p-4 md:p-8 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
            <div className="w-full max-w-sm space-y-4 md:space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-indigo-900 dark:text-indigo-100">Get Started</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">Join in seconds • No credit card needed</p>
              </div>
              <div className="space-y-4">
                <GoogleOAuthProvider clientId="602949390183-oa5ikpt9j6lc5ijhvjo7o8uok609snuc.apps.googleusercontent.com">
                  <div className="flex justify-center" ref={googleLoginRef}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      theme="filled_black"
                      size="large"
                      width="100%"
                      auto_select={false}
                    />
                  </div>
                </GoogleOAuthProvider>
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center px-6">
                  By continuing, you agree to our{" "}
                  <a
                    href="/assets/privacypolicy.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/assets/terms-condition.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div
                className={cn(
                  "group rounded-full border border-black/5 bg-neutral-100 text-base text-black transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800",
                )}
                onClick={triggerGoogleLogin}
              >
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  <span>✨ Join and get free Turnitin checks</span>
                  <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <ToastContainer />
    </div>
  )
}

