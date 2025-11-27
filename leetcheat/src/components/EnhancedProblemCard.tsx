import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Button } from '@/components/UI/button';
import { CheckCircle, Circle, TrendingUp, Users, ThumbsUp, BookOpen, Clock, Star, Eye, Zap, Target } from 'lucide-react';
import { TheoryQuestion } from '@/lib/mockData';

interface EnhancedProblemCardProps {
  question: TheoryQuestion;
  isSolved?: boolean;
  isBookmarked?: boolean;
  onSolve: (questionId: string) => void;
  onBookmark?: (questionId: string) => void;
}

export default function EnhancedProblemCard({ 
  question, 
  isSolved = false, 
  isBookmarked = false, 
  onSolve, 
  onBookmark 
}: EnhancedProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq': return '🔘';
      case 'short_answer': return '📝';
      case 'long_answer': return '📄';
      default: return '❓';
    }
  };

  const getAcceptanceColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600 dark:text-green-400';
    if (rate >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Status Icon */}
            <div className="flex flex-col items-center mt-1">
              {isSolved ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              {isBookmarked && (
                <Star className="w-4 h-4 text-yellow-500 mt-1" fill="currentColor" />
              )}
            </div>

            {/* Problem Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  #{question.id}
                </span>
                <Badge className={`text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getTypeIcon(question.type)}
                </span>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 group-hover:text-blue-600">
                {question.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {question.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {question.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
                {question.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm font-medium"
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
                className="p-1.5 h-auto"
              >
                <Star className={`w-4 h-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
          {/* Left Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className={`font-medium ${getAcceptanceColor(question.acceptanceRate)}`}>
                {question.acceptanceRate}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{formatNumber(question.submissions)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{formatNumber(question.likes)}</span>
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(question.likes + question.dislikes + Math.floor(Math.random() * 1000))}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{Math.floor(Math.random() * 30 + 5)}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>{question.difficulty === 'Easy' ? 'O(1)' : question.difficulty === 'Medium' ? 'O(n)' : 'O(n²)'}</span>
            </div>
          </div>
        </div>

        {/* Company Tags */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">Asked at:</span>
          {question.companies.slice(0, 2).map((company, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {company}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
