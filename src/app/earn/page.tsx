"use client"

import Header from "../header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"
import { Copy, Gift, Users, Zap, Send, Star, ExternalLink, DiscIcon as DiscordLogo, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"

export default function EarnPage() {
  const [referralLink, setReferralLink] = useState("https://yourapp.com/ref/user123")

  // This would typically come from your user profile or auth system
  useEffect(() => {
    // Example: fetch user's referral link from API
    // For demo purposes, we're using a static link
  }, [])

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
            Invite friends, earn rewards, and unlock premium features without spending a dime. Our referral program
            makes it easy to get more out of our platform.
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
                <h3 className="text-xl font-medium text-purple-700 dark:text-purple-400 mb-2">Copy Your Link</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get your unique referral link from below and copy it with one click.
                </p>
                <Copy className="mt-4 text-purple-500 h-8 w-8" />
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-purple-50 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="rounded-full bg-purple-600 text-white w-14 h-14 flex items-center justify-center text-xl font-semibold mb-4">
                  2
                </div>
                <h3 className="text-xl font-medium text-purple-700 dark:text-purple-400 mb-2">Share With Friends</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Send your link to friends via email, social media, or messaging apps.
                </p>
                <Users className="mt-4 text-purple-500 h-8 w-8" />
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-purple-50 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="rounded-full bg-purple-600 text-white w-14 h-14 flex items-center justify-center text-xl font-semibold mb-4">
                  3
                </div>
                <h3 className="text-xl font-medium text-purple-700 dark:text-purple-400 mb-2">Earn Rewards</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get 1 free Report Credit for each friend who signs up using your link.
                </p>
                <Gift className="mt-4 text-purple-500 h-8 w-8" />
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
                When your referred friends make their first report check, you'll receive an additional credit as a
                bonus!
              </p>
              <div className="flex items-center justify-center bg-white/20 p-3 rounded-lg">
                <span className="font-semibold">That's up to 2 credits per referral!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Section */}
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-semibold text-center text-purple-600 mb-8">
            Join Our Community for More Free Credits
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Discord Card */}
            <Card className="overflow-hidden border-purple-100 dark:border-purple-900 transition-all hover:shadow-lg flex flex-col">
              <div className="h-3 bg-indigo-600"></div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-4 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <DiscordLogo className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">Discord Community</h3>
                    <p className="text-gray-600 dark:text-gray-400">Join discussions & exclusive events</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-auto">
                  Join our Discord server to participate in community challenges, giveaways, and earn additional free
                  credits through special promotions.
                </p>
                <div className="mt-6">
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => window.open("https://discord.gg/R2zK3A5ftj", "_blank")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Join Discord
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Telegram Card */}
            <Card className="overflow-hidden border-purple-100 dark:border-purple-900 transition-all hover:shadow-lg flex flex-col">
              <div className="h-3 bg-blue-500"></div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-500 dark:text-blue-400">Telegram Group</h3>
                    <p className="text-gray-600 dark:text-gray-400">Get instant updates & offers</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-auto">
                  Our Telegram group members get early access to new features, flash promotions, and opportunities to
                  earn additional credits through community activities.
                </p>
                <div className="mt-6">
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => window.open("https://t.me/yourgroup", "_blank")}
                  >
                    <Send className="mr-2 h-4 w-4" /> Join Telegram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials */}
        <div className="w-full max-w-4xl mb-16">
          <h2 className="text-3xl font-semibold text-center text-purple-600 mb-8">What Our Users Say</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-white dark:bg-gray-900 border-purple-100 dark:border-purple-900 hover:shadow-md transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center mr-3">
                      <span className="text-purple-700 dark:text-purple-300 font-medium">
                        {String.fromCharCode(64 + i)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">User {i}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    "I've earned {i * 5} free credits through referrals! The process was super easy and my friends love
                    the service too."
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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

