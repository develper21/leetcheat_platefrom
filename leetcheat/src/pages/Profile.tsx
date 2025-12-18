import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Button } from '@/components/UI/button';
import { Progress } from '@/components/UI/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Label } from '@/components/UI/label';
import { Input } from '@/components/UI/input';
import { Flame, CheckCircle, Target, Trophy, TrendingUp, Activity, Clock, Shield, Users, Zap } from 'lucide-react';
import CodeSutraHeader from '@/components/features/layout/CodeSutraHeader';
import { MockAuth, MockQuestionAPI, MockSubmissionAPI } from '@/lib/mockApi';
import type { Submission, TheoryQuestion, User } from '@/types';

interface ProfileProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const gradientBg = 'bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600';

export default function Profile({ currentUser, setCurrentUser, theme, toggleTheme }: ProfileProps) {
  const [user, setUser] = useState<User | null>(currentUser ?? MockAuth.getCurrentUser());
  const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0, acceptance: 0 });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    setUser(currentUser ?? MockAuth.getCurrentUser());
  }, [currentUser]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const allQuestions = await MockQuestionAPI.getAllQuestions();
      const solved = allQuestions.filter(q => user.solvedQuestions.includes(q.id));
      const easy = solved.filter(q => q.difficulty === 'Easy').length;
      const medium = solved.filter(q => q.difficulty === 'Medium').length;
      const hard = solved.filter(q => q.difficulty === 'Hard').length;
      const acceptance = solved.length && user.submissions ? Math.min(100, Math.round((solved.length / user.submissions) * 100)) : 0;
      setStats({ total: solved.length, easy, medium, hard, acceptance });

      const userSubs = await MockSubmissionAPI.getUserSubmissions(user.id);
      setSubmissions(userSubs.slice(-5).reverse());
    };
    load();
  }, [user]);

  const difficultyBreakdown = useMemo(() => [
    { label: 'Easy', value: stats.easy, color: 'text-emerald-500', bar: 'bg-emerald-500' },
    { label: 'Medium', value: stats.medium, color: 'text-amber-500', bar: 'bg-amber-500' },
    { label: 'Hard', value: stats.hard, color: 'text-rose-500', bar: 'bg-rose-500' },
  ], [stats.easy, stats.medium, stats.hard]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        const result = await MockAuth.login(authForm.email, authForm.password);
        if (result) {
          setCurrentUser(result.user);
          setUser(result.user);
          setShowAuthDialog(false);
          setAuthForm({ name: '', email: '', password: '' });
        } else {
          alert('Invalid credentials. Use password: "password"');
        }
      } else {
        const result = await MockAuth.register(authForm.name, authForm.email, authForm.password);
        setCurrentUser(result.user);
        setUser(result.user);
        setShowAuthDialog(false);
        setAuthForm({ name: '', email: '', password: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    MockAuth.logout();
    setCurrentUser(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <CodeSutraHeader
        currentUser={user}
        onLogin={() => setShowAuthDialog(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card className="overflow-hidden shadow-xl border-none bg-white/70 dark:bg-slate-900/70">
          <div className={`h-32 ${gradientBg}`} />
          <CardContent className="-mt-16 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #f97316, #3b82f6)' }}>
                {user ? user.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user ? user.name : 'Guest'}</h2>
                  <Badge variant="secondary" className="text-xs">{user ? user.role : 'Visitor'}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email || 'Sign in to sync progress'}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <Shield className="w-4 h-4" /> Consistency is key • <Clock className="w-4 h-4" /> Streak-friendly
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="bg-orange-50 dark:bg-orange-900/30 border-none shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-300">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs uppercase font-semibold">Solved</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 dark:bg-emerald-900/30 border-none shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs uppercase font-semibold">Acceptance</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.acceptance}%</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-900/30 border-none shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs uppercase font-semibold">Streak</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">3 days</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 dark:bg-purple-900/30 border-none shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs uppercase font-semibold">Rank</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Top 18%</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Solved Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {difficultyBreakdown.map(item => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${item.color}`}>{item.label}</span>
                    <span className="text-slate-600 dark:text-slate-300">{item.value}</span>
                  </div>
                  <Progress value={stats.total ? (item.value / Math.max(stats.total, 1)) * 100 : 0} className="h-2" indicatorClassName={item.bar} />
                </div>
              ))}
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-orange-500" /> Focus on balance
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-emerald-500" /> Keep streak alive
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                Activity Pulse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 42 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-sm bg-orange-200/70 dark:bg-orange-500/30"
                    style={{ opacity: 0.3 + ((idx % 7) / 10) }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Recent 6 weeks activity</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Recent Submissions
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/problems')}>
              Solve more
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">No submissions yet. Start solving to see history.</div>
            ) : (
              submissions.map(sub => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Problem #{sub.problemId}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(sub.timestamp).toLocaleString()}</p>
                  </div>
                  <Badge variant={sub.isCorrect ? 'secondary' : 'outline'} className={sub.isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}>
                    {sub.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {!user && (
          <Card className="border-dashed border-2 border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sign in to sync your profile</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Save progress, track submissions, and unlock streaks.</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAuthDialog(true)} className={gradientBg + ' text-white shadow-md'}>Sign In</Button>
                <Button variant="outline" onClick={() => navigate('/problems')}>Browse Problems</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {authMode === 'login' ? 'Sign In' : 'Register'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
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
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
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
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder='Use "password" for mock login'
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
                {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
