import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

// Mock service for document operations (replace with actual API calls)
const documentService = {
  async uploadDocument(formData, token) {
    // Simulate API call to upload PDF
    console.log('Uploading document:', formData);
    const response = await fetch('http://localhost:5000/api/documents/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    console.log(response,"sabdclkbsadjkhb");
    return await response.json();
  },

  async getUserDocuments(token) {
    // Simulate API call to get user documents
    const response = await fetch('http://localhost:5000/api/documents/getData', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },

  async deleteDocument(documentId, token) {
    // Simulate API call to delete document
    const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  }
};

export const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { user, getTokens } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    loadUserDocuments();
  }, []);

  const loadUserDocuments = async () => {
    try {
      const { accessToken } = getTokens();
      const data = await documentService.getUserDocuments(accessToken);
      setDocuments(data.documents.study_materials || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      // Fallback to sample data if API fails
      setDocuments(sampleDocuments);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { accessToken } = getTokens();
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('title', file.name.replace('.pdf', ''));
        formData.append('description', `Uploaded ${new Date().toLocaleDateString()}`);

        const result = await documentService.uploadDocument(formData, accessToken);
        
        if (result.success) {
          setDocuments(prev => [result.document, ...prev]);
        }
      }
      
      setShowUpload(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const { accessToken } = getTokens();
      const result = await documentService.deleteDocument(documentId, accessToken);
      
      if (result.success) {
        setDocuments(prev => prev.filter(doc => doc._id !== documentId));
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const getDocumentThumbnail = (document) => {
    // In a real app, you'd generate thumbnails on the backend
    // For now, using a placeholder based on subject
    const subjectColors = {
      Physics: 'from-blue-500 to-cyan-500',
      Chemistry: 'from-purple-500 to-pink-500',
      Mathematics: 'from-green-500 to-teal-500',
      Biology: 'from-red-500 to-orange-500',
      General: 'from-gray-500 to-gray-700'
    };

    return (
      <div className={`w-full h-32 bg-gradient-to-br ${subjectColors[document.subject] || 'from-blue-500 to-purple-500'} rounded-lg flex items-center justify-center text-white relative overflow-hidden`}>
        <div className="text-center">
          <div className="text-2xl mb-1">📄</div>
          <div className="text-xs font-medium bg-black/20 px-2 py-1 rounded">
            {document.pages} pages
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Documents</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your course materials and study resources</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-black">My Documents</h1>
          <p className="text-black dark:text-black">
            {documents.length} document{documents.length !== 1 ? 's' : ''} • Continue your learning journey
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpload(true)}
          className="mt-2 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <span>📄</span>
          <span>Upload New Document</span>
        </motion.button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Document</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
                disabled={uploading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload PDF Document</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your PDF file here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => handleUploadComplete(Array.from(e.target.files))}
                className="hidden"
                id="pdf-upload"
                disabled={uploading}
              />
              <label
                htmlFor="pdf-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  'Choose Files'
                )}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Maximum file size: 50MB • Supported format: PDF
              </p>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Processing your document...
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      AI is analyzing the content for better learning experience
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documents.map((document, index) => (
          <motion.div
            key={document._id || document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
          >
            {/* Document Thumbnail */}
            {getDocumentThumbnail(document)}
            
            <div className="p-4">
              {/* Document Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {document.title || document.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Subject:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{document.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pages:</span>
                    <span className="font-medium">{document.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{document.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span className="font-medium">
                      {new Date(document.uploadedAt || document.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <span>📝</span>
                    <span>{document.quiz_attempts?.length || 0} quizzes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{document.chat_sessions?.length || 0} chats</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link
                  to={`/study/${document._id || document.id}`}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>📖</span>
                  <span>Study</span>
                </Link>
                
                <button 
                  onClick={() => handleDeleteDocument(document._id || document.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {documents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            No documents yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Upload your first PDF to start your AI-powered learning journey. Get instant explanations, generate quizzes, and track your progress.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpload(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg"
          >
            📄 Upload Your First Document
          </motion.button>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Learning',
                description: 'Get instant explanations and personalized guidance from AI tutor'
              },
              {
                icon: '🎯',
                title: 'Smart Quizzes',
                description: 'Generate adaptive quizzes based on your study material'
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                description: 'Monitor your learning journey with detailed analytics'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Sample data for fallback
const sampleDocuments = [
  {
    _id: '1',
    title: 'Physics Textbook - Class XI',
    name: 'Physics Textbook - Class XI',
    size: '2.4 MB',
    uploadedAt: '2023-09-15',
    uploadDate: '2023-09-15',
    pages: 245,
    subject: 'Physics',
    class: 'XI',
    quiz_attempts: [{}, {}],
    chat_sessions: [{}]
  },
  {
    _id: '2',
    title: 'Chemistry Notes - Organic Chemistry',
    name: 'Chemistry Notes - Organic Chemistry',
    size: '1.8 MB',
    uploadedAt: '2023-09-20',
    uploadDate: '2023-09-20',
    pages: 120,
    subject: 'Chemistry',
    class: 'XI',
    quiz_attempts: [{}],
    chat_sessions: []
  },
  {
    _id: '3',
    title: 'Mathematics Guide - Calculus',
    name: 'Mathematics Guide - Calculus',
    size: '3.1 MB',
    uploadedAt: '2023-09-25',
    uploadDate: '2023-09-25',
    pages: 180,
    subject: 'Mathematics',
    class: 'XI',
    quiz_attempts: [{}, {}, {}],
    chat_sessions: [{}]
  }
];