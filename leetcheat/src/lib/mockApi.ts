import type { User, TheoryQuestion, Submission } from '@/types';
import { mockUsers, mockSubmissions } from './mockData';
import { comprehensiveQuestions } from './questionDatabase';
import { comprehensiveTheoryQuestions } from './theoryQuestionDatabase';

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

// Mock Question API
export class MockQuestionAPI {
  private static questions: TheoryQuestion[] | null = null;

  static async getAllQuestions(): Promise<TheoryQuestion[]> {
    await delay(800);
    if (!this.questions) {
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

  static async updateQuestion(id: string, question: Partial<TheoryQuestion>): Promise<TheoryQuestion | null> {
    const questions = await this.getAllQuestions();
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...question };
      return questions[index];
    }
    return null;
  }

  static async deleteQuestion(id: string): Promise<boolean> {
    const questions = await this.getAllQuestions();
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Mock Submission API
export class MockSubmissionAPI {
  private static submissions: Submission[] = mockSubmissions;

  static async submitSolution(submission: Omit<Submission, 'id' | 'timestamp'>): Promise<Submission> {
    await delay(1000);
    const newSubmission: Submission = {
      ...submission,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    this.submissions.push(newSubmission);
    return newSubmission;
  }

  static async getUserSubmissions(userId: string): Promise<Submission[]> {
    await delay(500);
    return this.submissions.filter(submission => submission.userId === userId);
  }
}
