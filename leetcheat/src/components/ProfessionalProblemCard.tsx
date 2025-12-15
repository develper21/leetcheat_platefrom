import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Button } from '@/components/UI/button';
import { CheckCircle2, Circle, TrendingUp, Users, ThumbsUp, BookOpen, Clock, Star, Eye, Zap, Target, Award, Code2, Brain, Database, Globe } from 'lucide-react';
import { TheoryQuestion } from '@/lib/mockData';

interface ProfessionalProblemCardProps {
  question: TheoryQuestion;
  isSolved?: boolean;
  isBookmarked?: boolean;
  onSolve: (questionId: string) => void;
  onBookmark?: (questionId: string) => void;
}

export default function ProfessionalProblemCard({ 
  question, 
  isSolved = false, 
  isBookmarked = false, 
  onSolve, 
  onBookmark 
}: ProfessionalProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700';
      case 'Hard': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-700';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'arrays': return <Code2 className="w-4 h-4" key={`icon-arrays-${question.id}`} />;
      case 'data structures': return <Database className="w-4 h-4" key={`icon-data-structures-${question.id}`} />;
      case 'algorithms': return <Brain className="w-4 h-4" key={`icon-algorithms-${question.id}`} />;
      case 'database': return <Database className="w-4 h-4" key={`icon-database-${question.id}`} />;
      case 'system design': return <Globe className="w-4 h-4" key={`icon-system-design-${question.id}`} />;
      case 'programming concepts': return <Code2 className="w-4 h-4" key={`icon-programming-concepts-${question.id}`} />;
      case 'networking': return <Globe className="w-4 h-4" key={`icon-networking-${question.id}`} />;
      case 'operating systems': return <Database className="w-4 h-4" key={`icon-operating-systems-${question.id}`} />;
      case 'web development': return <Globe className="w-4 h-4" key={`icon-web-development-${question.id}`} />;
      case 'machine learning': return <Brain className="w-4 h-4" key={`icon-machine-learning-${question.id}`} />;
      case 'cloud computing': return <Globe className="w-4 h-4" key={`icon-cloud-computing-${question.id}`} />;
      default: return <BookOpen className="w-4 h-4" key={`icon-default-${question.id}`} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq': return '🔘';
      case 'short_answer': return '📝';
      case 'long_answer': return '📄';
      case 'coding': return '💻';
      default: return '❓';
    }
  };

  const getAcceptanceColor = (rate: number) => {
    if (rate >= 70) return 'text-emerald-600 dark:text-emerald-400';
    if (rate >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Calculate view count once instead of generating random numbers on each render
  const viewCount = React.useMemo(() => {
    return question.likes + question.dislikes + Math.floor(Math.random() * 2000);
  }, [question.likes, question.dislikes]);

  // Calculate estimated time once instead of generating random numbers on each render
  const estimatedTime = React.useMemo(() => {
    return Math.floor(Math.random() * 45 + 5);
  }, []);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Status Icons */}
            <div className="flex flex-col items-center mt-1">
              {isSolved ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" key={`check-circle-${question.id}`} />
              ) : (
                <Circle className="w-5 h-5 text-slate-400" key={`circle-${question.id}`} />
              )}
              {isBookmarked && (
                <Star className="w-4 h-4 text-amber-500 mt-1" fill="currentColor" key={`star-${question.id}`} />
              )}
            </div>

            {/* Problem Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  #{question.id}
                </span>
                <Badge className={`text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  {getCategoryIcon(question.category)}
                  <span>{question.category}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {getTypeIcon(question.type)}
                </span>
              </div>

              <h3 className="font-semibold text-lg text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 group-hover:text-blue-600">
                {question.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                {question.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {question.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={`${tag}-${index}-${question.id}`} variant="outline" className="text-xs px-2 py-0.5 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                    {tag}
                  </Badge>
                ))}
                {question.tags.length > 3 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-0.5">
                    +{question.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 ml-3">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSolve(question.id);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 text-sm font-semibold shadow-sm"
            >
              {isSolved ? 'Revisit' : 'Solve'}
            </Button>
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(question.id);
                }}
                className="p-1.5 h-auto hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Star className={`w-4 h-4 ${isBookmarked ? 'text-amber-500 fill-current' : 'text-slate-400'}`} key={`bookmark-star-${question.id}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
          {/* Left Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" key={`trending-up-${question.id}`} />
              <span className={`font-semibold ${getAcceptanceColor(question.acceptanceRate)}`}>
                {question.acceptanceRate}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" key={`users-${question.id}`} />
              <span>{formatNumber(question.submissions)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" key={`thumbs-up-${question.id}`} />
              <span>{formatNumber(question.likes)}</span>
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" key={`eye-${question.id}`} />
              <span>{formatNumber(viewCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" key={`clock-${question.id}`} />
              <span>{estimatedTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" key={`zap-${question.id}`} />
              <span className="text-xs font-mono">
                {question.difficulty === 'Easy' ? 'O(1)' : question.difficulty === 'Medium' ? 'O(n)' : 'O(n²)'}
              </span>
            </div>
          </div>
        </div>

        {/* Company Tags */}
        <div className="flex items-center gap-2 mt-3">
          <Award className="w-3 h-3 text-slate-400" key={`award-${question.id}`} />
          <span className="text-xs text-slate-500 dark:text-slate-400">Asked at:</span>
          {question.companies.slice(0, 2).map((company, index) => (
            <Badge key={`${company}-${index}-${question.id}`} variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {company}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}