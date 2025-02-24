'use client'

import React, { useState, useEffect } from 'react';
import { Zap, Users, CreditCard, Check, Layout } from 'lucide-react';
import { FeatureItem } from './FeatureItem';

const features = [
  {
    icon: Zap,
    title: "500 Free Credits Daily",
    description: "Fresh credits every day to fuel your creativity",
  },
  {
    icon: Users,
    title: "Refer & Earn +500",
    description: "Share the power of AI and get bonus words",
  },
  {
    icon: CreditCard,
    title: "No Monthly Subscription",
    description: "Just top-up and use, no recurring fees",
  },
  {
    icon: Check,
    title: "Top Sentence Quality",
    description: "Delivering precise and reliable outputs",
  },
  {
    icon: Layout,
    title: "Format Retention",
    description: "Maintains your input structure flawlessly",
  },
];

export function FeatureCarousel() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Automatically cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 5000); // Change feature every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="transition-transform duration-500 ease-in-out flex"
            style={{
              transform: `translateX(-${currentFeatureIndex * 100}%)`,
              width: `${features.length * 100}%`,
            }}
          >
            {features.map((feature, index) => (
              <div key={index} className="w-full flex-shrink-0 px-2">
                <FeatureItem
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}