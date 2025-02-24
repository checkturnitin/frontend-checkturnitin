"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../header";
import { ToastContainer, toast } from "react-toastify";
import { serverURL } from "@/utils/utils";
import "react-toastify/dist/ReactToastify.css";
import { X, Trash2, Copy, Clock, FileText, Download } from "lucide-react";

interface OutputItem {
  text: string;
  score: number;
}

interface Document {
  _id: string;
  documentId: string;
  createdAt: string;
  userId: string;
  istrash: boolean;
  inputs: string;
  output: OutputItem[];
}

const DocumentsHistoryPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedOutputIndex, setSelectedOutputIndex] = useState<number>(0);
  const [isInputVisible, setIsInputVisible] = useState(true); // State to toggle between input and output for small screens
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const fetchDocuments = async (pageNumber = 1) => {
    console.log("Fetching documents...");
    setLoading(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      window.location.href = "/";
      return;
    }
  
    try {
      const response = await axios.get(`${serverURL}/documents`, {
        params: {
          page: pageNumber,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { documents, totalPages } = response.data;
      setDocuments(documents);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents.");
      setLoading(false);
    }
  };

  const handleTrashDocument = async (documentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      window.location.href = "/";
      return;
    }
  
    try {
      await axios.post(
        `${serverURL}/document/${documentId}/trash`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Document moved to trash.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: "#272727",
          color: "#fff",
          borderRadius: "8px",
        },
      });
      setSelectedDocument(null);
      fetchDocuments(page);
    } catch (error) {
      console.error("Error moving document to trash:", error);
      toast.error("Failed to move document to trash.");
    }
  };

  const handleCardClick = (document: Document) => {
    setSelectedDocument(document);
    setSelectedOutputIndex(0);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setSelectedOutputIndex(0);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const downloadDocument = () => {
    if (selectedDocument) {
      const content = `
Document ID: ${selectedDocument.documentId}
  
Input:
${selectedDocument.inputs}
  
Outputs:
${selectedDocument.output.map((output, index) => `\nOutput ${index + 1}:\n${output.text}\n`).join('\n')}
      `;
      
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `document_${selectedDocument.documentId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  

  useEffect(() => {
    fetchDocuments(page);
  }, [page]);

  useEffect(() => {
    if (selectedDocument) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [selectedDocument]);

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen text-white">
  <main className={`pt-28 pb-8 ${selectedDocument ? 'blur-sm' : ''}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
    <div className="flex flex-wrap justify-center sm:justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl sm:text-4xl font-bold text-white">Documents History</h1>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition-colors text-sm sm:text-base"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <p className="text-sm sm:text-lg">Page {page} of {totalPages}</p>
        <button
          className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition-colors text-sm sm:text-base"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>


      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-sm sm:text-lg text-gray-400">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          <p className="text-lg sm:text-xl text-gray-400">No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/50"
              onClick={() => handleCardClick(doc)}
            >
              <h2 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">
                {doc.inputs.slice(0, 30)}{doc.inputs.length > 30 ? "..." : ""}
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-2 flex items-center gap-1 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                {new Date(doc.createdAt).toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-300 truncate">{doc.inputs}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </main>

  {selectedDocument && (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-70 backdrop-blur-sm">
    <div
      ref={modalRef}
      className="bg-gray-900 rounded-2xl w-full max-w-7xl m-4 shadow-2xl transform transition-all duration-300 ease-in-out border border-gray-800"
    >
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-800">
  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
    {/* Title and Details */}
    <div className="flex items-center justify-between w-full">
      <div>
        <h2 className="text-2xl font-bold text-white">Document Details</h2>
        <div className="text-gray-400 mt-2 hidden sm:block">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            ID: {selectedDocument.documentId}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4" />
            {new Date(selectedDocument.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Close Button for Small Screens */}
      <button
        className="block lg:hidden p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
        onClick={closeModal}
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-4">
      <button
        className="hidden lg:block p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
        onClick={downloadDocument}
      >
        <Download className="w-5 h-5" />
      </button>
      <button
        className="hidden lg:block p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        onClick={() => handleTrashDocument(selectedDocument._id)}
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Close Button for Large Screens */}
      <button
        className="hidden lg:block p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
        onClick={closeModal}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
</div>


      {/* Modal Content */}
      <div className="p-6">
        {/* Large Screens */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-6 h-[70vh]">
          {/* Input Section */}
          <div className="lg:w-[45%] flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-white">Input</h3>
            <div className="flex-1 bg-gray-800/50 rounded-xl p-1 overflow-y-auto">
              <pre className="h-full p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {selectedDocument.inputs}
              </pre>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:w-[55%] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-white">Output</h3>
              <button
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                onClick={() => copyToClipboard(selectedDocument.output[selectedOutputIndex]?.text || "")}
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            <select
              value={selectedOutputIndex}
              onChange={(e) => setSelectedOutputIndex(Number(e.target.value))}
              className="w-full p-3 mb-3 bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {selectedDocument.output.map((_, index) => (
                <option key={index} value={index}>
                  Output {index + 1}
                </option>
              ))}
            </select>

            <div className="flex-1 bg-gray-800/50 rounded-xl p-1 overflow-y-auto">
              <pre className="h-full p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {selectedDocument.output[selectedOutputIndex]?.text || "N/A"}
              </pre>
            </div>
          </div>
        </div>

        {/* Small Screens */}
        <div className="flex lg:hidden flex-col gap-4 h-[70vh]">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">{isInputVisible ? "Input" : "Output"}</h3>
            {isInputVisible ? (
              <div className="p-2" style={{ height: "40px" }}></div>
            ) : (
              <>
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  onClick={() => copyToClipboard(selectedDocument.output[selectedOutputIndex]?.text || "")}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <select
                  value={selectedOutputIndex}
                  onChange={(e) => setSelectedOutputIndex(Number(e.target.value))}
                  className="p-2 bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {selectedDocument.output.map((_, index) => (
                    <option key={index} value={index}>
                      Output {index + 1}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="flex-1 bg-gray-800/50 rounded-xl p-1 overflow-y-auto">
            <pre className="h-full p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {isInputVisible ? selectedDocument.inputs : selectedDocument.output[selectedOutputIndex]?.text || "N/A"}
            </pre>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setIsInputVisible(true)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                isInputVisible
                  ? "bg-blue-500/30 text-blue-400"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800/70"
              }`}
            >
              Input
            </button>
            <button
              onClick={() => setIsInputVisible(false)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                !isInputVisible
                  ? "bg-blue-500/30 text-blue-400"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800/70"
              }`}
            >
              Output
            </button>
          </div>



        </div>
      </div>
    </div>
  </div>
)}



  <ToastContainer />
</div>

    </>
  );
};

export default DocumentsHistoryPage;