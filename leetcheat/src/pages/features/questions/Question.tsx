import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Badge } from '@/components/UI/badge';
import { Label } from '@/components/UI/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Send, Play, Code, FileText, MessageSquare, BarChart3 } from 'lucide-react';
import type { TheoryQuestion as ProblemType, User, Submission } from '@/types';
import { languageTemplates } from '@/lib/mockData';
import { MockQuestionAPI } from '@/lib/mockApi';
import LazyCodeEditor from '@/components/features/questions/LazyCodeEditor';
import { useNavigate } from 'react-router-dom';

interface QuestionProps {
  questionId: string;
  onBack?: () => void;
  currentUser: User | null;
}

export default function Question({ questionId, onBack, currentUser }: QuestionProps) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<ProblemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Partial<Submission> | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const loadQuestion = useCallback(async () => {
    try {
      const data = await MockQuestionAPI.getQuestion(questionId);
      setQuestion(data);
      // Set default code template based on language
      setCode(getDefaultCode(data, selectedLanguage));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load question:', error);
      setLoading(false);
    }
  }, [questionId, selectedLanguage]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const getDefaultCode = useMemo(() => (question: ProblemType, language: string) => {
    const templates = {
      javascript: `// ${question.title}
// Time Complexity: O(n)
// Space Complexity: O(1)

function solution(input) {
    // Write your code here
    return input;
}`,
      python: `# ${question.title}
# Time Complexity: O(n)
# Space Complexity: O(1)

def solution(input):
    # Write your code here
    return input`,
      java: `// ${question.title}
// Time Complexity: O(n)
// Space Complexity: O(1)

public class Solution {
    public String solution(String input) {
        // Write your code here
        return input;
    }
}`,
      cpp: `// ${question.title}
// Time Complexity: O(n)
// Space Complexity: O(1)

#include <string>
using namespace std;

class Solution {
public:
    string solution(string input) {
        // Write your code here
        return input;
    }
};`
    };
    return templates[language] || templates.javascript;
  }, []);

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput('Running code...');
    
    // Simulate code execution
    setTimeout(() => {
      const mockOutput = `Output: ${code.split('\n').length} lines processed\nTime: ${Math.random() * 100}ms\nMemory: ${Math.floor(Math.random() * 50)}MB`;
      setConsoleOutput(mockOutput);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    setConsoleOutput('Submitting solution...');
    
    // Simulate submission
    setTimeout(() => {
      const mockResult = `✅ Accepted
Time: ${Math.floor(Math.random() * 100)}ms
Memory: ${Math.floor(Math.random() * 50)}MB

Runtime Distribution:
🟢 Faster than 80% of submissions`;
      setConsoleOutput(mockResult);
      setIsRunning(false);
      setSubmitted(true);
      
      if (currentUser && !currentUser.solvedQuestions.includes(questionId)) {
        currentUser.solvedQuestions.push(questionId);
      }
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!question || !currentUser) return;

    const userAnswer = question.type === 'mcq' ? selectedOption : answer;
    if (!userAnswer.trim()) return;

    try {
      // Simulate submission since submitAnswer doesn't exist
      const submission = {
        isCorrect: userAnswer === question.correctAnswer,
        score: userAnswer === question.correctAnswer ? 100 : 0,
        feedback: userAnswer === question.correctAnswer ? 'Correct! Well done!' : 'Incorrect. Please review the explanation.'
      };

      setSubmitted(true);
      setResult(submission);

      // Mark as solved if correct
      if (submission.isCorrect && !currentUser.solvedQuestions.includes(questionId)) {
        currentUser.solvedQuestions.push(questionId);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleReset = () => {
    setAnswer('');
    setSelectedOption('');
    setSubmitted(false);
    setResult(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Question not found
          </h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* LeetCode-style Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => (onBack ? onBack() : navigate('/problems'))}
                className="flex items-center gap-2 h-8 px-3"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">List</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{question.title}</span>
                <Badge variant={question.difficulty === 'Easy' ? 'default' : question.difficulty === 'Medium' ? 'secondary' : 'destructive'} className="text-xs">
                  {question.difficulty}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{formatTime(timeSpent)}</span>
              </div>
              
              {currentUser && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {currentUser.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex">
        {/* Left Column - Problem Description */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {question.id}. {question.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  Acceptance: {question.acceptanceRate}%
                </span>
                <span>•</span>
                <span>Submissions: {question.submissions}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Difficulty: 
                  <span className={`ml-1 font-medium ${
                    question.difficulty === 'Easy' ? 'text-green-600' : 
                    question.difficulty === 'Medium' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {question.difficulty}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag, index) => (
                  <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div className="prose dark:prose-invert max-w-none">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {question.description}
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded border-l-4 border-blue-500">
                    <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                      {question.question}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Examples */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Example 1:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <Label htmlFor="example-input">Input:</Label>
                    <pre className="bg-white dark:bg-gray-800 p-2 rounded mt-1 text-sm overflow-x-auto">
                      <code>input = "sample input"</code>
                    </pre>
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="example-output">Output:</Label>
                    <pre className="bg-white dark:bg-gray-800 p-2 rounded mt-1 text-sm overflow-x-auto">
                      <code>"sample output"</code>
                    </pre>
                  </div>
                  <div>
                    <Label htmlFor="example-explanation">Explanation:</Label>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {question.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Companies */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Companies:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {question.companies.map(company => (
                      <span key={company} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                        {company}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Answer Input Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Your Answer:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-answer">Write your answer:</Label>
                      <Input
                        id="user-answer"
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleSubmit} disabled={!answer.trim()}>
                      Submit Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Column - Code Editor */}
        <div className="w-1/2">
          <div className="h-full flex flex-col">
            {/* Editor Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select value={selectedLanguage} onValueChange={(value) => {
                    setSelectedLanguage(value);
                    if (question) {
                      setCode(getDefaultCode(question, value));
                    }
                  }}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={handleRunCode}
                      disabled={isRunning}
                      size="sm"
                      className="h-8 px-3"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Run
                    </Button>
                    <Button 
                      onClick={handleSubmitCode}
                      disabled={isRunning || submitted}
                      size="sm"
                      className="h-8 px-3 bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Submit
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="console" className="w-48">
                  <TabsList className="grid w-full grid-cols-3 h-8">
                    <TabsTrigger value="console" className="text-xs">Console</TabsTrigger>
                    <TabsTrigger value="testcase" className="text-xs">Testcase</TabsTrigger>
                    <TabsTrigger value="solution" className="text-xs">Solution</TabsTrigger>
                  </TabsList>
                  <TabsContent value="console" className="mt-2">
                    <div className="text-xs text-gray-400">
                      Console output will appear here after running code
                    </div>
                  </TabsContent>
                  <TabsContent value="testcase" className="mt-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Custom Test Case</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="test-input" className="text-xs">Input:</Label>
                          <Input
                            id="test-input"
                            placeholder="Enter test input..."
                            value={testInput}
                            onChange={(e) => setTestInput(e.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="test-output" className="text-xs">Expected Output:</Label>
                          <Input
                            id="test-output"
                            placeholder="Enter expected output..."
                            value={testOutput}
                            onChange={(e) => setTestOutput(e.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <Button size="sm" className="w-full text-xs">
                          Run Test Case
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="solution" className="mt-2">
                    <div className="text-xs text-gray-400">
                      Official solution and explanations
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <LazyCodeEditor
                language={selectedLanguage}
                code={code}
                onLanguageChange={(value) => {
                  setSelectedLanguage(value);
                  if (question) {
                    setCode(getDefaultCode(question, value));
                  }
                }}
                onCodeChange={setCode}
                onRun={handleRunCode}
                onSubmit={handleSubmitCode}
                onReset={() => setCode(getDefaultCode(question!, selectedLanguage))}
                isRunning={isRunning}
                isSubmitting={submitted}
                languages={Object.keys(languageTemplates).map(lang => ({ id: lang, name: lang }))}
                languageTemplates={languageTemplates}
              />
            </div>

            {/* Console Output */}
            <div className="bg-gray-900 border-t border-gray-700">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Code className="w-4 h-4" />
                    Console Output
                  </span>
                </div>
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {consoleOutput || 'Click "Run" to test your code or "Submit" to submit your solution.'}
                </pre>
                {result && (
                  <Card className="mt-3">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        {result.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`font-medium ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {result.isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                        <span className="text-gray-400">Score: {result.score}/100</span>
                      </div>
                      {result.status && (
                        <p className="text-xs text-gray-300 mt-2">Status: {result.status}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
                <div className="mt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs text-gray-300 border-gray-700 hover:bg-gray-800"
                    onClick={() => setConsoleOutput('')}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs text-gray-300 border-gray-700 hover:bg-gray-800"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs text-red-400 border-red-700 hover:bg-red-900"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
