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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      if (!target.closest('.user-menu') && !target.closest('.user-menu-trigger')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navLinks = isAuthenticated ? [
    { href: '/app', label: 'Dashboard' },
    { href: '/docs', label: 'Docs' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/community', label: 'Community' }
  ] : [
    { href: '/about', label: 'About' },
    { href: '/docs', label: 'Documentation' },
    { href: '/community', label: 'Community' },
    { href: '/pricing', label: 'Pricing' }
  ];

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
          <Link href={isAuthenticated ? "/app" : "/"} className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold hidden sm:block">QuickBriefs.ai</span>
            <span className="text-lg font-bold sm:hidden">QB.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search (Authenticated Users) */}
            {isAuthenticated && (
              <div className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search briefs..."
                    className="pl-10 w-48 lg:w-64"
                  />
                </div>
              </div>
            )}

            {/* Mobile Search Toggle */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden touch-target"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-4 h-4" />
              </Button>
            )}

            {/* Credits Badge (Authenticated) */}
            {isAuthenticated && (
              <Badge variant="outline" className="hidden sm:flex px-3 py-1">
                <Star className="w-4 h-4 mr-2" />
                <span className="text-xs">{userCredits.used}/{userCredits.total}</span>
              </Badge>
            )}

            {/* Notifications (Authenticated) */}
            {isAuthenticated && (
              <Button variant="ghost" size="sm" className="relative touch-target">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
            )}

            {/* User Menu (Authenticated) */}
            {isAuthenticated && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="user-menu-trigger flex items-center space-x-2 touch-target"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </Button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="user-menu absolute right-0 mt-2 w-56 bg-background border rounded-lg shadow-lg py-2"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Free Plan</p>
                      </div>
                      
                      <Link href="/app" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      <Link href="/pricing" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                        <CreditCard className="w-4 h-4 mr-3" />
                        Upgrade Plan
                      </Link>
                      
                      <Link href="/app" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                        <History className="w-4 h-4 mr-3" />
                        History
                      </Link>
                      
                      <Link href="/app" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      
                      <div className="border-t mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-red-600"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth Buttons (Not Authenticated) */
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t py-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search briefs..."
                  className="pl-10 w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t mobile-menu-enter"
            >
              <div className="py-4 space-y-4">
                {/* Credits (Mobile) */}
                {isAuthenticated && (
                  <div className="px-4">
                    <Badge variant="outline" className="w-full justify-center py-2">
                      <Star className="w-4 h-4 mr-2" />
                      Credits: {userCredits.used}/{userCredits.total}
                    </Badge>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-base font-medium hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Auth Buttons (Not Authenticated) */}
                {!isAuthenticated && (
                  <div className="px-4 space-y-2 border-t pt-4">
                    <Link href="/auth/login" className="block">
                      <Button variant="outline" className="w-full touch-target">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="block">
                      <Button className="w-full touch-target">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}

                {/* User Actions (Authenticated) */}
                {isAuthenticated && (
                  <div className="px-4 space-y-2 border-t pt-4">
                    <Link href="/pricing" className="block">
                      <Button variant="outline" className="w-full justify-start touch-target">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 touch-target"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}