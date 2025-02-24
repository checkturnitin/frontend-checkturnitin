"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Database, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NoRepositoryMode: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Turnitin Logo */}
          <div className="mb-12">
            <Image
              src="/assets/logos/turnitin_logo.svg"
              alt="Turnitin Logo"
              width={200}
              height={50}
              className="w-48 sm:w-56 filter dark:invert" // Use dark:invert to only apply the filter in dark mode
            />
          </div>

          {/* No Repository Mode Section */}
          <Card className="w-full bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
            <CardHeader className="text-center p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-indigo-100 dark:bg-indigo-700 rounded-full">
                  <Database size={40} className="text-indigo-600 dark:text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                No Repository Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Your data and reports are not stored in Turnitin. We operate in{" "}
                <Badge variant="secondary" className="font-semibold text-indigo-700 dark:text-indigo-200">
                  No Repository Mode
                </Badge>
                , ensuring your work remains private and secure.
              </p>
              <div className="flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-300">
                <Lock size={20} className="text-gray-900 dark:text-white" />
                <span>Your privacy is our priority.</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default NoRepositoryMode;