"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, Menu, Sun, Moon } from "lucide-react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { serverURL } from "@/utils/utils";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";

interface HeaderProps {
  onShowSignupForm?: () => void;
}

interface User {
  name: string;
  email: string;
  credits: number;
  DailyFreeCredits: number;
  referralCode: string;
  planType: string;
}

const Header: React.FC<HeaderProps> = ({ onShowSignupForm }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [rewriteCount, setRewriteCount] = useState<number>(-1);
  const [dailyFreeCredits, setDailyFreeWords] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }
  }, []);

  // Toggle dark/light mode
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.body.classList.toggle("dark", newTheme);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.get(`${serverURL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setIsLoggedIn(true);
      setDailyFreeWords(response.data.user.DailyFreeCredits);
      localStorage.setItem("planType", response.data.user.planType);
    } catch (error) {
      setIsLoggedIn(false);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const toggleDropdown = () => {
    if (isLoggedIn) {
      getUser();
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed left-0 right-0 z-50 bg-white bg-opacity-10 backdrop-blur-lg dark:bg-gray-900 dark:bg-opacity-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/checkturnitin.svg"
                alt="CheckTurnitin Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
                CheckTurnitin
              </h1>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="bg-white bg-opacity-20 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link href="/pricing" className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition duration-150 ease-in-out">
              Pricing
            </Link>
            <Link href="/earn" className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition duration-150 ease-in-out">
              Earn
            </Link>
            <a
              href="https://discord.gg/pHCcvkn7tp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition duration-150 ease-in-out"
            >
              <FaDiscord className="h-5 w-5 inline-block mr-1" />
              Discord
            </a>
            <Link
              href="/telegram"
              className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition duration-150 ease-in-out"
            >
              <FaTelegramPlane className="h-5 w-5 inline-block mr-1" />
              Telegram
            </Link>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {/* Theme toggle button */}
            <Toggle
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150 ease-in-out"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Toggle>
            {!isLoggedIn ? (
              <button
                onClick={onShowSignupForm}
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Try for Free
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  {user?.name || "Dashboard"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 divide-y-2 divide-gray-50 dark:divide-gray-700">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <Image
                    src="/assets/images/checkturnitin.svg"
                    alt="CheckTurnitin Logo"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link href="/pricing" className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
                    Pricing
                  </Link>
                  <Link href="/earn" className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
                    Earn
                  </Link>
                  <a
                    href="https://discord.gg/pHCcvkn7tp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <FaDiscord className="h-5 w-5 inline-block mr-1" />
                    Discord
                  </a>
                  <a
                    href="https://t.me/yourtelegramlink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <FaTelegramPlane className="h-5 w-5 inline-block mr-1" />
                    Telegram
                  </a>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              {/* Theme toggle for mobile */}
              <Toggle
                aria-label="Toggle theme"
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 mr-2" />
                ) : (
                  <Moon className="h-5 w-5 mr-2" />
                )}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Toggle>
              <div>
                {!isLoggedIn ? (
                  <button
                    onClick={onShowSignupForm}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Try for Free
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      toggleDropdown();
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {user?.name || "Dashboard"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;