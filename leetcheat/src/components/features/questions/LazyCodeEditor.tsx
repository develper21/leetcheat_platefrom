import { Suspense, lazy } from 'react';
import { Card } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Play, Send, RotateCcw } from 'lucide-react';

const Editor = lazy(() => import('@monaco-editor/react'));

interface LazyCodeEditorProps {
  language: string;
  code: string;
  onLanguageChange: (language: string) => void;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  languages: Array<{ id: string; name: string }>;
  languageTemplates: Record<string, string>;
}

export default function LazyCodeEditor({
  language,
  code,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
  languages,
  languageTemplates
}: LazyCodeEditorProps) {
  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    const template = languageTemplates[newLanguage];
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

      <div className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => onCodeChange(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </Suspense>
      </div>
    </Card>
  );
}
