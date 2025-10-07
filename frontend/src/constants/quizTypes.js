export const QUIZ_TYPES = {
  MCQ: {
    id: 'mcq',
    name: 'Multiple Choice Questions',
    icon: '🔘',
    description: 'Choose the correct answer from options'
  },
  SAQ: {
    id: 'saq',
    name: 'Short Answer Questions',
    icon: '📝',
    description: 'Brief written answers'
  },
  LAQ: {
    id: 'laq',
    name: 'Long Answer Questions',
    icon: '📄',
    description: 'Detailed explanations and essays'
  }
};

export const DEFAULT_QUESTIONS_COUNT = 5;
export const MAX_QUESTIONS_COUNT = 15;
export const MIN_QUESTIONS_COUNT = 3;