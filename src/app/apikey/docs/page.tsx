"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ExternalLink, FileText, Download, Trash2, Search, Eye } from "lucide-react";
import { toast } from "sonner";

export default function APIDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10"
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedCode === id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  const ResponseExample = ({ title, code, status }: { title: string; code: string; status: string }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-white">{title}</h4>
        <Badge variant={status.startsWith('2') ? "default" : "destructive"}>
          {status}
        </Badge>
      </div>
      <CodeBlock code={code} language="json" id={`${title}-${status}`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete API reference for CheckTurnitin plagiarism detection and AI content analysis
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ExternalLink className="h-5 w-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-white">Base URL</h3>
                <CodeBlock code="https://api.aiplagreport.com" language="text" id="base-url" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">API Key Format</h3>
                <CodeBlock code="tk_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2" language="text" id="api-key-format" />
              </div>
            </div>
            <div className="bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Note:</strong> All API requests require a valid API key. Get your API key from the dashboard after signing up.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Tabs defaultValue="authentication" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-gray-800 border-gray-700">
            <TabsTrigger value="authentication">Auth</TabsTrigger>
            <TabsTrigger value="checks">Checks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          {/* Authentication */}
          <TabsContent value="authentication" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  API Key Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Request</h3>
                    <CodeBlock 
                      code={`GET /api/key/details?apiKey=tk_your_api_key_here
Headers: None required`} 
                      language="http" 
                      id="key-details-request" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Response</h3>
                    <CodeBlock 
                      code={`{
  "id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "name": "My API Key",
  "totalChecks": 100,
  "checksUsed": 25,
  "checksRemaining": 75,
  "status": "active",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "permissions": ["read", "write"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}`} 
                      language="json" 
                      id="key-details-response" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Checks */}
          <TabsContent value="checks" className="space-y-6">
            {/* Submit Check */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  Submit Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Request</h3>
                    <CodeBlock 
                      code={`POST /api/check
Headers: 
  Content-Type: multipart/form-data
Body (form-data):
  - apiKey: tk_your_api_key_here
  - file: [Select File] (PDF, DOCX, TXT, DOC)`} 
                      language="http" 
                      id="submit-check-request" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Response (200 OK)</h3>
                    <CodeBlock 
                      code={`{
  "checkId": "550e8400-e29b-41d4-a716-446655440000",
  "deliveryTime": "2024-01-15T10:35:00.000Z"
}`} 
                      language="json" 
                      id="submit-check-response" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-white">Error Responses</h4>
                  <div className="space-y-2">
                    <ResponseExample 
                      title="400 Bad Request" 
                      code={`"Missing apiKey in request body"
"No file uploaded"
"File type not allowed"
"Insufficient credits"
"No staff available, please try later."
"File content must be primarily in supported languages (English, Spanish, Japanese)"`} 
                      status="400" 
                    />
                    <ResponseExample 
                      title="401 Unauthorized" 
                      code={`"Invalid API key"`} 
                      status="401" 
                    />
                    <ResponseExample 
                      title="403 Forbidden" 
                      code={`"API key is inactive or expired"
"API key has no remaining checks"`} 
                      status="403" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get Check by ID */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="h-5 w-5" />
                  Get Check by ID
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Request</h3>
                    <CodeBlock 
                      code={`GET /api/check/by-id?apiKey=tk_your_api_key_here&checkId=550e8400-e29b-41d4-a716-446655440000
Headers: None required`} 
                      language="http" 
                      id="get-check-request" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Response (200 OK)</h3>
                    <CodeBlock 
                      code={`{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
  "checkId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "fileId": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "originalFileName": "document.pdf",
    "storedFileName": "1642234567890123.pdf",
    "fileSize": 2.5,
    "fileType": "pdf",
    "fileReference": "Input/1642234567890123.pdf",
    "eTag": "\\"d41d8cd98f00b204e9800998ecf8427e\\""
  },
  "reportId": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "checkId": "64f8a1b2c3d4e5f6a7b8c9d3",
    "staffId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "reports": {
      "ai": {
        "reportUrl": "Reports/ai_report_123.pdf",
        "reportETag": "\\"abc123def456\\""
      },
      "plagiarism": {
        "reportUrl": "Reports/plag_report_123.pdf",
        "reportETag": "\\"def456ghi789\\""
      }
    }
  },
  "status": "completed",
  "priority": "high",
  "planType": "pro",
  "deliveryTime": "2024-01-15T10:35:00.000Z",
  "checkedBy": "64f8a1b2c3d4e5f6a7b8c9d6",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}`} 
                      language="json" 
                      id="get-check-response" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-white">Error Responses</h4>
                  <div className="space-y-2">
                    <ResponseExample 
                      title="400 Bad Request" 
                      code={`{
  "error": "apiKey and checkId are required"
}`} 
                      status="400" 
                    />
                    <ResponseExample 
                      title="401 Unauthorized" 
                      code={`{
  "error": "Invalid API key"
}`} 
                      status="401" 
                    />
                    <ResponseExample 
                      title="403 Forbidden" 
                      code={`{
  "error": "API key is inactive or expired"
}`} 
                      status="403" 
                    />
                    <ResponseExample 
                      title="404 Not Found" 
                      code={`{
  "error": "Check not found"
}`} 
                      status="404" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get All Checks */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="h-5 w-5" />
                  Get All Checks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Request</h3>
                    <CodeBlock 
                      code={`GET /api/checks?apiKey=tk_your_api_key_here
Headers: None required`} 
                      language="http" 
                      id="get-all-checks-request" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Response (200 OK)</h3>
                    <CodeBlock 
                      code={`[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "checkId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "fileId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "originalFileName": "document.pdf",
      "storedFileName": "1642234567890123.pdf",
      "fileSize": 2.5,
      "fileType": "pdf"
    },
    "status": "completed",
    "priority": "high",
    "planType": "pro",
    "deliveryTime": "2024-01-15T10:35:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
  // ... more checks
]`} 
                      language="json" 
                      id="get-all-checks-response" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-white">Error Responses</h4>
                  <div className="space-y-2">
                    <ResponseExample 
                      title="400 Bad Request" 
                      code={`{
  "error": "apiKey is required"
}`} 
                      status="400" 
                    />
                    <ResponseExample 
                      title="401 Unauthorized" 
                      code={`{
  "error": "Invalid API key"
}`} 
                      status="401" 
                    />
                    <ResponseExample 
                      title="403 Forbidden" 
                      code={`{
  "error": "API key is inactive or expired"
}`} 
                      status="403" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            {/* AI Report */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5" />
                  Get AI Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Request</h3>
                    <CodeBlock 
                      code={`GET /api/report/ai?apiKey=tk_your_api_key_here&checkId=550e8400-e29b-41d4-a716-446655440000
Headers: None required`} 
                      language="http" 
                      id="ai-report-request" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Response (200 OK)</h3>
                    <CodeBlock 
                      code={`Content-Type: application/pdf
Content-Length: 1234567
[Binary PDF content streamed directly]`} 
                      language="http" 
                      id="ai-report-response" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-white">Error Responses</h4>
                  <div className="space-y-2">
                    <ResponseExample 
                      title="400 Bad Request" 
                      code={`{
  "message": "apiKey and checkId are required"
}
{
  "message": "Check is not completed yet"
}`} 
                      status="400" 
                    />
                    <ResponseExample 
                      title="401 Unauthorized" 
                      code={`{
  "error": "Invalid API key"
}`} 
                      status="401" 
                    />
                    <ResponseExample 
                      title="403 Forbidden" 
                      code={`{
  "error": "API key is inactive or expired"
}`} 
                      status="403" 
                    />
                    <ResponseExample 
                      title="404 Not Found" 
                      code={`{
  "message": "Check not found"
}
{
  "message": "AI Report not found"
}`} 
                      status="404" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plagiarism Report */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5" />
                  Get Plagiarism Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Request</h3>
                    <CodeBlock 
                      code={`GET /api/report/plag?apiKey=tk_your_api_key_here&checkId=550e8400-e29b-41d4-a716-446655440000
Headers: None required`} 
                      language="http" 
                      id="plag-report-request" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Response (200 OK)</h3>
                    <CodeBlock 
                      code={`Content-Type: application/pdf
Content-Length: 987654
[Binary PDF content streamed directly]`} 
                      language="http" 
                      id="plag-report-response" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-white">Error Responses</h4>
                  <div className="space-y-2">
                    <ResponseExample 
                      title="400 Bad Request" 
                      code={`{
  "message": "apiKey and checkId are required"
}
{
  "message": "Check is not completed yet"
}`} 
                      status="400" 
                    />
                    <ResponseExample 
                      title="401 Unauthorized" 
                      code={`{
  "error": "Invalid API key"
}`} 
                      status="401" 
                    />
                    <ResponseExample 
                      title="403 Forbidden" 
                      code={`{
  "error": "API key is inactive or expired"
}`} 
                      status="403" 
                    />
                    <ResponseExample 
                      title="404 Not Found" 
                      code={`{
  "message": "Check not found"
}
{
  "message": "Plagiarism Report not found"
}`} 
                      status="404" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files */}
          <TabsContent value="files" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Download className="h-5 w-5" />
                  File Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-white">Supported Formats</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        PDF (.pdf)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Microsoft Word (.doc, .docx)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Plain Text (.txt)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-white">File Requirements</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        File Size: Less than 100 MB
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Word Count: 300 - 30,000 words
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Language: English, Spanish, and Japanese (60%+ supported languages)
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-200">File Upload Notes</h4>
                  <ul className="text-sm text-yellow-300 space-y-1">
                    <li>• <strong>Small files:</strong> Files &lt;500 words are automatically merged for better detection</li>
                    <li>• <strong>Language requirement:</strong> Must be primarily in supported languages (English, Spanish, Japanese) - 60%+</li>
                    <li>• <strong>File size limits:</strong> Check your plan limits for specific restrictions</li>
                    <li>• <strong>Page limit:</strong> Less than 800 pages</li>
                  </ul>
                </div>
                <div className="mt-4 bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-200">Common Headers</h4>
                  <div className="text-sm text-blue-300 space-y-1">
                    <p><strong>For JSON requests:</strong> Content-Type: application/json</p>
                    <p><strong>For file uploads:</strong> Content-Type: multipart/form-data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Management */}
          <TabsContent value="management" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trash2 className="h-5 w-5" />
                  Delete All Checks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Request</h3>
                    <CodeBlock 
                      code={`POST /api/deleteAll
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "apiKey": "tk_your_api_key_here"
}`} 
                      language="http" 
                      id="delete-all-request" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Response (200 OK)</h3>
                    <CodeBlock 
                      code={`"All checks deleted successfully"`} 
                      language="json" 
                      id="delete-all-response" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Response (207 Partial Success)</h4>
                  <CodeBlock 
                    code={`{
  "message": "Some deletions completed with errors",
  "successCount": 8,
  "failedCount": 2,
  "failedDeletions": [
    {
      "success": false,
      "checkId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "error": "File not found in storage"
    }
  ]
}`} 
                    language="json" 
                    id="delete-all-partial-response" 
                  />
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-white">Error Responses</h4>
                  <div className="space-y-2">
                    <ResponseExample 
                      title="400 Bad Request" 
                      code={`"Missing apiKey in request body"
"No checks available to delete"`} 
                      status="400" 
                    />
                    <ResponseExample 
                      title="401 Unauthorized" 
                      code={`"Invalid API key"`} 
                      status="401" 
                    />
                    <ResponseExample 
                      title="403 Forbidden" 
                      code={`"API key is inactive or expired"`} 
                      status="403" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors */}
          <TabsContent value="errors" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Error Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponseExample 
                  title="400 Bad Request" 
                  code={`{
  "error": "apiKey is required"
}`} 
                  status="400" 
                />
                <ResponseExample 
                  title="401 Unauthorized" 
                  code={`{
  "error": "Invalid API key"
}`} 
                  status="401" 
                />
                <ResponseExample 
                  title="403 Forbidden" 
                  code={`{
  "error": "API key is inactive or expired"
}`} 
                  status="403" 
                />
                <ResponseExample 
                  title="404 Not Found" 
                  code={`{
  "error": "Check not found"
}`} 
                  status="404" 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples */}
          <TabsContent value="examples" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Postman Collection & Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">Environment Variables</h3>
                  <CodeBlock 
                    code={`base_url: https://api.aiplagreport.com
api_key: tk_your_actual_api_key_here`} 
                    language="text" 
                    id="postman-env" 
                  />
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">Submit Check - cURL</h3>
                  <CodeBlock 
                    code={`curl -X POST "https://api.aiplagreport.com/api/check" \\
  -H "Content-Type: multipart/form-data" \\
  -F "apiKey=tk_your_api_key_here" \\
  -F "file=@document.pdf"`} 
                    language="bash" 
                    id="curl-submit-example" 
                  />
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">Get Check Details - cURL</h3>
                  <CodeBlock 
                    code={`curl -X GET "https://api.aiplagreport.com/api/check/by-id?apiKey=tk_your_api_key_here&checkId=550e8400-e29b-41d4-a716-446655440000"`} 
                    language="bash" 
                    id="curl-get-example" 
                  />
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">Get AI Report - cURL</h3>
                  <CodeBlock 
                    code={`curl -X GET "https://api.aiplagreport.com/api/report/ai?apiKey=tk_your_api_key_here&checkId=550e8400-e29b-41d4-a716-446655440000" \\
  -o ai_report.pdf`} 
                    language="bash" 
                    id="curl-ai-report-example" 
                  />
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">JavaScript - Submit Check</h3>
                  <CodeBlock 
                    code={`const formData = new FormData();
formData.append('apiKey', 'tk_your_api_key_here');
formData.append('file', fileInput.files[0]);

fetch('https://api.aiplagreport.com/api/check', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Check submitted:', data);
  console.log('Check ID:', data.checkId);
  console.log('Delivery Time:', data.deliveryTime);
})
.catch(error => console.error('Error:', error));`} 
                    language="javascript" 
                    id="js-submit-example" 
                  />
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">JavaScript - Get All Checks</h3>
                  <CodeBlock 
                    code={`fetch('https://api.aiplagreport.com/api/checks?apiKey=tk_your_api_key_here')
.then(response => response.json())
.then(checks => {
  console.log('All checks:', checks);
  checks.forEach(check => {
    console.log(\`Check \${check.checkId}: \${check.status}\`);
  });
})
.catch(error => console.error('Error:', error));`} 
                    language="javascript" 
                    id="js-get-all-example" 
                  />
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">Python Example</h3>
                  <CodeBlock 
                    code={`import requests

# Submit a check
def submit_check(api_key, file_path):
    url = "https://api.aiplagreport.com/api/check"
    files = {'file': open(file_path, 'rb')}
    data = {'apiKey': api_key}
    
    response = requests.post(url, files=files, data=data)
    return response.json()

# Get check details
def get_check_details(api_key, check_id):
    url = "https://api.aiplagreport.com/api/check/by-id"
    params = {'apiKey': api_key, 'checkId': check_id}
    
    response = requests.get(url, params=params)
    return response.json()

# Usage
api_key = "tk_your_api_key_here"
result = submit_check(api_key, "document.pdf")
print(f"Check ID: {result['checkId']}")`} 
                    language="python" 
                    id="python-example" 
                  />
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">PHP Example</h3>
                  <CodeBlock 
                    code={`<?php
// Submit a check
function submitCheck($apiKey, $filePath) {
    $url = "https://api.aiplagreport.com/api/check";
    
    $postData = [
        'apiKey' => $apiKey,
        'file' => new CURLFile($filePath)
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Usage
$apiKey = "tk_your_api_key_here";
$result = submitCheck($apiKey, "document.pdf");
echo "Check ID: " . $result['checkId'];
?>`} 
                    language="php" 
                    id="php-example" 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400">
          <p>Need help? Contact our support team or check our FAQ section.</p>
        </div>
      </div>
    </div>
  );
}
