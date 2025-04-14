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
      <title>Pricing Plans - Aiplagreport</title>
      <meta
        name="description"
        content="Explore Aiplagreport's flexible pricing plans designed to meet the needs of students and professionals. From the Basic plan to the Premium plan, our plagiarism detection technology guarantees high-quality, authentic content. Choose the plan that suits your needs and ensure your content is original and undetectable."
      />
      <meta property="og:url" content="https://Aiplagreport.com/pricing" />
      <meta property="og:title" content="Pricing Plans - Aiplagreport" />
      <meta
        property="og:description"
        content="Explore Aiplagreport's flexible pricing plans, offering high-quality plagiarism detection that guarantees authentic content. Perfect for students and professionals."
      />
      <meta
        property="og:image"
        content="https://Aiplagreport.com/assets/images/pricing.png"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Aiplagreport" />
      <meta name="twitter:handle" content="@Aiplagreport" />
      <meta name="twitter:title" content="Pricing Plans - Aiplagreport" />
      <meta
        name="twitter:description"
        content="Choose from CheckTurnitin's flexible pricing plans to access powerful plagiarism detection technology. Ensure high-quality, authentic content with advanced algorithms across all plans."
      />
      <meta name="twitter:image" content="https://Aiplagreport.com/assets/images/pricing.png" />
      <script type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://Aiplagreport.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Pricing",
          "item": "https://Aiplagreport.com/pricing"
        },
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Aiplagreport",
            "image": "https://Aiplagreport.com/assets/images/pricing.png",
            "description": "Choose the perfect plan that fits your needs.",
            "sku": "Aiplagreport-plan",
            "offers": {
        "@type": "Offer",
        "url": "https://Aiplagreport.com/pricing",
        "priceCurrency": "USD",
        "price": "10.00"
            }
          }
        ])}
      </script>
      </head>

        <main className="relative flex flex-col w-full min-h-screen bg-white text-gray-900 overflow-hidden dark:bg-black dark:text-white">
          <Header onShowSignupForm={() => setShowSignupForm(true)} />

          <div className="flex flex-col items-center mt-24  px-4 dark:bg-black dark:text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-gray-900 p-4 dark:bg-black dark:text-white">
              Get Authentic{" "}
              <img src="/assets/logos/Turnitin_logo.svg" alt="Turnitin Logo" className="inline-block w-40 h-12" /> Checks in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Minutes⚡</span>
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-xl dark:bg-black  dark:text-white"> 
              Ensure your content is{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                unique, undetectable
              </span>
              , and ready to ace any academic or professional challenge.
            </p>
            <p className="text-lg text-blue-600 font-semibold text-center mt-4">
              No monthly cost,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">pay what you use!</span>
            </p>
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

          <p className="text-center mb-10 text-gray-600">
            Supported payment methods:
            <span className="text-blue-600 flex items-center justify-center mt-6">
              <img src="/assets/logos/internationalpayment.png" alt="International Pay" className="w-90 h-20 mr-2" />
            </span>
          </p>
          <PlansAndPriority />

          <ElegantFooter />
          {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}
          <Toaster position="bottom-right" richColors />
        </main>
      </>
    );
  }