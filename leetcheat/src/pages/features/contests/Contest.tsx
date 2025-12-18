import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { ArrowLeft, Trophy, Clock, Users, Calendar, Target, Award, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContestProps {
  onBack?: () => void;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  participants: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prize: string;
  status: 'upcoming' | 'live' | 'ended';
  problems: number;
  maxRankings: number;
}

export default function Contest({ onBack }: ContestProps) {
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    // Mock contest data
    const mockContests: Contest[] = [
      {
        id: '1',
        title: 'Weekly Coding Challenge',
        description: 'Test your skills with our weekly coding competition. 3 problems, 90 minutes!',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        duration: 90,
        participants: 1234,
        difficulty: 'Medium',
        prize: 'LeetCode Premium 1 Month',
        status: 'upcoming',
        problems: 3,
        maxRankings: 100
      },
      {
        id: '2',
        title: 'Bi-Weekly Contest 101',
        description: 'Solve complex algorithmic problems in this 2-hour competition.',
        startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        duration: 120,
        participants: 2567,
        difficulty: 'Hard',
        prize: '$100 Amazon Gift Card',
        status: 'live',
        problems: 4,
        maxRankings: 500
      },
      {
        id: '3',
        title: 'Beginner Friendly Contest',
        description: 'Perfect for beginners! Easy problems to build your confidence.',
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 3 days ago + 1 hour
        duration: 60,
        participants: 892,
        difficulty: 'Easy',
        prize: 'Certificate of Achievement',
        status: 'ended',
        problems: 2,
        maxRankings: 50
      },
      {
        id: '4',
        title: 'Google Mock Interview',
        description: 'Simulate Google interview experience with real-world problems.',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 1 week + 2 hours
        duration: 120,
        participants: 456,
        difficulty: 'Hard',
        prize: 'Google Swag Pack',
        status: 'upcoming',
        problems: 5,
        maxRankings: 25
      }
    ];
    
    setContests(mockContests);
    setLoading(false);
  };

  const filteredContests = contests.filter(contest => {
    if (selectedTab === 'all') return true;
    return contest.status === selectedTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ended': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/problems');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contest</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Contest Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {contests.filter(c => c.status === 'live').length}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Live Contests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {contests.filter(c => c.status === 'upcoming').length}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Upcoming</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {contests.reduce((sum, c) => sum + c.participants, 0)}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Total Participants</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                <div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {contests.reduce((sum, c) => sum + c.problems, 0)}
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Total Problems</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contest Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          {(['all', 'upcoming', 'live', 'ended'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                selectedTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'all' && ` (${contests.length})`}
              {tab === 'upcoming' && ` (${contests.filter(c => c.status === 'upcoming').length})`}
              {tab === 'live' && ` (${contests.filter(c => c.status === 'live').length})`}
              {tab === 'ended' && ` (${contests.filter(c => c.status === 'ended').length})`}
            </button>
          ))}
        </div>

        {/* Contest List */}
        <div className="space-y-6">
          {filteredContests.map(contest => (
            <Card key={contest.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{contest.title}</h3>
                      <Badge className={getStatusColor(contest.status)}>
                        {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                      </Badge>
                      <Badge className={getDifficultyColor(contest.difficulty)}>
                        {contest.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{contest.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{contest.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{contest.problems} problems</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{contest.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span>{contest.prize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {contest.status === 'live' ? 'LIVE NOW!' : formatTimeRemaining(contest.endTime)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {contest.status === 'live' ? 'Ends in:' : 'Starts in:'}
                      </div>
                    </div>
                    
                    <Button 
                      size="lg"
                      className={contest.status === 'live' ? 'bg-red-600 hover:bg-red-700 animate-pulse' : ''}
                    >
                      {contest.status === 'live' ? 'Join Contest' : 
                       contest.status === 'upcoming' ? 'Register' : 'View Results'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Performers */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5" />
              Top Performers This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { rank: 1, name: 'Alice Chen', score: 2847, contests: 12, badge: '🥇' },
                { rank: 2, name: 'Bob Smith', score: 2734, contests: 11, badge: '🥈' },
                { rank: 3, name: 'Carol Wang', score: 2656, contests: 10, badge: '🥉' },
                { rank: 4, name: 'David Lee', score: 2543, contests: 9, badge: '' },
                { rank: 5, name: 'Emma Davis', score: 2489, contests: 8, badge: '' },
              ].map(performer => (
                <div key={performer.rank} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{performer.badge}</span>
                    <span className="font-medium text-gray-900 dark:text-white">#{performer.rank}</span>
                    <span className="text-gray-900 dark:text-white">{performer.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-medium text-blue-600 dark:text-blue-400">{performer.score} pts</span>
                    <span className="text-gray-600 dark:text-gray-400">{performer.contests} contests</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
