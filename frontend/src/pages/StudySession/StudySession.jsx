import React, { useState, useEffect, useRef } from "react";
import PDFViewer from "../../components/pdf/PDFViewer/PDFViewer";
import { ChatInterface } from "../../components/chat/ChatInterface/ChatInterface";
import { QuizGenerator } from "../../components/quiz/QuizGenerator/QuizGenerator";
import { QuizSession } from "../../components/quiz/QuizSession/QuizSession";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import './StudySession.css';

const TABS = {
  CHAT: "chat",
  QUIZ: "quiz",
};

export const StudySession = () => {
  const { documentId } = useParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(TABS.CHAT);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [showTextPreview, setShowTextPreview] = useState(false);
  
  // Ref to control PDF viewer
  const pdfViewerRef = useRef(null);

  // Fetch single document from backend
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `http://localhost:5000/api/study/documents/${documentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.document) {
          setSelectedDocument(data.document);
          console.log("Fetched document:", data.document);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [documentId]);

  const handleTextSelect = async (text, pageNumber) => {
    console.log(`Text selected from page ${pageNumber}:`, text);
    setSelectedText(text);
    setSelectedPage(pageNumber);
    setShowTextPreview(true);
    
    // Auto-switch to chat tab when text is selected
    setActiveTab(TABS.CHAT);
    
    // Record text selection in backend
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://localhost:5000/api/pdf/text-selection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pdfId: documentId,
          text: text,
          pageNumber: pageNumber
        })
      });
    } catch (error) {
      console.error("Failed to record text selection:", error);
    }
  };

  const handleSendToChatbot = () => {
    if (selectedText && window.chatInterfaceRef) {
      window.chatInterfaceRef.handleTextSelection(selectedText, selectedPage);
      setShowTextPreview(false);
      setSelectedText("");
    }
  };

  const handleClearSelection = () => {
    setSelectedText("");
    setShowTextPreview(false);
  };

  const handleQuizGenerated = (quizConfig) => {
    setCurrentQuiz(quizConfig);
    setActiveTab(TABS.QUIZ);
  };

  const handleQuizComplete = (answers) => {
    console.log("Quiz completed with answers:", answers);
    setCurrentQuiz(null);
    setActiveTab(TABS.CHAT);
  };

  const handleChatSessionCreated = (sessionId) => {
    setChatSessionId(sessionId);
  };

  // Handle page navigation from chat interface
  const handlePageNavigate = (pageNumber) => {
    console.log(`Navigating to page ${pageNumber}`);
    
    // Navigate to the specified page in PDF viewer
    if (pdfViewerRef.current && pdfViewerRef.current.goToPage) {
      pdfViewerRef.current.goToPage(pageNumber);
    } else {
      // Fallback: use the PDFViewer's internal method if available
      const pdfViewer = document.querySelector('pdf-viewer');
      if (pdfViewer && pdfViewer.goToPage) {
        pdfViewer.goToPage(pageNumber);
      } else {
        // Last resort: trigger custom event
        const event = new CustomEvent('pdfNavigateToPage', { 
          detail: { pageNumber } 
        });
        window.dispatchEvent(event);
      }
    }
    
    // Optional: Highlight that we're navigating
    setSelectedPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="study-session-loading">
        <div className="loading-spinner-large"></div>
        <div className="loading-text">
          <h3>Loading your study session</h3>
          <p>Preparing your document and AI tutor...</p>
        </div>
      </div>
    );
  }

  if (!selectedDocument) {
    return (
      <div className="document-error">
        <div className="error-icon">📄</div>
        <h3>Document Not Found</h3>
        <p>The document you're looking for doesn't exist or you don't have access to it.</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="study-session">
      {/* Header */}
      <div className="study-header">
        <div className="header-content">
          <div className="header-main">
            <div className="title-section">
              <h1 className="main-title">Study Session</h1>
              <p className="subtitle">Learn with your AI tutor and interactive quizzes</p>
            </div>
            <div className="document-info">
              <div className="document-badge">
                <span className="doc-emoji">📚</span>
                <div className="doc-details">
                  <h3 className="doc-title">{selectedDocument.title}</h3>
                  <p className="doc-meta">
                    Uploaded {new Date(selectedDocument.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {selectedDocument.description && (
            <div className="document-description">
              <p>{selectedDocument.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Text Preview */}
      {showTextPreview && selectedText && (
        <div className="text-preview-overlay">
          <div className="text-preview-card">
            <div className="preview-header">
              <div className="preview-title">
                <span className="preview-icon">📑</span>
                <div>
                  <h4>Selected Text</h4>
                  <span className="page-badge">Page {selectedPage}</span>
                </div>
              </div>
              <div className="preview-actions">
                <button
                  onClick={handleSendToChatbot}
                  className="send-chat-button"
                >
                  <span>💬</span>
                  Send to AI Tutor
                </button>
                <button
                  onClick={handleClearSelection}
                  className="clear-button"
                >
                  <span>×</span>
                </button>
              </div>
            </div>
            <div className="preview-content">
              <p>{selectedText.length > 300 ? `${selectedText.substring(0, 300)}...` : selectedText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="study-layout">
        {/* PDF Viewer Section */}
        <div className="pdf-section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">📄</span>
              <h3>PDF Document</h3>
            </div>
            <div className="section-hint">
              <span className="hint-badge">💡</span>
              Select text to chat with AI tutor
            </div>
          </div>
          <div className="pdf-container">
            <PDFViewer 
              ref={pdfViewerRef}
              pdfUrl={selectedDocument.pdfUrl} 
              pdfId={documentId}
              onTextSelect={handleTextSelect}
              apiBaseUrl="http://localhost:5000"
              currentPage={selectedPage}
            />
          </div>
        </div>

        {/* Interactive Panel */}
        <div className="interactive-panel">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              onClick={() => setActiveTab(TABS.CHAT)}
              className={`tab-button ${activeTab === TABS.CHAT ? 'tab-active' : ''}`}
            >
              <span className="tab-icon">💬</span>
              <span className="tab-label">AI Tutor</span>
              {selectedText && activeTab !== TABS.CHAT && (
                <span className="notification-badge">!</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab(TABS.QUIZ)}
              className={`tab-button ${activeTab === TABS.QUIZ ? 'tab-active' : ''}`}
            >
              <span className="tab-icon">🎯</span>
              <span className="tab-label">Quiz</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === TABS.CHAT && (
              <div className="chat-tab">
                <ChatInterface 
                  documentId={documentId}
                  accessToken={localStorage.getItem('accessToken')}
                  initialText={selectedText}
                  selectedPage={selectedPage}
                  onSessionCreated={handleChatSessionCreated}
                  onPageNavigate={handlePageNavigate}
                  ref={(ref) => {
                    if (ref) window.chatInterfaceRef = ref;
                  }}
                />
              </div>
            )}

            {activeTab === TABS.QUIZ && (
              <div className="quiz-tab">
                {currentQuiz ? (
                  <QuizSession
                    quiz={currentQuiz}
                    onComplete={handleQuizComplete}
                    documentTitle={selectedDocument.title}
                  />
                ) : (
                  <QuizGenerator
                    documentId={documentId}
                    onQuizGenerated={handleQuizGenerated}
                    documentTitle={selectedDocument.title}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="actions-content">
          <div className="actions-info">
            <div className="tip-container">
              <span className="tip-icon">💡</span>
              <div>
                <strong>Pro Tip:</strong> Click on page references in AI responses to jump to that page
              </div>
            </div>
          </div>
          <div className="actions-buttons">
            <button
              onClick={() => setActiveTab(TABS.CHAT)}
              className={`action-button ${activeTab === TABS.CHAT ? 'action-active' : ''}`}
            >
              <span>💬</span>
              AI Tutor
            </button>
            <button
              onClick={() => setActiveTab(TABS.QUIZ)}
              className={`action-button ${activeTab === TABS.QUIZ ? 'action-active' : ''}`}
            >
              <span>🎯</span>
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};