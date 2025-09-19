import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, HardDrive, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import { Problem as ProblemType, User, Submission, languageTemplates } from '@/lib/mockData';
import { MockProblemAPI, MockCodeRunner } from '@/lib/mockApi';

interface ProblemPageProps {
  problemId: string;
  onBack: () => void;
  currentUser: User | null;
}

interface TestResult {
  passed: boolean;
  input: string;
  output: string;
  expected: string;
  error?: string;
}

export default function Problem({ problemId, onBack, currentUser }: ProblemPageProps) {
  const [problem, setProblem] = useState<ProblemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState<TestResult[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    loadProblem();
  }, [problemId]);

  useEffect(() => {
    // Set initial code template when language changes
    const template = languageTemplates[selectedLanguage as keyof typeof languageTemplates];
    if (template && !code) {
      setCode(template);
    }
  }, [selectedLanguage]);

  const loadProblem = async () => {
    try {
      const data = await MockProblemAPI.getProblem(problemId);
      setProblem(data);
      setLoading(false);
      
      // Set initial code template
      const template = languageTemplates[selectedLanguage as keyof typeof languageTemplates];
      if (template) {
        setCode(template);
      }
    } catch (error) {
      console.error('Failed to load problem:', error);
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!problem || !currentUser) return;
    
    setIsRunning(true);
    setActiveTab('results');
    
    try {
      const result = await MockCodeRunner.runCode(problemId, selectedLanguage, code);
      setRunResults(result.results);
    } catch (error) {
      console.error('Run failed:', error);
      setRunResults([{
        passed: false,
        input: '',
        output: '',
        expected: '',
        error: 'Failed to run code'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !currentUser) return;
    
    setIsSubmitting(true);
    setActiveTab('results');
    
    try {
      const result = await MockCodeRunner.submitSolution(problemId, selectedLanguage, code);
      setSubmission(result);
      setRunResults(result.testResults);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const template = languageTemplates[selectedLanguage as keyof typeof languageTemplates];
    if (template) {
      setCode(template);
    }
    setRunResults([]);
    setSubmission(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Wrong Answer': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Runtime Error': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'Time Limit Exceeded': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Problem not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please sign in to solve problems</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{problem.title}</h1>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {submission && (
              <div className="flex items-center gap-2">
                {getStatusIcon(submission.status)}
                <span className="font-medium">{submission.status}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                {/* Problem Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Problem Description</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{problem.description}</p>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Examples</h3>
                  {problem.examples.map((example, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div>
                            <strong>Input:</strong> <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{example.input}</code>
                          </div>
                          <div>
                            <strong>Output:</strong> <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{example.output}</code>
                          </div>
                          {example.explanation && (
                            <div>
                              <strong>Explanation:</strong> {example.explanation}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index} className="text-sm">{constraint}</li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Companies */}
                {problem.companies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Companies</h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.companies.map(company => (
                        <Badge key={company} variant="outline">{company}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results" className="flex-1 overflow-auto p-6">
              <div className="space-y-4">
                {submission && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(submission.status)}
                        Submission Result: {submission.status}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Runtime: {submission.runtime}ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4" />
                          <span>Memory: {submission.memory}MB</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {runResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Test Results</h3>
                    <div className="space-y-3">
                      {runResults.map((result, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              {result.passed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <span className="font-medium">
                                Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Input:</strong>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                                  {result.input}
                                </pre>
                              </div>
                              
                              <div>
                                <strong>Expected:</strong>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                                  {result.expected}
                                </pre>
                              </div>
                              
                              <div>
                                <strong>Your Output:</strong>
                                <pre className={`p-2 rounded mt-1 overflow-x-auto ${
                                  result.passed 
                                    ? 'bg-green-50 dark:bg-green-900/20' 
                                    : 'bg-red-50 dark:bg-red-900/20'
                                }`}>
                                  {result.output}
                                </pre>
                              </div>

                              {result.error && (
                                <div>
                                  <strong>Error:</strong>
                                  <pre className="bg-red-50 dark:bg-red-900/20 p-2 rounded mt-1 overflow-x-auto text-red-700 dark:text-red-300">
                                    {result.error}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {runResults.length === 0 && !isRunning && !isSubmitting && (
                  <div className="text-center py-8 text-gray-500">
                    <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Run your code to see test results here</p>
                  </div>
                )}

                {(isRunning || isSubmitting) && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">
                      {isRunning ? 'Running tests...' : 'Submitting solution...'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 p-4">
            <CodeEditor
              language={selectedLanguage}
              code={code}
              onLanguageChange={setSelectedLanguage}
              onCodeChange={setCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}