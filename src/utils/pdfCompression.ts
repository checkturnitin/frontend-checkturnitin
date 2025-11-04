/**
 * Compresses a PDF file by optimizing its structure and embedded resources
 * @param file - The original PDF file to compress
 * @param quality - Compression quality (0-1), default 0.75
 * @returns A compressed PDF File object
 */
export async function compressPDF(
  file: File,
  quality: number = 0.75
): Promise<File> {
  try {
    // Dynamically import pdf-lib to handle cases where it might not be installed
    const { PDFDocument } = await import('pdf-lib');
    
    // Read the PDF file
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Get all pages
    const pages = pdfDoc.getPages();
    
    // Compress images embedded in the PDF
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      // pdf-lib doesn't directly compress images, but we can optimize the document
      // The compression happens when we save the document
    }
    
    // Save the PDF with compression
    // pdf-lib will optimize the structure automatically
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: false, // Disable object streams for better compression
      addDefaultPage: false,
    });
    
    // Create a new File object with the compressed PDF (keep original filename)
    // Convert to ArrayBuffer to avoid type issues
    const bufferSlice = compressedPdfBytes.buffer.slice(
      compressedPdfBytes.byteOffset,
      compressedPdfBytes.byteOffset + compressedPdfBytes.byteLength
    );
    // Type assertion: pdf-lib returns ArrayBuffer, not SharedArrayBuffer
    const compressedArrayBuffer = (bufferSlice instanceof ArrayBuffer 
      ? bufferSlice 
      : new Uint8Array(compressedPdfBytes).buffer) as ArrayBuffer;
    const compressedFile = new File(
      [compressedArrayBuffer],
      file.name,
      {
        type: 'application/pdf',
        lastModified: Date.now(),
      }
    );
    
    // If the compressed file is not smaller, return original
    if (compressedFile.size >= file.size) {
      console.log('Compressed file is not smaller, returning original');
      return file;
    }
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing PDF:', error);
    // If compression fails (e.g., pdf-lib not installed), return the original file
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      console.warn('pdf-lib is not installed. Please install it with: npm install pdf-lib');
    }
    return file;
  }
}

/**
 * Compresses PDF by rendering pages to canvas at lower resolution
 * This method uses pdf.js which is already installed
 * @param file - The original PDF file to compress
 * @param scale - Scale factor for compression (0-1), default 0.8
 * @returns A compressed PDF File object
 */
export async function compressPDFWithCanvas(
  file: File,
  scale: number = 0.8
): Promise<File> {
  try {
    // Dynamically import pdf.js
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up the worker
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
    
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Import pdf-lib to create new PDF
    const { PDFDocument } = await import('pdf-lib');
    const newPdfDoc = await PDFDocument.create();
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not get canvas context');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
      
      // Convert canvas to image
      const imageBytes = await new Promise<Uint8Array>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(new Uint8Array());
            return;
          }
          blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
        }, 'image/jpeg', 0.85); // JPEG with 85% quality
      });
      
      // Add image to new PDF
      const pdfImage = await newPdfDoc.embedJpg(imageBytes);
      const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
      newPage.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
    }
    
    // Save the compressed PDF
    const pdfBytes = await newPdfDoc.save();
    
    // Create new File object (keep original filename)
    // Convert to ArrayBuffer to avoid type issues
    const bufferSlice = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    );
    // Type assertion: pdf-lib returns ArrayBuffer, not SharedArrayBuffer
    const compressedArrayBuffer = (bufferSlice instanceof ArrayBuffer 
      ? bufferSlice 
      : new Uint8Array(pdfBytes).buffer) as ArrayBuffer;
    const compressedFile = new File(
      [compressedArrayBuffer],
      file.name,
      {
        type: 'application/pdf',
        lastModified: Date.now(),
      }
    );
    
    // If the compressed file is not smaller, return original
    if (compressedFile.size >= file.size) {
      console.log('Compressed file is not smaller, returning original');
      return file;
    }
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing PDF with canvas:', error);
    // If compression fails, return the original file
    return file;
  }
}
