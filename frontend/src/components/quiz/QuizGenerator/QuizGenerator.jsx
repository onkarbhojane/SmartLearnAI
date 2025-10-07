// src/components/quiz/QuizGenerator/QuizGenerator.jsx
import React, { useState } from 'react';
import { Button } from '../../common/UI/Button/Button';

const QUIZ_TYPES = [
  { id: 'mcq', name: 'Multiple Choice', icon: '🔘' },
  { id: 'saq', name: 'Short Answer', icon: '📝' },
  { id: 'laq', name: 'Long Answer', icon: '📄' }
];

export const QuizGenerator = ({ documentId, onQuizGenerated }) => {
  const [selectedType, setSelectedType] = useState('mcq');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onQuizGenerated?.({
        type: selectedType,
        count: questionCount,
        documentId
      });
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Quiz</h3>
      
      {/* Quiz Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quiz Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {QUIZ_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`
                flex items-center space-x-3 p-4 border rounded-lg text-left transition-all
                ${selectedType === type.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-2xl">{type.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{type.name}</p>
                <p className="text-sm text-gray-600">
                  {type.id === 'mcq' && 'Choose from options'}
                  {type.id === 'saq' && 'Brief written answers'}
                  {type.id === 'laq' && 'Detailed explanations'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Question Count */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Number of Questions: {questionCount}
        </label>
        <input
          type="range"
          min="3"
          max="15"
          value={questionCount}
          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>3</span>
          <span>9</span>
          <span>15</span>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateQuiz}
        loading={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? 'Generating Questions...' : 'Generate Quiz'}
      </Button>

      {/* Tips */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> The AI will generate questions based on the content 
          of your selected document. Make sure to upload relevant course material 
          for better quiz quality.
        </p>
      </div>
    </div>
  );
};