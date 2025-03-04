"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"
import { serverURL } from "@/utils/utils"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, MessageCircle, User, Bell, Shield, ArrowLeft, Play, RefreshCw } from "lucide-react"
import Link from "next/link"
import VideoModal from "./video-modal"

interface User {
  username: string
  telegramId?: string
}

export default function TelegramVerification() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [telegramUsername, setTelegramUsername] = useState("")
  const [showQR, setShowQR] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showVideo, setShowVideo] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchUser()
    }
  }, [])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Authentication token not found. Please sign up first to verify Telegram")
        window.location.href = "/signup"
        return
      }

      const response = await axios.get(`${serverURL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(response.data.user)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data || "Failed to load user data"
        toast.error(message)
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!telegramUsername.trim()) {
      toast.error("Please enter your Telegram username")
      return
    }

    const processedUsername = telegramUsername.trim().replace(/^@/, "")

    setVerifying(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${serverURL}/telegram/verify`,
        { username: processedUsername },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setUser((prev) => (prev ? { ...prev, telegramId: response.data.telegramId } : null))
      setCurrentStep(4)
      setVerificationSuccess(true)
      toast.success(user?.telegramId ? "Telegram ID updated successfully!" : "Telegram ID verified successfully!")
      setTimeout(() => setVerificationSuccess(false), 3000) // Reset after 3 seconds
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Failed to verify Telegram ID"
        if (error.response?.status === 404) {
          toast.error("User not found on Telegram. Please check your username")
        } else {
          toast.error(errorMessage)
        }
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  const steps = [
    {
      title: "Join Telegram Group",
      content:
        "Click the link below to join our Telegram group. This is where you'll receive updates and notifications.",
      icon: <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: "Find Bot and Message",
      content:
        "Once in the group, find our verification bot. Send the message '/verify' to initiate the verification process.",
      icon: <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: "Enter Username",
      content:
        "Enter your Telegram username in the input field on the right. Make sure it matches your Telegram account exactly.",
      icon: <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: "Verification Complete",
      content:
        "Great job! Your account is now verified. You'll receive live updates and notifications directly in Telegram.",
      icon: <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
  ]

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="w-full overflow-hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Scrollable steps */}
            <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Image src="/assets/images/telegram-icon.png" alt="Telegram Icon" width={32} height={32} />
                  <h2 className="text-2xl font-bold ml-2 text-gray-900 dark:text-gray-100">Verification Steps</h2>
                </div>
                <Button
                  onClick={() => setShowVideo(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 px-4 transition-all duration-300 flex items-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Watch Tutorial</span>
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                {steps.map((step, index) => (
                  <Card
                    key={index}
                    className={`mb-4 transition-all duration-300 ease-in-out ${
                      currentStep > index + 1
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "hover:shadow-md hover:-translate-y-1"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center text-gray-900 dark:text-gray-100">
                        {currentStep > index + 1 ? (
                          <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                        ) : (
                          <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {index + 1}
                          </div>
                        )}
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start">
                        {step.icon}
                        <p className="ml-2 text-gray-600 dark:text-gray-400">{step.content}</p>
                      </div>
                      {index === 0 && (
                        <div className="mt-4">
                          <a
                            href="https://t.me/+Ygur2tomDdwyM2Fl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center group"
                            onMouseEnter={() => setShowQR(true)}
                            onMouseLeave={() => setShowQR(false)}
                          >
                            Join Telegram Group
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                          </a>
                          <div
                            className={`mt-2 transition-all duration-300 ease-in-out ${
                              showQR ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
                            } overflow-hidden`}
                          >
                            <Image
                              src="/assets/images/telegram_checkturnitingroup.png"
                              alt="Telegram Group QR Code"
                              width={150}
                              height={150}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </div>

            {/* Right side - Verification form */}
            <div className="w-full md:w-1/2 p-6 bg-white dark:bg-gray-800">
              <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Telegram Verification</h1>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {user?.telegramId ? "Update" : "Enter"} Your Telegram Username
                  </h3>
                  {user?.telegramId && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Current Telegram ID: <span className="font-semibold">{user.telegramId}</span>
                    </p>
                  )}
                  <Input
                    type="text"
                    placeholder="@yourusername"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="w-full mb-4"
                  />
                  <Button
                    onClick={handleVerify}
                    disabled={verifying}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out ${
                      verificationSuccess ? "animate-pulse bg-green-500" : ""
                    }`}
                  >
                    {verifying ? "Verifying..." : user?.telegramId ? "Update Telegram ID" : "Verify Telegram"}
                    {user?.telegramId && <RefreshCw className="ml-2 h-4 w-4" />}
                  </Button>
                </Card>
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Why verify your Telegram?</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Receive instant notifications</li>
                    <li>Get real-time updates on your submissions</li>
                    <li>Access exclusive Telegram-only features</li>
                    <li>Connect with our community</li>
                  </ul>
                </Card>
              </div>

              {currentStep === 4 && (
                <Card className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-700 dark:text-green-300 text-center text-lg font-semibold">
                    {user?.telegramId ? "Telegram ID updated!" : "Verification complete!"}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-center mt-2">
                    You will now receive live tracking and notification progress in Telegram.
                  </p>
                </Card>
              )}

              <Button
                onClick={() => setShowVideo(true)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl flex items-center justify-center"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Tutorial Video
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} videoId="S6ZxkZRElg4" />
    </div>
  )
}