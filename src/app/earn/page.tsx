"use client"

import Header from "../header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"
import { Copy, Gift, Users, Zap, Send, Star, ExternalLink, DiscIcon as DiscordLogo, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function EarnPage() {
  const [referralLink, setReferralLink] = useState("Login and Get Your Referral Link")
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied to clipboard!")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white text-black dark:from-gray-950 dark:to-gray-900 dark:text-white">
      <Header />

      <main className="flex-grow flex flex-col items-center px-4 py-12 transition duration-300 ease-in-out">
        {/* Hero Section */}
        <div className="w-full max-w-4xl mx-auto mb-16 text-center mt-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 mb-6">
            Earn Free Report Credits!
          </h1>
          <p className="text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Invite friends, earn rewards, and unlock premium features without spending a dime. Our referral program makes it easy to get more out of our platform.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white dark:bg-gray-900 shadow-xl border-purple-100 dark:border-purple-900 w-full max-w-4xl mb-12">
          <CardContent className="p-8 md:p-10">
            <h2 className="text-3xl font-semibold text-center text-purple-600 mb-8">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-purple-50 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="rounded-full bg-purple-600 text-white w-14 h-14 flex items-center justify-center text-xl font-semibold mb-4">
                  1
                </div>
                <h3 className="text-xl font-medium text-purple-700 dark:text-purple-400 mb-2">Log In</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  First, log into your account.
                </p>
                <ExternalLink className="mt-4 text-purple-500 h-8 w-8" />
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-purple-50 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="rounded-full bg-purple-600 text-white w-14 h-14 flex items-center justify-center text-xl font-semibold mb-4">
                  2
                </div>
                <h3 className="text-xl font-medium text-purple-700 dark:text-purple-400 mb-2">Get Your Link</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Go to your profile and copy the referral link available there.
                </p>
                <Copy className="mt-4 text-purple-500 h-8 w-8" />
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-purple-50 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="rounded-full bg-purple-600 text-white w-14 h-14 flex items-center justify-center text-xl font-semibold mb-4">
                  3
                </div>
                <h3 className="text-xl font-medium text-purple-700 dark:text-purple-400 mb-2">Share With Friends</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Send your link to friends via email, social media, or messaging apps.
                </p>
                <Users className="mt-4 text-purple-500 h-8 w-8" />
              </div>
            </div>

            {/* Referral Link Section */}
            <div className="bg-purple-100 dark:bg-gray-800 p-6 rounded-xl mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow p-3 bg-white dark:bg-gray-700 rounded-lg border border-purple-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {referralLink}
                </div>
                <Button onClick={copyReferralLink} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
              </div>
            </div>

            {/* Bonus Info */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold">Bonus: Double Your Rewards!</h3>
              </div>
              <p className="mb-4">
                When your referred friends make their first report check, you'll receive an additional credit as a bonus!
              </p>
              <div className="flex items-center justify-center bg-white/20 p-3 rounded-lg">
                <span className="font-semibold">That's up to 2 credits per referral!</span>
              </div>
            </div>
          </CardContent>
        </Card>




        {/* FAQ Section */}
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-semibold text-center text-purple-600 mb-8">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: "How many credits can I earn?",
                a: "There's no limit! You can earn as many credits as you want by referring friends.",
              },
              {
                q: "How long does it take to receive my credits?",
                a: "Credits are added to your account immediately after your friend signs up using your referral link.",
              },
              {
                q: "Can I combine referral credits with purchased credits?",
                a: "Yes! Referral credits work exactly the same as purchased credits.",
              },
              {
                q: "Do referral credits expire?",
                a: "No, your earned credits never expire and can be used anytime.",
              },
            ].map((faq, i) => (
              <Card
                key={i}
                className="bg-white dark:bg-gray-900 border-purple-100 dark:border-purple-900 hover:shadow-md transition-all"
              >
                <CardContent className="p-6">
                  <h4 className="text-lg font-medium text-purple-700 dark:text-purple-400 mb-2">{faq.q}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-purple-50 dark:bg-gray-900 py-8 text-center text-gray-600 dark:text-gray-400">
        <div className="container mx-auto px-4">
          <p>Start earning free credits today by sharing your referral link!</p>
          <p className="mt-2">
            Have questions? Contact our support team at{" "}
            <a href="mailto:support@example.com" className="text-purple-600 dark:text-purple-400 hover:underline">
              support@checkturnitin.com
            </a>
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center">
              <ExternalLink className="h-4 w-4 mr-1" /> Terms
            </a>
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center">
              <ExternalLink className="h-4 w-4 mr-1" /> Privacy
            </a>
          </div>
        </div>
      </footer>

      <Toaster position="bottom-center" richColors />
    </div>
  )
}