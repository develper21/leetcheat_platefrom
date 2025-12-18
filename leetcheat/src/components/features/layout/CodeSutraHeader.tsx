import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Badge } from '@/components/UI/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/UI/dropdown-menu';
import { Search, Code, Trophy, Users, BookOpen, LogIn, LogOut, User, Settings, Moon, Sun, ChevronDown, Menu, X, Sparkles, Target, Zap, Star } from 'lucide-react';
import type { User as UserType } from '@/types';
import { CodeSutraLogo, BrandButton } from '@/branding/brandAssets';
import { brandConfig } from '@/branding/brandConstants';

interface CodeSutraHeaderProps {
  currentUser: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function CodeSutraHeader({
  currentUser,
  onLogin,
  onLogout,
  theme,
  toggleTheme,
}: CodeSutraHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = useMemo(
    () => [
      { name: 'Profile', path: '/', icon: User, fromColor: brandConfig.colors.primary.digitalBlue, toColor: brandConfig.colors.primary.growthGreen },
      { name: 'Problems', path: '/problems', icon: Code, fromColor: brandConfig.colors.primary.saffron, toColor: brandConfig.colors.primary.digitalBlue },
      { name: 'Explore', path: '/explore', icon: BookOpen, fromColor: brandConfig.colors.primary.growthGreen, toColor: brandConfig.colors.primary.digitalBlue },
      { name: 'Contest', path: '/contest', icon: Trophy, fromColor: brandConfig.colors.primary.saffron, toColor: brandConfig.colors.primary.growthGreen },
      { name: 'Discuss', path: '/discuss', icon: Users, fromColor: brandConfig.colors.primary.digitalBlue, toColor: brandConfig.colors.primary.saffron },
      { name: 'Dashboard', path: '/dashboard', icon: Star, fromColor: brandConfig.colors.primary.navy, toColor: brandConfig.colors.primary.saffron },
    ],
    []
  );

  // Add a unique key for each navigation item to prevent key conflicts
  const getUniqueKey = (item: any, index: number) => {
    return `${item.path}-${index}`;
  };

  return (
    <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-4"
              onClick={() => navigate('/')}
            >
              <CodeSutraLogo variant="primary" size="medium" />
              <div className="hidden sm:block text-left">
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  Code Sutra
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Master Coding, Sutra by Sutra</p>
              </div>
            </button>
            <div className="hidden sm:block">
              {/* spacer to maintain layout */}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map(({ path, name, icon: Icon }) => {
              const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                </button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search 12,900+ questions..."
                className="pl-10 w-64 h-9 text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            {/* Question Count Badge */}
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1 px-3 py-1">
              <Sparkles className="w-3 h-3" />
              12,900+ Questions
            </Badge>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {/* User Menu */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {currentUser.role === 'admin' ? 'Admin' : 'Developer'}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                  <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ 
                          background: `linear-gradient(135deg, ${brandConfig.colors.primary.saffron}, ${brandConfig.colors.primary.digitalBlue}, ${brandConfig.colors.primary.growthGreen})` 
                        }}
                      >
                        <span className="text-lg font-bold text-white">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{currentUser.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {currentUser.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/dashboard');
                  }} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    <span>Dashboard</span>
                    <Target className="w-4 h-4 ml-auto text-gray-400" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/');
                  }} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate('/admin');
                    }} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4 mr-3 text-gray-500" />
                      <span>Admin Panel</span>
                      <Badge className="ml-auto text-xs" style={{ backgroundColor: brandConfig.colors.primary.saffron, color: 'white' }}>PRO</Badge>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLogout();
                  }} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <BrandButton 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onLogin();
                }}
                variant="primary"
                size="medium"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </BrandButton>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-10 h-10 p-0 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-900">
            <div className="space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <button
                    key={getUniqueKey(item, index)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-xl opacity-100"
                        style={{ 
                          background: `linear-gradient(to right, ${item.fromColor}, ${item.toColor})` 
                        }}
                      ></div>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search 12,900+ questions..."
                  className="pl-10 w-full h-10 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-xl"
                />
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="mt-4 px-4">
              <Badge className="bg-gradient-to-r text-white border-none px-3 py-1 text-xs font-semibold" style={{ background: `linear-gradient(to right, ${brandConfig.colors.primary.saffron}, ${brandConfig.colors.primary.digitalBlue})` }}>
                12,900+ Questions Available
              </Badge>
            </div>

            {/* Mobile Tagline */}
            <div className="mt-4 px-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                CodeSutra: Weaving Your Coding Journey
              </p>
              <div className="flex items-center justify-center mt-2">
                <Star className="w-4 h-4 mr-2" style={{ color: brandConfig.colors.primary.saffron }} />
                <span className="text-xs text-gray-500">Indian Innovation • Global Impact</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}