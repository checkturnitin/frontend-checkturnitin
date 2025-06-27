"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Copy, CheckCircle2, Sparkles, Loader2, CreditCard, Check, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import axios from "axios"
import { FaRegCreditCard } from "react-icons/fa"
import { FaGift } from "react-icons/fa6"
import { BsCheckCircleFill } from "react-icons/bs"
import { serverURL } from "@/utils/utils"


export default function ClaimGiftCard() {
  const [giftCardCode, setGiftCardCode] = useState("")
  const [email, setEmail] = useState("")
  const [isClaiming, setIsClaiming] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isCreditsFlipped, setIsCreditsFlipped] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentCredits, setCurrentCredits] = useState(250)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [claimedCard, setClaimedCard] = useState<{
    code: string
    credits: number
    expiryDate: string
    isRedeemed: boolean
  } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Check theme from localStorage and get user data
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Check for theme in localStorage
      const storedTheme = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      // Set dark theme if explicitly set to 'dark' or if system prefers dark and no theme is stored
      const isDark = storedTheme === "dark" || (!storedTheme && prefersDark)
      setIsDarkTheme(isDark)

      // Apply theme to document
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      // Listen for theme changes
      const handleStorageChange = () => {
        const updatedTheme = localStorage.getItem("theme")
        const newIsDark = updatedTheme === "dark"
        setIsDarkTheme(newIsDark)

        if (newIsDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }

      window.addEventListener("storage", handleStorageChange)
      
      // Get user data
      getUser()
      
      return () => {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [])

  // Get user data if token exists
  const getUser = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoggedIn(false)
      setIsLoadingUser(false)
      return
    }

    try {
      console.log("Fetching user data...")
      console.log(serverURL);
      console.log(token);
      
      
      const response = await axios.get(`${serverURL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      setUser(response.data.user)
      console.log("User data:", response.data.user)
      setIsLoggedIn(true)
      setEmail(response.data.user.email) // Auto-fill email field
      setCurrentCredits(response.data.user.credits || 250)
      localStorage.setItem("planType", response.data.user.planType)
    } catch (error) {
      setIsLoggedIn(false)
      toast.error("Failed to fetch user data!")
    } finally {
      setIsLoadingUser(false)
    }
  }

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light" : "dark"
    localStorage.setItem("theme", newTheme)
    setIsDarkTheme(!isDarkTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const copyToClipboard = () => {
    if (!claimedCard) return

    navigator.clipboard.writeText(claimedCard.code)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const claimGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast.error("Please enter a gift card code")
      return
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsClaiming(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/gift-cards/redeem`, {
        code: giftCardCode,
        email: email
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      })

      const newCredits = response.data.credits
      setClaimedCard({
        code: giftCardCode,
        credits: newCredits,
        expiryDate: response.data.expiryDate || "12/31/2025",
        isRedeemed: true,
      })

      // Update total credits
      setCurrentCredits((prev) => prev + newCredits)

      toast.success(`Gift card claimed successfully! Added ${newCredits} CheckPlagiarism Credits.`)
      setGiftCardCode("")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to claim gift card. Please try again.")
      console.error(error)
    } finally {
      setIsClaiming(false)
    }
  }

  // Format the code with spaces for better readability
  const formattedCode = (code: string) => code.replace(/(.{4})/g, "$1 ").trim()

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/chat"
            className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Chat
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDarkTheme ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">CheckPlagiarism Credits</h1>

        {/* Current Credits Card */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Your Current Balance
          </h2>

          <div className="w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
            <div
              className={`relative w-full h-48 transition-all duration-500 cursor-pointer`}
              style={{
                transformStyle: "preserve-3d",
                transform: isCreditsFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
              onClick={() => setIsCreditsFlipped(!isCreditsFlipped)}
            >
              {/* Front of credits card */}
              <div
                className="absolute inset-0 rounded-xl overflow-hidden shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                  <FaRegCreditCard className="h-32 w-32 text-white/20" />
                </div>

                {/* Card content */}
                <div className="relative h-full p-6 flex flex-col justify-between">
                  {/* Top section */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-white/20 dark:bg-white/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="ml-2 text-white font-bold text-lg">CheckPlagiarism</h3>
                    </div>

                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-white/70" />
                    </div>
                  </div>

                  {/* Middle section */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="text-center">
                      <p className="text-white/80 text-sm mb-1">Available Balance</p>
                      <div className="flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">{currentCredits}</span>
                      </div>
                      <p className="text-white/90 text-sm mt-1">CheckPlagiarism Credits</p>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                    <div className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Active</div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 h-20 w-20 bg-white/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 h-16 w-16 bg-white/10 rounded-tr-full"></div>
              </div>

              {/* Back of credits card */}
              <div
                className="absolute inset-0 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-teal-800 dark:to-emerald-900"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="absolute top-0 w-full h-12 bg-black/10"></div>
                <div className="absolute top-16 left-4 right-4 h-10 bg-white/80 dark:bg-white/20 rounded"></div>

                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your CheckPlagiarism Credits can be used to verify documents for plagiarism.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Each credit allows you to check one document up to 25,000 words.
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Tap card to flip</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gift Card Claim Form */}
        <Card className="bg-white dark:bg-gray-900 border-indigo-100 dark:border-indigo-900 shadow-lg mb-8 transition-colors duration-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FaGift className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>Redeem Gift Card</span>
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Enter your gift card code to add CheckPlagiarism Credits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                disabled={isLoggedIn}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="giftCardCode" className="dark:text-gray-300">
                Gift Card Code
              </Label>
              <Input
                id="giftCardCode"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
                placeholder="GIFT-XXXX-XXXX-XXXX"
                className="font-mono dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-800"
              onClick={claimGiftCard}
              disabled={isClaiming || !giftCardCode.trim() || !email.trim()}
            >
              {isClaiming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                "Claim Gift Card"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Claimed Gift Card */}
        {claimedCard && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">Your Gift Card</h2>

            {/* Virtual Gift Card */}
            <div className="w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
              <div
                className={`relative w-full h-56 transition-all duration-500 cursor-pointer`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front of card */}
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <FaGift className="h-32 w-32 text-white/20" />
                  </div>

                  {/* Card content */}
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    {/* Top section */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-white/20 dark:bg-white/10 p-2 rounded-full">
                          <FaGift className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="ml-2 text-white font-bold text-lg">Gift Card</h3>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Sparkles className="h-4 w-4 text-yellow-300" />
                        <span className="text-white font-bold">{claimedCard.credits} CheckPlagiarism Credits</span>
                      </div>
                    </div>

                    {/* Middle section */}
                    <div className="flex flex-col items-center justify-center space-y-2 py-2">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="text-white text-center text-sm">
                          <span className="font-semibold text-white">Congratulations!</span>
                        </p>
                        <p className="text-white/90 text-center text-sm">Your gift card has been claimed</p>
                      </div>
                    </div>

                    {/* Bottom section */}
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center">
                          <div className="font-mono text-white text-sm sm:text-base tracking-wider">
                            {formattedCode(claimedCard.code)}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard()
                            }}
                            className="text-white hover:text-white/80 transition-colors"
                            aria-label="Copy gift card code"
                          >
                            {copied ? (
                              <BsCheckCircleFill className="h-5 w-5 text-green-300" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {copied && (
                          <div
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded"
                            style={{
                              animation: "fadeInUp 0.3s ease-out forwards",
                            }}
                          >
                            Copied!
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs text-white/70">
                        <span>Valid until: {claimedCard.expiryDate}</span>
                        {claimedCard.isRedeemed && (
                          <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Redeemed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 h-20 w-20 bg-white/10 rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 h-16 w-16 bg-white/10 rounded-tr-full"></div>
                </div>

                {/* Back of card */}
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="absolute top-0 w-full h-12 bg-black/10"></div>
                  <div className="absolute top-16 left-4 right-4 h-10 bg-white/80 dark:bg-white/20 rounded"></div>

                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        This gift card has been added to your account.
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {claimedCard.credits} CheckPlagiarism Credits have been added to your balance.
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Tap card to flip</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="mx-auto dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                onClick={() => setClaimedCard(null)}
              >
                Claim Another Gift Card
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}