"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { serverURL } from "@/utils/utils";
import Header from "../header";
import ElegantFooter from "../last";
import SignupForm from "../signup/SignupForm";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ClaimResponse = {
  message: string;
  bonusCredits: number;
  newBalance: number;
  transactionId: string;
};

type UserResponse = {
  user: {
    userId: string;
    email: string;
  };
};

export default function ClaimDiscordBonusPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<ClaimResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPrefilledFromAuth, setIsPrefilledFromAuth] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);

    const fetchUser = async () => {
      try {
        const res = await axios.get<UserResponse>(`${serverURL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.user?.email) {
          setEmail(res.data.user.email);
          setIsPrefilledFromAuth(true);
        }
      } catch (e) {
        // Ignore if user fetch fails; user can type email manually
      }
    };
    fetchUser();
  }, []);

  // Refresh login state when signup form is closed
  useEffect(() => {
    if (!showSignupForm) {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        setIsLoggedIn(true);
        // Fetch user data again
        const fetchUser = async () => {
          try {
            const res = await axios.get<UserResponse>(`${serverURL}/users`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data?.user?.email) {
              setEmail(res.data.user.email);
              setIsPrefilledFromAuth(true);
            }
          } catch (e) {
            // Ignore if user fetch fails
          }
        };
        fetchUser();
      } else {
        setIsLoggedIn(false);
        setIsPrefilledFromAuth(false);
        setEmail("");
      }
    }
  }, [showSignupForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post<ClaimResponse>(
        `${serverURL}/users/claim-discord-bonus`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: typeof window !== "undefined" && localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : "",
          },
        }
      );
      setSuccess(res.data);
    } catch (err: any) {
      const message = err?.response?.data?.error || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-white text-gray-900 overflow-hidden dark:bg-black dark:text-white">
      <Header onShowSignupForm={() => setShowSignupForm(true)} />

      <section className="flex-1 px-4 pt-28 pb-16 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Claim Discord Join Bonus</CardTitle>
              <CardDescription>
                Get 5 bonus credits for joining our Discord. Enter your account email to claim. Bonus is added instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4">
                  <Alert>
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      {success.message} Added {success.bonusCredits} credits. New balance: {success.newBalance}.<br />
                      Transaction ID: {success.transactionId}
                      <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">Thank you! 😊</div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {error && (
                <div className="mb-4">
                  <Alert variant="destructive">
                    <AlertTitle>Unable to claim</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Enter your email</Label>
                  <div className="rounded-lg border-2 border-indigo-500/40 bg-indigo-50/60 p-3 dark:border-indigo-400/30 dark:bg-indigo-950/30">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                      className="bg-white dark:bg-neutral-950"
                    />
                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">Bonus will be added to this account instantly.</p>
                  </div>
                  {isPrefilledFromAuth && (
                    <p className="text-xs text-neutral-500">Email fetched from your logged-in account.</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Claiming..." : "Claim Bonus"}
                  </Button>

                  <a
                    href="https://discord.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Join our Discord
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Join Discord prompt card */}
        <div className="w-full max-w-xl mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Not on Discord yet?</CardTitle>
              <CardDescription>
                Join our Discord community first, then come back here to claim your bonus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-600/90"
              >
                Join Discord
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Simple steps guide (moved to bottom) */}
        <div className="w-full max-w-2xl mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">1</div>
              <div>
                <div className="text-sm font-semibold">Join Discord</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Become a member of our community.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">2</div>
              <div>
                <div className="text-sm font-semibold">Enter your email</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Put your email here — the bonus will be added to your account instantly.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">3</div>
              <div>
                <div className="text-sm font-semibold">Claim your bonus</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Click Claim — credits are applied immediately.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ElegantFooter />
      {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}
    </main>
  );
}


