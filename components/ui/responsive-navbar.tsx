'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  CreditCard,
  History,
  Star,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ResponsiveNavbarProps {
  isAuthenticated?: boolean;
  userCredits?: { used: number; total: number };
  notifications?: number;
}

export function ResponsiveNavbar({ 
  isAuthenticated = false, 
  userCredits = { used: 0, total: 3 },
  notifications = 0 
}: ResponsiveNavbarProps) {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
      if (!target.closest('.user-menu') && !target.closest('.user-menu-button')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      setIsUserMenuOpen(false);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      toast.info(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-xl navbar-blur"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/app" : "/"} className="flex items-center space-x-3 z-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center"
            >
              <Zap className="w-5 h-5 text-background" />
            </motion.div>
            <span className="text-xl font-bold hidden sm:block">QuickBriefs.ai</span>
            <span className="text-lg font-bold sm:hidden">QB.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link href="/about">
                  <Button variant="ghost" className="text-sm">About</Button>
                </Link>
                <Link href="/docs">
                  <Button variant="ghost" className="text-sm">Docs</Button>
                </Link>
                <Link href="/community">
                  <Button variant="ghost" className="text-sm">Community</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" className="text-sm">Pricing</Button>
                </Link>
              </>
            ) : (
              <>
                {/* Search Bar for authenticated users */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search summaries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </form>

                {/* Quick Actions */}
                <Link href="/app">
                  <Button variant="ghost" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    New Summary
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Credits Badge */}
                <Badge variant="outline" className="hidden sm:flex px-3 py-1">
                  <Star className="w-4 h-4 mr-2" />
                  {userCredits.used}/{userCredits.total} Credits
                </Badge>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>

                {/* User Menu */}
                <div className="relative user-menu">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="user-menu-button flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium max-w-32 truncate">
                      {user?.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-background border rounded-lg shadow-lg py-2"
                      >
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium">{user?.email}</p>
                          <p className="text-xs text-muted-foreground">Free Plan</p>
                        </div>
                        
                        <div className="py-1">
                          <Link href="/app" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                            <User className="w-4 h-4 mr-3" />
                            Dashboard
                          </Link>
                          <Link href="/app/history" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                            <History className="w-4 h-4 mr-3" />
                            Summary History
                          </Link>
                          <Link href="/pricing" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                            <CreditCard className="w-4 h-4 mr-3" />
                            Upgrade Plan
                          </Link>
                          <Link href="/app/settings" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                          </Link>
                        </div>

                        <div className="border-t pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden mobile-menu-button"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mobile-menu border-t bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-6 space-y-4">
                {!isAuthenticated ? (
                  <>
                    <div className="space-y-2">
                      <Link href="/about" className="block py-2 text-base font-medium">
                        About
                      </Link>
                      <Link href="/docs" className="block py-2 text-base font-medium">
                        Documentation
                      </Link>
                      <Link href="/community" className="block py-2 text-base font-medium">
                        Community
                      </Link>
                      <Link href="/pricing" className="block py-2 text-base font-medium">
                        Pricing
                      </Link>
                    </div>
                    
                    <div className="pt-4 border-t space-y-2">
                      <Link href="/auth/login" className="block">
                        <Button variant="outline" className="w-full">Sign In</Button>
                      </Link>
                      <Link href="/auth/signup" className="block">
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search summaries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </form>

                    {/* Credits Display */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Daily Credits</span>
                      <Badge variant="outline">
                        {userCredits.used}/{userCredits.total}
                      </Badge>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <Link href="/app" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <Zap className="w-4 h-4 mr-3" />
                          New Summary
                        </Button>
                      </Link>
                      <Link href="/app/history" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <History className="w-4 h-4 mr-3" />
                          Summary History
                        </Button>
                      </Link>
                      <Link href="/pricing" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <CreditCard className="w-4 h-4 mr-3" />
                          Upgrade Plan
                        </Button>
                      </Link>
                    </div>

                    <div className="pt-4 border-t">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}