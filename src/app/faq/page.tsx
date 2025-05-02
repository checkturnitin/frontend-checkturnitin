"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { HelpCircle, Info, FileText, Clock, AlertCircle, Shield, Award, Zap, Globe, BookOpen } from "lucide-react"
import { FiDollarSign } from "react-icons/fi"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SignupForm from "../signup/SignupForm"

const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    icon: <HelpCircle className="w-5 h-5" />,
    questions: [
      {
        question: "What is No Repository Mode?",
        answer: "We're using Turnitin's 'No Repository Mode' for draft submissions. This means your work won't be stored in any database, so it won't impact your final submission later. Perfect for checking your work before final submission!",
      },
    ],
  },
  {
    id: "credits",
    title: "Credits & Purchases",
    icon: <FiDollarSign className="w-5 h-5" />,
    questions: [
      {
        question: "How do credits work?",
        answer: (
          <div className="space-y-4">
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
                <div>
                  <AlertTitle className="text-green-800 dark:text-green-200">Lifetime Credits</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    All purchased credits in Aiplagreport are lifetime credits with no expiry date. We don't charge any monthly or automatic fees.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
                <div>
                  <AlertTitle className="text-green-800 dark:text-green-200">Pay As You Go</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    We operate on a pay-as-you-go model. There are no subscriptions or recurring charges. You only pay for the credits you need.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
                <div>
                  <AlertTitle className="text-green-800 dark:text-green-200">No Hidden Fees</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    We do not charge any subscription fees or automatic monthly charges. Your credits never expire and remain in your account until you use them.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
                <div>
                  <AlertTitle className="text-green-800 dark:text-green-200">Simple Pricing</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Purchase credits once and use them whenever you need. No recurring payments, no automatic deductions, and no monthly fees.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        ),
      },
      {
        question: "How do I purchase credits?",
        answer: (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <ol className="space-y-4">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Visit the Pricing page</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Choose your desired credit package</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Complete the payment process</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Credits are instantly added to your account</span>
                  </li>
                </ol>
                <div className="mt-4">
                  <Link href="/pricing">
                    <Button className="w-full">View Pricing Plans</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
      },
    ],
  },
  {
    id: "reports",
    title: "Report Interpretation",
    icon: <FileText className="w-5 h-5" />,
    questions: [
      {
        question: "How do I interpret the AI Detection Report?",
        answer: (
          <div className="space-y-4">
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
                <div>
                  <AlertTitle className="text-green-800 dark:text-green-200">0% AI Detected</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Your submission is entirely human-written, with no AI-generated content identified.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
                <div>
                  <AlertTitle className="text-green-800 dark:text-green-200">*% AI Detected (1-19%)</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    An asterisk (*) indicates that a small portion of your text may resemble AI-generated content. This is considered within the safe range, and no action is required.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 mt-1" />
                <div>
                  <AlertTitle className="text-red-800 dark:text-red-200">20-100% AI Detected</AlertTitle>
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    A percentage in this range suggests that a significant portion of your submission is likely AI-generated. Your organization may review such cases for potential academic integrity concerns.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        ),
      },
    ],
  },
  {
    id: "submission",
    title: "Submission Guidelines",
    icon: <Info className="w-5 h-5" />,
    questions: [
      {
        question: "What are the submission requirements?",
        answer: (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Minimum Word Count: 300 words in paragraphs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>File Size: Less than 100 MB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Page Count: Maximum 800 pages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Accepted File Types: .pdf and .docx only</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Language: English only</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ),
      },
    ],
  },
  {
    id: "processing",
    title: "Processing & Timing",
    icon: <Clock className="w-5 h-5" />,
    questions: [
      {
        question: "How long does processing take?",
        answer: (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>2000+ words: 0-2 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>3000+ words: 0-10 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-800 dark:text-red-200">Important Note</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                If your file doesn't meet the requirements, it may get stuck during processing. Please raise a ticket in #support-ticket for assistance.
              </AlertDescription>
            </Alert>
          </div>
        ),
      },
    ],
  },
]

const DetectorComparison = () => {
  const detectors = [
    { name: "Turnitin", isAuthentic: true },
    { name: "ZeroGPT", isAuthentic: false },
    { name: "GPTZero", isAuthentic: false },
    { name: "Detect.ai", isAuthentic: false },
    { name: "Winston AI", isAuthentic: false },
  ]

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      title: "Academic Standard",
      description: "The only AI detection tool officially recognized by educational institutions",
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      title: "Highest Accuracy",
      description: "99.9% accuracy rate in detecting AI-generated content",
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: "Fast Results",
      description: "Get detailed reports in under 2 minutes",
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-600" />,
      title: "Global Database",
      description: "Access to the world's largest academic database",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      title: "Detailed Reports",
      description: "Comprehensive similarity and AI detection reports",
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: "Instant Integration",
      description: "Seamless integration with educational platforms",
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {detectors.map((detector, index) => (
          <motion.div
            key={detector.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`h-full ${detector.isAuthentic ? 'border-green-500' : 'border-red-500'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{detector.name}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    detector.isAuthentic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {detector.isAuthentic ? 'Official & Trusted' : 'Not Official'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Why Choose Turnitin?</CardTitle>
            <CardDescription className="text-center">
              Turnitin is the only AI detection tool officially recognized and trusted by educational institutions worldwide.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          >
            <Card className="h-full hover:border-indigo-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section && faqCategories.some(cat => cat.id === section)) {
      setActiveTab(section);
    }

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      window.location.href = '/dashboard';
    } else {
      setShowSignupForm(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">
                Aiplagreport
              </span>
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Find answers to common questions about our AI detection service
            </CardDescription>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGetStarted}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-sm transition-all duration-300"
                >
                  {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-8 py-6 text-lg font-semibold rounded-lg shadow-sm transition-all duration-300"
                  >
                    View Pricing
                  </Button>
                </Link>
              </motion.div>
            </div>
          </CardHeader>
        </Card>

        {/* Mobile Dropdown */}
        <div className="md:hidden mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category">
                {faqCategories.find(cat => cat.id === activeTab)?.title}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {faqCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {faqCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="mt-6">
          {faqCategories.map((category) => (
            <div
              key={category.id}
              className={activeTab === category.id ? "block" : "hidden"}
            >
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>{faq.answer}</CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <DetectorComparison />
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join thousands of users who trust Aiplagreport for accurate AI detection
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-sm transition-all duration-300"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-8 py-6 text-lg font-semibold rounded-lg shadow-sm transition-all duration-300"
                >
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {showSignupForm && (
        <SignupForm onClose={() => setShowSignupForm(false)} />
      )}
    </div>
  );
} 