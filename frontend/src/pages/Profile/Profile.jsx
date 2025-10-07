import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user: currentUser, updateProfile } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Simulate API call - replace with actual userService.getUserProfile()
      const mockUserData = {
        id: '1',
        name: 'John Doe',
        email_id: 'john.doe@example.com',
        role: 'student',
        createdAt: '2023-01-15T00:00:00.000Z',
        study_materials: [
          {
            _id: '1',
            title: 'Physics Textbook - Class XI',
            description: 'Complete physics curriculum for class 11',
            pdfUrl: '/sample.pdf',
            uploadedAt: '2023-10-01T00:00:00.000Z',
            pages: 245,
            subject: 'Physics'
          },
          {
            _id: '2',
            title: 'Chemistry Notes - Organic Chemistry',
            description: 'Detailed organic chemistry notes',
            pdfUrl: '/sample.pdf',
            uploadedAt: '2023-10-05T00:00:00.000Z',
            pages: 120,
            subject: 'Chemistry'
          },
          {
            _id: '3',
            title: 'Mathematics Guide - Calculus',
            description: 'Calculus concepts and practice problems',
            pdfUrl: '/sample.pdf',
            uploadedAt: '2023-10-10T00:00:00.000Z',
            pages: 180,
            subject: 'Mathematics'
          }
        ],
        quiz_attempts: [
          {
            _id: '1',
            pdf: { title: 'Physics Textbook' },
            score: 92,
            totalQuestions: 10,
            attemptedAt: '2023-10-15T10:30:00.000Z',
            answers: [
              { question: 'What is Newton\'s first law?', isCorrect: true },
              { question: 'Define velocity', isCorrect: true }
            ]
          },
          {
            _id: '2',
            pdf: { title: 'Chemistry Notes' },
            score: 78,
            totalQuestions: 8,
            attemptedAt: '2023-10-12T14:20:00.000Z',
            answers: [
              { question: 'What is an element?', isCorrect: true },
              { question: 'Define covalent bond', isCorrect: false }
            ]
          },
          {
            _id: '3',
            pdf: { title: 'Mathematics Guide' },
            score: 85,
            totalQuestions: 12,
            attemptedAt: '2023-10-08T09:15:00.000Z',
            answers: [
              { question: 'Solve derivative of x²', isCorrect: true },
              { question: 'Define integral', isCorrect: true }
            ]
          }
        ],
        chat_sessions: [
          {
            _id: '1',
            pdf: { title: 'Physics Textbook' },
            messages: [
              { role: 'user', content: 'Explain Newton\'s laws', timestamp: '2023-10-15T10:00:00.000Z' },
              { role: 'assistant', content: 'Newton\'s laws describe...', timestamp: '2023-10-15T10:01:00.000Z' }
            ],
            createdAt: '2023-10-15T10:00:00.000Z'
          }
        ],
        progress: {
          totalQuizzes: 12,
          averageScore: 85,
          totalStudyHours: 36,
          strengths: ['Physics', 'Algebra', 'Basic Chemistry'],
          weaknesses: ['Calculus', 'Organic Chemistry', 'Thermodynamics'],
          lastActive: '2023-10-20T15:30:00.000Z'
        }
      };
      setUser(mockUserData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load user profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{user.email_id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Member since {new Date(user.createdAt).toLocaleDateString()} • {user.role}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <Link
                    to="/study"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Continue Learning
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'study-materials', label: 'Study Materials', icon: '📚' },
                { id: 'quiz-history', label: 'Quiz History', icon: '🎯' },
                { id: 'chat-sessions', label: 'AI Sessions', icon: '🤖' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab user={user} />}
            {activeTab === 'study-materials' && <StudyMaterialsTab materials={user.study_materials} />}
            {activeTab === 'quiz-history' && <QuizHistoryTab attempts={user.quiz_attempts} />}
            {activeTab === 'chat-sessions' && <ChatSessionsTab sessions={user.chat_sessions} />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ user }) => {
  const stats = [
    {
      label: 'Total Quizzes',
      value: user.progress?.totalQuizzes || 0,
      icon: '📝',
      color: 'blue'
    },
    {
      label: 'Average Score',
      value: `${user.progress?.averageScore || 0}%`,
      icon: '🎯',
      color: 'green'
    },
    {
      label: 'Study Hours',
      value: `${user.progress?.totalStudyHours || 0}h`,
      icon: '⏱️',
      color: 'purple'
    },
    {
      label: 'Documents',
      value: user.study_materials?.length || 0,
      icon: '📄',
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 dark:text-green-400 mb-3 flex items-center">
            <span className="text-lg mr-2">💪</span> Your Strengths
          </h3>
          <div className="space-y-2">
            {user.progress?.strengths?.map((strength, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-800 dark:text-green-300">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 dark:text-red-400 mb-3 flex items-center">
            <span className="text-lg mr-2">🎯</span> Areas to Improve
          </h3>
          <div className="space-y-2">
            {user.progress?.weaknesses?.map((weakness, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-800 dark:text-red-300">{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {user.quiz_attempts?.slice(0, 3).map((attempt) => (
            <div key={attempt._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">📝</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{attempt.pdf?.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(attempt.attemptedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                attempt.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                attempt.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {attempt.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Study Materials Tab Component
const StudyMaterialsTab = ({ materials }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">Your Study Materials</h3>
        <Link
          to="/documents"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Upload New
        </Link>
      </div>

      {materials && materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material, index) => (
            <motion.div
              key={material._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-3">
                <span className="text-red-600 dark:text-red-400 font-bold text-sm">PDF</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                {material.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {material.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-3">
                <span>{material.pages} pages</span>
                <span>{material.subject}</span>
              </div>
              <div className="flex space-x-2">
                <Link
                  to="/study"
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm text-center hover:bg-blue-700 transition-colors"
                >
                  Study
                </Link>
                <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Quiz
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">No Study Materials</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Upload your first PDF to start learning</p>
          <Link
            to="/documents"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Upload Document
          </Link>
        </div>
      )}
    </div>
  );
};

// Quiz History Tab Component
const QuizHistoryTab = ({ attempts }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">Quiz Attempt History</h3>
      
      {attempts && attempts.length > 0 ? (
        <div className="space-y-3">
          {attempts.map((attempt, index) => (
            <motion.div
              key={attempt._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    attempt.score >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                    attempt.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <span className={`text-lg ${
                      attempt.score >= 80 ? 'text-green-600 dark:text-green-400' :
                      attempt.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {attempt.score >= 80 ? '🎯' : attempt.score >= 60 ? '📝' : '📚'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {attempt.pdf?.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(attempt.attemptedAt).toLocaleDateString()} • {attempt.totalQuestions} questions
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Correct answers: {attempt.answers?.filter(a => a.isCorrect).length || 0}/{attempt.totalQuestions}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    attempt.score >= 80 ? 'text-green-600 dark:text-green-400' :
                    attempt.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {attempt.score}%
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                    Review
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">No Quiz History</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Take your first quiz to track your progress</p>
          <Link
            to="/study?tab=quiz"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Start Quiz
          </Link>
        </div>
      )}
    </div>
  );
};

// Chat Sessions Tab Component
const ChatSessionsTab = ({ sessions }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">AI Tutor Sessions</h3>
      
      {sessions && sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400">🤖</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {session.pdf?.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {session.messages?.length} messages
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-600/30 rounded-lg p-3">
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {session.messages?.slice(-2).map((message, msgIndex) => (
                    <div
                      key={msgIndex}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-500 text-gray-900 dark:text-white'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <Link
                  to="/study"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Continue Conversation →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">No AI Sessions</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start a conversation with your AI tutor</p>
          <Link
            to="/study"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Chat with AI Tutor
          </Link>
        </div>
      )}
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email_id,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle settings update
    console.log('Update settings:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Password Settings */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* Account Actions */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Download all your study data</div>
          </button>
          <button className="w-full text-left p-3 border border-red-200 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <div className="font-medium text-red-600 dark:text-red-400">Delete Account</div>
            <div className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;