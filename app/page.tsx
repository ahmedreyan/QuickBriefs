'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveNavbar } from '@/components/ui/responsive-navbar';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  FileText, 
  Youtube, 
  Upload, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  Sparkles,
  Brain,
  Clock,
  Star,
  MessageSquare,
  Heart,
  Globe,
  Chrome
} from 'lucide-react';
import Link from 'next/link';
import { SecurityService, PerformanceMonitor } from '@/lib/security';

export default function HomePage() {
  const [stats, setStats] = useState({
    summariesGenerated: 0,
    activeUsers: 0,
    timeSaved: 0
  });

  useEffect(() => {
    // Initialize security and performance monitoring
    SecurityService.enforceHTTPS();
    SecurityService.setupCSPReporting();
    PerformanceMonitor.measurePageLoad();

    // Animate counters from 0 with staggered timing
    const animateCounter = (target: number, setter: (value: number) => void, duration: number = 2000, delay: number = 0) => {
      setTimeout(() => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setter(target);
            clearInterval(timer);
          } else {
            setter(Math.floor(start));
          }
        }, 16);
      }, delay);
    };

    // Staggered counter animations
    animateCounter(2847, (value) => setStats(prev => ({ ...prev, summariesGenerated: value })), 2000, 800);
    animateCounter(1203, (value) => setStats(prev => ({ ...prev, activeUsers: value })), 2000, 1000);
    animateCounter(156, (value) => setStats(prev => ({ ...prev, timeSaved: value })), 2000, 1200);
  }, []);

  const features = [
    {
      icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Smart URL Processing",
      description: "Extract and summarize content from any blog post, article, or webpage instantly"
    },
    {
      icon: <Youtube className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "YouTube Analysis",
      description: "Turn video content into digestible summaries with transcript analysis"
    },
    {
      icon: <Upload className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Document Support",
      description: "Upload PDFs, text files, or paste content directly for processing"
    },
    {
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Advanced AI",
      description: "Powered by cutting-edge AI for intelligent content understanding and analysis"
    },
    {
      icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Multiple Formats",
      description: "Choose from business briefs, study notes, code explanations, or Gen Z-style breakdowns"
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Always Free",
      description: "Start with 3 free summaries, then sign in for premium features and unlimited access"
    }
  ];

  // Animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const heroVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <ResponsiveNavbar />

      {/* Browser Extension Banner */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Chrome className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">Coming Soon:</span>
            <span>Browser Extension for 1-click summarization anywhere on the web</span>
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
              Beta Feature
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6"
            >
              <Badge className="px-4 py-2 bg-green-100 text-green-800 border-green-200 text-sm">
                <Heart className="w-4 h-4 mr-2" />
                🔥 Now in Beta • Start Free • Premium Features Available
              </Badge>
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Turn Any Content Into
              <motion.span 
                className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Clear Summaries
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl xl:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Whether it's a lengthy article, YouTube video, or research paper, our advanced AI transforms 
              complex content into digestible insights tailored to your needs. Start free, upgrade for premium features.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/app">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 touch-target-lg transition-all duration-300 hover:scale-105"
                >
                  Start Summarizing Free
                  <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg touch-target-lg transition-all duration-300 hover:scale-105"
                >
                  View Documentation
                </Button>
              </Link>
            </motion.div>

            <motion.p 
              className="text-sm text-muted-foreground mt-6 sm:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              3 free summaries to start • Sign in for premium features • Powered by advanced AI
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.summariesGenerated.toLocaleString()}</div>
              <div className="text-muted-foreground text-sm sm:text-base">Summaries Generated</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-muted-foreground text-sm sm:text-base">Active Users Today</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">{stats.timeSaved}</div>
              <div className="text-muted-foreground text-sm sm:text-base">Hours Saved Today</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Everything You Need to Get Started</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful AI-driven features designed to make content consumption effortless and efficient
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 card-hover">
                  <CardHeader className="text-center p-4 sm:p-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-muted-foreground text-center leading-relaxed text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
              Three simple steps to transform any content into actionable insights
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                step: "1",
                title: "Input Your Content",
                description: "Paste a URL, upload a document, or add text directly. We support blogs, YouTube videos, PDFs, and more."
              },
              {
                step: "2", 
                title: "Choose Your Format",
                description: "Select from business brief, student summary, code explainer, or Gen Z-style breakdown based on your needs."
              },
              {
                step: "3",
                title: "Get Your Summary",
                description: "Receive a clear, structured summary with TL;DR and key points in seconds. Copy, download, or save your results."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div 
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-foreground text-background rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Features Preview */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Unlock Premium Features</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Sign in after your first 3 summaries to unlock advanced features and unlimited access
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    Free Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>3 high-quality summaries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>All 4 summary modes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>URL and text processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Download summaries</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full shadow-lg border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-purple-500" />
                    Premium Features
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      Beta Feature
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span>Unlimited summaries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span>Full PDF processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span>YouTube video analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span>Summary history & search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span>Priority performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span>Early access to new features</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-foreground text-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 px-4 py-2 bg-green-600 text-white border-green-500">
              <Heart className="w-4 h-4 mr-2" />
              Start Free • Premium Available
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Save Hours Every Week?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-background/80 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Stop spending hours reading through lengthy content. Get the insights you need in seconds with AI-powered summarization that understands context and delivers exactly what matters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg touch-target-lg transition-all duration-300 hover:scale-105"
                >
                  Start Summarizing Now
                  <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg border-background/20 text-background hover:bg-background/10 touch-target-lg transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-background/60 mt-6">
              3 free summaries to start • Sign in for premium features • Advanced AI powered
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-background" />
                </div>
                <span className="text-lg font-bold">QuickBriefs</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Transform any content into clear, actionable summaries with the power of AI. Start free, upgrade for premium features.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/app" className="hover:text-foreground transition-colors">Summarize</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Features</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://discord.gg/D4tWx9QqwB" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Discord Community
                </a></li>
                <li><a href="mailto:hello@quickbriefs.ai" className="hover:text-foreground transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 QuickBriefs.ai. All rights reserved. AI summarization for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}