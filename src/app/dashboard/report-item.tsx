"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { CustomModal } from "./custom-modal";
import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("./pdf-viewer").then(mod => mod.default), { ssr: false });
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"; // Add the Badge import

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

  return { progress, hoursLeft, minutesLeft, timeRemainingMs };
};

const isRecent = (deliveryTime: string) => {
  const deliveryDateTime = new Date(deliveryTime).getTime();
  const currentTime = new Date().getTime();
  return currentTime - deliveryDateTime < 24 * 60 * 60 * 1000; // Less than 24 hours
};

export const ReportItem: React.FC<ReportItemProps> = ({
  report,
  onDownload,
  onViewTurnitinReports,
  onDownloadTurnitinReports,
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hoursLeft: 0,
    minutesLeft: 0,
    timeRemainingMs: 0,
  });

  useEffect(() => {
    const updateProgress = () => {
      const { progress, hoursLeft, minutesLeft, timeRemainingMs } =
        calculateProgressAndTimeLeft(report.deliveryTime);
      setProgress(progress);
      setTimeLeft({ hoursLeft, minutesLeft, timeRemainingMs });
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

  return (
    <div className="mb-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="font-bold text-lg flex items-center">
            {report.fileId.originalFileName}{" "}
            {isRecent(report.deliveryTime) && <Badge className="ml-2">Recent</Badge>}
          </p>
          <p className="text-sm text-gray-500">Stored Filename: {report.fileId.storedFileName}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Check ID: {report.checkId.slice(0, 8)}...
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status:{" "}
            <span
              className={`font-medium ${
                report.status === "completed"
                  ? "text-green-600 dark:text-green-400"
                  : timeLeft.timeRemainingMs < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-yellow-600 dark:text-yellow-400"
              }`}
            >
              {report.status === "completed" ? "Completed" : report.status}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Delivery: {new Date(report.deliveryTime).toLocaleString()}
          </p>
          <div className="mt-2 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsViewModalOpen(true)}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Initial
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
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="flex space-x-4">
            {report.reportId?.reports ? (
              <>
                {report.reportId.reports.ai && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI Score:{" "}
                      <span
                        className={`font-medium ${
                          report.reportId.reports.ai.metadata.score === "0" || report.reportId.reports.ai.metadata.score === "-1"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {report.reportId.reports.ai.metadata.score === "-1" ? "0-20%" : `${report.reportId.reports.ai.metadata.score}%`}
                      </span>
                    </p>
                )}
                {report.reportId.reports.plagiarism && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Plagiarism Score:{" "}
                    <span
                      className={`font-medium ${
                      parseInt(report.reportId.reports.plagiarism.metadata.score) <= 15
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {report.reportId.reports.plagiarism.metadata.score}%
                    </span>
                  </p>
                )}
              </>
            ) : (
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            )}
          </div>
          <div className="flex space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isTurnitinReportAvailable &&
                onViewTurnitinReports(report.reportId!._id)
              }
              className="text-xs"
              disabled={!isTurnitinReportAvailable}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Turnitin Reports
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isTurnitinReportAvailable &&
                onDownloadTurnitinReports(report.reportId!._id)
              }
              className="text-xs"
              disabled={!isTurnitinReportAvailable}
            >
              <Download className="h-3 w-3 mr-1" />
              Download Turnitin Reports
            </Button>
          </div>
        </div>
      </div>

      {report.status !== "completed" && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
  
        </div>
      )}

      <CustomModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      >
        <PDFViewer fileId={report.fileId._id} />
      </CustomModal>
    </div>
  );
};