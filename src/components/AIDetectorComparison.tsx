"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, Shield, Award, Zap, Globe, BookOpen } from "lucide-react"

interface Detector {
  name: string;
  isAuthentic: boolean;
  description: string;
  features?: string[];
  issues?: string[];
}

const AIDetectorComparison: React.FC = () => {
  const detectors: Detector[] = [
    {
      name: "Advanced AI & Plagiarism Detection",
      isAuthentic: true,
      description: "Official and trusted plagiarism detection system used by universities worldwide.",
      features: [
        "Official & Trusted",
        "Used by Universities",
        "Most Accurate Results",
        "Comprehensive Database",
        "Academic Standards"
      ]
    },
    { 
      name: "ZeroGPT", 
      isAuthentic: false,
      description: "Uses unreliable detection methods with high false positive rates. Not recognized by any educational institutions.",
      issues: [
        "High false positive rate",
        "No academic validation",
        "Limited database",
        "Inconsistent results"
      ]
    },
    { 
      name: "GPTZero", 
      isAuthentic: false,
      description: "Lacks academic validation and produces inconsistent results. Not suitable for academic use.",
      issues: [
        "Inconsistent detection",
        "No institutional support",
        "Limited accuracy",
        "Unreliable scoring"
      ]
    },
    { 
      name: "Detect.ai", 
      isAuthentic: false,
      description: "Uses basic pattern matching with no academic validation. Results cannot be trusted for academic purposes.",
      issues: [
        "Basic detection methods",
        "No academic validation",
        "High error rate",
        "Limited capabilities"
      ]
    },
    { 
      name: "Winston AI", 
      isAuthentic: false,
      description: "Claims high accuracy but lacks academic validation and institutional support.",
      issues: [
        "Unverified claims",
        "No academic backing",
        "Limited testing",
        "Questionable accuracy"
      ]
    },
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

  const nonOfficialDetectors = detectors.filter(d => !d.isAuthentic);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % nonOfficialDetectors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="space-y-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full"
          >
            {/* Official Detector */}
            <div className="mb-6 w-full">
              <Card className="border-green-500 w-full hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-white">Advanced Plagiarism Detection</h3>
                    <div className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-800 w-fit shadow-sm">
                      Official & Trusted
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                    {detectors[0].description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {detectors[0].features?.map((feature, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start gap-2 group"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Non-Official Detectors Carousel */}
            <div 
              className="relative overflow-hidden w-full"
              onMouseLeave={handleMouseLeave}
              ref={carouselRef}
            >
              <div className="flex transition-transform duration-500 ease-in-out w-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {nonOfficialDetectors.map((detector, index) => (
                  <motion.div
                    key={detector.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full flex-shrink-0 px-2 sm:px-4"
                  >
                    <Card className="border-red-500 h-full cursor-pointer hover:border-red-600 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                          <h3 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-white">{detector.name}</h3>
                          <div className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-red-100 text-red-800 w-fit shadow-sm">
                            Not Official
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                          {detector.description}
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:gap-3">
                          {detector.issues?.map((issue, idx) => (
                            <motion.div 
                              key={idx} 
                              className="flex items-start gap-2 group"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                              <span className="text-xs sm:text-sm leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{issue}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {nonOfficialDetectors.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleCardClick(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentIndex === index ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="max-w-2xl mx-auto w-full px-2 sm:px-4"
          >
            <Card className="w-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-2xl font-bold text-center text-gray-800 dark:text-white">Why Choose Advanced Plagiarism Detection?</CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Advanced Plagiarism Detection is the only AI detection tool officially recognized and trusted by educational institutions worldwide.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full px-2 sm:px-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="w-full"
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 w-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
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
      </motion.div>
    </div>
  )
}

export default AIDetectorComparison 