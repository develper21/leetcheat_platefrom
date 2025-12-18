import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Badge } from '@/components/UI/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/UI/dialog';
import { Label } from '@/components/UI/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/UI/dropdown-menu';
import { Search, Filter, Code, Trophy, Users, BookOpen, LogIn, LogOut, User, Settings, Moon, Sun, ChevronDown } from 'lucide-react';
import type { TheoryQuestion, User as UserType } from '@/types';
import { MockAuth, MockQuestionAPI } from '@/lib/mockApi';
import CodeSutraHeader from '@/components/features/layout/CodeSutraHeader';
import ProfessionalProblemCard from '@/components/features/questions/ProfessionalProblemCard';
import EnhancedFilters from '@/components/features/questions/EnhancedFilters';
import { useNavigate } from 'react-router-dom';

interface ProblemsProps {
  currentUser: UserType | null;
  setCurrentUser: (user: UserType | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Problems({
  currentUser,
  setCurrentUser,
  theme,
  toggleTheme,
}: ProblemsProps) {
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<TheoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  
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
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await MockQuestionAPI.getAllQuestions();
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

    // Update the filteredQuestions state
    setFilteredQuestions(filtered);
    
    return filtered;
  }, [questions, searchTerm, difficultyFilter, categoryFilter]);

  const filteredQuestionsData = useMemo(() => filterQuestions(), [filterQuestions]);

  const handleSolveQuestion = (questionId: string) => {
    navigate(`/question/${questionId}`);
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

  const getAllCategories = useMemo(() => {
    const categories = new Set<string>();
    questions.forEach(q => categories.add(q.category));
    return Array.from(categories);
  }, [questions]);

  // Using the filteredQuestions state variable
  const getFilteredQuestionsCount = useCallback(() => {
    return filteredQuestions.length;
  }, [filteredQuestions]);

  // Creating a memoized component to display user stats
  const UserStats = memo(({ user }: { user: UserType | null }) => {
    if (!user) return null;
    
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span>Welcome, {user.name}!</span>
        <Badge variant="secondary" className="text-xs">
          {user.role}
        </Badge>
      </div>
    );
  });

  UserStats.displayName = 'UserStats';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* CodeSutra Header */}
      <CodeSutraHeader
        currentUser={currentUser}
        onLogin={() => setShowAuthDialog(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Enhanced Filters Sidebar */}
        <aside className="w-full lg:w-80 lg:flex-shrink-0 order-2 lg:order-1">
          <div className="lg:sticky lg:top-20 p-4 space-y-6">
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

            {/* Stats Bar */}
            <Card className="bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600 text-white rounded-xl shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold">{getFilteredQuestionsCount()}</div>
                    <div className="text-xs sm:text-sm text-white/90">Total Questions</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-base sm:text-lg font-semibold text-emerald-300">
                      {filteredQuestionsData.filter(q => q.difficulty === 'Easy').length}
                    </div>
                    <div className="text-xs sm:text-sm text-white/90">Easy Questions</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-base sm:text-lg font-semibold text-amber-300">
                      {filteredQuestionsData.filter(q => q.difficulty === 'Medium').length}
                    </div>
                    <div className="text-xs sm:text-sm text-white/90">Medium Questions</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-base sm:text-lg font-semibold text-rose-300">
                      {filteredQuestionsData.filter(q => q.difficulty === 'Hard').length}
                    </div>
                    <div className="text-xs sm:text-sm text-white/90">Hard Questions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Navigation */}
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-12"
                    onClick={() => navigate('/explore')}
                  >
                    <BookOpen className="w-4 h-4" />
                    Explore
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 h-12"
                    onClick={() => navigate('/contest')}
                  >
                    <Trophy className="w-4 h-4" />
                    Contests
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 h-12"
                    onClick={() => navigate('/discuss')}
                  >
                    <Users className="w-4 h-4" />
                    Discuss
                  </Button>
                  {currentUser ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2 h-12"
                          >
                            <Code className="w-4 h-4" />
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Profile</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <p>Name: {currentUser?.name}</p>
                            <p>Email: {currentUser?.email}</p>
                            <p>Role: {currentUser?.role}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 h-12"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 h-12"
                      onClick={() => setShowAuthDialog(true)}
                    >
                      <User className="w-4 h-4" />
                      Login
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <Input
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 h-10 text-sm bg-white/20 border-white/30 text-white placeholder-white/70"
                />
              </div>
              <select className="px-3 py-2 text-sm border border-white/30 rounded-lg bg-white/20 text-white w-full sm:w-auto">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Hardest</option>
                <option>Easiest</option>
                <option>Acceptance Rate</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 order-1 lg:order-2 p-4 lg:p-6">
          {/* Mobile Filter Button */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {filteredQuestionsData.length} Questions
              </Badge>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Filter
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setDifficultyFilter('')}>
                  <span>All Difficulties</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter('Easy')}>
                  <span className="text-green-600">Easy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter('Medium')}>
                  <span className="text-yellow-600">Medium</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter('Hard')}>
                  <span className="text-red-600">Hard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategoryFilter('')}>
                  <span>All Categories</span>
                </DropdownMenuItem>
                {getAllCategories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    <span>{category}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setDifficultyFilter('');
                setCategoryFilter('');
              }}
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            {/* Display user stats using the memoized component */}
            <UserStats user={currentUser} />
          </div>

          {/* Problem Cards Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading problems...</p>
              </div>
            </div>
          ) : filteredQuestionsData.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredQuestionsData.map((question) => (
                <ProfessionalProblemCard
                  key={`problem-card-${question.id}`}
                  question={question}
                  isSolved={currentUser?.solvedQuestions.includes(question.id)}
                  onSolve={handleSolveQuestion}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {authMode === 'login' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Register
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  placeholder="Enter your name"
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {authMode === 'login' ? 'Sign In' : 'Register'}
            </Button>
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:underline"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Register" 
                  : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}