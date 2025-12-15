import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Badge } from '@/components/UI/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/UI/dialog';
import { Label } from '@/components/UI/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/UI/dropdown-menu';
import { Search, Filter, Code, Trophy, Users, BookOpen, LogIn, LogOut, User, Settings, Moon, Sun, ChevronDown } from 'lucide-react';
import { TheoryQuestion, User as UserType } from '@/lib/mockData';
import { MockAuth, MockQuestionAPI } from '@/lib/mockApi';
import CodeSutraHeader from '@/components/CodeSutraHeader';
import ProfessionalProblemCard from '@/components/ProfessionalProblemCard';
import EnhancedFilters from '@/components/EnhancedFilters';

type PageType = 'questions' | 'question' | 'dashboard' | 'admin' | 'explore' | 'contest' | 'discuss';

const isValidPage = (page: string): page is PageType => {
  return ['questions', 'question', 'dashboard', 'admin', 'explore', 'contest', 'discuss'].includes(page);
};

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
  const [currentPage, setCurrentPage] = useState<PageType>('questions');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Enhanced filters state
  const [filters, setFilters] = useState({
    difficulty: [],
    category: [],
    tags: [],
    companies: [],
    status: [],
    timeComplexity: [],
    spaceComplexity: []
  });

  useEffect(() => {
    loadQuestions();
    setCurrentUser(MockAuth.getCurrentUser());
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

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

  const filterQuestions = useCallback(() => {
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
  }, [questions, searchTerm, difficultyFilter, categoryFilter]);

  useEffect(() => {
    filterQuestions();
  }, [filterQuestions]);

  const handleSolveQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentPage('question');
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

  const getAllCategories = () => {
    const categories = new Set<string>();
    questions.forEach(q => categories.add(q.category));
    return Array.from(categories);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
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

  if (currentPage === 'explore') {
    const ExplorePage = React.lazy(() => import('./Explore'));
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ExplorePage 
          onBack={() => setCurrentPage('questions')}
          onSolveQuestion={handleSolveQuestion}
        />
      </React.Suspense>
    );
  }

  if (currentPage === 'contest') {
    const ContestPage = React.lazy(() => import('./Contest'));
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ContestPage 
          onBack={() => setCurrentPage('questions')}
        />
      </React.Suspense>
    );
  }

  if (currentPage === 'discuss') {
    const DiscussPage = React.lazy(() => import('./Discuss'));
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <DiscussPage 
          onBack={() => setCurrentPage('questions')}
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* CodeSutra Header */}
      <CodeSutraHeader
        currentUser={currentUser}
        currentPage={currentPage}
        setCurrentPage={(page: string) => setCurrentPage(page as PageType)}
        onLogin={() => setShowAuthDialog(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Enhanced Filters Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-20 p-4">
            <EnhancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setFilters({
                difficulty: [],
                category: [],
                tags: [],
                companies: [],
                status: [],
                timeComplexity: [],
                spaceComplexity: []
              })}
            />
          </div>

          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600 text-white p-6 rounded-xl shadow-xl mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{filteredQuestions.length}</div>
                <div className="text-sm text-white/90">Total Questions</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-emerald-300">
                  {filteredQuestions.filter(q => q.difficulty === 'Easy').length}
                </div>
                <div className="text-sm text-white/90">Easy</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-amber-300">
                  {filteredQuestions.filter(q => q.difficulty === 'Medium').length}
                </div>
                <div className="text-sm text-white/90">Medium</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-rose-300">
                  {filteredQuestions.filter(q => q.difficulty === 'Hard').length}
                </div>
                <div className="text-sm text-white/90">Hard</div>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <Input
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 h-10 text-sm bg-white/20 border-white/30 text-white placeholder-white/70"
                />
              </div>
              <select className="px-3 py-2 text-sm border border-white/30 rounded-lg bg-white/20 text-white">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Hardest</option>
                <option>Easiest</option>
                <option>Acceptance Rate</option>
              </select>
            </div>
          </div>

          {/* Problem Cards Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading problems...</p>
              </div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-medium mb-2">No problems found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
              <Button onClick={() => {
                setSearchTerm('');
                setFilters({
                  difficulty: [],
                  category: [],
                  tags: [],
                  companies: [],
                  status: [],
                  timeComplexity: [],
                  spaceComplexity: []
                });
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredQuestions.map((question) => (
                <ProfessionalProblemCard
                  key={`problem-card-${question.id}`}
                  question={question}
                  isSolved={currentUser?.solvedQuestions.includes(question.id)}
                  onSolve={handleSolveQuestion}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
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
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {authMode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}