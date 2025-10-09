import React from 'react';
import { motion } from 'framer-motion';

export const ProgressChart = ({ 
  totalQuizzes, 
  averageScore, 
  weakAreasCount, 
  studyHours,
  monthlyProgress = [] 
}) => {
  
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getProgressBg = (percentage) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getProgressWidth = (value, max) => {
    return Math.min((value / max) * 100, 100);
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="text-2xl font-bold text-blue-600">{totalQuizzes}</div>
          <div className="text-sm text-blue-600 font-medium">Total Quizzes</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="text-2xl font-bold text-green-600">{averageScore}%</div>
          <div className="text-sm text-green-600 font-medium">Average Score</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800"
        >
          <div className="text-2xl font-bold text-purple-600">{studyHours}h</div>
          <div className="text-sm text-purple-600 font-medium">Study Hours</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800"
        >
          <div className="text-2xl font-bold text-orange-600">{weakAreasCount}</div>
          <div className="text-sm text-orange-600 font-medium">Areas to Improve</div>
        </motion.div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Completion</span>
            <span className="text-sm font-bold text-blue-600">{totalQuizzes} quizzes</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getProgressWidth(totalQuizzes, 50)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-blue-500 h-3 rounded-full"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Score</span>
            <span className={`text-sm font-bold ${getProgressColor(averageScore)}`}>{averageScore}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${averageScore}%` }}
              transition={{ duration: 1, delay: 0.7 }}
              className={`h-3 rounded-full ${getProgressBg(averageScore)}`}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Consistency</span>
            <span className="text-sm font-bold text-purple-600">{studyHours}h</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getProgressWidth(studyHours, 20)}%` }}
              transition={{ duration: 1, delay: 0.9 }}
              className="bg-purple-500 h-3 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Monthly Progress Mini View */}
      {monthlyProgress.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Monthly Trend</h4>
          <div className="flex items-end justify-between space-x-1 h-16">
            {monthlyProgress.slice(0, 6).map((month, index) => (
              <motion.div
                key={month.month}
                initial={{ height: 0 }}
                animate={{ height: `${(month.averageScore / 100) * 40}px` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex-1 rounded-t-lg ${
                  month.averageScore >= 80 ? 'bg-emerald-500' :
                  month.averageScore >= 60 ? 'bg-blue-500' :
                  month.averageScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                title={`${month.month}: ${month.averageScore}%`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};