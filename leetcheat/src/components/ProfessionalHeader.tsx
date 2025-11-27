import React, { useState } from 'react';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Badge } from '@/components/UI/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/UI/dropdown-menu';
import { Search, Code, Trophy, Users, BookOpen, LogIn, LogOut, User, Settings, Moon, Sun, ChevronDown, Menu, X, Sparkles, Target, Zap } from 'lucide-react';
import { User as UserType } from '@/lib/mockData';

interface ProfessionalHeaderProps {
  currentUser: UserType | null;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function ProfessionalHeader({ 
  currentUser, 
  currentPage, 
  setCurrentPage, 
  onLogin, 
  onLogout, 
  theme, 
  toggleTheme 
}: ProfessionalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Problems', value: 'questions', icon: Code, color: 'from-blue-500 to-indigo-600' },
    { name: 'Explore', value: 'explore', icon: BookOpen, color: 'from-emerald-500 to-teal-600' },
    { name: 'Contest', value: 'contest', icon: Trophy, color: 'from-amber-500 to-orange-600' },
    { name: 'Discuss', value: 'discuss', icon: Users, color: 'from-purple-500 to-pink-600' },
    { name: 'Dashboard', value: 'dashboard', icon: User, color: 'from-rose-500 to-red-600' },
  ];

  return (
    <header className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center mr-8">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  InterviewPlate
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">World-Class Platform</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setCurrentPage(item.value)}
                    className={`group relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-100`}></div>
                    )}
                    <div className="relative flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                      {isActive && (
                        <Zap className="w-3 h-3 ml-1 text-yellow-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search 8000+ questions..."
                  className="pl-10 w-80 h-10 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Stats Badge */}
            <div className="hidden sm:block">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none px-3 py-1 text-xs font-semibold">
                8000+ Questions
              </Badge>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              ) : (
                <Sun className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              )}
            </Button>

            {/* User Section */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-10 px-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {currentUser.role === 'admin' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900"></div>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {currentUser.role === 'admin' ? 'Admin' : 'Developer'}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-xl">
                  <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{currentUser.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{currentUser.email}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {currentUser.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentPage('dashboard')} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                    <User className="w-4 h-4 mr-3 text-slate-500" />
                    <span>Dashboard</span>
                    <Target className="w-4 h-4 ml-auto text-slate-400" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Settings className="w-4 h-4 mr-3 text-slate-500" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem onClick={() => setCurrentPage('admin')} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Settings className="w-4 h-4 mr-3 text-slate-500" />
                      <span>Admin Panel</span>
                      <Badge className="ml-auto text-xs bg-amber-100 text-amber-700">PRO</Badge>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={onLogin}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm h-10 px-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-10 h-10 p-0 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              ) : (
                <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 bg-white dark:bg-slate-900">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      setCurrentPage(item.value);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-100`}></div>
                    )}
                    <div className="relative flex items-center">
                      <Icon className="w-4 h-4 mr-3" />
                      {item.name}
                      {isActive && (
                        <Zap className="w-3 h-3 ml-2 text-yellow-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Search */}
            <div className="mt-4 px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search 8000+ questions..."
                  className="pl-10 w-full h-10 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 rounded-xl"
                />
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="mt-4 px-4">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none px-3 py-1 text-xs font-semibold">
                8000+ Questions Available
              </Badge>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
