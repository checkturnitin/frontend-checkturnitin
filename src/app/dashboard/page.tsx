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
import { FileText, Clock, CheckCircle, Eye } from "lucide-react";
import Image from "next/image";
import { ReportItem } from "./report-item";
import { CustomModal } from "./custom-modal";
import Link from "next/link";
import dynamic from "next/dynamic";

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
  const [reportType, setReportType] = useState<"plagiarism" | "turnitin" | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [pdfFiles, setPDFFiles] = useState<any[]>([]);
  const [aiPercentage, setAiPercentage] = useState<number | null>(null);
  const [plagiarismPercentage, setPlagiarismPercentage] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
        const pending = fetchedReports.filter((report: any) => report.status === "pending");
        const processing = fetchedReports.filter((report: any) => report.status !== "completed" && report.status !== "pending");
        const completed = fetchedReports.filter((report: any) => report.status === "completed");
        setReports({ pending, processing, completed });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(`Server Error: ${error.response.data.message || "Something went wrong"}`);
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
          toast.error("The document must contain between 300 and 30,000 words. Please upload a document within this range.");
          setFile(null);
        }
      }
    }
  };

  const getWordCount = async (file: File): Promise<number | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${serverURL}/file/wordcount`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

      const response = await axios.post(`${serverURL}/turnitin/check`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`Turnitin check initiated successfully! Check ID: ${response.data.checkId}`);
      setReports({ pending: [], processing: [], completed: [] });
      removeFile();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Server Error: ${error.response.data || "Something went wrong"}`);
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

      const response = await axios.post(`${serverURL}/file`, { fileId }, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const fileName = response.headers["x-file-name"] || "downloaded_file";
      const contentType = response.headers["content-type"] || "application/octet-stream";

      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
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
          `${serverURL}/report/ai-report`, { reportId }, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        axios.post<{ data: any; percentage: number }>(
          `${serverURL}/report/plag-report`, { reportId }, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
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
          `${serverURL}/report/ai-report`, { reportId }, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        axios.post(
          `${serverURL}/report/plag-report`, { reportId }, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
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
    switch (planType) {
      case "basic":
        return "0 - 4 hrs (default)";
      case "pro":
        return "0 - 1 hr";
      case "pro+":
        return "0 - 30 mins";
      case "enterprise":
        return "Enterprise priority";
      default:
        return "0 - 4 hrs (default)";
    }
  };

  const filteredAllReports = [
    ...reports.pending,
    ...reports.processing,
    ...reports.completed,
  ].filter((report) =>
    report.fileId.originalFileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8 mt-16">
        <div className="w-full max-w-3xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <FileUpload
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                files={file ? [file] : []}
              />
              {file && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Uploaded File:
                  </h3>
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <span>{file.name}</span>
                    <div className="flex items-center space-x-4">
                      {wordCountLoading ? (
                        <span>Loading word count...</span>
                      ) : (
                        <span>Words: {wordCount}</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(file)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>File Size: Files must be less than 100 MB.</p>
                <p>Page Count: Submissions should not exceed 800 pages.</p>
                <p>Word Count: Documents must contain at least 300 words.</p>
                <p><strong>Accepted File Types: .pdf, .docx</strong></p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => openConfirmation("turnitin")}
                  disabled={loading || !file || wordCountLoading || (wordCount !== null && wordCount < 300)}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-all"
                >
                  <Image
                    src="/assets/logos/Turnitin_logo.svg"
                    alt="Turnitin Logo"
                    width={20}
                    height={20}
                  />
                  <span>
                    {loading
                      ? "Submitting..."
                      : "Submit for AI & Plagiarism Report"}
                  </span>
                </Button>
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
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <h4 className="text-lg font-semibold mb-2">
                    File for Submission:
                  </h4>
                  <div className="flex items-center justify-around bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <p className="text-2xl font-semibold bg-black-200 p-2 rounded">
                      {file.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(file)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span>Preview PDF</span>
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <h4 className="text-2xl font-bold text-white-600 mb-4">
                    Estimated Delivery Time:{" "}
                    <span className="italic text-base text-gray-800 dark:text-gray-200">
                      {getEstimatedTime()}
                    </span>
                  </h4>
                  <p className="text-lg flex items-center ml-4">
                    <Link
                      href="/pricing"
                      className="text-green-600 font-semibold text-sm hover:underline hover:text-blue-800 transition-colors duration-200 pb-3"
                    >
                      Upgrade for faster delivery
                    </Link>{" "}
                    <span className="rotate-45 text-2xl ml-2 font-bold">⚡</span>
                  </p>
                </div>
                <p className="text-sm mt-2 italic">
                  The delivery times vary according to your subscription:{" "}
                  <Link
                    href="/pricing"
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
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

              <h4 className="text-lg font-semibold">File Requirements:</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <h5 className="font-semibold mb-2">Plagiarism Detection:</h5>
                <ul className="list-disc ml-6">
                  <li>File Size: Less than 100 MB</li>
                  <li>Minimum Length: At least 300 words</li>
                  <li>Page Limit: Less than 800 pages</li>
                  <li>Accepted File Types: .pdf, .docx</li>
                </ul>
                <h5 className="font-semibold mt-4 mb-2">
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

          {/* Reports Tabs */}
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
            }}
            className="w-full mt-8"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({filteredAllReports.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({reports.pending.length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({reports.processing.length})
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
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="processing">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Processing Reports
                  </h3>
                  {reports.processing.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <Clock className="h-12 w-12 text-yellow-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No processing reports at the moment.
                      </p>
                    </div>
                  ) : (
                    reports.processing.map((report) => (
                      <ReportItem
                        key={report.checkId}
                        report={report}
                        onDownload={downloadFile}
                        onViewTurnitinReports={handleViewTurnitinReports}
                        onDownloadTurnitinReports={
                          handleDownloadTurnitinReports
                        }
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
                    <h3 className="text-lg font-semibold">All Reports</h3>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by file name"
                      className="border border-gray-400 p-2 rounded w-64 max-w-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
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