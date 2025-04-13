"use client"

import axios from "axios"
import { useEffect, useState, useCallback } from "react"
import { ToastContainer, toast } from "react-toastify"
import { serverURL } from "@/utils/utils"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"

interface Check {
  _id: string
  checkId: string
  status: string
  deliveryTime: string
  fileId: {
    _id: string
    originalFileName: string
    storedFileName: string
  }
  reportId?: {
    _id: string
    reports?: {
      ai?: { metadata: { score: string } }
      plagiarism?: { metadata: { score: string } }
    }
  }
}

export default function DeleteCheckPage() {
  const [checks, setChecks] = useState<{
    pending: Check[]
    completed: Check[]
  }>({ pending: [], completed: [] })
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string>("light")
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(15) // seconds
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Get theme from localStorage and set up listener
  useEffect(() => {
    // Function to get current theme from localStorage
    const getThemeFromStorage = () => {
      const theme = localStorage.getItem("theme")
      console.log("Current theme from localStorage:", theme)
      return theme === "dark" ? "dark" : "light"
    }

    // Set initial theme
    setCurrentTheme(getThemeFromStorage())

    // Apply theme class to document
    const applyTheme = (theme: string) => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    // Apply initial theme
    applyTheme(getThemeFromStorage())

    // Set up storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue === "dark" ? "dark" : "light"
        setCurrentTheme(newTheme)
        applyTheme(newTheme)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Check for theme changes every second (for changes within the same window)
    const intervalId = setInterval(() => {
      const storedTheme = getThemeFromStorage()
      if (storedTheme !== currentTheme) {
        setCurrentTheme(storedTheme)
        applyTheme(storedTheme)
      }
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(intervalId)
    }
  }, [currentTheme])

  useEffect(() => {
    // Force dark mode on the entire document
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.body.style.backgroundColor = "#111827" // dark gray-900
    } else {
      document.documentElement.classList.remove("dark")
      document.body.style.backgroundColor = ""
    }
  }, [currentTheme])

  // Fetch data function
  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true)
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No token found in localStorage")
        setLoading(false)
        setIsRefreshing(false)
        setApiError(true)
        return
      }

      console.log("Fetching checks data...")
      const response = await axios.get(`${serverURL}/turnitin/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      })

      console.log("Fetched reports:", response.data)
      const fetchedReports = response.data || []

      const pending = fetchedReports.filter((report: any) => report.status === "pending")
      const completed = fetchedReports.filter((report: any) => report.status === "completed")

      setChecks({ pending, completed })
      setLoading(false)
      setIsRefreshing(false)
      setApiError(false)
      setLastRefreshed(new Date())
    } catch (error) {
      console.error("Error fetching checks:", error)
      setLoading(false)
      setIsRefreshing(false)
      setApiError(true)

      // Set empty data on error
      setChecks({ pending: [], completed: [] })
    }
  }, [])

  // Initial data fetch and auto-refresh setup
  useEffect(() => {
    fetchData()

    // Auto-refresh setup
    const refreshInterval = setInterval(() => {
      console.log(`Auto-refreshing data every ${autoRefreshInterval} seconds`)
      fetchData()
    }, autoRefreshInterval * 1000)

    return () => clearInterval(refreshInterval)
  }, [fetchData, autoRefreshInterval])

  const handleManualRefresh = () => {
    fetchData(true)
  }

  const deleteAllChecks = async () => {
    setIsDeleting(true)
    try {
      const response = await axios.post(
        `${serverURL}/turnitin/deleteAll`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )

      if (response.status === 200) {
        toast.success("All checks and associated files deleted successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            backgroundColor: currentTheme === "dark" ? "#1e1e1e" : "#f8f9fa",
            color: currentTheme === "dark" ? "#fff" : "#333",
            borderRadius: "8px",
            border: "1px solid #8b5cf6",
          },
        })

        // Refresh the checks after successful deletion
        await fetchData(true)
      }
    } catch (error) {
      console.error("Error deleting checks:", error)
      toast.error("Failed to delete checks", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: currentTheme === "dark" ? "#1e1e1e" : "#f8f9fa",
          color: currentTheme === "dark" ? "#fff" : "#333",
          borderRadius: "8px",
          border: "1px solid #8b5cf6",
        },
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  const totalChecks = checks.pending.length + checks.completed.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 fixed inset-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-lg">Loading checks...</p>
        </div>
      </div>
    )
  }

  if (apiError) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                onClick={() => (window.location.href = "/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Delete Checks
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={handleManualRefresh}
              className="w-full sm:w-auto"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <Card className="border-purple-200 dark:border-purple-900 shadow-md overflow-hidden mb-8">
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
              <CardTitle className="text-red-500">Connection Error</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Unable to connect to the server. This could be due to:
              </p>
              <ul className="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300">
                <li>Server is currently down or unreachable</li>
                <li>Your internet connection is unstable</li>
                <li>Your authentication token has expired</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleManualRefresh} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Format the last refreshed time
  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-black text-gray-boa dark:text-gray-100">
      <div className="container mx-auto py-4 px-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20"
              onClick={() => (window.location.href = "/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Delete Checks
            </h1>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={totalChecks === 0}
              className="ml-2"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete All
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="text-xs text-gray-500 dark:text-gray-400 mr-2 hidden sm:block">
              Auto-refreshing every {autoRefreshInterval}s
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing" : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Last refreshed indicator */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center">
          <span className="mr-1">Last updated:</span>
          <span className="font-medium">{formatLastRefreshed()}</span>
          <div className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Checks */}
          <Card className="border-purple-200 dark:border-purple-900 shadow-md overflow-hidden h-full">
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20 py-3">
              <CardTitle className="flex justify-between items-center text-base">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  Pending
                </span>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100"
                >
                  {checks.pending.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 px-3 sm:px-4">
              <ChecksTable checks={checks.pending} status="pending" />
            </CardContent>
          </Card>

          {/* Completed Checks */}
          <Card className="border-purple-200 dark:border-purple-900 shadow-md overflow-hidden h-full">
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20 py-3">
              <CardTitle className="flex justify-between items-center text-base">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  Completed
                </span>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100"
                >
                  {checks.completed.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 px-3 sm:px-4">
              <ChecksTable checks={checks.completed} status="completed" />
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full border-2 border-purple-500 animate-in fade-in zoom-in duration-300">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
                </div>

                <p className="mb-4 text-gray-700 dark:text-gray-300 text-sm">
                  This will permanently delete all <span className="font-semibold">{totalChecks}</span> checks and
                  associated files.
                  <span className="font-bold text-red-500 block mt-2"> This action cannot be undone.</span>
                </p>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteAllChecks}
                    disabled={isDeleting}
                    className={`${isDeleting ? "opacity-80" : ""}`}
                  >
                    {isDeleting ? (
                      <>
                        <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete All
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={currentTheme === "dark" ? "dark" : "light"}
          toastClassName="border border-purple-500"
        />
      </div>
    </div>
  )
}

function ChecksTable({ checks, status }: { checks: Check[]; status: string }) {
  if (checks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mb-2">
          <Trash2 className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No {status} checks found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead className="font-medium text-xs">File Name</TableHead>
            <TableHead className="font-medium text-xs">Check ID</TableHead>
            <TableHead className="font-medium text-xs">Status</TableHead>
            <TableHead className="font-medium text-xs">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checks.map((check) => (
            <TableRow key={check._id} className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
              <TableCell className="font-medium truncate max-w-[100px] text-xs py-2">
                {check.fileId.originalFileName}
              </TableCell>
              <TableCell className="font-mono text-xs py-2">{check.checkId.slice(0, 6)}...</TableCell>
              <TableCell className="py-2">
                <Badge
                  variant={status === "completed" ? "default" : "outline"}
                  className={`text-xs ${
                    status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  }`}
                >
                  {status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-gray-600 dark:text-gray-400 py-2">
                {new Date(check.deliveryTime).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
