"use client";

import { useState, useEffect } from "react";
import Header from "./header";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (!storedTheme) {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      setTheme(storedTheme);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Site Under Maintenance - Aiplagreport</title>
        <meta name="description" content="Aiplagreport is currently under maintenance. We'll be back soon with improved services." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <Header />

      <div className="flex flex-col min-h-screen w-full font-sans relative overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        <main className="flex-grow flex items-center justify-center px-4 py-8 mt-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Image
                src="/assets/logos/checkturnitin.svg"
                alt="Aiplagreport Logo"
                width={120}
                height={120}
                className="mx-auto mb-6"
                priority
              />
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
                  <svg 
                    className="w-8 h-8 text-yellow-600 dark:text-yellow-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Site Under Maintenance
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  We're currently performing scheduled maintenance to improve our services.
                </p>
              </div>

              <div className="space-y-4 text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  What's happening?
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>System upgrades and performance improvements</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Enhanced security features</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Better user experience and interface updates</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <svg 
                    className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    We apologize for any inconvenience. Please check back soon!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>For urgent inquiries, please contact our support team.</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
