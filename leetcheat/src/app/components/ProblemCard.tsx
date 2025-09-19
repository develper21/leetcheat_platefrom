import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, TrendingUp, Users, ThumbsUp } from 'lucide-react';
import { Problem } from '@/lib/mockData';

interface ProblemCardProps {
  problem: Problem;
  isSolved?: boolean;
  onSolve: (problemId: string) => void;
}

export default function ProblemCard({ problem, isSolved = false, onSolve }: ProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
                {problem.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {problem.description.substring(0, 100)}...
              </p>
            </div>
          </div>
          <Badge className={getDifficultyColor(problem.difficulty)}>
            {problem.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {problem.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {problem.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{problem.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Companies */}
          {problem.companies.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{problem.companies.slice(0, 2).join(', ')}</span>
              {problem.companies.length > 2 && <span>+{problem.companies.length - 2}</span>}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{problem.acceptanceRate}%</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{problem.likes.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onSolve(problem.id)}
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