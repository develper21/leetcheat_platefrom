import { User, TheoryQuestion, Submission } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication Service
export class AuthService {
  private static currentUser: User | null = null;

  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(500);
    // Mock login logic - in real app, this would call an API
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        solvedQuestions: [],
        submissions: 0
      }
    ];
    
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
    
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      return this.currentUser;
    }
    return null;
  }
}

// Question Service
export class QuestionService {
  private static questions: TheoryQuestion[] = [];

  static async getAllQuestions(): Promise<TheoryQuestion[]> {
    await delay(800);
    if (this.questions.length === 0) {
      // Import questions from database
      const { comprehensiveQuestions } = await import('@/lib/questionDatabase');
      const { comprehensiveTheoryQuestions } = await import('@/lib/theoryQuestionDatabase');
      this.questions = [...comprehensiveQuestions, ...comprehensiveTheoryQuestions];
    }
    return this.questions;
  }

  static async getQuestion(id: string): Promise<TheoryQuestion | null> {
    const questions = await this.getAllQuestions();
    return questions.find(q => q.id === id) || null;
  }

  static async createQuestion(question: Omit<TheoryQuestion, 'id'>): Promise<TheoryQuestion> {
    const questions = await this.getAllQuestions();
    const newQuestion: TheoryQuestion = {
      ...question,
      id: Date.now().toString()
    };
    questions.push(newQuestion);
    return newQuestion;
  }
}

// Submission Service
export class SubmissionService {
  static async submitSolution(submission: Omit<Submission, 'id' | 'timestamp'>): Promise<Submission> {
    await delay(1000);
    const newSubmission: Submission = {
      ...submission,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    return newSubmission;
  }

  static async getUserSubmissions(userId: string): Promise<Submission[]> {
    await delay(500);
    // Mock user submissions
    return [];
  }
}