import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, TrendingUp, Users, ThumbsUp, BookOpen } from 'lucide-react';
import { TheoryQuestion } from '@/lib/mockData';

interface QuestionCardProps {
  question: TheoryQuestion;
  isSolved?: boolean;
  onSolve: (questionId: string) => void;
}

export default function QuestionCard({ question, isSolved = false, onSolve }: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isSolved ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                {question.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {question.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
            <span className="text-xs text-center">{getTypeIcon(question.type)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Category */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <Badge variant="outline" className="text-xs">
              {question.category}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {question.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {question.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{question.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Companies */}
          {question.companies.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{question.companies.slice(0, 2).join(', ')}</span>
              {question.companies.length > 2 && <span>+{question.companies.length - 2}</span>}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{question.acceptanceRate}%</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{question.likes.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onSolve(question.id)}
              size="sm"
              variant={isSolved ? "outline" : "default"}
            >
              {isSolved ? 'Solve Again' : 'Solve'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}