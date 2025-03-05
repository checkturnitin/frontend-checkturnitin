"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner"; // Import sonner
import { useSpring, animated } from "react-spring";
import Header from "./header";
import Hero from "./hero";
import ElegantFooter from "./last";
import SignupForm from "./signup/SignupForm";
import LoginComponent from "./login/LoginComponent";
import WhyTrustMatters from "./WhyTrustMatters"; // Import the WhyTrustMatters component
import NoRepositoryMode from "./NoRepositoryMode"; // Import the NoRepositoryMode component
import PricingSection from "./PricingSection";
import AccordionDemo from "./FAQ"; // Import FAQ component
// import {WobbleCardDemo} from "./TrustTurnitinSection";
import CheckTurnitinCTA from "./CheckTurnitinCTA";
import Image from "next/image";

interface Message {
  id: number;
  text: string;
  sender: string;
}

interface User {
  name: string;
  email: string;
}

export default function Home() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  const sendMessage = async () => {
    if (text.trim().length < 3 || loading) return;

    setLoading(true);
    setShowLanding(false);
    const userMessage = { id: messages.length + 1, text, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setText("");

    try {
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: messages.length + 2,
            text: "Humanized Text Version",
            sender: "bot",
          },
        ]);
        scrollToBottom();
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!"); // Use sonner's toast
    }
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setText(event.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fadeIn = useSpring({
    opacity: isLoaded ? 1 : 0,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  if (!isLoaded) {
    return (
        <>
        <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CheckTurnitin - Reliable Turnitin Check & Plagiarism Detection</title>
        <meta
          name="description"
          content="Ensure your content is plagiarism-free with CheckTurnitin. Trusted by educators and institutions for accurate Turnitin checks and comprehensive plagiarism detection."
        />
        <link rel="canonical" href="https://checkturnitin.com/" />
  
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://checkturnitin.com/" />
        <meta property="og:site_name" content="CheckTurnitin" />
        <meta property="og:title" content="CheckTurnitin - Reliable Turnitin Check | Trusted by Educators" />
        <meta
          property="og:description"
          content="Ensure your content is plagiarism-free with our reliable Turnitin check platform. Trusted by educators and institutions for accurate plagiarism detection and comprehensive reports."
        />
        <meta property="og:image" content="https://checkturnitin.com/assets/images/og-image.png" />
        <meta property="og:image:secure_url" content="https://checkturnitin.com/assets/images/og-image.png" />
        <meta property="og:image:alt" content="CheckTurnitin - Reliable Turnitin Check Platform" />
        <meta property="og:image" content="https://checkturnitin.com/assets/images/og-square.png" />
        <meta property="og:image:alt" content="CheckTurnitin Logo" />
  
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@checkturnitin" />
        <meta name="twitter:handle" content="@checkturnitin" />
        <meta name="twitter:title" content="CheckTurnitin - Reliable Turnitin Check | Trusted by Educators" />
        <meta
          name="twitter:description"
          content="Ensure your content is plagiarism-free with our reliable Turnitin check platform. Trusted by educators and institutions for accurate plagiarism detection and comprehensive reports."
        />
        <meta name="twitter:image" content="https://checkturnitin.com/assets/images/og-image.png" />
  
        <meta name="apple-mobile-web-app-title" content="CheckTurnitin" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
  
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
  
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://checkturnitin.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Pricing",
                "item": "https://checkturnitin.com/pricing"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Earn",
                "item": "https://checkturnitin.com/earn"
              },
            ]
          })}
        </script>
      </head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F8F8] dark:bg-black">
        {/* CheckTurnitin Logo with Animation */}
        <div className="transition-transform transform hover:scale-110  animate-bounce dark:bg-black">
          <Image
            src="/assets/logos/checkturnitin.svg"
            alt="CheckTurnitin Logo"
            width={100} // Set smaller width
            height={100} // Set smaller height
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" // Smallest possible responsive size
          />
        </div>
      </div>
      </>
    );
  }
  

  return (
    <>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>CheckTurnitin - Reliable Turnitin Check & Plagiarism Detection</title>
      <meta
        name="description"
        content="Ensure your content is plagiarism-free with CheckTurnitin. Trusted by educators and institutions for accurate Turnitin checks and comprehensive plagiarism detection."
      />
      <link rel="canonical" href="https://checkturnitin.com/" />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content="https://checkturnitin.com/" />
      <meta property="og:site_name" content="CheckTurnitin" />
      <meta property="og:title" content="CheckTurnitin - Reliable Turnitin Check | Trusted by Educators" />
      <meta
        property="og:description"
        content="Ensure your content is plagiarism-free with our reliable Turnitin check platform. Trusted by educators and institutions for accurate plagiarism detection and comprehensive reports."
      />
      <meta property="og:image" content="https://checkturnitin.com/assets/images/og-image.png" />
      <meta property="og:image:secure_url" content="https://checkturnitin.com/assets/images/og-image.png" />
      <meta property="og:image:alt" content="CheckTurnitin - Reliable Turnitin Check Platform" />
      <meta property="og:image" content="https://checkturnitin.com/assets/images/og-square.png" />
      <meta property="og:image:alt" content="CheckTurnitin Logo" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@checkturnitin" />
      <meta name="twitter:handle" content="@checkturnitin" />
      <meta name="twitter:title" content="CheckTurnitin - Reliable Turnitin Check | Trusted by Educators" />
      <meta
        name="twitter:description"
        content="Ensure your content is plagiarism-free with our reliable Turnitin check platform. Trusted by educators and institutions for accurate plagiarism detection and comprehensive reports."
      />
      <meta name="twitter:image" content="https://checkturnitin.com/assets/images/og-image.png" />

      <meta name="apple-mobile-web-app-title" content="CheckTurnitin" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#000000" />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://checkturnitin.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Pricing",
              "item": "https://checkturnitin.com/pricing"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Earn",
              "item": "https://checkturnitin.com/earn"
            },
          ]
        })}
      </script>
    </head>


      <Header onShowSignupForm={() => setShowSignupForm(true)} />

      <div className="flex flex-col min-h-screen w-full font-sans relative overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        <main className="flex-grow px-4 overflow-y-auto overflow-x-hidden relative z-30 pb-24 bg-[#F8F8F8]  dark:bg-black dark:text-white">
          <animated.div
            style={fadeIn}
            className="max-w-1xl mx-auto text-[#222222]"
          >
            {showLanding && (
              <div className="flex flex-col min-h-screen w-full font-sans relative overflow-hidden overflow-x-hidden bg-[#F8F8F8] dark:bg-black dark:text-white">
                {showLanding && <Hero isLoggedIn={!!user} />}
                <WhyTrustMatters />
                <NoRepositoryMode />
                <PricingSection />
                <AccordionDemo />
                <CheckTurnitinCTA />
                {/* <WobbleCardDemo /> */}

                <ElegantFooter />
              </div>
            )}
            <div className="flex flex-col items-center space-y-4 max-w-6xl mx-auto">
              {loading && (
                <div className="flex items-center p-4 rounded-lg bg-[#EDEDED] max-w-[50%]">
                  <p className="ml-4 text-[#443f3f] text-lg">Processing...</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </animated.div>
        </main>

        {showSignupForm && (
          <SignupForm onClose={() => setShowSignupForm(false)} />
        )}
        {showLoginForm && (
          <LoginComponent onClose={() => setShowLoginForm(false)} />
        )}
        {/* Remove ToastContainer from react-toastify */}
      </div>
    </>
  );
}
