"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import Hero from "./hero"
import ElegantFooter from "./last"
import SignupForm from "./signup/SignupForm"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [utcTime, setUtcTime] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Calculate UTC time for 8pm NPT (NPT is UTC+5:45)
    const getUtcTime = () => {
      const now = new Date()
      
      // Get today's date in NPT timezone
      const nptDateStr = now.toLocaleString("en-CA", { 
        timeZone: "Asia/Kathmandu",
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      
      // Create a date string for 8pm NPT today: YYYY-MM-DDTHH:mm:ss+05:45
      const nptDateTimeStr = `${nptDateStr}T20:00:00+05:45`
      
      // Parse as UTC (JavaScript will automatically convert from +05:45 offset)
      const nptDate = new Date(nptDateTimeStr)
      
      // Get UTC hours and minutes
      // Since NPT is UTC+5:45, 20:00 NPT = 14:15 UTC
      const hours = nptDate.getUTCHours().toString().padStart(2, '0')
      const minutes = nptDate.getUTCMinutes().toString().padStart(2, '0')
      setUtcTime(`${hours}:${minutes} UTC`)
    }

    getUtcTime()
  }, [])

  const handleShowSignupForm = () => {
    setShowSignupForm(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Under Maintenance
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            We'll be live in 5 hours
          </p>
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            {utcTime}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            (8:00 PM NPT)
          </p>
        </div>
      </div>
      <Header onShowSignupForm={handleShowSignupForm} />
      <main className="flex-grow">
        <Hero isLoggedIn={isLoggedIn} />
      </main>
      <ElegantFooter />
      {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}
    </div>
  )
}
