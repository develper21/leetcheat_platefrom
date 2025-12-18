import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import type { User as UserType } from '@/types';
import Profile from '@/pages/Profile';
import Problems from '@/pages/Index';

// Lazy load pages
const Question = lazy(() => import('@/pages/features/questions/Question'));
const Explore = lazy(() => import('@/pages/features/explore/Explore'));
const Contest = lazy(() => import('@/pages/features/contests/Contest'));
const Discuss = lazy(() => import('@/pages/features/discuss/Discuss'));
const Dashboard = lazy(() => import('@/pages/features/dashboard/Dashboard'));
const Admin = lazy(() => import('@/pages/features/admin/Admin'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

interface RouterProps {
  currentUser: UserType | null;
  setCurrentUser: (user: UserType | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

function QuestionRoute({ currentUser }: { currentUser: UserType | null }) {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Question 
        questionId={id || ''}
        onBack={() => navigate('/problems')}
        currentUser={currentUser}
      />
    </Suspense>
  );
}

export default function Router({
  currentUser,
  setCurrentUser,
  theme,
  toggleTheme,
}: RouterProps) {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/problems" element={<Problems currentUser={currentUser} setCurrentUser={setCurrentUser} theme={theme} toggleTheme={toggleTheme} />} />
      
      <Route path="/question/:id" element={<QuestionRoute currentUser={currentUser} />} />
      
      <Route path="/explore" element={
        <Suspense fallback={<LoadingFallback />}>
          <Explore 
            onBack={() => navigate('/problems')}
            onSolveQuestion={(questionId: string) => {
              navigate(`/question/${questionId}`);
            }}
          />
        </Suspense>
      } />
      
      <Route path="/contest" element={
        <Suspense fallback={<LoadingFallback />}>
          <Contest 
            onBack={() => navigate('/problems')}
          />
        </Suspense>
      } />
      
      <Route path="/discuss" element={
        <Suspense fallback={<LoadingFallback />}>
          <Discuss 
            onBack={() => navigate('/problems')}
          />
        </Suspense>
      } />
      
      <Route path="/dashboard" element={
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard 
            currentUser={currentUser}
            onBack={() => navigate('/problems')}
          />
        </Suspense>
      } />
      
      <Route path="/admin" element={
        <Suspense fallback={<LoadingFallback />}>
          {currentUser?.role === 'admin' ? (
            <Admin 
              currentUser={currentUser}
              onBack={() => navigate('/problems')}
            />
          ) : (
            <NotFound />
          )}
        </Suspense>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
