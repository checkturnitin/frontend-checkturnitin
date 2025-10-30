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
  const [isMaintenance, setIsMaintenance] = useState<boolean>(true);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

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

  // Maintenance countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      // Target: 11:30 AM NPT = 5:45 AM UTC (NPT is UTC+5:45)
      const target = new Date();
      target.setUTCHours(5, 45, 0, 0);
      
      if (now >= target) {
        target.setUTCDate(target.getUTCDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsMaintenance(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
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

  if (isMaintenance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="text-center p-8 max-w-2xl">
          <div className="mb-8 animate-pulse">
            <Image
              src="/assets/logos/checkturnitin.svg"
              alt="Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <h1 className="text-5xl font-bold mb-4">Under Maintenance</h1>
          <p className="text-2xl mb-8 text-gray-200">
            We'll be back soon!
          </p>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <p className="text-lg mb-6 text-gray-200">
              Estimated time remaining:
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-white/20 rounded-xl p-6 min-w-[100px]">
                <div className="text-4xl font-bold">{String(timeRemaining.hours).padStart(2, '0')}</div>
                <div className="text-sm text-gray-300 mt-2">Hours</div>
              </div>
              <div className="bg-white/20 rounded-xl p-6 min-w-[100px]">
                <div className="text-4xl font-bold">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                <div className="text-sm text-gray-300 mt-2">Minutes</div>
              </div>
              <div className="bg-white/20 rounded-xl p-6 min-w-[100px]">
                <div className="text-4xl font-bold">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                <div className="text-sm text-gray-300 mt-2">Seconds</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 space-y-2">
              <p>Target time: <span className="font-semibold">11:30 AM NPT</span></p>
              <p>UTC time: <span className="font-semibold">5:45 AM UTC</span></p>
            </div>
          </div>
          <p className="mt-8 text-gray-300">
            We're improving our services for you. Thank you for your patience!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Head>
      <title>AIplagreport - Advanced Plagiarism Detection and AI Report</title>
      <meta name="description" content="Aiplagreport is the leading plagiarism detection tool offering 99.9% accurate content analysis. Trusted by 10,000+ educators and institutions worldwide. Get instant plagiarism reports, AI content detection, and comprehensive similarity analysis." />
      <meta name="keywords" content="Aiplagreport, Plagiarism Detection Tool, Content Analysis, AI Content Detection, Academic Integrity" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://aiplagreport.com/" />
      <meta property="og:title" content="Aiplagreport - #1 Advanced Plagiarism Detection Tool | AI-Powered Content Analysis" />
      <meta property="og:description" content="The most accurate plagiarism detection tool for content analysis. Used by 10,000+ educators worldwide. Get instant plagiarism reports, AI content detection, and comprehensive similarity analysis." />
      <meta property="og:image" content="https://aiplagreport.com/assets/images/og-image.png" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://aiplagreport.com/" />
      <meta name="twitter:title" content="Aiplagreport - #1 Advanced Plagiarism Detection Tool | AI-Powered Content Analysis" />
      <meta name="twitter:description" content="The most accurate plagiarism detection tool for content analysis. Used by 10,000+ educators worldwide. Get instant plagiarism reports, AI content detection, and comprehensive similarity analysis." />
      <meta name="twitter:image" content="https://aiplagreport.com/assets/images/og-image.png" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Aiplagreport" />
      <meta name="application-name" content="Aiplagreport" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="Aiplagreport" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
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


      <Header onShowSignupForm={() => setShowSignupForm(true)} />

      <div className="flex flex-col min-h-screen w-full font-sans relative overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        <main className="flex-grow px-4 overflow-y-auto overflow-x-hidden relative z-30 bg-[#F8F8F8]  dark:bg-black dark:text-white">
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
