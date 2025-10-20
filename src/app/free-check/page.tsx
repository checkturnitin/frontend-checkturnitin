"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSpring, animated } from "react-spring";
import Header from "../header";
import ElegantFooter from "../last";
import SignupForm from "../signup/SignupForm";
import LoginComponent from "../login/LoginComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Gift, 
  Users, 
  MessageCircle, 
  CreditCard,
  Info,
  Shield,
  Clock,
  Award,
  HelpCircle,
  Zap
} from "lucide-react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

interface User {
  name: string;
  email: string;
  credits: number;
}

export default function FreeCheckPage() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState("dark");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    const userData = localStorage.getItem("user");
    
    setIsLoggedIn(!!token);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or DOCX file only");
        return;
      }
      
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (!isLoggedIn) {
      setShowSignupForm(true);
      return;
    }

    if (!user || user.credits <= 0) {
      toast.error("You don't have enough credits. Get more credits below!");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast.success("File uploaded successfully! Processing your report...");
      // Redirect to dashboard or show results
      window.location.href = "/dashboard";
    }, 2000);
  };

  const fadeIn = useSpring({
    opacity: isLoaded ? 1 : 0,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free AI & Plagiarism Check - Aiplagreport",
    "url": "https://aiplagreport.com/free-check",
    "description": "Get free AI and plagiarism detection reports. 2 free credits on signup, 1 credit per referral, 1 credit for joining Discord. Advanced plagiarism detection trusted by universities worldwide.",
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
          <title>Free AI & Plagiarism Check - Aiplagreport</title>
          <meta name="description" content="Get free AI and plagiarism detection reports. 2 free credits on signup, 1 credit per referral, 1 credit for joining Discord." />
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

  return (
    <>
      <Head>
        <title>Free AI & Plagiarism Check - Aiplagreport</title>
        <meta name="description" content="Get free AI and plagiarism detection reports. 2 free credits on signup, 1 credit per referral, 1 credit for joining Discord. Advanced plagiarism detection trusted by universities worldwide." />
        <meta name="keywords" content="Free Plagiarism Check, Free AI Detection, Plagiarism Detection Tool, Content Analysis, Academic Integrity" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiplagreport.com/free-check" />
        <meta property="og:title" content="Free AI & Plagiarism Check - Aiplagreport" />
        <meta property="og:description" content="Get free AI and plagiarism detection reports. 2 free credits on signup, 1 credit per referral, 1 credit for joining Discord." />
        <meta property="og:image" content="https://aiplagreport.com/assets/images/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://aiplagreport.com/free-check" />
        <meta name="twitter:title" content="Free AI & Plagiarism Check - Aiplagreport" />
        <meta name="twitter:description" content="Get free AI and plagiarism detection reports. 2 free credits on signup, 1 credit per referral, 1 credit for joining Discord." />
        <meta name="twitter:image" content="https://aiplagreport.com/assets/images/og-image.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <Header onShowSignupForm={() => setShowSignupForm(true)} />

      <div className="flex flex-col min-h-screen w-full font-sans relative overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        <main className="flex-grow px-4 overflow-y-auto overflow-x-hidden relative z-30 bg-[#F8F8F8] dark:bg-black dark:text-white">
          <animated.div
            style={fadeIn}
            className="max-w-6xl mx-auto py-8"
          >
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-b from-gray-700 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-200">
                Free AI & Plagiarism Check
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Get instant, accurate AI and plagiarism detection reports with our free credits. 
                Trusted by universities worldwide.
              </p>
              
              {/* Credit Display */}
              {isLoggedIn && user && (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-8">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
                    {user.credits} Free Credits Available
                  </span>
                </div>
              )}
            </div>

            {/* File Upload Section */}
            <Card className="mb-12 border-2 border-indigo-500/20 bg-white/90 dark:bg-black/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                  <Upload className="w-6 h-6 text-indigo-600" />
                  Upload Your Document
                </CardTitle>
                <CardDescription className="text-center text-lg">
                  Upload a PDF or DOCX file to get your free AI and plagiarism report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                      <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        PDF or DOCX files only (Max 100MB)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Upload Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
                  >
                    {isUploading ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        Get Free Report
                      </>
                    )}
                  </Button>
                </div>

                {/* Requirements Alert */}
                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-800 dark:text-blue-200">File Requirements</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Minimum 300 words in paragraphs</li>
                      <li>Maximum 100MB file size</li>
                      <li>Maximum 800 pages</li>
                      <li>Supported formats: PDF and DOCX only</li>
                      <li>Languages: English, Spanish, and Japanese</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Free Credits Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/10 border-green-200 dark:border-green-500/20">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
                    <Gift className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                    2 Free Credits
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Get 2 free credits when you sign up for a new account
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/10 border-blue-200 dark:border-blue-500/20">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                    1 Credit Per Referral
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Earn 1 free credit for each friend you refer who signs up
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-600/10 border-purple-200 dark:border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                    1 Credit for Discord
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300">
                    Join our Discord community and get 1 free credit
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border-indigo-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold">Secure & Private</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your documents are processed securely and never stored in our database. We use industry-standard encryption.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border-indigo-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold">Fast Results</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get your AI and plagiarism report within minutes. No waiting in queues or delayed results.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border-indigo-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold">University Trusted</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our reports are accepted by universities worldwide. Get the same quality as official plagiarism detection reports.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Sign up now to get your free credits and start checking your documents
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isLoggedIn ? (
                  <>
                    <Button
                      onClick={() => setShowSignupForm(true)}
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Sign Up for Free Credits
                    </Button>
                    <Button
                      onClick={() => setShowLoginForm(true)}
                      size="lg"
                      variant="outline"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-white dark:text-white dark:hover:bg-gray-800 px-8 py-3"
                    >
                      Login to Your Account
                    </Button>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Discord CTA */}
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <MessageCircle className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Join Our Discord Community</h3>
                </div>
                <p className="text-lg mb-6 opacity-90">
                  Get 1 free credit for joining our Discord server and connect with other users
                </p>
                <a
                  href="https://discord.gg/R2zK3A5ftj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join Discord Now
                </a>
              </CardContent>
            </Card>
          </animated.div>
        </main>

        {showSignupForm && (
          <SignupForm onClose={() => setShowSignupForm(false)} />
        )}
        {showLoginForm && (
          <LoginComponent onClose={() => setShowLoginForm(false)} />
        )}
      </div>

      <ElegantFooter />
    </>
  );
}
