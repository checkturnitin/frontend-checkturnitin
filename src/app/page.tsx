"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import Hero from "./hero"
import ElegantFooter from "./last"
import SignupForm from "./signup/SignupForm"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignupForm, setShowSignupForm] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

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
    </div>
  )
}
