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
import Head from "next/head";

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
  const [theme, setTheme] = useState("dark");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (!storedTheme) {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      setTheme(storedTheme);
    }
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  useEffect(() => {
    // Detect country using a free geolocation API
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code === 'PK') {
          setIsBlocked(true);
        }
      })
      .catch(() => {});
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aiplagreport - Advanced Plagiarism Detection Tool",
    "url": "https://aiplagreport.com",
    "description": "Advanced plagiarism detection tool with AI-powered content analysis. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide.",
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
  };

  if (!isLoaded) {
    return (
      <>
        <Head>
          <title>AIplagreport - Server Maintenance</title>
          <meta name="description" content="Server is currently under maintenance. We'll be back soon!" />
          <meta name="robots" content="noindex, nofollow" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#000000" />
        </Head>
        <div className={`flex flex-col items-center justify-center min-h-screen ${theme === "dark" ? "bg-black" : "bg-[#f8f8f8]"}`}>
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="transition-transform transform hover:scale-110 animate-bounce">
              <Image
                src="/assets/logos/checkturnitin.svg"
                alt="Aiplagreport Logo"
                width={100}
                height={100}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto"
                priority
              />
            </div>
            <div className="space-y-4">
              <h1 className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
                Server Maintenance
              </h1>
              <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                We're currently performing maintenance on our servers.
              </p>
              <p className={`text-base ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Expected downtime: ~2 hours
              </p>
              <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                Thank you for your patience. We'll be back soon!
              </p>
            </div>
            <div className="animate-pulse">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Site is Down</h1>
        <p className="text-lg">Blocked by turnitin</p>
      </div>
    );
  }

  return (
    <>
    <Head>
      <title>AIplagreport - Server Maintenance</title>
      <meta name="description" content="Server is currently under maintenance. We'll be back soon!" />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
    </Head>

      <div className="flex flex-col min-h-screen w-full font-sans relative overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        <main className="flex-grow flex items-center justify-center px-4 overflow-y-auto overflow-x-hidden relative z-30 bg-[#F8F8F8] dark:bg-black dark:text-white">
          <animated.div
            style={fadeIn}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="text-center space-y-8 max-w-lg mx-auto px-4">
              <div className="transition-transform transform hover:scale-110 animate-bounce">
                <Image
                  src="/assets/logos/checkturnitin.svg"
                  alt="Aiplagreport Logo"
                  width={120}
                  height={120}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto"
                  priority
                />
              </div>
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
                  Server Maintenance
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300">
                  We're currently performing maintenance on our servers.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Expected downtime: ~2 hours
                </p>
                <p className="text-base text-gray-500 dark:text-gray-500">
                  Thank you for your patience. We'll be back soon!
                </p>
              </div>
              <div className="animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          </animated.div>
        </main>
      </div>
    </>
  );
}
