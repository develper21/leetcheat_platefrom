import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Input } from '@/components/UI/input';
import { ArrowLeft, MessageSquare, ThumbsUp, Clock, Search, Filter, Plus, TrendingUp, Star, Users, Eye } from 'lucide-react';

interface DiscussProps {
  onBack: () => void;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  upvotes: number;
  replies: number;
  views: number;
  createdAt: Date;
  lastActivity: Date;
  isPinned: boolean;
  isLocked: boolean;
}

export default function Discuss({ onBack }: DiscussProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    // Mock discussion posts
    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'How to optimize Two Sum problem for better performance?',
        content: 'I\'m currently solving the Two Sum problem and getting O(n²) time complexity. How can I optimize it to O(n)?',
        author: 'John Doe',
        authorAvatar: 'JD',
        category: 'Algorithms',
        tags: ['two-sum', 'optimization', 'hash-table'],
        upvotes: 42,
        replies: 15,
        views: 1234,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isPinned: true,
        isLocked: false
      },
      {
        id: '2',
        title: 'Confused about React Hooks dependency array',
        content: 'Can someone explain when and why we should include dependencies in useEffect dependency array?',
        author: 'Sarah Chen',
        authorAvatar: 'SC',
        category: 'JavaScript',
        tags: ['react', 'hooks', 'useeffect'],
        upvotes: 28,
        replies: 8,
        views: 567,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isPinned: false,
        isLocked: false
      },
      {
        id: '3',
        title: 'Best resources for system design preparation?',
        content: 'What are the best resources and topics to focus on for system design interviews?',
        author: 'Mike Wilson',
        authorAvatar: 'MW',
        category: 'System Design',
        tags: ['system-design', 'interview-prep', 'resources'],
        upvotes: 67,
        replies: 23,
        views: 2345,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        lastActivity: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        isPinned: false,
        isLocked: false
      },
      {
        id: '4',
        title: 'Time complexity of binary search tree operations',
        content: 'Can someone explain the time complexity of BST operations in different scenarios?',
        author: 'Emily Zhang',
        authorAvatar: 'EZ',
        category: 'Data Structures',
        tags: ['bst', 'time-complexity', 'data-structures'],
        upvotes: 15,
        replies: 3,
        views: 234,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isPinned: false,
        isLocked: false
      },
      {
        id: '5',
        title: '[SOLVED] Dynamic programming approach for Fibonacci',
        content: 'I finally understood DP with Fibonacci! Sharing my solution and thought process.',
        author: 'Alex Kumar',
        authorAvatar: 'AK',
        category: 'Algorithms',
        tags: ['dynamic-programming', 'fibonacci', 'solved'],
        upvotes: 89,
        replies: 12,
        views: 3456,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        isPinned: false,
        isLocked: true
      }
    ];
    
    setPosts(mockPosts);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: 'All Topics', count: posts.length },
    { id: 'Algorithms', name: 'Algorithms', count: posts.filter(p => p.category === 'Algorithms').length },
    { id: 'Data Structures', name: 'Data Structures', count: posts.filter(p => p.category === 'Data Structures').length },
    { id: 'JavaScript', name: 'JavaScript', count: posts.filter(p => p.category === 'JavaScript').length },
    { id: 'System Design', name: 'System Design', count: posts.filter(p => p.category === 'System Design').length },
    { id: 'Database', name: 'Database', count: posts.filter(p => p.category === 'Database').length },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.upvotes - a.upvotes;
      case 'unanswered':
        return a.replies - b.replies;
      case 'recent':
      default:
        return b.lastActivity.getTime() - a.lastActivity.getTime();
    }
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discuss</h1>
            </div>
            
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'unanswered')}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="recent">Recent</option>
                  <option value="popular">Popular</option>
                  <option value="unanswered">Unanswered</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {sortedPosts.length} discussions
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {sortedPosts.map(post => (
                <Card key={post.id} className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Author Avatar */}
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {post.authorAvatar}
                      </div>
                      
                      {/* Post Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {post.isPinned && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              📌 Pinned
                            </Badge>
                          )}
                          {post.isLocked && (
                            <Badge variant="outline" className="text-gray-600 border-gray-600">
                              🔒 Locked
                            </Badge>
                          )}
                          <Badge variant="secondary">{post.category}</Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-gray-900 dark:text-white">{post.author}</span>
                            <span>Posted {formatTimeAgo(post.createdAt)}</span>
                            <span>Last activity {formatTimeAgo(post.lastActivity)}</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{post.upvotes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {sortedPosts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No discussions found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button>Start a Discussion</Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
