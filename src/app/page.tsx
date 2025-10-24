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
          <title>AIplagreport - Advanced Plagiarism Detection and AI Report</title>
          <meta name="description" content="Advanced plagiarism detection tool with AI-powered content analysis. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide." />
          <meta name="keywords" content="Plagiarism Detection Tool, Content Analysis, AI Content Detection, Academic Integrity, Plagiarism Checker" />
          <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#000000" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://aiplagreport.com" />
          <meta property="og:title" content="Advanced Plagiarism Detection Tool - AI-Powered Content Analysis | Aiplagreport" />
          <meta property="og:description" content="Advanced plagiarism detection tool with AI-powered content analysis. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide." />
          <meta property="og:image" content="https://aiplagreport.com/assets/images/og-image.png" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://aiplagreport.com" />
          <meta name="twitter:title" content="Advanced Plagiarism Detection Tool - AI-Powered Content Analysis | Aiplagreport" />
          <meta name="twitter:description" content="Advanced plagiarism detection tool with AI-powered content analysis. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide." />
          <meta name="twitter:image" content="https://aiplagreport.com/assets/images/og-image.png" />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
          
          {/* Google AdSense */}
          <script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5495042162016103"
            crossOrigin="anonymous"
          />
        </Head>
        <div className={`flex flex-col items-center justify-center min-h-screen ${theme === "dark" ? "bg-black" : "bg-[#f8f8f8]"}`}>
          <div className="transition-transform transform hover:scale-110 animate-bounce">
            <Image
              src="/assets/logos/checkturnitin.svg"
              alt="Aiplagreport Logo"
              width={100}
              height={100}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
              priority
            />
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

  // Temporary maintenance mode
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="mb-8">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/assets/logos/checkturnitin.svg"
              alt="CheckTurnitin Logo"
              width={120}
              height={120}
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6"
              priority
            />
          </div>
          
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-6"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            Site Under Maintenance
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-6">
            Maintenance is because of Turnitin's own update
          </p>
        </div>
        
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-300">Expected Return</span>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-gray-300 mb-4">
            2 Hours
          </div>
          
          <p className="text-gray-400 mb-6">
            We apologize for any inconvenience. Turnitin is performing essential updates to their system, which affects our service temporarily.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Check back in 2 hours for full service restoration</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>All your data and reports are safe</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Thank you for your patience and continued support!</p>
        </div>
      </div>
    </div>
  );
}
