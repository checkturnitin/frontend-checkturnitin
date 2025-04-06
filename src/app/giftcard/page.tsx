"use client"

import type React from "react"

import { useState, useEffect, forwardRef } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Copy, CheckCircle2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Textarea component
const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = "Textarea"

// Virtual Gift Card Component
interface VirtualGiftCardProps {
  code: string
  amount: number
  expiryDate: string
  isRedeemed?: boolean
  recipientName?: string
  senderName?: string
  message?: string
  onCopy?: () => void
}

function VirtualGiftCard({
  code = "GIFT-XXXX-XXXX-XXXX",
  amount = 50,
  expiryDate = "12/31/2025",
  isRedeemed = false,
  recipientName,
  senderName,
  message,
  onCopy,
}: VirtualGiftCardProps) {
  const [copied, setCopied] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    if (onCopy) onCopy()

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  // Format the code with spaces for better readability
  const formattedCode = code.replace(/(.{4})/g, "$1 ").trim()

  return (
    <div className="w-full max-w-md mx-auto my-8" style={{ perspective: "1000px" }}>
      <div
        className={`relative w-full h-56 sm:h-64 transition-all duration-500 cursor-pointer ${isFlipped ? "rotate-180" : ""}`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${
            isRedeemed
              ? "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900"
              : "bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] opacity-10 bg-center bg-no-repeat bg-cover"></div>

          {/* Card content */}
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Top section */}
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="bg-white/20 dark:bg-white/10 p-2 rounded-full">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <h3 className="ml-2 text-white font-bold text-lg">Gift Card</h3>
              </div>

              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-white font-bold">${amount}</span>
              </div>
            </div>

            {/* Middle section */}
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              {recipientName && (
                <p className="text-white/80 text-center text-sm">
                  For: <span className="font-semibold text-white">{recipientName}</span>
                </p>
              )}

              {message && <p className="text-white/90 text-center text-sm italic max-w-xs">"{message}"</p>}

              {senderName && (
                <p className="text-white/80 text-center text-sm">
                  From: <span className="font-semibold text-white">{senderName}</span>
                </p>
              )}
            </div>

            {/* Bottom section */}
            <div className="space-y-3">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center">
                  <div className="font-mono text-white text-sm sm:text-base tracking-wider">{formattedCode}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard()
                    }}
                    className="text-white hover:text-white/80 transition-colors"
                    aria-label="Copy gift card code"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5 text-green-300" /> : <Copy className="h-5 w-5" />}
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
                <span>Valid until: {expiryDate}</span>
                {isRedeemed && (
                  <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Redeemed</span>
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
                This gift card can be redeemed on our platform for credits.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Terms and conditions apply. No cash value. Cannot be combined with other offers.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Tap card to flip</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Page Component
export default function GiftCardDemo() {
  const [giftCardDetails, setGiftCardDetails] = useState({
    code: "GIFT-1234-5678-9012",
    amount: 50,
    expiryDate: "12/31/2025",
    recipientName: "Alex Johnson",
    senderName: "Jamie Smith",
    message: "Happy Birthday! Enjoy your gift!",
    isRedeemed: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    setGiftCardDetails((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    setGiftCardDetails((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Add custom styles for animations
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate(-50%, 10px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/chat"
          className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Chat
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Virtual Gift Card</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gift Card Preview */}
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Preview</h2>
            <VirtualGiftCard {...giftCardDetails} />
          </div>

          {/* Gift Card Customizer */}
          <div>
            <Card className="bg-white dark:bg-gray-900 border-indigo-100 dark:border-indigo-900 shadow-lg">
              <CardHeader>
                <CardTitle>Customize Gift Card</CardTitle>
                <CardDescription>Adjust the details to see changes in the preview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Gift Card Code</Label>
                    <Input
                      id="code"
                      name="code"
                      value={giftCardDetails.code}
                      onChange={handleChange}
                      placeholder="GIFT-XXXX-XXXX-XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={giftCardDetails.amount}
                      onChange={handleChange}
                      min={1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      name="recipientName"
                      value={giftCardDetails.recipientName}
                      onChange={handleChange}
                      placeholder="Recipient's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input
                      id="senderName"
                      name="senderName"
                      value={giftCardDetails.senderName}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={giftCardDetails.message}
                    onChange={handleChange}
                    placeholder="Add a personal message"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={giftCardDetails.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="isRedeemed"
                      name="isRedeemed"
                      checked={giftCardDetails.isRedeemed}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="isRedeemed">Mark as Redeemed</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tip: Click on the gift card to flip it and see the back side.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

