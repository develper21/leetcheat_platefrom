import { mockUsers, mockTheoryQuestions, mockSubmissions, User, TheoryQuestion, Submission } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication
export class MockAuth {
  private static currentUser: User | null = null;

  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      this.currentUser = user;
      const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }));
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(user));
      return { user, token };
    }
    return null;
  }

  static async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      solvedQuestions: [],
      submissions: 0
    };
    mockUsers.push(newUser);
    this.currentUser = newUser;
    const token = btoa(JSON.stringify({ userId: newUser.id, exp: Date.now() + 86400000 }));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(newUser));
    return { user: newUser, token };
  }

  static logout(): void {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('current_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return null;
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }
}

// Mock API for theory questions
export class MockQuestionAPI {
  static async getQuestions(filters?: {
    difficulty?: string;
    category?: string;
    tags?: string[];
    search?: string;
  }): Promise<TheoryQuestion[]> {
    await delay(300);
    let filtered = [...mockTheoryQuestions];

    if (filters?.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters?.category) {
      filtered = filtered.filter(q => q.category === filters.category);
    }

    if (filters?.tags?.length) {
      filtered = filtered.filter(q => 
        filters.tags!.some(tag => q.tags.includes(tag))
      );
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(search) ||
        q.description.toLowerCase().includes(search) ||
        q.question.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  static async getQuestion(id: string): Promise<TheoryQuestion | null> {
    await delay(200);
    return mockTheoryQuestions.find(q => q.id === id) || null;
  }

  static async createQuestion(question: Omit<TheoryQuestion, 'id'>): Promise<TheoryQuestion> {
    await delay(500);
    const newQuestion: TheoryQuestion = {
      ...question,
      id: Date.now().toString()
    };
    mockTheoryQuestions.push(newQuestion);
    return newQuestion;
  }

  static async updateQuestion(id: string, updates: Partial<TheoryQuestion>): Promise<TheoryQuestion | null> {
    await delay(500);
    const index = mockTheoryQuestions.findIndex(q => q.id === id);
    if (index === -1) return null;
    
    mockTheoryQuestions[index] = { ...mockTheoryQuestions[index], ...updates };
    return mockTheoryQuestions[index];
  }

  static async deleteQuestion(id: string): Promise<boolean> {
    await delay(300);
    const index = mockTheoryQuestions.findIndex(q => q.id === id);
    if (index === -1) return false;
    
    mockTheoryQuestions.splice(index, 1);
    return true;
  }
}

// Mock answer evaluation
export class MockAnswerEvaluator {
  static async evaluateAnswer(
    questionId: string,
    userAnswer: string
  ): Promise<{
    isCorrect: boolean;
    score: number;
    feedback: string;
    correctAnswer: string;
  }> {
    await delay(1000 + Math.random() * 2000); // Simulate evaluation time

    const question = mockTheoryQuestions.find(q => q.id === questionId);
    if (!question) {
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Question not found',
        correctAnswer: ''
      };
    }

    // Simple evaluation logic
    const userAnswerLower = userAnswer.toLowerCase().trim();
    const correctAnswerLower = question.correctAnswer.toLowerCase();

    let isCorrect = false;
    let score = 0;

    if (question.type === 'mcq') {
      isCorrect = userAnswerLower === correctAnswerLower.toLowerCase();
      score = isCorrect ? 100 : 0;
    } else {
      // For short and long answers, check for key terms
      const keyTerms = correctAnswerLower.split(/[,.\s]+/).filter(term => term.length > 3);
      const matchedTerms = keyTerms.filter(term => userAnswerLower.includes(term));
      
      const matchPercentage = (matchedTerms.length / keyTerms.length) * 100;
      score = Math.round(matchPercentage);
      isCorrect = score >= 70; // Consider correct if 70% match
    }

    let feedback = '';
    if (score >= 90) {
      feedback = 'Excellent answer! You demonstrated a thorough understanding.';
    } else if (score >= 70) {
      feedback = 'Good answer! You covered most key points.';
    } else if (score >= 50) {
      feedback = 'Partial answer. You got some points but missed important details.';
    } else {
      feedback = 'Incorrect answer. Please review the explanation and try again.';
    }

    return {
      isCorrect,
      score,
      feedback,
      correctAnswer: question.correctAnswer
    };
  }

  static async submitAnswer(
    questionId: string,
    userAnswer: string,
    timeTaken: number
  ): Promise<Submission> {
    const user = MockAuth.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const evaluation = await this.evaluateAnswer(questionId, userAnswer);
    
    const submission: Submission = {
      id: `sub-${Date.now()}`,
      userId: user.id,
      questionId,
      answer: userAnswer,
      isCorrect: evaluation.isCorrect,
      score: evaluation.score,
      timestamp: new Date(),
      timeTaken
    };

    mockSubmissions.push(submission);

    // Update user's solved questions if correct
    if (evaluation.isCorrect && !user.solvedQuestions.includes(questionId)) {
      user.solvedQuestions.push(questionId);
      user.submissions++;
      localStorage.setItem('current_user', JSON.stringify(user));
    }

    return submission;
  }
}

// Mock submission API
export class MockSubmissionAPI {
  static async getUserSubmissions(userId: string): Promise<Submission[]> {
    await delay(300);
    return mockSubmissions.filter(s => s.userId === userId);
  }

  static async getSubmission(id: string): Promise<Submission | null> {
    await delay(200);
    return mockSubmissions.find(s => s.id === id) || null;
  }
}