"use client"

import Header from "../header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"
import { Copy, Gift, Users, Zap, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { serverURL } from "@/utils/utils"
import Link from "next/link"

interface User {
  name: string;
  email: string;
  credits: number;
  referralCode: string;
  planType: string;
}

export default function EarnPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [referralLink, setReferralLink] = useState<string>("");
  
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<{ user: User }>(`${serverURL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setReferralLink(`${window.location.origin}/?referral=${response.data.user.referralCode}`);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    getUser();
  }, []);
  
  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
        .then(() => toast.success("Referral link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy referral link."));
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white text-black dark:from-gray-950 dark:to-gray-900 dark:text-white">
      <Header />

      <main className="flex-grow flex flex-col items-center px-4 py-12 transition duration-300 ease-in-out">
        {/* Hero Section */}
        <div className="w-full max-w-3xl mx-auto mb-12 text-center mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Earn Free Report Credits
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Invite friends, earn rewards, and unlock premium features without spending a dime.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white dark:bg-gray-900 shadow-lg border-gray-100 dark:border-gray-800 w-full max-w-3xl mb-12">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-8">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center text-center p-5 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all hover:shadow-sm">
                <div className="rounded-full bg-indigo-600 text-white w-12 h-12 flex items-center justify-center text-lg font-semibold mb-3">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Log In</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  First, log into your account.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-5 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all hover:shadow-sm">
                <div className="rounded-full bg-indigo-600 text-white w-12 h-12 flex items-center justify-center text-lg font-semibold mb-3">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Get Your Link</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Copy your unique referral link.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-5 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all hover:shadow-sm">
                <div className="rounded-full bg-indigo-600 text-white w-12 h-12 flex items-center justify-center text-lg font-semibold mb-3">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Share With Friends</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Send your link to friends via email, social media, or messaging apps.
                </p>
              </div>
            </div>

            {/* Referral Link Section */}
            {user ? (
              <div className="bg-indigo-600 text-white p-6 rounded-lg mb-8">
                <div className="flex items-center mb-4">
                  <Gift className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-semibold">Your Referral Link</h3>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                  <p className="font-medium text-center break-all text-sm">
                    {referralLink}
                  </p>
                </div>
                <Button 
                  onClick={copyReferralLink} 
                  className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
              </div>
            ) : (
              <div className="bg-indigo-600 text-white p-6 rounded-lg mb-8">
                <div className="flex items-center mb-4">
                  <Gift className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-semibold">Get Your Referral Link</h3>
                </div>
                <p className="mb-4 text-sm">
                  Log in to get your unique referral link and start earning credits!
                </p>
                <Link href="/">
                  <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center">
                    Log In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Bonus Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Zap className="h-6 w-6 mr-2 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bonus: Double Your Rewards!</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                When your referred friends make their first report check, you'll receive an additional credit as a bonus!
              </p>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-md">
                <span className="font-medium text-indigo-700 dark:text-indigo-300 text-sm">That's up to 2 credits per referral!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>

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
                className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:shadow-sm transition-all"
              >
                <CardContent className="p-5">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">{faq.q}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 py-6 text-center text-gray-600 dark:text-gray-400">
        <div className="container mx-auto px-4">
          <p className="text-sm">Start earning free credits today by sharing your referral link!</p>
          <p className="mt-2 text-sm">
            Have questions? Contact our support team at{" "}
            <a href="mailto:support@aiplagreport.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              support@aiplagreport.com
            </a>
          </p>
        </div>
      </footer>

      <Toaster position="bottom-center" richColors />
    </div>
  )
}