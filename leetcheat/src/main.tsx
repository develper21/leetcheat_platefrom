import { createRoot } from 'react-dom/client';
import App from './App';
import './globals.css';

// Initialize theme
if (typeof window !== 'undefined') {
  // Set initial theme class on document
  const savedTheme = localStorage.getItem('theme') || 'system';
  if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
}

createRoot(document.getElementById('root')!).render(<App />);