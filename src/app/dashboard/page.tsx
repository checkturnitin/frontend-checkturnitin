"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "@/utils/utils"; // Replace with your server URL
import Header from "../header";
import { FileUpload } from "@/components/ui/file-upload";
import { toast, Toaster } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, Eye, Search, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { ReportItem } from "./report-item";
import { CustomModal } from "./custom-modal";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FiTrash2 } from "react-icons/fi";
import Stepper, { Step } from '@/components/Stepper/Stepper';
import { CheckCircle2, Globe, HelpCircle } from "lucide-react";

const PDFViewer = dynamic(
  () => import("./pdf-viewer").then((mod) => mod.default),
  { ssr: false }
);

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [wordCountLoading, setWordCountLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [planType, setPlanType] = useState<string>("basic");
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [showStepper, setShowStepper] = useState(false);
  const [isEnglish, setIsEnglish] = useState<boolean | null>(null);
  const [englishPercentage, setEnglishPercentage] = useState<number | null>(null);

  interface Report {
    checkId: string;
    deliveryTime: string;
    status: string;
    priority: string;
    fileId: {
      _id: string;
      originalFileName: string;
      storedFileName: string;
    };
    reportId?: {
      _id: string;
      reports?: {
        ai?: { metadata: { score: string } };
        plagiarism?: { metadata: { score: string } };
      };
    };
  }

  const [reports, setReports] = useState<{
    pending: Report[];
    processing: Report[];
    completed: Report[];
  }>({
    pending: [],
    processing: [],
    completed: [],
  });

  const [activeTab, setActiveTab] = useState("all");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [reportType, setReportType] = useState<
    "plagiarism" | "turnitin" | null
  >(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [pdfFiles, setPDFFiles] = useState<any[]>([]);
  const [aiPercentage, setAiPercentage] = useState<number | null>(null);
  const [plagiarismPercentage, setPlagiarismPercentage] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [confirmationType, setConfirmationType] = useState<
    "plagiarism" | "turnitin"
  >("plagiarism");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [checkToDelete, setCheckToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [showQueuePopup, setShowQueuePopup] = useState(false);

  // Define fetchData function at component level so it can be reused
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${serverURL}/turnitin/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched reports:", response.data);
      const fetchedReports = response.data;
      const pending = fetchedReports.filter(
        (report: any) => report.status === "pending"
      );
      const processing = fetchedReports.filter(
        (report: any) =>
          report.status !== "completed" && report.status !== "pending"
      );
      const completed = fetchedReports.filter(
        (report: any) => report.status === "completed"
      );
      setReports({ pending, processing, completed });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Server Error: ${
            error.response.data.message || "Something went wrong"
          }`
        );
      } else {
        toast.error("Failed to fetch reports");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const getUser = async () => {
      try {
        const response = await axios.get(`${serverURL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setIsLoggedIn(true);
        setPlanType(response.data.user.planType);
        localStorage.setItem("planType", response.data.user.planType);
        
        // Show stepper on first visit
        const hasSeenStepper = localStorage.getItem("hasSeenStepper");
        if (!hasSeenStepper) {
          setShowStepper(true);
          localStorage.setItem("hasSeenStepper", "true");
        }
      } catch (error) {
        setIsLoggedIn(false);
        toast.error("Something went wrong!");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Show queue popup for free users after a short delay
  useEffect(() => {
    if (planType === "basic" && isLoggedIn) {
      const timer = setTimeout(() => {
        setShowQueuePopup(true);
        // Auto-close after 4 seconds
        setTimeout(() => {
          setShowQueuePopup(false);
        }, 4000);
      }, 1500); // Show after 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [planType, isLoggedIn]);

  const handleFileUpload = async (newFiles: File[]) => {
    if (newFiles.length > 1) {
      toast.error("Only one file can be uploaded at a time.");
      return;
    }

    const selectedFile = newFiles[0];
    if (selectedFile && selectedFile.size > 100 * 1024 * 1024) {
      toast.error(`File ${selectedFile.name} exceeds the 100 MB size limit.`);
      return;
    }

    if (selectedFile) {
      setFile(selectedFile);
      setWordCountLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const [wordCountResponse, languageCheckResponse] = await Promise.all([
          axios.post(`${serverURL}/file/wordcount`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
          axios.post(`${serverURL}/file/check-language`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        ]);

        const wordCount = wordCountResponse.data.total_words;
        const languageCheck = languageCheckResponse.data;

        setWordCount(wordCount);
        setIsEnglish(languageCheck.supported_language_percentage >= 60);
        setEnglishPercentage(languageCheck.supported_language_percentage);

        if (wordCount < 300 || wordCount > 30000) {
          toast.error(
            "The document must contain between 300 and 30,000 words. Please upload a document within this range."
          );
          setFile(null);
        }

        if (languageCheck.supported_language_percentage < 60) {
          toast.error(
            "The document must be in English, Spanish, or Japanese. Please upload a document with more supported language content."
          );
          setFile(null);
        }
      } catch (error) {
        toast.error("Failed to analyze document.");
        console.error("Document analysis error:", error);
        setFile(null);
      } finally {
        setWordCountLoading(false);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setWordCount(null);
  };

  const handleSubmit = async () => {
    if (!file || loading || !reportType) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        window.location.href = "/";
        return;
      }

      const response = await axios.post(
        `${serverURL}/turnitin/check`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        `Plagiarism detection check initiated successfully! Check ID: ${response.data.checkId}`
      );
      setReports({ pending: [], processing: [], completed: [] });
      removeFile();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data === "User is not active" 
            ? "Account deactivated by admin. Please contact admin."
            : `Server Error: ${error.response.data || "Something went wrong"}`
        );
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
      setIsConfirmationOpen(false);
    }
  };

  const openConfirmation = (type: "plagiarism" | "turnitin") => {
    if (!file) {
      toast.error("Please upload a file first.");
      return;
    }
    setReportType(type);
    setIsConfirmationOpen(true);
  };

  const downloadFile = async (fileId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        `${serverURL}/file`,
        { fileId },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const fileName = response.headers["x-file-name"] || "downloaded_file";
      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  const handlePreview = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files can be previewed. Please download the file to view it.");
      return;
    }
    setPreviewFile(file);
  };

  const handleViewTurnitinReports = async (reportId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [aiReportResponse, plagReportResponse] = await Promise.all([
        axios.post<{ data: any; percentage: number }>(
          `${serverURL}/report/ai-report`,
          { reportId },
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
        axios.post<{ data: any; percentage: number }>(
          `${serverURL}/report/plag-report`,
          { reportId },
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      setPDFFiles([
        {
          data: aiReportResponse.data,
          name: "AI_Report.pdf",
          type: aiReportResponse.headers["content-type"],
        },
        {
          data: plagReportResponse.data,
          name: "Plagiarism_Report.pdf",
          type: plagReportResponse.headers["content-type"],
        },
      ]);

      setAiPercentage(aiReportResponse.data.percentage);
      setPlagiarismPercentage(plagReportResponse.data.percentage);
    } catch (error) {
      console.error("Error downloading Turnitin reports:", error);
      toast.error("Failed to fetch Turnitin reports");
    }
  };

  const handleDownloadTurnitinReports = async (reportId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [aiReportResponse, plagReportResponse] = await Promise.all([
        axios.post(
          `${serverURL}/report/ai-report`,
          { reportId },
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
        axios.post(
          `${serverURL}/report/plag-report`,
          { reportId },
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      const downloadBlob = (data: Blob, fileName: string) => {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      };

      downloadBlob(aiReportResponse.data, "AI_Report.pdf");
      downloadBlob(plagReportResponse.data, "Plagiarism_Report.pdf");
    } catch (error) {
      console.error("Error downloading Turnitin reports:", error);
      toast.error("Failed to download Turnitin reports");
    }
  };

  const getEstimatedTime = () => {
    // If word count is more than 5000, set delivery time to 15 minutes
    if (wordCount && wordCount > 5000) {
      return "15 minutes";
    }

    // For files with less than 5000 words, set delivery time to 2 minutes
    return "2 minutes";
  };

  const filteredAllReports = [
    ...reports.pending,
    ...reports.processing,
    ...reports.completed,
  ]
    .filter((report) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        report.fileId.originalFileName.toLowerCase().includes(query) ||
        report.fileId.storedFileName.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => new Date(b.deliveryTime).getTime() - new Date(a.deliveryTime).getTime());

  const handleDeleteCheck = (checkId: string) => {
    setCheckToDelete(checkId);
    confirmDeleteCheck(checkId);
  };

  const confirmDeleteCheck = async (checkId: string) => {
    if (!checkId) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.delete(`${serverURL}/turnitin/check/${checkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports((prevReports) => {
        const newReports = { ...prevReports };
        Object.keys(newReports).forEach((status) => {
          newReports[status as keyof typeof newReports] = newReports[
            status as keyof typeof newReports
          ].filter((report: any) => report.checkId !== checkId);
        });
        return newReports;
      });

      toast.success("Check deleted successfully");
    } catch (error) {
      console.error("Error deleting check:", error);
      toast.error("Failed to delete check");
    } finally {
      setIsDeleting(false);
      setCheckToDelete(null);
    }
  };

  const deleteAllChecks = async () => {
    setIsDeletingAll(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await axios.post(
        `${serverURL}/turnitin/deleteAll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("All checks and associated files deleted successfully");
        // Refresh the reports after successful deletion
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting all checks:", error);
      toast.error("Failed to delete all checks");
    } finally {
      setIsDeletingAll(false);
      setIsDeleteAllModalOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery("");
    }
  };

  // Temporary maintenance mode
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="mb-8">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/assets/logos/checkturnitin.svg"
              alt="CheckTurnitin Logo"
              width={120}
              height={120}
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6"
              priority
            />
          </div>
          
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-6"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            Site Under Maintenance
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-6">
            Maintenance is because of Turnitin's own update
                                </p>
                              </div>
        
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-300">Expected Return</span>
                      </div>
                    </div>
          
          <div className="text-3xl font-bold text-gray-300 mb-4">
            2 Hours
                </div>

          <p className="text-gray-400 mb-6">
            We apologize for any inconvenience. Turnitin is performing essential updates to their system, which affects our service temporarily.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              <span>Check back in 2 hours for full service restoration</span>
              </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              <span>All your data and reports are safe</span>
                </div>
              </div>
              </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Thank you for your patience and continued support!</p>
                  </div>
                    </div>
    </div>
  );
}