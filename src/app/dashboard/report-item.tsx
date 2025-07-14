"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { CustomModal } from "./custom-modal";
import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("./pdf-viewer").then(mod => mod.default), { ssr: false });
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FiDownload, FiEye, FiTrash2, FiMail } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ReportItemProps {
  report: {
    checkId: string;
    priority: string;
    status: string;
    deliveryTime: string;
    fileId: {
      _id: string,
      originalFileName: string,
      storedFileName: string
    };
    reportId?: {
      _id: string;
      reports?: {
        ai?: { metadata: { score: string } };
        plagiarism?: { metadata: { score: string } };
      };
    };
  };
  onDownload: (fileId: string) => Promise<void>;
  onViewTurnitinReports: (reportId: string) => void;
  onDownloadTurnitinReports: (reportId: string) => void;
  onDelete: (checkId: string) => void;
}

const calculateProgressAndTimeLeft = (deliveryTime: string) => {
  const deliveryDateTime = new Date(deliveryTime).getTime();
  const currentTime = new Date().getTime();
  const totalDuration = 24 * 60 * 60 * 1000; // Assuming 24 hours in ms for the report to be delivered.

  const timeElapsed = totalDuration - (deliveryDateTime - currentTime);
  const progress = Math.min((timeElapsed / totalDuration) * 100, 100);

  const timeRemainingMs = deliveryDateTime - currentTime;
  const hoursLeft = Math.floor(timeRemainingMs / (1000 * 60 * 60));
  const minutesLeft = Math.floor(
    (timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Check if delivery time has been exceeded by 20 minutes
  const isExceededBy20Minutes = timeRemainingMs < -20 * 60 * 1000;

  return { progress, hoursLeft, minutesLeft, timeRemainingMs, isExceededBy20Minutes };
};

const isRecent = (deliveryTime: string) => {
  const deliveryDateTime = new Date(deliveryTime).getTime();
  const currentTime = new Date().getTime();
  return currentTime - deliveryDateTime < 24 * 60 * 60 * 1000; // Less than 24 hours
};

const truncateFileName = (fileName: string, maxLength: number = 20) => {
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.split('.').pop();
  const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncatedName = nameWithoutExtension.substring(0, maxLength - 3);
  return `${truncatedName}...${extension ? `.${extension}` : ''}`;
};

export const ReportItem: React.FC<ReportItemProps> = ({
  report,
  onDownload,
  onViewTurnitinReports,
  onDownloadTurnitinReports,
  onDelete,
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewTurnitinLoading, setIsViewTurnitinLoading] = useState(false);
  const [isDownloadTurnitinLoading, setIsDownloadTurnitinLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hoursLeft: 0,
    minutesLeft: 0,
    timeRemainingMs: 0,
    isExceededBy20Minutes: false,
  });

  useEffect(() => {
    const updateProgress = () => {
      const { progress, hoursLeft, minutesLeft, timeRemainingMs, isExceededBy20Minutes } =
        calculateProgressAndTimeLeft(report.deliveryTime);
      setProgress(progress);
      setTimeLeft({ hoursLeft, minutesLeft, timeRemainingMs, isExceededBy20Minutes });
    };

    updateProgress(); // Initialize immediately
    const interval = setInterval(updateProgress, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [report.deliveryTime]);

  const handleDownload = async () => {
    setIsLoading(true);
    await onDownload(report.fileId._id);
    setIsLoading(false);
  };

  const isTurnitinReportAvailable = !!report.reportId;

  const handleViewTurnitinReports = async () => {
    if (isTurnitinReportAvailable) {
      setIsViewTurnitinLoading(true);
      await onViewTurnitinReports(report.reportId!._id);
      setIsViewTurnitinLoading(false);
    }
  };

  const handleDownloadTurnitinReports = async () => {
    if (isTurnitinReportAvailable) {
      setIsDownloadTurnitinLoading(true);
      await onDownloadTurnitinReports(report.reportId!._id);
      setIsDownloadTurnitinLoading(false);
    }
  };

  const handlePreview = () => {
    // Check if the file is a PDF based on the file extension
    const fileExtension = report.fileId.originalFileName.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'pdf') {
      toast.error("Only PDF files can be previewed. Please download the file to view it.");
      return;
    }
    setIsViewModalOpen(true);
  };

  return (
    <Card className="mb-4 transition-all duration-200 hover:shadow-lg dark:bg-gray-800/50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-semibold text-lg flex flex-wrap items-center gap-2">
                {truncateFileName(report.fileId.originalFileName)}
                {isRecent(report.deliveryTime) && (
                  <Badge variant="secondary" className="ml-0 sm:ml-2">Recent</Badge>
                )}
              </h3>
              <Badge
                variant={report.status === "completed" ? "default" : "outline"}
                className={`${
                  report.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : report.status === "failed"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    : timeLeft.timeRemainingMs < 0
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}
              >
                {report.status === "completed" 
                  ? "Completed" 
                  : report.status === "failed"
                  ? "Failed"
                  : "Processing"}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Stored Filename: {report.fileId.storedFileName}</p>
              <p>Check ID: {report.checkId.slice(0, 8)}...</p>
              <p>Delivery: {new Date(report.deliveryTime).toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <span>Email Notification:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <FiMail className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">(may go to spam, check spam folder)</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>All check notifications are sent to your email.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {timeLeft.isExceededBy20Minutes && report.status !== "completed" && report.status !== "failed" && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  Delivery time exceeded by more than 20 minutes. Please contact support for assistance.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="text-xs"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Preview</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  {isLoading ? "Downloading..." : "Download Initial"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  disabled={report.status !== "completed" && report.status !== "failed"}
                >
                  <FiTrash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              {report.reportId?.reports ? (
                <>
                  {report.reportId.reports.ai && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">AI Score: </span>
                      <span
                        className={`font-medium ${
                          report.reportId.reports.ai.metadata.score === "0" || report.reportId.reports.ai.metadata.score === "-1"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {report.reportId.reports.ai.metadata.score === "-1" ? "0-19%" : `${report.reportId.reports.ai.metadata.score}%`}
                      </span>
                    </div>
                  )}
                  {report.reportId.reports.plagiarism && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Plagiarism Score: </span>
                      <span
                        className={`font-medium ${
                          parseInt(report.reportId.reports.plagiarism.metadata.score) <= 15
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {report.reportId.reports.plagiarism.metadata.score}%
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewTurnitinReports}
                className="text-xs"
                disabled={!isTurnitinReportAvailable || isViewTurnitinLoading}
              >
                <Eye className="h-3 w-3 mr-1" />
                {isViewTurnitinLoading ? "Loading..." : "View Turnitin AI and Plag Reports"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTurnitinReports}
                className="text-xs"
                disabled={!isTurnitinReportAvailable || isDownloadTurnitinLoading}
              >
                <Download className="h-3 w-3 mr-1" />
                {isDownloadTurnitinLoading ? "Downloading..." : "Download Turnitin AI and Plag Reports"}
              </Button>
            </div>
          </div>
        </div>

        {report.status !== "completed" && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>

      <CustomModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      >
        <PDFViewer fileId={report.fileId._id} />
      </CustomModal>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
          <DialogHeader>
            <DialogTitle>Delete All</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this check? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(report.checkId);
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};