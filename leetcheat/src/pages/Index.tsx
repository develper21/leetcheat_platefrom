import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Filter, Code, Trophy, Users, BookOpen, LogIn, LogOut, User, Settings } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import { TheoryQuestion, User as UserType } from '@/lib/mockData';
import { MockAuth, MockQuestionAPI } from '@/lib/mockApi';

export default function Index() {
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<TheoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [currentPage, setCurrentPage] = useState<'questions' | 'question' | 'dashboard' | 'admin'>('questions');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

  useEffect(() => {
    loadQuestions();
    setCurrentUser(MockAuth.getCurrentUser());
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, difficultyFilter, categoryFilter]);

  const loadQuestions = async () => {
    try {
      const data = await MockQuestionAPI.getQuestions();
      setQuestions(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter) {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(q => q.category === categoryFilter);
    }

    setFilteredQuestions(filtered);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        const result = await MockAuth.login(authForm.email, authForm.password);
        if (result) {
          setCurrentUser(result.user);
          setShowAuthDialog(false);
          setAuthForm({ name: '', email: '', password: '' });
        } else {
          alert('Invalid credentials. Use password: "password"');
        }
      } else {
        const result = await MockAuth.register(authForm.name, authForm.email, authForm.password);
        setCurrentUser(result.user);
        setShowAuthDialog(false);
        setAuthForm({ name: '', email: '', password: '' });
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleLogout = () => {
    MockAuth.logout();
    setCurrentUser(null);
  };

  const handleSolveQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentPage('question');
  };

  const getAllCategories = () => {
    const categories = new Set<string>();
    questions.forEach(q => categories.add(q.category));
    return Array.from(categories);
  };

  if (currentPage === 'question') {
    // Dynamically import and render Question component
    const QuestionPage = React.lazy(() => import('./Question'));
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <QuestionPage 
          questionId={selectedQuestionId} 
          onBack={() => setCurrentPage('questions')}
          currentUser={currentUser}
        />
      </React.Suspense>
    );
  }

  if (currentPage === 'dashboard') {
    const DashboardPage = React.lazy(() => import('./Dashboard'));
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <DashboardPage 
          currentUser={currentUser}
          onBack={() => setCurrentPage('questions')}
        />
      </React.Suspense>
    );
  }

  if (currentPage === 'admin' && currentUser?.role === 'admin') {
    const AdminPage = React.lazy(() => import('./Admin'));
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <AdminPage 
          currentUser={currentUser}
          onBack={() => setCurrentPage('questions')}
        />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                InterviewPlate
              </h1>
            </div>

            <nav className="flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentPage('questions')}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Questions
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentPage('dashboard')}
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>

                  {currentUser.role === 'admin' && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentPage('admin')}
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </Button>
                  )}

                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{currentUser.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {currentUser.role}
                    </Badge>
                  </div>

                  <Button variant="ghost" onClick={handleLogout} size="sm">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Sign In' : 'Create Account'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAuth} className="space-y-4">
                      {authMode === 'register' && (
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={authForm.name}
                            onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                            required
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={authForm.email}
                          onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                          placeholder="Try: john@example.com or admin@example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={authForm.password}
                          onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                          placeholder="Use: password"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {authMode === 'login' ? 'Sign In' : 'Create Account'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      >
                        {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Master Theory Interviews
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Practice with real theoretical questions from top tech companies
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>{questions.length} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>Multiple Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-green-500" />
              <span>Real-time Evaluation</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="">All Categories</option>
                {getAllCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {(searchTerm || difficultyFilter || categoryFilter) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setDifficultyFilter('');
                    setCategoryFilter('');
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                isSolved={currentUser?.solvedQuestions.includes(question.id) || false}
                onSolve={handleSolveQuestion}
              />
            ))}
          </div>
        )}

        {filteredQuestions.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No questions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}