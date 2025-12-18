import { useEffect, useState } from 'react';
import { Toaster } from '@/components/UI/sonner';
import { TooltipProvider } from '@/components/UI/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import Router from '@/components/features/layout/Router';
import { MockAuth } from '@/lib/mockApi';
import type { User } from '@/types';

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedUser = MockAuth.getCurrentUser();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | null) || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Router
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;