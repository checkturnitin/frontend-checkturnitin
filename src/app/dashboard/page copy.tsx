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
import { PDFViewer } from "./pdf-viewer";
import { Badge } from "@/components/ui/badge";

// Redirect to login if no token is found
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
  }
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

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
  const [filteredReports, setFilteredReports] = useState<{
    pending: Report[];
    processing: Report[];
    completed: Report[];
  }>({
    pending: [],
    processing: [],
    completed: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverURL}/turnitin/check`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Fetched reports:", response.data);

        const fetchedReports = response.data;
        const pending = fetchedReports.filter((report: any) => report.status === "pending");
        const processing = fetchedReports.filter((report: any) =>
          report.status !== "completed" && report.status !== "pending"
        );
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

  useEffect(() => {
    const handleSearchAndFilter = () => {
      if (searchQuery === "") {
        setFilteredReports(reports);
        return;
      }

      const newPending = reports.pending.filter((report) =>
        report.fileId.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const newProcessing = reports.processing.filter((report) =>
        report.fileId.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const newCompleted = reports.completed.filter((report) =>
        report.fileId.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredReports({ pending: newPending, processing: newProcessing, completed: newCompleted });
    };

    handleSearchAndFilter();
  }, [reports, searchQuery]);

  const handleFileUpload = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 100 MB size limit.`);
        return false;
      }
      return true;
    });
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0 || loading || !reportType) return;

    const file = files[0];
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100 MB.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${serverURL}/turnitin/check`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`Turnitin check initiated successfully! Check ID: ${response.data.checkId}`);
      setReports({ pending: [], processing: [], completed: [] });
      setFiles([]);
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
    if (files.length === 0) {
      toast.error("Please upload a file first.");
      return;
    }
    setReportType(type);
    setIsConfirmationOpen(true);
  };

  const downloadFile = async (fileId: string) => {
    try {
      const response = await axios.post(`${serverURL}/file`, { fileId }, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const fileName = response.headers["x-file-name"] || "downloaded_file";
      const contentType = response.headers["content-type"] || "application/octet-stream";

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
      const [aiReportResponse, plagReportResponse] = await Promise.all([
        axios.post<{ data: any; percentage: number }>(
          `${serverURL}/report/ai-report`,
          { reportId },
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const [aiReportResponse, plagReportResponse] = await Promise.all([
        axios.post(
          `${serverURL}/report/ai-report`,
          { reportId },
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8 mt-16">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-between mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by file name"
              className="border border-gray-400 p-2 rounded w-full max-w-xs"
            />
          </div>
          {/* File Upload Section */}
          <Card>
            <CardContent className="p-6">
              <FileUpload
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                files={files}
              />
              {files.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Uploaded Files:
                  </h3>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 p-2 rounded"
                      >
                        <span>{file.name}</span>
                        <div className="flex space-x-2">
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
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>File Size: Files must be less than 100 MB.</p>
                <p>Page Count: Submissions should not exceed 800 pages.</p>
                <p>Word Count: Documents must contain at least 20 words.</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => openConfirmation("turnitin")}
                  disabled={loading || files.length === 0}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
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
              <p>
                You are about to submit 1 file for AI and plagiarism check. This
                will cost 1 credit.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmationOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  Confirm
                </Button>
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
              <div className="h-full">
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
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
            onValueChange={setActiveTab}
            className="w-full mt-8"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({reports.pending.length + reports.processing.length + reports.completed.length})
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
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Completed Reports
                  </h3>
                  {filteredReports.completed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <CheckCircle className="h-12 w-12 text-green-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No completed reports yet.
                      </p>
                    </div>
                  ) : (
                    filteredReports.completed
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
                          onDownloadTurnitinReports={handleDownloadTurnitinReports}
                        />
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Pending Reports
                  </h3>
                  {filteredReports.pending.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <Clock className="h-12 w-12 text-yellow-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No pending reports at the moment.
                      </p>
                    </div>
                  ) : (
                    filteredReports.pending.map((report) => (
                      <ReportItem
                        key={report.checkId}
                        report={report}
                        onDownload={downloadFile}
                        onViewTurnitinReports={handleViewTurnitinReports}
                        onDownloadTurnitinReports={handleDownloadTurnitinReports}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="processing">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Processing Reports
                  </h3>
                  {filteredReports.processing.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <Clock className="h-12 w-12 text-yellow-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No processing reports at the moment.
                      </p>
                    </div>
                  ) : (
                    filteredReports.processing.map((report) => (
                      <ReportItem
                        key={report.checkId}
                        report={report}
                        onDownload={downloadFile}
                        onViewTurnitinReports={handleViewTurnitinReports}
                        onDownloadTurnitinReports={handleDownloadTurnitinReports}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="all">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">All Reports</h3>
                  {[...filteredReports.pending, ...filteredReports.processing, ...filteredReports.completed].length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No reports yet. Try submitting a file for free!
                      </p>
                    </div>
                  ) : (
                    [...filteredReports.pending, ...filteredReports.processing, ...filteredReports.completed].map((report) => (
                      <ReportItem
                        key={report.checkId}
                        report={report}
                        onDownload={downloadFile}
                        onViewTurnitinReports={handleViewTurnitinReports}
                        onDownloadTurnitinReports={handleDownloadTurnitinReports}
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