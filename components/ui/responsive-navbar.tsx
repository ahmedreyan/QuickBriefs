'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Menu, 
  X, 
  User, 
  LogOut, 
  FileText, 
  Users,
  Heart,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponsiveNavbarProps {
  isAuthenticated?: boolean;
  userCredits?: {
    used: number;
    total: number;
  };
  notifications?: number;
}

export function ResponsiveNavbar({ 
  isAuthenticated = false, 
  userCredits = { used: 0, total: -1 },
  notifications = 0 
}: ResponsiveNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { href: '/app', label: 'Summarize', icon: <Sparkles className="w-4 h-4" /> },
    { href: '/docs', label: 'Docs', icon: <FileText className="w-4 h-4" /> },
    { href: '/community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { href: '/about', label: 'About', icon: <Heart className="w-4 h-4" /> },
  ];

  // Navigation items for non-authenticated users
  const publicNavItems = [
    { href: '/docs', label: 'Documentation', icon: <FileText className="w-4 h-4" /> },
    { href: '/pricing', label: 'Features', icon: <Sparkles className="w-4 h-4" /> },
    { href: '/community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { href: '/about', label: 'About', icon: <Heart className="w-4 h-4" /> },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold hidden sm:block">QuickBriefs.ai</span>
            <span className="text-lg font-bold sm:hidden">QB.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Free Service Badge */}
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Heart className="w-3 h-3 mr-1" />
                  Free Forever
                </Badge>
                
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {user?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Heart className="w-3 h-3 mr-1" />
                  100% Free
                </Badge>
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/app">
                  <Button>Try Now</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                Free
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-b overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-3 px-2 text-muted-foreground hover:text-foreground transition-colors duration-200 touch-target"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t my-4"></div>

              {/* User Section */}
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 py-2 px-2">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {user?.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Free Forever</span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Unlimited summaries, no costs
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full justify-start touch-target-lg"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">100% Free Service</span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      No registration required
                    </div>
                  </div>
                  
                  <Link href="/auth/login" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full touch-target-lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/app" onClick={closeMobileMenu}>
                    <Button className="w-full touch-target-lg">
                      Try Now - Free
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}