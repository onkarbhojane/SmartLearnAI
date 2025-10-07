import React from 'react';

const sampleData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  scores: [65, 78, 82, 75, 88, 92],
  quizzes: [12, 15, 18, 14, 20, 22]
};

export const ProgressChart = ({ data = sampleData }) => {
  const maxScore = Math.max(...data.scores);
  const maxQuizzes = Math.max(...data.quizzes);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>Last month</option>
        </select>
      </div>

      <div className="space-y-6">
        {/* Score Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Average Scores</span>
            <span className="text-sm text-gray-500">Max: {maxScore}%</span>
          </div>
          <div className="flex items-end space-x-2 h-32">
            {data.scores.map((score, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-700"
                  style={{ height: `${(score / 100) * 80}%` }}
                />
                <span className="text-xs text-gray-600 mt-1">{data.labels[index]}</span>
                <span className="text-xs font-medium text-blue-600">{score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes Completed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Quizzes Completed</span>
            <span className="text-sm text-gray-500">Total: {data.quizzes.reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="flex items-end space-x-2 h-24">
            {data.quizzes.map((count, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all hover:from-green-600 hover:to-green-700"
                  style={{ height: `${(count / maxQuizzes) * 70}%` }}
                />
                <span className="text-xs text-gray-600 mt-1">{data.labels[index]}</span>
                <span className="text-xs font-medium text-green-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data.scores[data.scores.length - 1]}%</div>
          <div className="text-sm text-gray-600">Current Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.quizzes[data.quizzes.length - 1]}
          </div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
      </div>
    </div>
  );
};