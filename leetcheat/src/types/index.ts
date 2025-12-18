// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'recruiter';
  solvedQuestions: string[];
  submissions: number;
}

// Question and Problem Types
export interface TheoryQuestion {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
  companies: string[];
  acceptanceRate: number;
  submissions: number;
  likes: number;
  dislikes: number;
  type: 'mcq' | 'short_answer' | 'long_answer';
  timeEstimate?: string;
}

// Submission Types
export interface Submission {
  id: string;
  userId: string;
  questionId: string;
  problemId: string;
  answer: string;
  isCorrect: boolean;
  score: number;
  timestamp: Date;
  timeTaken: number; // in seconds
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded';
  language: string;
  runtime: number; // in milliseconds
  memory: number; // in MB
}

// Filter Types
export interface FilterState {
  difficulty: string[];
  category: string[];
  tags: string[];
  companies: string[];
  status: string[];
  timeComplexity: string[];
  spaceComplexity: string[];
}


// Component Props Types
export interface ProblemCardProps {
  problem: TheoryQuestion;
  onSolve: (problemId: string) => void;
  isSolved?: boolean;
  isBookmarked?: boolean;
  onBookmark?: (problemId: string) => void;
}

export interface FilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

// Test Result Types
export interface TestResult {
  passed: boolean;
  input: string;
  output: string;
  expected: string;
  error?: string;
}
