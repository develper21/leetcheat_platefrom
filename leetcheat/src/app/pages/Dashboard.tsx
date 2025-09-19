import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Clock, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react';
import { User, Submission } from '@/lib/mockData';
import { MockSubmissionAPI } from '@/lib/mockApi';

interface DashboardProps {
  currentUser: User | null;
  onBack: () => void;
}

export default function Dashboard({ currentUser, onBack }: DashboardProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadSubmissions();
    }
  }, [currentUser]);

  const loadSubmissions = async () => {
    if (!currentUser) return;
    
    try {
      const data = await MockSubmissionAPI.getUserSubmissions(currentUser.id);
      setSubmissions(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please sign in</h2>
          <Button onClick={onBack}>Go Back</Button>
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
  const solvedCount = currentUser.solvedProblems.length;
  const acceptanceRate = submissions.length > 0 ? Math.round((acceptedSubmissions.length / submissions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{solvedCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Solved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{acceptanceRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{submissions.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{Math.round((solvedCount / totalProblems) * 100)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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