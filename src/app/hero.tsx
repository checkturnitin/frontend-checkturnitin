"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronRight, Users, FileText, Check, X, Shield, Award, Clock, Zap, BookOpen, Globe, Info, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import PDFViewer from "./PDFViewer"
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import AnimatedGradientText from "@/components/ui/animated-gradient-text"
import FakeDetector from "./FakeDetector"
import SignupForm from "../app/signup/SignupForm"
import DiscordPromo from "./DiscordPromo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import Image from "next/image"
import { Cover } from "@/components/ui/cover"
import { TextAnimate } from "@/components/magicui/text-animate"
import HeroVideoDialog from "@/components/ui/hero-video-dialog"

interface HeroProps {
  isLoggedIn: boolean
}

interface Detector {
  name: string;
  isAuthentic: boolean;
  description: string;
  features?: string[];
  issues?: string[];
}

const AnimatedGradientTextDemo: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div
      className="z-10 flex items-center justify-center rounded-2xl p-2 hover:border-indigo-800 transition-colors duration-300 cursor-pointer"
      onClick={onClick}
    >
      <AnimatedGradientText>
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Get a free AI and plagiarism check with aiplagreport today!
        </span>
        <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedGradientText>
    </div>
  )
}

const Slogan: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <TextAnimate
        className="text-sm md:text-lg lg:text-xl mb-8 flex items-center justify-center text-gray-700 dark:text-gray-300 line-clamp-2 md:line-clamp-none"
        by="word"
        animation="fadeIn"
        delay={0.7}
      >
        One stop solution for all your AI and plagiarism detection needs.
      </TextAnimate>
    </div>
  )
}

const ReportCarousel: React.FC<{ onReportClick: (index: number) => void }> = ({ onReportClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const reports = ["/assets/images/report1.png", "/assets/images/report2.png"]

  const startAutoScroll = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reports.length)
    }, 3000)
  }, [reports])

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    stopAutoScroll()
  }

  const handleMouseLeave = () => {
    startAutoScroll()
  }

  useEffect(() => {
    startAutoScroll()
    return () => stopAutoScroll()
  }, [startAutoScroll, stopAutoScroll])

  return (
    <div
      className="relative w-full max-w-3xl mx-auto mt-8 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {reports.map((report, index) => (
          <motion.div
            key={index}
            className="w-full flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={report}
              alt={`Report ${index + 1}`}
              className="rounded-lg cursor-pointer w-full h-auto object-cover"
              style={{ transformOrigin: "top left" }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 },
              }}
              onClick={() => {
                stopAutoScroll()
                onReportClick(index)
              }}
            />
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {reports.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex ? "bg-indigo-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

const AnimatedCounter: React.FC<{
  value: number
  label: string
  icon: React.ReactNode
}> = ({ value, label, icon }) => {
  const count = useMotionValue(900000)
  const rounded = useTransform(count, (latest) => {
    const number = Math.round(latest)
    return number >= 1000000
      ? `${(number / 1000000).toFixed(0)}M+`
      : number >= 1000
        ? `${(number / 1000).toFixed(0)}k`
        : number.toString()
  })

  useEffect(() => {
    const animation = animate(count, value, { duration: 2 })
    return animation.stop
  }, [count, value])

  return (
    <div className="flex items-center space-x-2">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <motion.span className="text-2xl font-bold text-gray-800 dark:text-white">{rounded}</motion.span>
        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    </div>
  )
}

const DraftCheckInfo: React.FC = () => (
  <div className="w-full max-w-4xl mx-auto mt-8">
    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-200">Draft Check Mode</AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-300">
        We use advanced plagiarism detection in draft check mode, which means your documents are not stored in any database. This is perfect for checking your work before final submission.
      </AlertDescription>
    </Alert>
    <div className="mt-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <video
          src="/assets/Aiplaglanding.webm"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.8)' }}
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.8;
          }}
        />
      </div>
    </div>
  </div>
)

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <Card className="hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

const DetectorBubble: React.FC<{ name: string; isAuthentic: boolean; delay: number }> = ({
  name,
  isAuthentic,
  delay,
}) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    className={`relative group cursor-pointer ${
      isAuthentic ? "hover:scale-105" : "hover:scale-95"
    } transition-transform duration-300`}
  >
    <div
      className={`p-4 rounded-full ${
        isAuthentic
          ? "bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/20"
          : "bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/20"
      }`}
    >
      <div className="flex items-center justify-center">
        <span className="text-white font-semibold">{name}</span>
        {isAuthentic ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="ml-2"
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="ml-2"
          >
            <X className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>
    </div>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.5 }}
      className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm ${
        isAuthentic ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
      }`}
    >
      {isAuthentic ? "Official & Trusted" : "Not Official"}
    </motion.div>
  </motion.div>
)

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "What is No Repository Mode?",
      answer: "We're using a 'No Repository Mode' for draft submissions. This means your work won't be stored in any database, so it won't impact your final submission later. Perfect for checking your work before final submission!",
    },
    {
      question: "How do I interpret the AI Detection Report?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
            <div>
              <p className="font-semibold">0% AI Detected</p>
              <p>Your submission is entirely human-written, with no AI-generated content identified.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
            <div>
              <p className="font-semibold">*% AI Detected (1-19%)</p>
              <p>An asterisk (*) indicates that a small portion of your text may resemble AI-generated content. This is considered within the safe range, and no action is required.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 mt-1" />
            <div>
              <p className="font-semibold">20-100% AI Detected</p>
              <p>A percentage in this range suggests that a significant portion of your submission is likely AI-generated. Your organization may review such cases for potential academic integrity concerns.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      question: "How can I get free plagiarism checks?",
      answer: "We're offering 5 free plagiarism checks to users who join our Discord! To claim yours, simply open a ticket in #support-ticket, send us your email, and DM us for your free credits. It's that easy—join now and start checking!",
    },
    {
      question: "What are the submission requirements?",
      answer: (
        <ul className="space-y-2">
          <li>• Minimum Word Count: 300 words in paragraphs</li>
          <li>• File Size: Less than 100 MB</li>
          <li>• Page Count: Maximum 800 pages</li>
          <li>• Accepted File Types: .pdf and .docx only</li>
          <li>• Language: English, Spanish, and Japanese are supported</li>
        </ul>
      ),
    },
    {
      question: "How long does processing take?",
      answer: (
        <div className="space-y-2">
          <p>• 2000+ words: 0-2 minutes</p>
          <p>• 3000+ words: 0-10 minutes</p>
          <p className="text-sm text-red-500 mt-2">⚠️ If your file doesn't meet the requirements, it may get stuck during processing. Please raise a ticket in #support-ticket for assistance.</p>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

const AIDetectorComparison: React.FC = () => {
  const logos = [
    { src: "/assets/logos/Writer.webp", alt: "Writer Logo" },
    { src: "/assets/logos/zerogpt.webp", alt: "ZeroGPT Logo" },
    { src: "/assets/logos/winston-ai-logo.svg", alt: "winston-ai" },
    { src: "/assets/logos/Justdone.png", alt: "justdone" },
    { src: "/assets/logos/Gptzero.webp", alt: "GPTZero Logo" },
    { src: "/assets/logos/Crossplag.webp", alt: "Crossplag Logo" },
    { src: "/assets/logos/scribbr.svg", alt: "Scam Logo" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          You don't need fake detectors <br /> you only need <Cover>Advanced Plagiarism Detection</Cover>
        </h1>
      </div>
      <Card className="border-2 border-indigo-500/20 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-violet-500 dark:from-amber-400 dark:via-rose-500 dark:to-violet-500 bg-clip-text text-transparent font-extrabold tracking-tight hover:scale-105 transition-transform duration-300 ease-in-out">
              Advanced Plagiarism Detection vs All Other Detectors
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/10 border border-green-200 dark:border-green-500/20">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Plagiarism Detection</h3>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-900 dark:text-white/90">Official & Trusted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-900 dark:text-white/90">Used by Universities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-900 dark:text-white/90">Most Accurate Results</span>
                </div>
              </div>
              <div className="relative h-32 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4">
                <div className="relative">
                  <Image
                    src="/assets/logos/Turnitin_logo.svg"
                    alt="Advanced Plagiarism Detection Logo"
                    width={200}
                    height={50}
                    className="object-contain dark:filter dark:brightness-0 dark:invert"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-500/10 dark:to-red-600/10 border border-red-200 dark:border-red-500/20">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Other Detectors</h3>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-gray-900 dark:text-white/90">Not Official</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-gray-900 dark:text-white/90">Inaccurate Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-gray-900 dark:text-white/90 text-xs sm:text-sm md:text-base">Not Trusted by Universities</span>
                </div>
              </div>
              <div className="relative h-32 rounded-lg overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <div className="absolute inset-0 flex items-center">
                  <motion.div
                    className="flex space-x-8"
                    animate={{
                      x: [0, -800],
                    }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                      },
                    }}
                  >
                    {logos.map((logo, index) => (
                      <div
                        key={index}
                        className="relative h-24 w-32 flex-shrink-0 flex items-center justify-center"
                      >
                        <div className="relative w-24 h-12">
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            fill
                            style={{ objectFit: "contain" }}
                            className="dark:filter dark:brightness-0 dark:invert opacity-70 hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    ))}
                    {/* Duplicate logos for seamless infinite scroll */}
                    {logos.map((logo, index) => (
                      <div
                        key={`duplicate-${index}`}
                        className="relative h-24 w-32 flex-shrink-0 flex items-center justify-center"
                      >
                        <div className="relative w-24 h-12">
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            fill
                            style={{ objectFit: "contain" }}
                            className="dark:filter dark:brightness-0 dark:invert opacity-70 hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const Hero: React.FC<HeroProps> = ({ isLoggedIn }) => {
  const [selectedReport, setSelectedReport] = useState<number | null>(null)
  const [showSignupForm, setShowSignupForm] = useState(false)

  const handleButtonClick = () => {
    const token = localStorage.getItem("token")
    if (token) {
      window.location.href = "/dashboard"
    } else {
      setShowSignupForm(true)
    }
  }

  return (
    <section className="text-center pb-8 px-2 sm:px-4 lg:px-8 min-h-[120vh] flex flex-col items-center justify-center">
      {isLoggedIn ? (
        <a href="/dashboard" className="mt-32">
          <AnimatedGradientTextDemo onClick={() => (window.location.href = "/dashboard")} />
        </a>
      ) : (
        <div className="mt-32">
          <AnimatedGradientTextDemo onClick={() => setShowSignupForm(true)} />
        </div>
      )}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold pb-3 mb-4 mt-6 bg-gradient-to-b from-gray-700 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-200 px-2 sm:px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Get Authentic AI & Plagiarism Reports
      </motion.h1>
      <motion.div
        className="mb-8 px-2 sm:px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Slogan />
      </motion.div>
      <motion.div
        className="flex flex-col sm:flex-row gap-8 justify-center mb-12 px-2 sm:px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <AnimatedCounter value={100000} label="Users" icon={<Users size={24} />} />
        <AnimatedCounter value={1000000} label="Files Processed" icon={<FileText size={24} />} />
      </motion.div>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-2 sm:px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleButtonClick}>
          Get Your Report Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-white dark:text-white dark:hover:bg-gray-800"
          onClick={handleButtonClick}
        >
          Upload Your File for Instant Results
        </Button>
      </motion.div>
      <motion.div
        className="mb-12 w-full max-w-3xl mx-auto px-2 sm:px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {/* <DiscordPromo /> */}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="px-2 sm:px-4"
      >
        <DraftCheckInfo />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="w-full px-2 sm:px-4"
      >
        <AIDetectorComparison />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
        className="mt-8 px-2 sm:px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          
          <div className="text-center mb-8 pt-12">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Check out our comprehensive FAQ section for answers to common questions about our service.
            </p>
            <Link href="/faq">
              <Button variant="outline" className="flex items-center gap-2 mx-auto">
                <HelpCircle className="w-4 h-4" />
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
      {selectedReport !== null && (
        <PDFViewer pdfUrl={`/assets/reports/report${selectedReport + 1}.pdf`} onClose={() => setSelectedReport(null)} />
      )}
      {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}
    </section>
  )
}

export default Hero

