import React, { useState } from 'react';
import { Button } from '../../common/UI/Button/Button';

const sampleQuiz = {
  id: '1',
  title: 'Physics: Thermodynamics Quiz',
  type: 'mcq',
  questions: [
    {
      id: 1,
      question: "What is the first law of thermodynamics?",
      options: [
        "Energy cannot be created or destroyed",
        "Heat flows from hot to cold",
        "Entropy always increases",
        "Absolute zero cannot be reached"
      ],
      correctAnswer: 0,
      explanation: "The first law of thermodynamics states that energy cannot be created or destroyed, only converted from one form to another."
    },
    {
      id: 2,
      question: "Which process occurs at constant temperature?",
      options: [
        "Adiabatic process",
        "Isothermal process",
        "Isobaric process",
        "Isochoric process"
      ],
      correctAnswer: 1,
      explanation: "An isothermal process occurs at constant temperature, while heat transfer is allowed."
    }
  ]
};

export const QuizSession = ({ quiz = sampleQuiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const currentQ = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: answerIndex
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
      onComplete?.(userAnswers);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => prev - 1);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            score >= 80 ? 'bg-green-100 text-green-600' :
            score >= 60 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
          }`}>
            <span className="text-2xl font-bold">{score}%</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600 mb-6">
            You scored {score}% on {quiz.title}
          </p>
          
          <div className="space-y-4 mb-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="text-left p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Your answer: {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-600">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-sm text-blue-600 mt-2">
                        💡 {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry Quiz
            </Button>
            <Button onClick={() => onComplete?.(userAnswers)}>
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{quiz.title}</h2>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {currentQ.question}
        </h3>
        
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`
                quiz-option p-4 rounded-lg border-2 cursor-pointer transition-all
                ${userAnswers[currentQ.id] === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                  ${userAnswers[currentQ.id] === index 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-gray-300'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-gray-900">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={userAnswers[currentQ.id] === undefined}
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};