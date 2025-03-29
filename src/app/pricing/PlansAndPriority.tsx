"use client"

import type React from "react"
import { FaClock, FaBolt, FaHourglassHalf, FaHourglassEnd } from "react-icons/fa"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const processingTimes = [
  {
    range: "0 - 1,000 words",
    description: "Short reports and essays",
    deliveryTime: "1 - 2 minutes",
    priorityLevel: "Instant",
    icon: FaBolt,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    range: "1,001 - 5,000 words",
    description: "Medium length documents",
    deliveryTime: "2 - 5 minutes",
    priorityLevel: "Fast",
    icon: FaHourglassHalf,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    range: "5,001 - 15,000 words",
    description: "Long papers and theses",
    deliveryTime: "5 - 15 minutes",
    priorityLevel: "Standard",
    icon: FaHourglassHalf,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    range: "15,001+ words",
    description: "Extended research papers",
    deliveryTime: "15 - 30 minutes",
    priorityLevel: "Extended",
    icon: FaHourglassEnd,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
]

const ProcessingTimes: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
          Processing Time Estimates
        </h2>
        <p className="text-muted-foreground">
          Based on document word count for Turnitin AI and plagiarism detection
        </p>
      </div>
      
      <div className="space-y-4">
        {processingTimes.map((item, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-300 hover:shadow-md ${item.bgColor} border-0`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">{item.range}</CardTitle>
                <item.icon 
                  className={`${item.color} ${item.priorityLevel === "Instant" ? "animate-pulse" : ""}`} 
                  size={24} 
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge
                  variant={
                    item.priorityLevel === "Instant" 
                      ? "default" 
                      : item.priorityLevel === "Fast" 
                        ? "secondary" 
                        : "outline"
                  }
                >
                  {item.priorityLevel} Processing
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <FaClock className="mr-1.5" size={12} />
                  {item.deliveryTime}
                </Badge>
              </div>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Times may vary slightly based on server load and document complexity.
        </p>
      </div>
    </div>
  )
}

export default ProcessingTimes