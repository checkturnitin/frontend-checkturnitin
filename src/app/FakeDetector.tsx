"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X } from "lucide-react";
import { AnimatedList } from "@/components/ui/animated-list";
import Image from "next/image";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface DetectorNotification {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  isTrusted: boolean;
}

const detectorNotifications: DetectorNotification[] = [
  {
    name: "Crossplag",
    description: "Detected AI content",
    time: "15m ago",
    icon: "/assets/logos/crossplag.webp",
    color: "#FFFFFF",
    isTrusted: false,
  },
  {
    name: "Turnitin",
    description: "Accurate AI detection",
    time: "Just now",
    icon: "/assets/logos/turnitin.webp",
    color: "#FFFFFF",
    isTrusted: true,
  },
  {
    name: "GPTZero",
    description: "Flagged as potential AI",
    time: "10m ago",
    icon: "/assets/logos/gptzero.webp",
    color: "#FFFFFF",
    isTrusted: false,
  },
  {
    name: "Turnitin",
    description: "Accurate AI detection",
    time: "Just now",
    icon: "/assets/logos/turnitin.webp",
    color: "#FFFFFF",
    isTrusted: true,
  },
  {
    name: "Writer",
    description: "Inconclusive result",
    time: "5m ago",
    icon: "/assets/logos/writer.webp",
    color: "#FFFFFF",
    isTrusted: false,
  },
  {
    name: "Turnitin",
    description: "Accurate AI detection",
    time: "Just now",
    icon: "/assets/logos/turnitin.webp",
    color: "#FFFFFF",
    isTrusted: true,
  },
  {
    name: "ZeroGPT",
    description: "False positive detected",
    time: "2m ago",
    icon: "/assets/logos/zerogpt.webp",
    color: "#FFFFFF",
    isTrusted: false,
  },
  {
    name: "Turnitin",
    description: "Accurate AI detection",
    time: "Just now",
    icon: "/assets/logos/turnitin.webp",
    color: "#FFFFFF",
    isTrusted: true,
  },
  {
    name: "Undetectable",
    description: "Unable to determine",
    time: "1m ago",
    icon: "/assets/logos/undetectable.webp",
    color: "#FFFFFF",
    isTrusted: false,
  },
  {
    name: "Turnitin",
    description: "Accurate AI detection",
    time: "Just now",
    icon: "/assets/logos/turnitin.webp",
    color: "#FFFFFF",
    isTrusted: true,
  },
  {
    name: "Copyleaks",
    description: "Possible AI match found",
    time: "30s ago",
    icon: "/assets/logos/copyleaks.webp",
    color: "#FFFFFF",
    isTrusted: false,
  },
  {
    name: "Turnitin",
    description: "Accurate AI detection",
    time: "Just now",
    icon: "/assets/logos/turnitin.webp",
    color: "#FFFFFF",
    isTrusted: true,
  },
];

const notifications = Array.from({ length: 5 }, () => detectorNotifications).flat();

const DetectorCard: React.FC<DetectorNotification> = ({
  name,
  description,
  icon,
  color,
  time,
  isTrusted,
}) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-transform duration-200 ease-out transform hover:scale-[105%]",
        "bg-white text-black shadow-lg",
        "dark:bg-gray-800 dark:text-white dark:shadow-none"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: color,
          }}
        >
          <Image src={icon} alt={name} width={24} height={24} className="rounded-full" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-semibold dark:text-white">
            {name}
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-gray-700 dark:text-white/70">{description}</p>
        </div>
        <div className={`ml-auto ${isTrusted ? "text-green-600" : "text-red-500"}`}>
          {isTrusted ? <Check size={20} /> : <X size={20} />}
        </div>
      </div>
    </figure>
  );
};

const FakeDetector: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto mb-16 px-4">
      <div className="space-y-12">
        <div className="fade-in text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-600 to-blue-600">
            Beware of Unreliable AI Detectors
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Many AI detectors are inaccurate and unreliable. Choose wisely to ensure academic integrity.
          </p>
        </div>

        <div className="fade-in flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">Unreliable AI Detection in Action</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Watch how unreliable AI detectors produce inconsistent and potentially false results in real-time. Notice
              the frequent false positives and inconclusive outcomes.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <X className="w-6 h-6 mr-2 text-red-500" />
                Frequent false positives
              </li>
              <li className="flex items-center">
                <X className="w-6 h-6 mr-2 text-red-500" />
                Inconsistent results
              </li>
              <li className="flex items-center">
                <X className="w-6 h-6 mr-2 text-red-500" />
                Lack of context consideration
              </li>
            </ul>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative flex h-[500px] w-full flex-col overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 p-6 shadow-md">
              <AnimatedList>
                {notifications.map((item, idx) => (
                  <DetectorCard {...item} key={idx} />
                ))}
              </AnimatedList>
            </div>
          </div>
        </div>

        <div className="fade-in text-center space-y-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-cyan-600">
            Trust the Industry Standard
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Turnitin is the most trusted AI detection tool, used by institutions globally to maintain academic
            integrity. With unparalleled accuracy and reliability, Turnitin ensures that your work is evaluated fairly
            and transparently.
          </p>
          <div className="flex flex-col items-center gap-8">
            <div className="w-48 h-48 relative">
              <Image
                src="/assets/logos/turnitin.webp"
                alt="Turnitin Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="max-w-2xl mx-auto">
              <DetectorCard
                name="Turnitin"
                description="Accurate and reliable AI content detection"
                icon="/assets/logos/turnitin.webp"
                color="#FFFFFF"
                time="Always"
                isTrusted={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeDetector;