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
import { FileText, Clock, CheckCircle, Eye, Search, X } from "lucide-react";
import Image from "next/image";
import { ReportItem } from "./report-item";
import { CustomModal } from "./custom-modal";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";

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
      } catch (error) {
        setIsLoggedIn(false);
        toast.error("Something went wrong!");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
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
      const wordCount = await getWordCount(selectedFile);
      setWordCountLoading(false);

      if (wordCount !== null) {
        setWordCount(wordCount);
        if (wordCount < 300 || wordCount > 30000) {
          toast.error(
            "The document must contain between 300 and 30,000 words. Please upload a document within this range."
          );
          setFile(null);
        }
      }
    }
  };

  const getWordCount = async (file: File): Promise<number | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${serverURL}/file/wordcount`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.total_words;
    } catch (error) {
      toast.error("Failed to count words in document.");
      console.error("Word count error:", error);
      return null;
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
        `Turnitin check initiated successfully! Check ID: ${response.data.checkId}`
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
  ].filter((report) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      report.fileId.originalFileName.toLowerCase().includes(query) ||
      report.fileId.storedFileName.toLowerCase().includes(query)
    );
  });

  const handleDeleteCheck = (checkId: string) => {
    setCheckToDelete(checkId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCheck = async () => {
    if (!checkToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      await axios.delete(`${serverURL}/turnitin/check/${checkToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the reports state by removing the deleted check
      setReports((prevReports) => {
        const newReports = { ...prevReports };
        Object.keys(newReports).forEach((status) => {
          newReports[status as keyof typeof newReports] = newReports[
            status as keyof typeof newReports
          ].filter((report) => report.checkId !== checkToDelete);
        });
        return newReports;
      });

      toast.success("Check deleted successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Failed to delete check: ${
            error.response.data.message || "Something went wrong"
          }`
        );
      } else {
        toast.error("Failed to delete check");
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setCheckToDelete(null);
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
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8 mt-16">
        <div className="w-full max-w-3xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-black dark:bg-black border border-gray-800">
            <CardContent className="p-8">
              <div className="space-y-6">
                <FileUpload
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  files={file ? [file] : []}
                />

                {file && (
                  <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-indigo-400" />
                        <div>
                          <h3 className="font-medium text-white">
                            {file.name}
                          </h3>
                          {wordCountLoading ? (
                            <p className="text-sm text-gray-400">
                              Calculating word count...
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400">
                              {wordCount} words
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(file)}
                          className="text-indigo-400 hover:text-indigo-300 hover:bg-gray-800"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">
                      File Requirements
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                        File Size: Less than 100 MB
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                        Word Count: 300 - 30,000 words
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                        Page Limit: Less than 800 pages
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">
                      Supported Formats
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                        PDF (.pdf)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
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
                  className="w-full bg-white hover:bg-gray-100 text-indigo-600 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium border border-indigo-200"
                >
                  <Image
                    src="/assets/logos/Turnitin_logo.svg"
                    alt="Turnitin Logo"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span>
                    {loading
                      ? "Submitting..."
                      : "Submit for AI & Plagiarism Report"}
                  </span>
                </Button>

                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg border border-indigo-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <p className="text-white font-medium">
                          Join our Discord channel and get{" "}
                          <span className="text-green-400 font-bold">
                            5 credits
                          </span>{" "}
                          as a bonus!
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Connect with our community and get instant rewards
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://discord.gg/R2zK3A5ftj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 rounded-full px-4 py-2 text-sm font-medium text-white"
                    >
                      <svg
                        className="w-5 h-5"
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
                  This is Authentic Turnitin Check and Both Turnitin AI and Plag
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
                Confirm and Receive Turnitin Reports
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
                    Language: English and Spanish submissions are supported
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

          {/* Delete Confirmation Modal */}
          <CustomModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setCheckToDelete(null);
            }}
            heading="Delete Check"
          >
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete this check? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setCheckToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteCheck}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </CustomModal>

          {/* Reports Tabs */}
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
            }}
            className="w-full mt-8"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({filteredAllReports.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({reports.pending.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({reports.completed.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="completed">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Completed Reports
                  </h3>
                  {reports.completed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <CheckCircle className="h-12 w-12 text-green-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No completed reports yet.
                      </p>
                    </div>
                  ) : (
                    reports.completed
                      .sort(
                        (a, b) =>
                          new Date(b.deliveryTime).getTime() -
                          new Date(a.deliveryTime).getTime()
                      )
                      .map((report) => (
                        <ReportItem
                          key={report.checkId}
                          report={report}
                          onDownload={downloadFile}
                          onViewTurnitinReports={handleViewTurnitinReports}
                          onDownloadTurnitinReports={
                            handleDownloadTurnitinReports
                          }
                          onDelete={handleDeleteCheck}
                        />
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Pending Reports
                  </h3>
                  {reports.pending.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <Clock className="h-12 w-12 text-yellow-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No pending reports at the moment.
                      </p>
                    </div>
                  ) : (
                    reports.pending.map((report) => (
                      <ReportItem
                        key={report.checkId}
                        report={report}
                        onDownload={downloadFile}
                        onViewTurnitinReports={handleViewTurnitinReports}
                        onDownloadTurnitinReports={
                          handleDownloadTurnitinReports
                        }
                        onDelete={handleDeleteCheck}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="all">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">All Reports</h3>
                      <span className="text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline-block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12H8m0 0l4-4m-4 4l4 4m8-4a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      <p className="text-xs text-green-500 mt-1">
                        Email notification is on
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {isSearchActive && (
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1">
                          <Input
                            type="text"
                            placeholder="Search by filename..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-0 bg-transparent focus-visible:ring-0 h-8 w-48 text-sm"
                            autoFocus
                          />
                          {searchQuery && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setSearchQuery("")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSearch}
                        className={`flex items-center space-x-1 ${
                          isSearchActive
                            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : ""
                        }`}
                      >
                        <Search className="h-4 w-4" />
                        <span className="text-sm font-medium">Search</span>
                      </Button>
                      <Link
                        href="/deletechecks"
                        className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6h18M9 6v12m6-12v12M4 6l1-1h14l1 1M5 6v12a2 2 0 002 2h10a2 2 0 002-2V6"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Delete Checks
                        </span>
                      </Link>
                    </div>
                  </div>
                  {filteredAllReports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No reports yet. Try submitting a file for free!
                      </p>
                    </div>
                  ) : (
                    filteredAllReports.map((report) => (
                      <ReportItem
                        key={report.checkId}
                        report={report}
                        onDownload={downloadFile}
                        onViewTurnitinReports={handleViewTurnitinReports}
                        onDownloadTurnitinReports={
                          handleDownloadTurnitinReports
                        }
                        onDelete={handleDeleteCheck}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
