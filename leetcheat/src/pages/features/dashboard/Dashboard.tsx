import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { ArrowLeft, Trophy, Clock, CheckCircle, XCircle, TrendingUp, Calendar, Code, Target, Zap, Award, BarChart3, Flame, Star } from 'lucide-react';
import { User, Submission } from '@/lib/mockData';
import { MockSubmissionAPI } from '@/lib/mockApi';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  currentUser: User | null;
  onBack?: () => void;
}

export default function Dashboard({ currentUser, onBack }: DashboardProps) {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const data = await MockSubmissionAPI.getUserSubmissions(currentUser.id);
      setSubmissions(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadSubmissions();
    }
  }, [currentUser, loadSubmissions]);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/problems');
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please sign in</h2>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Wrong Answer': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Wrong Answer': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
  const totalProblems = 150; // Mock total problems count
  const solvedCount = currentUser.solvedQuestions.length;
  const acceptanceRate = submissions.length > 0 ? Math.round((acceptedSubmissions.length / submissions.length) * 100) : 0;
  
  // Developer-focused stats
  const easySolved = currentUser.solvedQuestions.filter(id => {
    // Mock: assume first 50 problems are easy
    return parseInt(id) <= 50;
  }).length;
  const mediumSolved = currentUser.solvedQuestions.filter(id => {
    // Mock: assume 51-100 are medium
    const numId = parseInt(id);
    return numId > 50 && numId <= 100;
  }).length;
  const hardSolved = currentUser.solvedQuestions.filter(id => {
    // Mock: assume 101-150 are hard
    return parseInt(id) > 100;
  }).length;
  
  const currentStreak = 7; // Mock streak
  const longestStreak = 15; // Mock longest streak
  const totalHours = Math.floor(solvedCount * 0.5); // Mock: 30 mins per problem
  const avgTimePerProblem = submissions.length > 0 ? 
    Math.round(submissions.reduce((acc, s) => acc + (s.runtime || 0), 0) / submissions.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{solvedCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{solvedCount}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Problems Solved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{currentStreak}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Day Streak 🔥</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{acceptanceRate}%</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-orange-200 dark:border-orange-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                <div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{avgTimePerProblem}ms</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Avg. Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Developer Progress Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Difficulty Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Problem Solving by Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Easy
                      </span>
                      <span className="font-medium">{easySolved} / 50</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(easySolved / 50) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        Medium
                      </span>
                      <span className="font-medium">{mediumSolved} / 50</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(mediumSolved / 50) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        Hard
                      </span>
                      <span className="font-medium">{hardSolved} / 50</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(hardSolved / 50) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Skill Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Algorithms</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Data Structures</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Problem Solving</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>System Design</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Solved "Two Sum" problem</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">2 hours ago • 15ms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Code className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Started "Binary Search" problem</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">5 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Award className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Achieved 7-day streak! 🔥</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">1 day ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="font-medium text-sm">First Problem</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Solved your first problem</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Flame className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-medium text-sm">On Fire</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">7-day streak</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-medium text-sm">Speed Demon</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Solved in &lt;10ms</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-medium text-sm">Problem Master</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Solved 25 problems</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Problems Solved: {solvedCount} / {totalProblems}</span>
                <span>{Math.round((solvedCount / totalProblems) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(solvedCount / totalProblems) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.slice(0, 10).map(submission => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(submission.status)}
                      <div>
                        <div className="font-medium">Problem #{submission.problemId}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {submission.language} • {new Date(submission.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                      {submission.status === 'Accepted' && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {submission.runtime}ms • {submission.memory}MB
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No submissions yet. Start solving problems to see your progress here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}