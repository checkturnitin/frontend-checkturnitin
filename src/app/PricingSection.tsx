"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Check, Zap, Rocket, DollarSign } from "lucide-react";
import TestimonialsSection from "./TestimonialsSection"; 

const PricingSection: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* Pricing Section */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent dark:text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Affordable and Transparent Pricing
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Get reports for just{" "}
          <span className="font-bold bg-gradient-to-r from-indigo-700 to-purple-800 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent dark:text-transparent">
            $1, quick!
          </span>{" "}
          No subscriptions, no hidden fees.
        </motion.p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <DollarSign size={48} className="text-indigo-700 dark:text-indigo-400" />,
              title: "Starting at Just $1",
              description: "Get your first report for free and enjoy affordable pricing starting at just $1.",
            },
            {
              icon: <Check size={48} className="text-indigo-700 dark:text-indigo-400" />,
              title: "No Subscriptions",
              description: "Pay only for what you use. No recurring fees or hidden charges.",
            },
            {
              icon: <Zap size={48} className="text-indigo-700 dark:text-indigo-400" />,
              title: "Fast Reports",
              description: "Receive your plagiarism detection reports quickly, without any delays.",
            },
            {
              icon: <Rocket size={48} className="text-indigo-700 dark:text-indigo-400" />,
              title: "Easy to Use",
              description: "Simple and straightforward process to get your reports in minutes.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-800 dark:text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action Button */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={() => {
              // Navigate to the pricing page
              window.location.href = "/pricing";
            }}
          >
            See Pricing
          </Button>
        </motion.div>

        {/* Testimonials Section */}
        <TestimonialsSection />
      </div>
    </section>
  );
};

export default PricingSection;