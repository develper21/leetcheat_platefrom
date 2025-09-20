import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2, Users, Code, Settings, Eye } from 'lucide-react';
import { TheoryQuestion, User } from '@/lib/mockData';
import { MockQuestionAPI } from '@/lib/mockApi';

interface AdminProps {
  currentUser: User | null;
  onBack: () => void;
}

export default function Admin({ currentUser, onBack }: AdminProps) {
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TheoryQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<TheoryQuestion>>({
    title: '',
    description: '',
    question: '',
    type: 'mcq',
    difficulty: 'Easy',
    category: '',
    correctAnswer: '',
    explanation: '',
    tags: [],
    companies: [],
    options: ['', '', '', '']
  });

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

  const handleCreateQuestion = async () => {
    try {
      const questionData: Omit<TheoryQuestion, 'id'> = {
        ...newQuestion,
        slug: newQuestion.title?.toLowerCase().replace(/\s+/g, '-') || '',
        acceptanceRate: 0,
        submissions: 0,
        likes: 0,
        dislikes: 0,
        tags: typeof newQuestion.tags === 'string' ? newQuestion.tags.split(',').map(t => t.trim()) : newQuestion.tags || [],
        companies: typeof newQuestion.companies === 'string' ? newQuestion.companies.split(',').map(c => c.trim()) : newQuestion.companies || []
      } as Omit<TheoryQuestion, 'id'>;

      await MockQuestionAPI.createQuestion(questionData);
      setShowCreateDialog(false);
      setNewQuestion({
        title: '',
        description: '',
        question: '',
        type: 'mcq',
        difficulty: 'Easy',
        category: '',
        correctAnswer: '',
        explanation: '',
        tags: [],
        companies: [],
        options: ['', '', '', '']
      });
      loadQuestions();
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    try {
      await MockQuestionAPI.updateQuestion(editingQuestion.id, editingQuestion);
      setEditingQuestion(null);
      loadQuestions();
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await MockQuestionAPI.deleteQuestion(id);
        loadQuestions();
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have permission to access this page.
          </p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Panel
                </h1>
              </div>
            </div>
            
            <Badge variant="secondary" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Admin
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-6">
            {/* Questions Management */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Questions
              </h2>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Question</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newQuestion.title || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                        placeholder="Enter question title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newQuestion.description || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                        placeholder="Enter question description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Textarea
                        id="question"
                        value={newQuestion.question || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                        placeholder="Enter the actual question"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <select
                          id="type"
                          value={newQuestion.type || 'mcq'}
                          onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value as 'mcq' | 'short_answer' | 'long_answer'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="short_answer">Short Answer</option>
                          <option value="long_answer">Long Answer</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <select
                          id="difficulty"
                          value={newQuestion.difficulty || 'Easy'}
                          onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newQuestion.category || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                        placeholder="e.g., Programming Concepts, Database"
                      />
                    </div>

                    {newQuestion.type === 'mcq' && (
                      <div>
                        <Label>Options</Label>
                        {newQuestion.options?.map((option, index) => (
                          <Input
                            key={index}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(newQuestion.options || [])];
                              newOptions[index] = e.target.value;
                              setNewQuestion({...newQuestion, options: newOptions});
                            }}
                            placeholder={`Option ${index + 1}`}
                            className="mt-2"
                          />
                        ))}
                      </div>
                    )}

                    <div>
                      <Label htmlFor="correctAnswer">Correct Answer</Label>
                      <Textarea
                        id="correctAnswer"
                        value={newQuestion.correctAnswer || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                        placeholder="Enter the correct answer"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="explanation">Explanation</Label>
                      <Textarea
                        id="explanation"
                        value={newQuestion.explanation || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                        placeholder="Enter explanation for the answer"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={Array.isArray(newQuestion.tags) ? newQuestion.tags.join(', ') : newQuestion.tags || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                        placeholder="e.g., OOP, Programming, Concepts"
                      />
                    </div>

                    <div>
                      <Label htmlFor="companies">Companies (comma-separated)</Label>
                      <Input
                        id="companies"
                        value={Array.isArray(newQuestion.companies) ? newQuestion.companies.join(', ') : newQuestion.companies || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, companies: e.target.value})}
                        placeholder="e.g., Google, Microsoft, Amazon"
                      />
                    </div>

                    <Button onClick={handleCreateQuestion} className="w-full">
                      Create Question
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {questions.map(question => (
                  <Card key={question.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {question.title}
                            </h3>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {question.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {question.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Category: {question.category}</span>
                            <span>Submissions: {question.submissions}</span>
                            <span>Acceptance: {question.acceptanceRate}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingQuestion(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Easy Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {questions.filter(q => q.difficulty === 'Easy').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Medium Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {questions.filter(q => q.difficulty === 'Medium').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Hard Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {questions.filter(q => q.difficulty === 'Hard').length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Question Dialog */}
      {editingQuestion && (
        <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingQuestion.title}
                  onChange={(e) => setEditingQuestion({...editingQuestion, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingQuestion.description}
                  onChange={(e) => setEditingQuestion({...editingQuestion, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-question">Question</Label>
                <Textarea
                  id="edit-question"
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="edit-correctAnswer">Correct Answer</Label>
                <Textarea
                  id="edit-correctAnswer"
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion({...editingQuestion, correctAnswer: e.target.value})}
                  rows={3}
                />
              </div>

              <Button onClick={handleUpdateQuestion} className="w-full">
                Update Question
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}