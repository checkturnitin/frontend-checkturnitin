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
    <footer className="bg-gradient-to-b from-background to-muted py-12 w-full font-sans border-t rounded-t-3xl">
      <motion.div
        className="container mx-auto px-4 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <img src="/assets/images/checkturnitin.svg" alt="aiplagreport Logo" className="mx-auto mb-4 h-12" />
          <h2 className="text-2xl font-bold text-primary">Check For Plagiarism and AI</h2>
        </motion.div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-4 text-center">Supported Payments</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {paymentIcons.map((icon, idx) => (
                  <FontAwesomeIcon
                    key={idx}
                    icon={icon.icon as IconDefinition}
                    className="text-3xl transition-all duration-300 hover:scale-110 hover:drop-shadow-md"
                    style={{
                      color: `var(--icon-color-${icon.name.toLowerCase().replace(/\s+/g, "-")})`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div variants={itemVariants} className="text-center mb-8">
          <a
            href="mailto:contact@aiplagreport.com"
            className="text-primary hover:text-primary/80 transition-colors duration-300"
          >
            contact@aiplagreport.com
          </a>
        </motion.div>

        <Separator className="mb-8" />

        <motion.div variants={itemVariants} className="text-center">
          <div className="text-sm text-muted-foreground">
            <a href="/assets/terms-condition.txt" className="mr-4 hover:text-primary">
              Terms & Conditions
            </a>
            <a href="/assets/privacypolicy.txt" className="mr-4 hover:text-primary">
              Privacy Policy
            </a>
            <a href="/assets/refundpolicy.txt" className="hover:text-primary">
              Refund Policy
            </a>
          </div>
          <p className="mt-4">
            © aiplagreport {new Date().getFullYear()}. Designed with ❤️ by aiplagreport Team. Based in Kathmandu, Nepal.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default CenteredFooter