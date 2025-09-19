import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Send, RotateCcw } from 'lucide-react';
import { languages, languageTemplates } from '@/lib/mockData';

interface CodeEditorProps {
  language: string;
  code: string;
  onLanguageChange: (language: string) => void;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

export default function CodeEditor({
  language,
  code,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false
}: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // In a real implementation, this would initialize Monaco Editor
    // For now, we'll use a textarea with syntax highlighting simulation
    if (editorRef.current) {
      editorRef.current.style.fontFamily = 'Monaco, Menlo, "Ubuntu Mono", monospace';
      editorRef.current.style.fontSize = '14px';
      editorRef.current.style.lineHeight = '1.5';
    }
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    // Set template code for the new language
    const template = languageTemplates[newLanguage as keyof typeof languageTemplates];
    if (template) {
      onCodeChange(template);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
          
          <Button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full resize-none border-0 outline-none bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
          placeholder="Write your code here..."
          spellCheck={false}
        />
      </div>

      <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
        <p>💡 Tips: Use Ctrl+/ to comment/uncomment lines. Press Ctrl+Enter to run code.</p>
      </div>
    </Card>
  );
}