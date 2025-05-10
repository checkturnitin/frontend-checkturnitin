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
        setIsLoading(false);
            }  };

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
        <title>Turnitin Alternative - AI-Powered Plagiarism Checker | Aiplagreport</title>
        <meta
          name="description"
          content="Advanced Turnitin alternative with AI-powered plagiarism detection. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiplagreport.com" />
        <meta property="og:title" content="Turnitin Alternative - AI-Powered Plagiarism Checker | Aiplagreport" />
        <meta
          property="og:description"
          content="Advanced Turnitin alternative with AI-powered plagiarism detection. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide."
        />
        <meta
          property="og:image"
          content="https://aiplagreport.com/assets/images/pricing.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@aiplagreport" />
        <meta name="twitter:title" content="Turnitin Alternative - AI-Powered Plagiarism Checker | Aiplagreport" />
        <meta
          name="twitter:description"
          content="Advanced Turnitin alternative with AI-powered plagiarism detection. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide."
        />
        <meta name="twitter:image" content="https://aiplagreport.com/assets/images/pricing.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Aiplagreport - Turnitin Alternative",
            "url": "https://aiplagreport.com",
            "description": "Advanced Turnitin alternative with AI-powered plagiarism detection. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://aiplagreport.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Aiplagreport",
              "url": "https://aiplagreport.com"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Aiplagreport Plagiarism Checker",
            "description": "Advanced Turnitin alternative with AI-powered plagiarism detection. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide.",
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
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1000",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>
      </head>

        <main className="relative flex flex-col w-full min-h-screen bg-white text-gray-900 overflow-hidden dark:bg-black dark:text-white">
          <Header onShowSignupForm={() => setShowSignupForm(true)} />

          <div className="flex flex-col items-center mt-24 px-4 dark:bg-black dark:text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-gray-900 p-4 dark:bg-black dark:text-white">
              Authentic AI and{" "}
              <img src="/assets/logos/Turnitin_logo.svg" alt="Turnitin Logo" className="inline-block w-40 h-12" /> Plagiarism Reports
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-xl dark:bg-black dark:text-white">
              Get instant AI analysis and detailed plagiarism reports for your content
            </p>
            <div className="flex flex-col items-center mt-6 space-y-2">
              <p className="text-lg text-blue-600 font-semibold text-center">
                Pay-as-you-go model • No monthly fees • Credits never expire
              </p>
              <p className="text-sm text-gray-500 text-center">
                Top up your account anytime and use credits whenever you need them
              </p>
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

          <ElegantFooter />
          {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}
          <Toaster position="bottom-right" richColors />
        </main>
      </>
    );
  }