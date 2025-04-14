"use client"
import React, { useState } from "react"
import { FiCheckCircle, FiX } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { frontendURL } from "@/utils/utils"

interface PricingItem {
  _id: string
  title: string
  currency: string
  price: number
  creditLimit: number
  features: string[]
  country: string
  enable: boolean
  paddleProductId: string | null
}

interface PricingCardsProps {
  pricingData: PricingItem[]
  country: string
  isLoggedIn: boolean
  setShowSignupForm: (show: boolean) => void
  paymentMethods: any
  openCheckout: (priceId: string) => Promise<void>
  isLoading: boolean
}

interface PaymentMethodPopupProps {
  onClose: () => void
  paymentMethods: any
  onSelectMethod: (method: string) => void
}

const PaymentMethodPopup: React.FC<PaymentMethodPopupProps> = ({
  onClose,
  paymentMethods,
  onSelectMethod,
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative border border-gray-300 dark:border-gray-700"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Close payment method selection"
        >
          <FiX size={24} />
        </button>

        <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">
          Select Payment Method
        </h3>

        <div className="space-y-4">
          {paymentMethods?.fonepay?.enabled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMethod("fonepay")}
              className="w-full px-6 py-4 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center space-x-4 shadow-md hover:shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 group"
            >
              <div className="bg-white dark:bg-gray-800 p-2 rounded flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/logos/fonepay-dark.png"
                  alt="Fonepay"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-white font-semibold text-lg">
                Pay with Fonepay
              </span>
            </motion.button>
          )}

          {paymentMethods?.imepay?.enabled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMethod("imepay")}
              className="w-full px-6 py-4 bg-teal-600 dark:bg-teal-500 rounded-lg flex items-center justify-center space-x-4 shadow-md hover:shadow-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-all duration-300 group"
            >
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-teal-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/logos/imepay.png"
                  alt="IME Pay"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>
              <span className="text-white font-semibold text-lg">
                Pay with IME Pay
              </span>
            </motion.button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred payment method to continue
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
)

const PricingCard: React.FC<{
  item: PricingItem
  onSelect: (item: PricingItem) => void
  isLoggedIn: boolean
}> = ({ item, onSelect, isLoggedIn }) => {
  const isPopular = item.title === "Pro"

  return (
    <Card className="relative w-full max-w-xs flex flex-col m-3 overflow-hidden transition-all duration-300 border-0 hover:shadow-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold py-1 px-4 rounded-bl-lg shadow-md">
            Most Popular
          </div>
        </div>
      )}

      <CardHeader className="text-center pb-0 pt-6">
        <CardTitle className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
          {item.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          {item.creditLimit.toLocaleString()} credits
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center pt-6 flex-grow">
        <div className="flex flex-col items-center mb-6">
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
            {item.currency} {item.price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            One-time payment
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-900 dark:text-white font-semibold text-md">What's included:</p>
          <ul className="space-y-3">
            {item.features.map((feature, index) => (
              <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                <FiCheckCircle
                  className="mr-2 text-green-500 flex-shrink-0 mt-1"
                  size={18}
                />
                <span className="text-left text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="mt-auto pt-6 pb-6">
        <Button
          onClick={() => onSelect(item)}
          disabled={!item.enable}
          className={`w-full text-md font-semibold py-3 rounded-lg transition-all duration-300 ${
            item.enable
              ? isPopular 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoggedIn
            ? item.enable
              ? isPopular ? "Get Started" : "Choose Plan"
              : "Currently Unavailable"
            : "Sign Up to Continue"}
        </Button>
      </CardFooter>
    </Card>
  )
}

const PricingCards: React.FC<PricingCardsProps> = ({
  pricingData,
  country,
  isLoggedIn,
  setShowSignupForm,
  paymentMethods,
  openCheckout,
  isLoading,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<PricingItem | null>(null)

  const handleSelectPlan = (item: PricingItem) => {
    setSelectedItem(item)
    if (isLoggedIn) {
      if (
        country === "NP" &&
        (paymentMethods?.fonepay?.enabled || paymentMethods?.imepay?.enabled)
      ) {
        setSelectedPaymentMethod("popup")
      } else if (item.paddleProductId) {
        openCheckout(item.paddleProductId).catch((error) => {
          console.error("Paddle checkout error:", error)
          alert(
            "Something went wrong. Please try again later. If the issue persists, you can contact our support team."
          )
        })
      } else {
        alert("No payment method available")
      }
    } else {
      setShowSignupForm(true)
    }
  }

  const handlePaymentMethodSelection = (method: string) => {
    if (isLoggedIn && selectedItem) {
      window.location.href = `${frontendURL}/shop/payment?item=${selectedItem._id}&method=${method}`
    }
    setSelectedPaymentMethod(null)
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-6 dark:bg-black dark:text-white">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="w-full max-w-xs h-80" />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 dark:bg-black dark:text-white">
      <div className="flex flex-wrap items-stretch justify-center gap-8">
        {pricingData.map((item) => (
          <PricingCard
            key={item._id}
            item={item}
            onSelect={handleSelectPlan}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>

      {selectedPaymentMethod === "popup" && (
        <PaymentMethodPopup
          onClose={() => setSelectedPaymentMethod(null)}
          paymentMethods={paymentMethods}
          onSelectMethod={handlePaymentMethodSelection}
        />
      )}
    </div>
  )
}

export default PricingCards