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
        setIsEnglish(languageCheck.supported_language_percentage >= 60);``
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
          `Server Error: ${error.response.data || "Something went wrong"}`
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8 mt-20">
        <div className="w-full max-w-3xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
            <CardContent className="p-8">
              <div className="space-y-6">
                <FileUpload
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  files={file ? [file] : []}
                />

                {file && (
                  <div className="mt-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </h3>
                          {wordCountLoading ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Analyzing document...
                            </p>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {wordCount} words
                                </p>
                              </div>
                              {isEnglish !== null && (
                                <>
                                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                                  <div className="flex items-center gap-1">
                                    {isEnglish ? (
                                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                          Supported (EN/ES/JP)
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/30">
                                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                                          Not Supported
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(file)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      File Requirements
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        File Size: Less than 100 MB
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        Word Count: 300 - 30,000 words
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        Page Limit: Less than 800 pages
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Supported Formats
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        PDF (.pdf)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        Microsoft Word (.doc, .docx)
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => openConfirmation("turnitin")}
                  disabled={
                    loading ||
                    !file ||
                    wordCountLoading ||
                    (wordCount !== null && wordCount < 300)
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg font-medium border border-indigo-500"
                >
     
                  <span className="text-sm sm:text-base md:text-lg">
                    {loading
                      ? "Submitting..."
                      : "Submit for AI & Plagiarism Report"}
                  </span>
                </Button>

                <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-center sm:text-left">
                      <span className="text-xl sm:text-2xl">🎉</span>
                      <div>
                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                          Join our Discord channel and get{" "}
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            2 credits
                          </span>{" "}
                          as a bonus!
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Connect with our community and get instant rewards
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://discord.gg/R2zK3A5ftj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      <span>Join Discord</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Popup */}
          <CustomModal
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            heading="Confirm Submission"
          >
            <div className="space-y-4">
              {file && (
                <div className="text-sm text-gray-400">
                  <h4 className="text-lg font-semibold mb-2 text-white">
                    File for Submission:
                  </h4>
                  <div className="flex items-center justify-around bg-gray-900 p-2 rounded border border-gray-800">
                    <p className="text-2xl font-semibold text-white p-2 rounded">
                      {file.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(file)}
                      className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 hover:bg-gray-800"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span>Preview PDF</span>
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-gray-400">
                <div className="flex items-center">
                  <h4 className="text-2xl font-bold text-white mb-4">
                    Estimated Delivery Time:{" "}
                    <span className="italic text-base text-gray-300">
                      {getEstimatedTime()}
                    </span>
                  </h4>
                  <p className="text-lg flex items-center ml-4">
                    <Link
                      href="/pricing"
                      className="text-green-400 font-semibold text-sm hover:underline hover:text-green-300 transition-colors duration-200 pb-3"
                    >
                      Upgrade for faster delivery
                    </Link>{" "}
                    <span className="rotate-45 text-2xl ml-2 font-bold">
                      ⚡
                    </span>
                  </p>
                </div>
                <p className="text-sm mt-2 italic">
                  This is Authentic Plagiarism Detection Check and Both AI and Plag
                  Report will be provided:{" "}
                  <Link
                    href="/pricing"
                    className="text-indigo-400 underline hover:text-indigo-300 transition-colors duration-200"
                  >
                    View our plans
                  </Link>
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all"
              >
                Confirm and Receive Plagiarism Detection Reports
              </Button>

              <h4 className="text-lg font-semibold text-white">
                File Requirements:
              </h4>
              <div className="text-sm text-gray-400">
                <h5 className="font-semibold mb-2 text-white">
                  Plagiarism Detection:
                </h5>
                <ul className="list-disc ml-6">
                  <li>File Size: Less than 100 MB</li>
                  <li>Minimum Length: At least 300 words</li>
                  <li>Page Limit: Less than 800 pages</li>
                  <li>Accepted File Types: .pdf, .docx, .doc</li>
                  <li>Language: English, Spanish, and Japanese are supported</li>
                </ul>
                <h5 className="font-semibold mt-4 mb-2 text-white">
                  AI-Generated Content Detection:
                </h5>
                <ul className="list-disc ml-6">
                  <li>File Size: Less than 100 MB</li>
                  <li>
                    Word Count: Between 300 and 30,000 words of prose text in a
                    long-form writing format
                  </li>
                  <li>
                    Language: English, Spanish, and Japanese are supported (minimum 60% content in supported languages)
                  </li>
                </ul>
              </div>
            </div>
          </CustomModal>

          {/* File Preview Modal */}
          <CustomModal
            isOpen={!!previewFile}
            onClose={() => setPreviewFile(null)}
            heading="File Preview"
          >
            {previewFile && (
              <div className="h-full overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                  File Preview: {previewFile.name}
                </h2>
                {previewFile.type === "application/pdf" ? (
                  <PDFViewer file={previewFile} />
                ) : (
                  <p>Preview not available for this file type.</p>
                )}
              </div>
            )}
          </CustomModal>

          {/* PDF Viewer Modal for Turnitin Reports */}
          <CustomModal
            isOpen={pdfFiles.length > 0}
            onClose={() => setPDFFiles([])}
            heading="View Reports"
            width="90%"
          >
            <div className="flex justify-end space-x-4 mb-3">
              {pdfFiles.map((pdfFile, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    const blob = new Blob([pdfFile.data], {
                      type: pdfFile.type,
                    });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", pdfFile.name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Download {pdfFile.name}
                </Button>
              ))}
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                {pdfFiles.map((pdfFile, index) => (
                  <div key={index} className="w-1/2 h-[75vh] overflow-auto">
                    <PDFViewer file={pdfFile.data} />
                  </div>
                ))}
              </div>
            </div>
          </CustomModal>

          {/* Reports Tabs */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Reports
              </h2>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSearch}
                  className="flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">Email Notification:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <span className="hidden sm:inline">On</span>
                    <span className="sm:hidden">✓</span>
                  </Badge>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteAllModalOpen(true)}
                  disabled={Object.values(reports).flat().length === 0}
                  className="text-xs"
                >
                  <FiTrash2 className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Delete All</span>
                </Button>
              </div>
            </div>

            {isSearchActive && (
              <div className="mb-4 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by filename..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {filteredAllReports.length > 0 ? (
                  filteredAllReports.map((report) => (
                    <ReportItem
                      key={report.checkId}
                      report={report}
                      onDownload={downloadFile}
                      onViewTurnitinReports={handleViewTurnitinReports}
                      onDownloadTurnitinReports={handleDownloadTurnitinReports}
                      onDelete={handleDeleteCheck}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No reports found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                {reports.pending
                  .sort((a, b) => new Date(b.deliveryTime).getTime() - new Date(a.deliveryTime).getTime())
                  .map((report) => (
                    <ReportItem
                      key={report.checkId}
                      report={report}
                      onDownload={downloadFile}
                      onViewTurnitinReports={handleViewTurnitinReports}
                      onDownloadTurnitinReports={handleDownloadTurnitinReports}
                      onDelete={handleDeleteCheck}
                    />
                  ))}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {reports.completed
                  .sort((a, b) => new Date(b.deliveryTime).getTime() - new Date(a.deliveryTime).getTime())
                  .map((report) => (
                    <ReportItem
                      key={report.checkId}
                      report={report}
                      onDownload={downloadFile}
                      onViewTurnitinReports={handleViewTurnitinReports}
                      onDownloadTurnitinReports={handleDownloadTurnitinReports}
                      onDelete={handleDeleteCheck}
                    />
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" richColors />

      {/* Delete All Confirmation Modal */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black rounded-lg shadow-xl max-w-md w-full border-2 border-red-500 animate-in fade-in zoom-in duration-300">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
              </div>

              <p className="mb-4 text-gblack dark:text-gray-300 text-sm">
                This will permanently delete all <span className="font-semibold">{filteredAllReports.length}</span> checks and
                associated files.
                <span className="font-bold text-red-500 block mt-2"> This action cannot be undone.</span>
              </p>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteAllModalOpen(false)}
                  disabled={isDeletingAll}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteAllChecks}
                  disabled={isDeletingAll}
                  className={`${isDeletingAll ? "opacity-80" : ""}`}
                >
                  {isDeletingAll ? (
                    <>
                      <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete All
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Modal */}
      {showStepper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <Stepper
              initialStep={1}
              onStepChange={(step) => {
                console.log(step);
              }}
              onFinalStepCompleted={() => {
                setShowStepper(false);
                console.log("All steps completed!");
              }}
              backButtonText="Previous"
              nextButtonText="Next"
              stepCircleContainerClassName="rounded-2xl"
              stepContainerClassName="p-4"
              contentClassName="p-4"
              footerClassName="mt-2"
            >
              <Step>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                      Welcome to AIPlagReport 👋
                    </h2>
                    <p className="text-white/80 text-lg">
                      Your journey to authentic plagiarism detection checks starts here!
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">Upload your document</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">Get instant AI & Plagiarism analysis</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">Download your authentic plagiarism detection report</span>
                    </div>
                  </div>
                </div>
              </Step>
              <Step>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                      What files do we accept?
                    </h2>
                    <p className="text-white/80 text-lg">
                      We support the following file formats and requirements:
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">PDF, DOC, or DOCX format</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">Minimum 350 words per paragraph</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">No presentations or Excel files</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">Maximum file size: 100MB</span>
                    </div>
                  </div>
                </div>
              </Step>
              <Step>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                      Ready to get started?
                    </h2>
                    <p className="text-white/80 text-lg">
                      Upload your document now and receive your authentic plagiarism detection report in minutes!
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">No database storage - your document stays private</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">Get both AI and Plagiarism reports</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-white/90">Instant results with detailed analysis</span>
                    </div>
                  </div>
                </div>
              </Step>
            </Stepper>
          </div>
        </div>
      )}
    </div>
  );
}
