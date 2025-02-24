"use client"

import type React from "react"
import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, Loader2 } from "lucide-react"

pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

interface PDFViewerProps {
  pdfUrl: string
  onClose: () => void
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }

  function onDocumentLoadError(error: Error) {
    setIsLoading(false)
    setError("Failed to load PDF. Please try again.")
    console.error("PDF Load Error:", error)
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal content with higher z-index */}
      <div className="relative z-[101] bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl mt-20 mb-5">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">PDF Viewer</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 2}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center h-64 text-red-500">
              {error}
            </div>
          )}
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="flex justify-center"
            loading={
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="shadow-lg"
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              }
            />
          </Document>
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          <Button
            variant="outline"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <p className="text-sm">
            Page {pageNumber} of {numPages || "-"}
          </p>
          <Button
            variant="outline"
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
            disabled={pageNumber >= (numPages || 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PDFViewer