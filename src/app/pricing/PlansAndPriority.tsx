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
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
  },
  {
    range: "1,001 - 5,000 words",
    description: "Medium length documents",
    deliveryTime: "2 - 5 minutes",
    priorityLevel: "Fast",
    icon: FaHourglassHalf,
    color: "text-blue-500",
    bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  },
  {
    range: "5,001 - 15,000 words",
    description: "Long papers and theses",
    deliveryTime: "5 - 15 minutes",
    priorityLevel: "Standard",
    icon: FaHourglassHalf,
    color: "text-yellow-500",
    bgColor: "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
  },
  {
    range: "15,001+ words",
    description: "Extended research papers",
    deliveryTime: "15 - 30 minutes",
    priorityLevel: "Extended",
    icon: FaHourglassEnd,
    color: "text-orange-500",
    bgColor: "bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
  },
]

const ProcessingTimes: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
          Processing Time Estimates
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Fast and reliable processing for all document sizes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processingTimes.map((item, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-300 hover:shadow-lg ${item.bgColor} border-0 overflow-hidden`}
          >
            <div className={`h-1 w-full ${item.color.replace('text', 'bg')}`}></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">{item.range}</CardTitle>
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  <item.icon 
                    className={`${item.color} ${item.priorityLevel === "Instant" ? "animate-pulse" : ""}`} 
                    size={20} 
                  />
                </div>
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
                  className="px-3 py-1"
                >
                  {item.priorityLevel}
                </Badge>
                <Badge variant="outline" className="flex items-center px-3 py-1">
                  <FaClock className="mr-1.5" size={12} />
                  {item.deliveryTime}
                </Badge>
              </div>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 rounded-xl text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          Processing times may vary slightly based on server load and document complexity.
          <span className="block mt-2 text-blue-600 dark:text-blue-400 font-medium">
            All reports include both AI analysis and plagiarism detection
          </span>
        </p>
      </div>
    </div>
  )
}

export default ProcessingTimes