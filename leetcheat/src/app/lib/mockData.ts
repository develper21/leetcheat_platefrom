export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'recruiter';
  solvedQuestions: string[];
  submissions: number;
}

export interface TheoryQuestion {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  question: string;
  options?: string[]; // For MCQ
  correctAnswer: string;
  explanation: string;
  tags: string[];
  companies: string[];
  acceptanceRate: number;
  submissions: number;
  likes: number;
  dislikes: number;
  type: 'mcq' | 'short_answer' | 'long_answer';
}

export interface Submission {
  id: string;
  userId: string;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  score: number;
  timestamp: Date;
  timeTaken: number; // in seconds
}

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
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    solvedQuestions: ['1', '2', '3'],
    submissions: 25
  },
  {
    id: '3',
    name: 'HR Manager',
    email: 'hr@example.com',
    role: 'recruiter',
    solvedQuestions: ['1'],
    submissions: 5
  }
];

export const mockTheoryQuestions: TheoryQuestion[] = [
  {
    id: '1',
    title: 'What is Object-Oriented Programming?',
    slug: 'what-is-oop',
    difficulty: 'Easy',
    category: 'Programming Concepts',
    description: 'Understanding the fundamental concepts of Object-Oriented Programming',
    question: 'What are the four main principles of Object-Oriented Programming? Explain each briefly.',
    type: 'long_answer',
    correctAnswer: 'The four main principles of OOP are: 1) Encapsulation - bundling data and methods together, 2) Inheritance - creating new classes based on existing ones, 3) Polymorphism - ability to take multiple forms, 4) Abstraction - hiding complex implementation details',
    explanation: 'Object-Oriented Programming is based on four fundamental principles that help in creating modular, reusable, and maintainable code.',
    tags: ['OOP', 'Programming', 'Concepts'],
    companies: ['Google', 'Microsoft', 'Amazon'],
    acceptanceRate: 75.5,
    submissions: 1250,
    likes: 890,
    dislikes: 45
  },
  {
    id: '2',
    title: 'Database Normalization',
    slug: 'database-normalization',
    difficulty: 'Medium',
    category: 'Database',
    description: 'Understanding database normalization and its forms',
    question: 'What is the difference between 1NF, 2NF, and 3NF in database normalization?',
    type: 'long_answer',
    correctAnswer: '1NF: Each column contains atomic values, no repeating groups. 2NF: 1NF + no partial dependencies on composite primary keys. 3NF: 2NF + no transitive dependencies.',
    explanation: 'Database normalization is the process of organizing data to reduce redundancy and improve data integrity.',
    tags: ['Database', 'Normalization', 'SQL'],
    companies: ['Oracle', 'IBM', 'Microsoft'],
    acceptanceRate: 62.3,
    submissions: 980,
    likes: 654,
    dislikes: 89
  },
  {
    id: '3',
    title: 'Operating System Concepts',
    slug: 'os-concepts',
    difficulty: 'Medium',
    category: 'Operating Systems',
    description: 'Basic concepts of operating systems',
    question: 'What is the difference between a process and a thread?',
    type: 'mcq',
    options: [
      'Process is lightweight, thread is heavyweight',
      'Process has its own memory space, thread shares memory with other threads',
      'Process and thread are the same thing',
      'Thread can exist without a process'
    ],
    correctAnswer: 'Process has its own memory space, thread shares memory with other threads',
    explanation: 'A process is an independent program in execution with its own memory space, while threads are lightweight units within a process that share the same memory space.',
    tags: ['Operating Systems', 'Process', 'Thread'],
    companies: ['Intel', 'AMD', 'NVIDIA'],
    acceptanceRate: 68.7,
    submissions: 1456,
    likes: 1023,
    dislikes: 67
  },
  {
    id: '4',
    title: 'Network Protocols',
    slug: 'network-protocols',
    difficulty: 'Easy',
    category: 'Networking',
    description: 'Understanding basic network protocols',
    question: 'What does HTTP stand for and what is its primary purpose?',
    type: 'short_answer',
    correctAnswer: 'HyperText Transfer Protocol - used for transferring web pages and data over the internet',
    explanation: 'HTTP is the foundation of data communication on the World Wide Web, defining how messages are formatted and transmitted.',
    tags: ['Networking', 'HTTP', 'Protocols'],
    companies: ['Cisco', 'Google', 'Cloudflare'],
    acceptanceRate: 82.1,
    submissions: 2134,
    likes: 1567,
    dislikes: 23
  },
  {
    id: '5',
    title: 'Data Structures',
    slug: 'data-structures',
    difficulty: 'Hard',
    category: 'Data Structures',
    description: 'Advanced data structure concepts',
    question: 'Compare and contrast Binary Search Tree (BST) and AVL Tree. When would you use each?',
    type: 'long_answer',
    correctAnswer: 'BST: Simple implementation, O(n) worst case. AVL: Self-balancing, guaranteed O(log n) operations. Use BST for simple applications, AVL for guaranteed performance.',
    explanation: 'Both are tree data structures, but AVL trees maintain balance automatically, ensuring better worst-case performance.',
    tags: ['Data Structures', 'Trees', 'BST', 'AVL'],
    companies: ['Facebook', 'Apple', 'Netflix'],
    acceptanceRate: 45.2,
    submissions: 567,
    likes: 432,
    dislikes: 156
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    userId: '1',
    questionId: '1',
    answer: 'The four principles are encapsulation, inheritance, polymorphism, and abstraction.',
    isCorrect: true,
    score: 85,
    timestamp: new Date('2024-01-15T10:30:00Z'),
    timeTaken: 180
  }
];

export const categories = [
  'Programming Concepts',
  'Database',
  'Operating Systems',
  'Networking',
  'Data Structures',
  'Algorithms',
  'Software Engineering',
  'System Design',
  'Web Development',
  'Mobile Development'
];