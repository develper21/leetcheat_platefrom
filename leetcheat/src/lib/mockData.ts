// Import types from centralized types folder
import type { User, TheoryQuestion, Submission } from '@/types';

// Re-export types for backward compatibility
export type { User, TheoryQuestion, Submission };

// Mock data arrays
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    solvedQuestions: ['1', '2'],
    submissions: 15
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    solvedQuestions: ['1', '2', '3', '4', '5'],
    submissions: 45
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    userId: '1',
    questionId: '1',
    problemId: '1',
    answer: 'Sample answer',
    isCorrect: true,
    score: 100,
    timestamp: new Date('2024-01-01'),
    timeTaken: 120,
    status: 'Accepted',
    language: 'python',
    runtime: 1000,
    memory: 64
  }
];

// Language templates for code editor
export const languageTemplates: Record<string, string> = {
  python: `def solution():
    # Write your solution here
    pass

if __name__ == "__main__":
    solution()`,
  javascript: `function solution() {
    // Write your solution here
}

solution();`,
  java: `public class Solution {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    // Write your solution here
    return 0;
}`
};

// Languages array for CodeEditor
export const languages = Object.keys(languageTemplates).map(lang => ({ id: lang, name: lang }));
