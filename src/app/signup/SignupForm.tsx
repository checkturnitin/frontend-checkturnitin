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

interface SignupFormProps {
  onClose: () => void
}

export default function SignupForm({ onClose }: SignupFormProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

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
        toast.success("Welcome to CheckTurnitin! 🎉", {
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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
      onClick={handleBackgroundClick}
    >
      <Card
        ref={formRef}
        className="w-full max-w-5xl h-auto md:h-[32rem] bg-white text-black overflow-hidden relative rounded-lg shadow-xl"
      >
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="flex flex-col md:flex-row h-full relative z-10">
          {/* Left Side */}
          <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center items-center h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            <CardHeader className="text-center mb-8 flex flex-col justify-center items-center">
              <Image
                src="/assets/logos/checkturnitin.svg"
                alt="CheckTurnitin Logo"
                width={120}
                height={120}
                className="mb-4"
              />
              <CardTitle className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-2">CheckTurnitin</CardTitle>
              <p className="text-xl md:text-2xl text-indigo-700">
                Get authentic Turnitin AI and plagiarism reports in minutes
              </p>
            </CardHeader>
            <div className="mt-8 text-center">
              <p className="text-sm text-indigo-600">
                Join thousands of users ensuring academic integrity with CheckTurnitin
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 p-8 flex flex-col justify-center items-center bg-white">
            <div className="w-full max-w-sm space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-indigo-900">Get Started</h3>
                <p className="text-sm text-indigo-600">Join in seconds • No credit card needed</p>
              </div>
              <div className="space-y-4">
                <GoogleOAuthProvider clientId="602949390183-0l5vs84jrsbvg5s4q5mqs7krg1bt9afd.apps.googleusercontent.com">
                  <div className="flex justify-center">
                    {isGoogleLoaded ? (
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        size="large"
                        theme="outline"
                        shape="pill"
                        locale="english"
                        text="continue_with"
                      />
                    ) : (
                      <div className="h-10 w-64 bg-gray-200 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </GoogleOAuthProvider>
                <div className="text-xs text-gray-600 text-center px-6">
                  By continuing, you agree to our{" "}
                  <a
                    href="/assets/Privacy%20Policy%20for%20CheckTurnitin%20-%20TermsFeed.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/assets/terms-of-service.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <ToastContainer />
    </div>
  )
}

