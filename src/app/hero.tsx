"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import PDFViewer from "./PDFViewer";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import Image from "next/image";
import FakeDetector from "./FakeDetector";

interface HeroProps {
  isLoggedIn: boolean;
}

const AnimatedGradientTextDemo: React.FC = () => {
  return (
    <div className="z-10 flex items-center justify-center rounded-2xl p-2 hover:border-indigo-800 transition-colors duration-300">
      <AnimatedGradientText>
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Introducing CheckTurnitin
        </span>
        <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedGradientText>
    </div>
  )
}

const Slogan: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.p
        className="text-lg sm:text-xl mb-8 flex items-center justify-center text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="font-semibold">
          "Authenticity is our priority. We deliver genuine results, not fabricated detections."
        </span>
      </motion.p>
    </div>
  );
};

const ReportCarousel: React.FC<{ onReportClick: (index: number) => void }> = ({ onReportClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reports = ["/assets/images/report1.png", "/assets/images/report2.png"];

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reports.length);
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseEnter = () => {
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    startAutoScroll();
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

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
                stopAutoScroll();
                onReportClick(index);
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
  );
};

const AnimatedCounter: React.FC<{ value: number; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => {
  const count = useMotionValue(900000);
  const rounded = useTransform(count, (latest) => {
    const number = Math.round(latest);
    return number >= 1000000 ? `${(number / 1000000).toFixed(0)}M+` : number >= 1000 ? `${(number / 1000).toFixed(0)}k` : number.toString();
  });

  useEffect(() => {
    const animation = animate(count, value, { duration: 2 });
    return animation.stop;
  }, [count, value]);

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

const Hero: React.FC<HeroProps> = ({ isLoggedIn }) => {
  const [selectedReport, setSelectedReport] = useState<number | null>(null);

  return (
    <section className="text-center pb-8 px-4 sm:px-6 lg:px-8 min-h-[120vh] flex flex-col items-center justify-center mt-20">
      {isLoggedIn ? (
        <a href="/dashboard">
          <AnimatedGradientTextDemo />
        </a>
      ) : (
        <AnimatedGradientTextDemo />
      )}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold pb-3 mb-4 mt-6 bg-gradient-to-b from-gray-700 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Accurate AI & Plagiarism Reports with Turnitin
      </motion.h1>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Slogan />
      </motion.div>
      <motion.div
        className="flex flex-col sm:flex-row gap-8 justify-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <AnimatedCounter value={100000} label="Users" icon={<Users size={24} />} />
        <AnimatedCounter value={1000000} label="Files Processed" icon={<FileText size={24} />} />
      </motion.div>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Get Your Report Now
        </Button>
        <Button size="lg" variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-white dark:text-white dark:hover:bg-gray-800">
          Upload Your File for Instant Results
        </Button>
      </motion.div>
      <motion.div
        className="mb-12 w-full max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <ReportCarousel onReportClick={setSelectedReport} />
      </motion.div>
      <FakeDetector />
      {selectedReport !== null && (
        <PDFViewer pdfUrl={`/assets/reports/report${selectedReport + 1}.pdf`} onClose={() => setSelectedReport(null)} />
      )}
    </section>
  );
};

export default Hero;