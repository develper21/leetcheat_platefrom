import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { ArrowLeft, BookOpen, TrendingUp, Star, Clock, Users, Filter, Search, Code, Settings, Network, GitBranch, Zap, Database } from 'lucide-react';
import { TheoryQuestion } from '@/lib/mockData';
import { MockQuestionAPI } from '@/lib/mockApi';

interface ExploreProps {
  onBack: () => void;
  onSolveQuestion: (questionId: string) => void;
}

export default function Explore({ onBack, onSolveQuestion }: ExploreProps) {
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'difficulty' | 'recent'>('popularity');

  useEffect(() => {
    loadQuestions();
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

    const categories = [
    { id: 'all', name: 'All Problems', icon: BookOpen, count: questions.length },
    { id: 'Programming Concepts', name: 'Programming Concepts', icon: Code, count: questions.filter(q => q.category === 'Programming Concepts').length },
    { id: 'Database', name: 'Database', icon: Database, count: questions.filter(q => q.category === 'Database').length },
    { id: 'Operating Systems', name: 'Operating Systems', icon: Settings, count: questions.filter(q => q.category === 'Operating Systems').length },
    { id: 'Networking', name: 'Networking', icon: Network, count: questions.filter(q => q.category === 'Networking').length },
    { id: 'Data Structures', name: 'Data Structures', icon: GitBranch, count: questions.filter(q => q.category === 'Data Structures').length },
    { id: 'Algorithms', name: 'Algorithms', icon: Zap, count: questions.filter(q => q.category === 'Algorithms').length },
  ];

  const collections = [
    {
      id: 'top-interview',
      name: 'Top Interview Questions',
      description: 'Most frequently asked questions in tech interviews',
      icon: Star,
      problemCount: 100,
      difficulty: 'Mixed',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'amazon-favorites',
      name: 'Amazon Favorites',
      description: 'Questions frequently asked at Amazon',
      icon: TrendingUp,
      problemCount: 50,
      difficulty: 'Medium',
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 'google-essentials',
      name: 'Google Essentials',
      description: 'Core questions for Google interviews',
      icon: Users,
      problemCount: 75,
      difficulty: 'Hard',
      color: 'from-green-400 to-cyan-500'
    },
    {
      id: 'quick-practice',
      name: 'Quick Practice',
      description: 'Easy problems for quick practice sessions',
      icon: Clock,
      problemCount: 30,
      difficulty: 'Easy',
      color: 'from-pink-400 to-red-500'
    }
  ];

  const filteredQuestions = questions.filter(q => 
    selectedCategory === 'all' || q.category === selectedCategory
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.submissions - a.submissions;
      case 'difficulty': {
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      case 'recent':
        return b.likes - a.likes; // Using likes as proxy for recent
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explore</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategory === category.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} problems</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Collections Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Curated Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map(collection => {
              const Icon = collection.icon;
              return (
                <Card key={collection.id} className="cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${collection.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{collection.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{collection.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{collection.problemCount} problems</span>
                      <Badge variant="secondary">{collection.difficulty}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Problems List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? 'All Problems' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'difficulty' | 'recent')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="popularity">Most Popular</option>
                <option value="difficulty">Difficulty</option>
                <option value="recent">Recent</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {sortedQuestions.slice(0, 10).map(question => (
              <Card key={question.id} className="cursor-pointer hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">#{question.id}</span>
                        <h3 
                          className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer"
                          onClick={() => onSolveQuestion(question.id)}
                        >
                          {question.title}
                        </h3>
                        <Badge variant={question.difficulty === 'Easy' ? 'default' : question.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{question.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <span>Acceptance: {question.acceptanceRate}%</span>
                        <span>{question.submissions} submissions</span>
                        <div className="flex gap-1">
                          {question.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => onSolveQuestion(question.id)}
                      className="ml-4"
                    >
                      Solve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
