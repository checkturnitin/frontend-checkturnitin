"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import Hero from "./hero"
import ElegantFooter from "./last"
import SignupForm from "./signup/SignupForm"
import { X, AlertTriangle } from "lucide-react"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [showIncidentPopup, setShowIncidentPopup] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    if (showIncidentPopup) {
      const timer = setTimeout(() => {
        setShowIncidentPopup(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showIncidentPopup])

  const handleShowSignupForm = () => {
    setShowSignupForm(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Header onShowSignupForm={handleShowSignupForm} />
      <main className="flex-grow">
        <Hero isLoggedIn={isLoggedIn} />
      </main>
      <ElegantFooter />
      {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}
      
      {/* Turnitin Service Incident Popup */}
      {showIncidentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-800 max-w-lg w-full mx-4 transform transition-all duration-300 ease-out">
            {/* Close button */}
            <button
              onClick={() => setShowIncidentPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header with icon */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Turnitin Service Incident
              </h3>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
                13th November 2025
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-4 border border-orange-200 dark:border-orange-800">
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">
                  Investigating - We've run into some issues.
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  iThenticate V2, Crossref Similarity Check, Similarity, SimCheck, Originality are currently experiencing an unexpected service incident.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  During this time, you may find that uploads are slow and reports are stuck processing, integration users may also be affected.
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
                We invite you to track the progress of this incident while we work to bring the service back to optimum health.
              </p>
            </div>

            {/* Footer with link */}
            <div className="px-6 pb-6">
              <a
                href="https://turnitin.statuspage.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Track Status Updates
              </a>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                Auto-closing in 5 seconds...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
