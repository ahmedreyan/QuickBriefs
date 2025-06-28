'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Menu, 
  X, 
  User, 
  Bell, 
  Search, 
  LogOut,
  Settings,
  CreditCard,
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/docs', label: 'Documentation' },
    { href: '/community', label: 'Community' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b shadow-sm' 
          : 'bg-background/80 backdrop-blur-md border-b'
      }`}
      style={{ maxHeight: '80px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold hidden sm:block">QuickBriefs.ai</span>
              <span className="text-lg font-bold sm:hidden">QB.ai</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {/* Search Bar */}
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search briefs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 text-sm border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Search briefs"
                  />
                </div>

                {/* Quick Actions */}
                <Link href="/app">
                  <Button size="sm" variant="ghost" className="hidden lg:flex">
                    Dashboard
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                {/* Credits Badge */}
                <Badge variant="outline" className="px-3 py-1 hidden sm:flex">
                  <Star className="w-4 h-4 mr-2" />
                  {userCredits.used}/{userCredits.total}
                </Badge>

                {/* Notifications */}
                <div className="relative">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-4 h-4" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </Button>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2"
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
                        className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2"
                      >
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium truncate">{user?.email}</p>
                          <p className="text-xs text-muted-foreground">Free Plan</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link href="/pricing" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                          <CreditCard className="w-4 h-4 mr-3" />
                          Upgrade
                        </Link>
                        <Link href="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-red-600"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
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
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                {isAuthenticated && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search briefs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Search briefs"
                    />
                  </div>
                )}

                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {!isAuthenticated ? (
                    <>
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="pt-4 space-y-2">
                        <Link href="/auth/login" className="block">
                          <Button variant="ghost" className="w-full justify-start">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth/signup" className="block">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/app" className="block">
                        <Button variant="ghost" className="w-full justify-start">
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/pricing" className="block">
                        <Button variant="ghost" className="w-full justify-start">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Upgrade Plan
                        </Button>
                      </Link>
                      <div className="pt-2 border-t border-border">
                        <Button
                          variant="ghost"
                          onClick={handleSignOut}
                          className="w-full justify-start text-red-600"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}