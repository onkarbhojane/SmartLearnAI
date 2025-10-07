import React from 'react';
import { ProgressChart } from '../../components/dashboard/ProgressChart/ProgressChart';

const sampleStats = {
  totalQuizzes: 45,
  averageScore: 82,
  studyHours: 36,
  weakAreas: ['Calculus', 'Organic Chemistry', 'Thermodynamics'],
  strongAreas: ['Algebra', 'Basic Physics', 'Inorganic Chemistry']
};

const recentQuizzes = [
  {
    id: 1,
    title: 'Physics: Thermodynamics',
    score: 92,
    date: '2023-10-05',
    type: 'MCQ',
    document: 'Physics Textbook.pdf'
  },
  {
    id: 2,
    title: 'Mathematics: Calculus',
    score: 78,
    date: '2023-10-03',
    type: 'SAQ',
    document: 'Mathematics Guide.pdf'
  },
  {
    id: 3,
    title: 'Chemistry: Periodic Table',
    score: 85,
    date: '2023-10-01',
    type: 'MCQ',
    document: 'Chemistry Notes.pdf'
  },
  {
    id: 4,
    title: 'Physics: Motion & Forces',
    score: 88,
    date: '2023-09-28',
    type: 'LAQ',
    document: 'Physics Textbook.pdf'
  }
];

export const Progress = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600">Track your performance and identify areas for improvement</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{sampleStats.totalQuizzes}</div>
          <div className="text-sm text-gray-600 mt-1">Total Quizzes</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{sampleStats.averageScore}%</div>
          <div className="text-sm text-gray-600 mt-1">Average Score</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{sampleStats.studyHours}h</div>
          <div className="text-sm text-gray-600 mt-1">Study Hours</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600">{sampleStats.weakAreas.length}</div>
          <div className="text-sm text-gray-600 mt-1">Areas to Improve</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="lg:col-span-2">
          <ProgressChart />
        </div>

        {/* Areas Analysis */}
        <div className="space-y-6">
          {/* Weak Areas */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas Needing Improvement</h3>
            <div className="space-y-3">
              {sampleStats.weakAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-red-700 font-medium">{area}</span>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Practice
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Areas */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Strong Areas</h3>
            <div className="space-y-3">
              {sampleStats.strongAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">{area}</span>
                  <span className="text-green-600 text-sm">✓ Strong</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quiz Results */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Quiz Results</h3>
        </div>
        
        <div className="overflow-hidden">
          {recentQuizzes.map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  quiz.score >= 90 ? 'bg-green-100 text-green-600' :
                  quiz.score >= 70 ? 'bg-blue-100 text-blue-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  <span className="font-bold">{quiz.score}%</span>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                  <p className="text-sm text-gray-600">
                    {quiz.type} • {quiz.document} • {quiz.date}
                  </p>
                </div>
              </div>
              
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Review
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-xl">💡</span>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Study Recommendation</h3>
            <p className="text-blue-800 mb-4">
              Based on your recent performance, we recommend focusing on Calculus and Thermodynamics. 
              These areas show the most room for improvement in your quiz scores.
            </p>
            
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Generate Focused Quiz
              </button>
              <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors">
                Study Materials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};