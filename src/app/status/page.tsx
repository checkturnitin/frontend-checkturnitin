"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, RefreshCw, Clock, Zap, FileText, ExternalLink } from "lucide-react"
import { serverURL } from "@/utils/utils"

const StatusPage = () => {
  const searchParams = useSearchParams()
  const checkId = searchParams.get("checkId")
  const [checkData, setCheckData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${serverURL}/turnitin/status`, {
        params: { checkId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCheckData(response.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch status")
      setCheckData(null)
    } finally {
      setLoading(false)
    }
  }, [checkId])

  useEffect(() => {
    if (!checkId) return
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [checkId, fetchStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400"
      case "processing":
        return "text-blue-400"
      case "completed":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return (
          <Badge variant="secondary" className="bg-gray-600 text-gray-200">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-600 text-yellow-100">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="secondary" className="bg-red-600 text-red-100">
            High
          </Badge>
        )
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className={`h-6 w-6 sm:h-8 sm:w-8 ${getStatusColor(status)}`} />
      case "processing":
        return <Loader2 className={`h-6 w-6 sm:h-8 sm:w-8 ${getStatusColor(status)} animate-spin`} />
      case "completed":
        return <CheckCircle className={`h-6 w-6 sm:h-8 sm:w-8 ${getStatusColor(status)}`} />
      default:
        return <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
    }
  }

  const renderStatusContent = () => {
    if (!checkData) return null

    const { status, deliveryTime, priority, hoursLeft } = checkData

    const statusPercentage = status === "completed" ? 100 : status === "processing" ? 50 : 25

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {renderStatusIcon(status)}
            <div>
              <p className={`text-base sm:text-lg font-semibold capitalize ${getStatusColor(status)}`}>{status}</p>
              <p className="text-xs sm:text-sm text-gray-400">Expected: {new Date(deliveryTime).toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1">{getPriorityBadge(priority)}</div>
            <p className="text-xs sm:text-sm text-gray-400">{hoursLeft} hours left</p>
          </div>
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-200 bg-purple-800">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-200">{statusPercentage}%</span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-purple-800">
            <div
              style={{ width: `${statusPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-in-out"
            ></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <Card className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 text-center shadow-2xl bg-gray-800 rounded-2xl sm:rounded-3xl border border-purple-500/20">
        <CardContent className="space-y-6 sm:space-y-8">
          <div className="flex justify-center items-center space-x-2">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-300">CheckTurnitin</h2>
          </div>
          {loading && !checkData ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400 animate-spin mb-4" />
              <p className="text-base sm:text-lg text-purple-300">Fetching status...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center">
              <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 mb-4" />
              <p className="text-base sm:text-lg text-red-400">{error}</p>
            </div>
          ) : (
            renderStatusContent()
          )}
          <Button
            onClick={fetchStatus}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-sm sm:text-base"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-500/30 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-purple-200 mb-2 sm:mb-4">Get Your Reports</h3>
            <p className="text-xs sm:text-sm text-purple-300 mb-4 sm:mb-6">
              Comprehensive plagiarism and AI-generated content detection.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-purple-800/50 p-2 sm:p-4 rounded-lg sm:rounded-xl">
                <p className="text-base sm:text-lg font-semibold text-purple-200">Plagiarism</p>
                <p className="text-xs text-purple-400">Detect copied content</p>
              </div>
              <div className="bg-indigo-800/50 p-2 sm:p-4 rounded-lg sm:rounded-xl">
                <p className="text-base sm:text-lg font-semibold text-indigo-200">AI Detection</p>
                <p className="text-xs text-indigo-400">Identify AI-generated text</p>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-700 pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-purple-300 mb-2 sm:mb-4">Want lightning-fast results?</p>
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Upgrade to Pro+
              <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatusPage

