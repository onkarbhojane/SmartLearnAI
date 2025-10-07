import React, { useState, useEffect, useRef } from 'react';
import './CleanPDFViewer.css';

const PDFViewer = (props) => {
  const [pdf, setPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const containerRef = useRef(null);
  const selectionContainerRef = useRef(null);

  const pdfUrl = props.pdfUrl;

  useEffect(() => {
    if (pdfUrl) {
      loadPDF();
    }
  }, [pdfUrl]);

  useEffect(() => {
    // Setup text selection handler
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText && isSelectionInPDF(selection)) {
        setSelectedText(selectedText);
        
        // Notify parent component about selected text
        if (props.onTextSelect) {
          props.onTextSelect(selectedText);
        }
      }
    };

    // Add event listeners for text selection
    document.addEventListener('selectionchange', handleTextSelection);
    
    // Add copy event listener to enhance copy functionality
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('selectionchange', handleTextSelection);
      document.removeEventListener('copy', handleCopy);
    };
  }, [props.onTextSelect]);

  const isSelectionInPDF = (selection) => {
    if (!selection.rangeCount) return false;
    
    const range = selection.getRangeAt(0);
    const textLayer = textLayerRef.current;
    
    if (!textLayer) return false;
    
    return textLayer.contains(range.commonAncestorContainer);
  };

  const handleCopy = (event) => {
    if (selectedText) {
      // Enhance clipboard data with the selected text
      event.clipboardData.setData('text/plain', selectedText);
      event.preventDefault();
      
      // Show feedback
      showSelectionFeedback('Text copied to clipboard!');
    }
  };

  const showSelectionFeedback = (message) => {
    // Create or update feedback element
    let feedback = document.getElementById('pdf-selection-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'pdf-selection-feedback';
      feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.style.display = 'block';
    
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 2000);
  };

  const loadPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      setPdf(null);
      setCurrentPage(1);
      setTotalPages(0);
      setSelectedText('');

      console.log('Loading Cloudinary PDF from:', pdfUrl);

      // Import PDF.js with text layer
      const pdfjs = await import('pdfjs-dist/build/pdf');
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      const loadingTask = pdfjs.getDocument(pdfUrl);
      
      const pdfDocument = await loadingTask.promise;
      console.log('PDF loaded successfully, total pages:', pdfDocument.numPages);
      
      setPdf(pdfDocument);
      setTotalPages(pdfDocument.numPages);
      
      setTimeout(() => {
        renderPage(pdfDocument, 1);
      }, 100);
      
    } catch (err) {
      console.error('PDF loading error:', err);
      setError(`Failed to load PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async (pdfDoc, pageNumber) => {
    try {
      if (!canvasRef.current || !textLayerRef.current) {
        console.error('Canvas or text layer not available yet');
        setTimeout(() => renderPage(pdfDoc, pageNumber), 100);
        return;
      }

      const page = await pdfDoc.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const textLayer = textLayerRef.current;
      
      if (!context) {
        throw new Error('Canvas context not available');
      }

      // Clear any existing selection
      setSelectedText('');
      const selection = window.getSelection();
      selection.removeAllRanges();

      // Calculate scale
      const container = containerRef.current || canvas.parentElement;
      const containerWidth = container ? container.clientWidth - 40 : 800;
      const pageViewport = page.getViewport({ scale: 1.0 });
      const scale = Math.min((containerWidth / pageViewport.width), 1.5);
      
      const viewport = page.getViewport({ scale });
      
      // Set canvas dimensions
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Clear and set white background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      console.log(`Rendering page ${pageNumber} at scale ${scale}`);

      // Render the page on canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Render text layer for text selection
      await renderTextLayer(page, viewport, textLayer);
      
    } catch (err) {
      console.error('PDF rendering error:', err);
      setError(`Failed to render page ${currentPage}: ${err.message}`);
    }
  };

  const renderTextLayer = async (page, viewport, textLayerDiv) => {
    try {
      // Import text layer renderer
      const { TextLayerBuilder } = await import('pdfjs-dist/web/pdf_viewer');
      
      // Clear previous text layer
      textLayerDiv.innerHTML = '';
      
      // Create new text layer
      const textLayer = new TextLayerBuilder({
        textLayerDiv: textLayerDiv,
        pageIndex: page.pageNumber - 1,
        viewport: viewport,
      });
      
      // Get text content
      const textContent = await page.getTextContent();
      textLayer.setTextContent(textContent);
      textLayer.render();
      
      // Enhance text layer for better selection
      enhanceTextLayer(textLayerDiv);
      
    } catch (err) {
      console.error('Text layer rendering error:', err);
      // Don't throw error - text layer is optional
    }
  };

  const enhanceTextLayer = (textLayerDiv) => {
    // Add CSS classes for better text selection
    textLayerDiv.classList.add('pdf-text-layer');
    
    // Make text selectable and improve selection appearance
    const textElements = textLayerDiv.querySelectorAll('.textLayer > *');
    textElements.forEach(element => {
      element.style.userSelect = 'text';
      element.style.cursor = 'text';
    });
  };

  const nextPage = async () => {
    if (currentPage < totalPages && pdf) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      await renderPage(pdf, newPage);
    }
  };

  const prevPage = async () => {
    if (currentPage > 1 && pdf) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      await renderPage(pdf, newPage);
    }
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySelectedText = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText)
        .then(() => {
          showSelectionFeedback('Text copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          showSelectionFeedback('Failed to copy text');
        });
    }
  };

  const sendToChatbot = () => {
    if (selectedText && props.onTextSelect) {
      props.onTextSelect(selectedText);
      showSelectionFeedback('Text sent to chatbot!');
    }
  };

  if (!pdfUrl) {
    return (
      <div className="error-container">
        <p>No PDF URL provided</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading PDF document from Cloudinary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'center' }}>
          <button onClick={loadPDF} className="retry-button">
            Try Again
          </button>
          <button onClick={downloadPDF} className="download-button">
            Download PDF
          </button>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="direct-link">
            Open PDF directly
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="clean-pdf-container mb-5" ref={containerRef}>
      <div className="pdf-controls">
        <button onClick={prevPage} disabled={currentPage <= 1} className="page-button">
          ‹ Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage >= totalPages} className="page-button">
          Next ›
        </button>
        <button onClick={downloadPDF} className="download-button">
          Download
        </button>
        
        {/* Text selection controls */}
        {selectedText && (
          <div className="selection-controls">
            <button onClick={copySelectedText} className="copy-button">
              Copy Text
            </button>
            {props.onTextSelect && (
              <button onClick={sendToChatbot} className="chatbot-button">
                Send to Chatbot
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Selected text preview */}
      {selectedText && (
        <div className="selected-text-preview">
          <div className="selected-text-header">
            <span>Selected Text:</span>
            <button 
              onClick={() => setSelectedText('')} 
              className="clear-selection-button"
            >
              ×
            </button>
          </div>
          <div className="selected-text-content">
            {selectedText.length > 150 ? `${selectedText.substring(0, 150)}...` : selectedText}
          </div>
        </div>
      )}
      
      <div className="pdf-canvas-container" ref={selectionContainerRef}>
        <div className="pdf-page-wrapper">
          <canvas ref={canvasRef} className="pdf-canvas" />
          <div ref={textLayerRef} className="textLayer" />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;