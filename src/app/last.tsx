"use client"

import type React from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCcVisa,
  faCcMastercard,
  faCcDiscover,
  faCcAmex,
  faCcApplePay,
  faGooglePay,
  faPaypal,
} from "@fortawesome/free-brands-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"

const paymentIcons = [
  { icon: faCcVisa, name: "Visa", lightColor: "#1a1f71", darkColor: "#ffffff" },
  { icon: faCcMastercard, name: "Mastercard", lightColor: "#eb001b", darkColor: "#ff5f00" },
  { icon: faCcDiscover, name: "Discover", lightColor: "#ff6000", darkColor: "#ff6000" },
  { icon: faCcAmex, name: "American Express", lightColor: "#002663", darkColor: "#00adef" },
  { icon: faCcApplePay, name: "Apple Pay", lightColor: "#000000", darkColor: "#ffffff" },
  { icon: faGooglePay, name: "Google Pay", lightColor: "#4285f4", darkColor: "#4285f4" },
  { icon: faPaypal, name: "PayPal", lightColor: "#003087", darkColor: "#00457c" },
]

const CenteredFooter: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <footer className="bg-gradient-to-b from-background to-muted py-16 w-full font-sans border-t rounded-t-3xl">
      <motion.div
        className="container mx-auto px-4 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <img src="/assets/images/checkturnitin.svg" alt="aiplagreport Logo" className="mx-auto mb-6 h-16" />

        </motion.div>

        <Card className="mb-12 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
          <CardContent className="p-8">
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl font-semibold mb-6 text-center">Supported Payments</h3>
              <div className="flex flex-wrap justify-center gap-8">
                {paymentIcons.map((icon, idx) => (
                  <FontAwesomeIcon
                    key={idx}
                    icon={icon.icon as IconDefinition}
                    className="text-5xl transition-all duration-300 hover:scale-110 hover:drop-shadow-lg"
                    style={{
                      color: `var(--icon-color-${icon.name.toLowerCase().replace(/\s+/g, "-")})`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div variants={itemVariants} className="text-center mb-12">
          <a
            href="mailto:contact@aiplagreport.com"
            className="text-3xl text-primary hover:text-primary/80 transition-colors duration-300"
          >
            contact@aiplagreport.com
          </a>
          <div className="text-sm text-muted-foreground space-x-4 mt-2">
            <a href="/assets/terms-condition.txt" className="hover:text-primary transition-colors duration-300">
              Terms & Conditions
            </a>
            <a href="/assets/privacypolicy.txt" className="hover:text-primary transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="/assets/refundpolicy.txt" className="hover:text-primary transition-colors duration-300">
              Refund Policy
            </a>
          </div>
        </motion.div>

        <Separator className="mb-12" />

        <motion.div variants={itemVariants} className="text-center">
          <p className="text-2xl mb-4">
            © aiplagreport {new Date().getFullYear()}. Designed with ❤️ by aiplagreport Team. 
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Made in Estonia
          </p>
        </motion.div>
        <div className="h-32 sm:h-40 md:h-48 lg:h-56 mb-0sm:mb-6">
            <TextHoverEffect text="Aiplagreport.com" />
        </div>
      </motion.div>
    </footer>
  )
}

export default CenteredFooter