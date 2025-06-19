"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "@/utils/utils";
import Header from "../header";
import SignupForm from "../signup/SignupForm";
import ElegantFooter from "../last";
import PricingCards from "./pricingcard";
import { initializePaddle } from "@paddle/paddle-js";
import PlansAndPriority from "./PlansAndPriority";
import Head from "next/head";
import { Toaster } from "sonner";
import { FaCcVisa, FaCcMastercard, FaCcDiscover, FaCcPaypal } from "react-icons/fa";
import { SiAlipay, SiApplepay, SiGooglepay } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
  _id: string;
  title: string;
  enable: boolean;
  country: string;
  currency: string;
  price: number;
  features: string[];
  paddleProductId: string | null;
  creditLimit: number;
}

interface PaymentMethods {
  stripe: { enabled: boolean; currencies: string[] };
  imepay: { enabled: boolean; currencies: string[] };
  esewa: { enabled: boolean; currencies: string[] };
  khalti: { enabled: boolean; currencies: string[] };
  fonepay: { enabled: boolean; currencies: string[] };
}

interface User {
  userId: string;
  email: string;
}

export default function UnifiedPricingShop() {
  const [items, setItems] = useState<Item[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const carouselItems = [
    {
      icon: "✅",
      color: "text-green-500",
      text: "We provide authentic Turnitin plagiarism and AI detection checks."
    },
    {
      icon: "💳",
      color: "text-blue-500",
      text: "Every purchase is a one-time payment — we do not offer subscriptions, and your card will never be charged automatically."
    },
    {
      icon: "🔁",
      color: "text-purple-500",
      text: "1 credit = 1 check."
    },
    {
      icon: "💰",
      color: "text-green-600",
      text: "Pay-as-you-go model • No monthly fees • Credits never expire"
    },
    {
      icon: "⚡",
      color: "text-blue-600",
      text: "Top up your account anytime and use credits whenever you need them"
    }
  ];

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${serverURL}/shop`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const { items, paymentMethods } = response.data;
      setItems(items.filter((item: Item) => item.currency === "USD" && item.enable));
      setPaymentMethods(paymentMethods);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      // Add a minimum loading time to prevent flashing
      setTimeout(() => {
        setIsLoading(false);
        setHasLoaded(true);
      }, 800); // Minimum 800ms loading time
    }
  };

  const initPaddle = async () => {
    try {
      await initializePaddle({
        token: "live_eb6b24eac760aa6c98bbe775bad", // Replace with your actual client-side token
        environment: "production",
        checkout: {
          settings: {
            frameTarget: "self",
            frameInitialHeight: 450,
            frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
          },
        },
        eventCallback: (event) => {
          console.log("Paddle event:", event);
          if (event.name === "checkout.completed") {
            handleSuccessfulPayment(event.data);
          }
        },
      });
      setPaddleLoaded(true);
    } catch (error) {
      console.error("Failed to initialize Paddle:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get<{ user: User }>(`${serverURL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    initPaddle();
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchItems();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (isCarouselPaused) return;
    
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000); // Change every 5 seconds (slower)

    return () => clearInterval(interval);
  }, [carouselItems.length, isCarouselPaused]);

  const handleSuccessfulPayment = async (data: any) => {
    try {
      const response = await axios.post(
        `${serverURL}/payment/paddle`,
        { data },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log("Subscription updated:", response.data);
      alert("Payment successful! Your account has been upgraded.");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update subscription:", error);
      alert("Payment was successful, but we encountered an error updating your account. Please contact support.");
    }
  };

  const openCheckout = async (priceId: string) => {
    if (paddleLoaded && typeof window !== "undefined" && window.Paddle && user) {
      try {
        await window.Paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: {
            email: user.email,
            address: {
              city: "George Town",
              countryCode: "KY",
              firstLine: "456 Cayman Street",
              postalCode: "KY1-1001",
              region: "Grand Cayman",
            },
          },
          settings: {
            frameTarget: "self",
            frameInitialHeight: 450,
            frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
            theme: "light",
          },
          customData: {
            utm_medium: "social",
            utm_source: "linkedin",
            utm_content: "launch-video",
            integration_id: "AA-123",
            userId: user.userId,
            userEmail: user.email,
          },
        });
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Something went wrong. Please try again later. If the issue persists, contact our support team.");
      }
    } else {
      console.error("Paddle is not initialized or user is not logged in");
      alert("Payment system is not ready. Please try again later.");
    }
  };

  return (
    <>
    <head>
      <title>Pricing Plans - Turnitin Alternative | Aiplagreport</title>
      <meta
        name="description"
        content="Choose from flexible pricing plans for our Turnitin alternative. Get instant AI analysis and detailed plagiarism reports. Start with our affordable plans today."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://aiplagreport.com/pricing" />
      <meta property="og:title" content="Pricing Plans - Turnitin Alternative | Aiplagreport" />
      <meta
        property="og:description"
        content="Choose from flexible pricing plans for our Turnitin alternative. Get instant AI analysis and detailed plagiarism reports. Start with our affordable plans today."
      />
      <meta
        property="og:image"
        content="https://aiplagreport.com/assets/images/pricing.png"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@aiplagreport" />
      <meta name="twitter:title" content="Pricing Plans - Turnitin Alternative | Aiplagreport" />
      <meta
        name="twitter:description"
        content="Choose from flexible pricing plans for our Turnitin alternative. Get instant AI analysis and detailed plagiarism reports. Start with our affordable plans today."
      />
      <meta name="twitter:image" content="https://aiplagreport.com/assets/images/pricing.png" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Pricing Plans - Turnitin Alternative",
          "description": "Choose from flexible pricing plans for our Turnitin alternative. Get instant AI analysis and detailed plagiarism reports. Start with our affordable plans today.",
          "url": "https://aiplagreport.com/pricing",
          "publisher": {
            "@type": "Organization",
            "name": "Aiplagreport",
            "url": "https://aiplagreport.com"
          },
          "mainEntity": {
            "@type": "Product",
            "name": "Aiplagreport Plagiarism Detection",
            "description": "Advanced Turnitin alternative with AI-powered plagiarism detection. Get instant similarity reports, detailed analysis, and 99.9% accuracy.",
            "image": "https://aiplagreport.com/assets/images/pricing.png",
            "brand": {
              "@type": "Brand",
              "name": "Aiplagreport"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "USD",
              "lowPrice": "9.99",
              "highPrice": "99.99",
              "offerCount": "3",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Basic Plan",
                  "price": "9.99",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Plan",
                  "price": "49.99",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "name": "Premium Plan",
                  "price": "99.99",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                }
              ]
            }
          }
        })}
      </script>
    </head>

      <main className="relative flex flex-col w-full min-h-screen bg-white text-gray-900 overflow-hidden dark:bg-black dark:text-white">
        <Header onShowSignupForm={() => setShowSignupForm(true)} />

        <div className="flex flex-col items-center mt-28 px-4 dark:bg-black dark:text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-900 p-4 dark:bg-black dark:text-white">
            Authentic AI and{" "}
            <img src="/assets/logos/Turnitin_logo.svg" alt="Turnitin Logo" className="inline-block w-32 h-10" /> Plagiarism Reports
          </h1>
          <p className="text-base text-gray-600 text-center max-w-xl dark:bg-black dark:text-white">
            Get instant AI analysis and detailed plagiarism reports for your content
          </p>

          
          {/* Additional Information Carousel */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div 
              className="relative h-16 flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCarouselIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300 text-center"
                >
                  <span className={`${carouselItems[currentCarouselIndex].color} text-2xl`}>
                    {carouselItems[currentCarouselIndex].icon}
                  </span>
                  <span className="max-w-md">
                    {carouselItems[currentCarouselIndex].text}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Carousel Dots */}
            <div className="flex justify-center space-x-2 mt-4">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCarouselIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentCarouselIndex 
                      ? 'bg-purple-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <PricingCards
          isLoading={isLoading}
          pricingData={items}
          country="US"
          isLoggedIn={isLoggedIn}
          setShowSignupForm={setShowSignupForm}
          paymentMethods={paymentMethods}
          openCheckout={openCheckout}
        />

        {hasLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Important Information Section */}
            <div className="max-w-4xl mx-auto px-4 mb-12">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                  Important Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full flex-shrink-0">
                      <span className="text-green-600 dark:text-green-400 text-xl">💳</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        No Automatic Charges
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        Your cards are not charged automatically. All plans are one-time payments with no recurring fees or subscriptions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 text-xl">⚡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Credit System
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        If you run out of credits, you need to top up again. Credits never expire and can be used anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <p className="text-gray-600 mb-4">Supported payment methods:</p>
              <div className="flex flex-wrap justify-center items-center gap-6">
                <FaCcVisa className="h-8 w-auto text-blue-600" />
                <FaCcMastercard className="h-8 w-auto text-orange-500" />
                <FaCcDiscover className="h-8 w-auto text-red-500" />
                <SiAlipay className="h-8 w-auto text-blue-500" />
                <SiApplepay className="h-8 w-auto text-gray-800 dark:text-white" />
                <SiGooglepay className="h-8 w-auto text-blue-500" />
                <FaCcPaypal className="h-8 w-auto text-blue-500" />
              </div>
            </div>
            <PlansAndPriority />
          </motion.div>
        )}

        <ElegantFooter />
        {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}
        <Toaster position="bottom-right" richColors />
      </main>
    </>
  );
}