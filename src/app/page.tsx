"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import Hero from "./hero"
import ElegantFooter from "./last"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleShowSignupForm = () => {
    // This can be used to show a signup modal
    console.log("Show signup form")
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Header onShowSignupForm={handleShowSignupForm} />
      <main className="flex-grow">
        <Hero isLoggedIn={isLoggedIn} />
      </main>
      <ElegantFooter />
    </div>
  )
}

