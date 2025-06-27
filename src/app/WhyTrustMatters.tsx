"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, BarChart2, Heart, Database, CheckCircle, EyeOff, CloudOff } from "lucide-react";

const WhyTrustMatters: React.FC = () => {
  const items = [
    {
      icon: <Shield size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Security",
      description: "Your data is encrypted and protected with the highest security standards, ensuring it remains safe from unauthorized access.",
    },
    {
      icon: <Lock size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Privacy",
      description: "We respect your privacy and ensure that your information is never shared or stored without your consent.",
    },
    {
      icon: <BarChart2 size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Accuracy",
      description: "Our advanced algorithms deliver precise and reliable results every time, backed by rigorous testing and validation.",
    },
    {
      icon: <Heart size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Integrity",
      description: "We are committed to ethical practices and transparency in all our operations, ensuring you can trust us completely.",
    },
    {
      icon: <Database size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: "No Repository Mode",
      description: "Your data and reports are not stored in any plagiarism detection system, as it operates in no repository mode, ensuring your work remains private.",
    },
    {
      icon: <CheckCircle size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Compliance",
      description: "We adhere to global data protection regulations, ensuring your data is handled in compliance with the highest standards.",
    },
    {
      icon: <EyeOff size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Confidentiality",
      description: "Your work is treated with the utmost confidentiality, and access is restricted to authorized personnel only.",
    },
    {
      icon: <CloudOff size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: "No Cloud Storage",
      description: "We do not store your data on external cloud servers, ensuring it remains secure and within your control.",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-b from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why Trust Matters
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Trust is the foundation of everything we do. We are committed to providing accurate, reliable, and transparent results to ensure your peace of mind. Your data and reports are not stored in any plagiarism detection system as it operates in no repository mode, ensuring complete privacy and security.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTrustMatters;