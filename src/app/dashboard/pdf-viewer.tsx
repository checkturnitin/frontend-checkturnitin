// pdf-viewer.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { serverURL } from "@/utils/utils";
import { square } from "ldrs";
import { SquareIcon as LSquare } from "lucide-react";

square.register();

// Fix for react-pdf worker issue
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileId?: string;
  file?: File;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileId, file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const fetchPDF = async () => {
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        setPdfData(new Uint8Array(arrayBuffer));
      } else if (fileId) {
        try {
          const response = await axios.post(
            `${serverURL}/file`,
            { fileId },
            {
              responseType: "arraybuffer",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          setPdfData(new Uint8Array(response.data));
        } catch (error) {
          console.error("Failed to fetch PDF:", error);
        }
      }
    };

    fetchPDF();
  }, [fileId, file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const pdfFile = useMemo(() => (!pdfData ? null : { data: pdfData }), [pdfData]);

  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto">
      {pdfFile ? (
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (_, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} width={600} />
          ))}
        </Document>
      ) : (
        <div className="flex justify-center items-center h-40">
          <LSquare
            size={35}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray="0.25"
            opacity={0.1}
            speed={1.2}
            color="black"
          />
        </div>
      )}
    </div>
  );
};