"use client"

import type React from "react"
import { FaStar, FaClock, FaCheckCircle } from "react-icons/fa"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Pro+",
    description: "High priority with exclusive support",
    deliveryTime: "0 - 30 minutes",
    priorityLevel: "High",
    icon: FaStar,
    color: "text-yellow-500",
  },
  {
    name: "Pro",
    description: "High priority",
    deliveryTime: "0 - 60 minutes",
    priorityLevel: "Medium",
    icon: FaCheckCircle,
    color: "text-green-500",
  },
  {
    name: "Starter",
    description: "Medium priority",
    deliveryTime: "4 hours",
    priorityLevel: "Low",
    icon: FaClock,
    color: "text-blue-500",
  },
  {
    name: "Free",
    description: "Basic analysis",
    deliveryTime: "24 hour report delivery",
    priorityLevel: "Low",
    icon: FaClock,
    color: "text-gray-500",
  },
]

const PlansAndPriority: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold text-center mb-4">Priority & Delivery Times</h2>
      <p className="text-center text-muted-foreground mb-8">
        Expected processing times for Turnitin AI and plagiarism report detection
      </p>
      <div className="space-y-6">
        {plans.map((plan, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                <plan.icon className={`${plan.color} ${plan.name === "Pro+" ? "animate-bounce" : ""}`} size={28} />
              </div>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  plan.priorityLevel === "High" ? "default" : plan.priorityLevel === "Medium" ? "secondary" : "outline"
                }
                className="mb-4"
              >
                {plan.priorityLevel} Priority
              </Badge>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-center text-sm font-medium">
                <FaClock className="mr-2 text-muted-foreground" />
                <span>Delivery Time: {plan.deliveryTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PlansAndPriority

