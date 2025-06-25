'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Zap, 
  FileText, 
  Youtube, 
  Upload, 
  Sparkles, 
  Clock, 
  BarChart3, 
  User,
  CreditCard,
  History,
  Copy,
  Download,
  RefreshCw,
  Brain,
  TrendingUp,
  Star,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [inputType, setInputType] = useState('url');
  const [summaryMode, setSummaryMode] = useState('business');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [credits, setCredits] = useState({ used: 2, total: 3 });

  const handleGenerate = async () => {
    setIsLoading(true);
    // Simulate API call with realistic loading time
    setTimeout(() => {
      const mockSummaries = {
        business: "This comprehensive business analysis reveals significant market opportunities with projected 35% revenue growth potential. Key strategic advantages include advanced AI integration, scalable infrastructure, and competitive positioning. Critical success factors encompass team development, technology optimization, and customer acquisition strategies. Risk mitigation involves diversified approaches and phased implementation. Investment requirements total $50K with 6-month ROI timeline. Market analysis indicates substantial gap opportunities. Recommendation: proceed with pilot program validation before full deployment. Expected outcomes include enhanced operational efficiency, reduced costs, and improved customer satisfaction driving sustainable competitive advantage.",
        student: "The fundamental concepts center on systematic learning methodologies and knowledge retention strategies. Primary principles include active recall techniques, spaced repetition systems, and interleaved practice approaches. Research demonstrates distributed practice sessions enhance long-term memory consolidation by 40%. Essential techniques involve mental model construction, connecting new information to existing knowledge frameworks, and regular self-assessment protocols. Study methodology emphasizes comprehension over memorization, with practical applications in academic environments. Evidence supports multi-modal learning for enhanced understanding. Students should implement strategies gradually, prioritizing consistency over intensity for optimal results and sustainable academic improvement.",
        code: "This technical implementation focuses on efficient data processing and user interface optimization using modern JavaScript frameworks. The architecture employs component-based design patterns with clean separation of concerns. Key functions handle API requests, state management, and responsive design implementations. Performance enhancements include lazy loading, code splitting, and intelligent caching strategies. System architecture follows MVC principles with modular structure. Database operations utilize optimized queries and proper indexing for faster response times. Comprehensive error handling includes detailed logging and user-friendly feedback systems. Security measures implement input validation and authentication protocols. The solution provides scalable foundation for future enhancements while maintaining backward compatibility."
      };
      
      setSummary(mockSummaries[summaryMode as keyof typeof mockSummaries]);
      setCredits(prev => ({ ...prev, used: prev.used + 1 }));
      setIsLoading(false);
    }, 3000);
  };

  const recentSummaries = [
    {
      id: 1,
      title: "AI in Healthcare: Future Trends and Applications",
      mode: "Business Brief",
      date: "2 hours ago",
      source: "URL",
      wordCount: 98
    },
    {
      id: 2,
      title: "React 18 Features and Performance Improvements",
      mode: "Code Explainer",
      date: "1 day ago",
      source: "YouTube",
      wordCount: 102
    },
    {
      id: 3,
      title: "Market Analysis Q4 2024: Tech Sector Insights",
      mode: "Student Summary",
      date: "2 days ago",
      source: "PDF",
      wordCount: 95
    },
    {
      id: 4,
      title: "Machine Learning Fundamentals Course",
      mode: "Student Summary",
      date: "3 days ago",
      source: "YouTube",
      wordCount: 100
    }
  ];

  const inputTypes = [
    {
      id: 'url',
      icon: <Globe className="w-6 h-6" />,
      title: 'URL/Blog',
      description: 'Extract from any website'
    },
    {
      id: 'youtube',
      icon: <Youtube className="w-6 h-6" />,
      title: 'YouTube',
      description: 'Analyze video transcripts'
    },
    {
      id: 'upload',
      icon: <Upload className="w-6 h-6" />,
      title: 'Upload',
      description: 'Process documents & text'
    }
  ];

  const summaryModes = [
    {
      id: 'business',
      title: 'Business Brief',
      description: 'Executive insights & action items',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 'student',
      title: 'Student Summary',
      description: 'Educational notes & key concepts',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'code',
      title: 'Code Explainer',
      description: 'Technical concepts simplified',
      icon: <Brain className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold">
                QuickBriefs.ai
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Star className="w-4 h-4 mr-2" />
                {credits.used}/{credits.total} Credits Used
              </Badge>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center py-8"
            >
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Your AI Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Transform any content into intelligent summaries in seconds
              </p>
            </motion.div>

            {/* Generator Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Sparkles className="w-7 h-7" />
                    Generate AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input Type Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Choose Content Source
                    </Label>
                    <div className="grid grid-cols-3 gap-4">
                      {inputTypes.map((type) => (
                        <Button
                          key={type.id}
                          variant={inputType === type.id ? 'default' : 'outline'}
                          onClick={() => setInputType(type.id)}
                          className="flex flex-col items-center p-4 h-auto space-y-2"
                        >
                          {type.icon}
                          <div className="text-center">
                            <div className="font-semibold text-sm">{type.title}</div>
                            <div className="text-xs opacity-80">{type.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Content Input */}
                  <div className="space-y-4">
                    {inputType === 'url' && (
                      <div>
                        <Label htmlFor="url" className="font-medium">
                          Blog URL or Article Link
                        </Label>
                        <Input
                          id="url"
                          placeholder="https://example.com/blog-post"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                    
                    {inputType === 'youtube' && (
                      <div>
                        <Label htmlFor="youtube" className="font-medium">
                          YouTube Video URL
                        </Label>
                        <Input
                          id="youtube"
                          placeholder="https://youtube.com/watch?v=..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                    
                    {inputType === 'upload' && (
                      <div>
                        <Label htmlFor="text" className="font-medium">
                          Paste Text Content
                        </Label>
                        <Textarea
                          id="text"
                          placeholder="Paste your text content here (max 10,000 characters)..."
                          rows={6}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          maxLength={10000}
                          className="mt-2"
                        />
                        <div className="text-sm text-muted-foreground mt-2">
                          {content.length}/10,000 characters
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Mode Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Summary Mode
                    </Label>
                    <div className="grid grid-cols-3 gap-4">
                      {summaryModes.map((mode) => (
                        <Button
                          key={mode.id}
                          variant={summaryMode === mode.id ? 'default' : 'outline'}
                          onClick={() => setSummaryMode(mode.id)}
                          className="flex flex-col items-center p-4 h-auto space-y-2"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            {mode.icon}
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-sm">{mode.title}</div>
                            <div className="text-xs opacity-80">{mode.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!content || isLoading || credits.used >= credits.total}
                    className="w-full py-3 text-base"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                        Generating AI Summary...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        Generate Summary ({credits.total - credits.used} credits left)
                      </>
                    )}
                  </Button>

                  {credits.used >= credits.total && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-6 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <p className="text-orange-700 mb-4 text-base">You've used all your free credits today!</p>
                      <Link href="/pricing">
                        <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Upgrade for Unlimited Access
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary Output */}
            {summary && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <FileText className="w-6 h-6" />
                        Generated Summary
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 p-6 rounded-lg border">
                      <p className="leading-relaxed text-base">{summary}</p>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <Badge variant="outline">
                        {summaryModes.find(m => m.id === summaryMode)?.title}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        Generated just now • {summary.split(' ').length} words
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credits Card */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    Credits Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                        <span>Today's Usage</span>
                        <span className="font-semibold">{credits.used}/{credits.total}</span>
                      </div>
                      <Progress 
                        value={(credits.used / credits.total) * 100} 
                        className="h-2"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Free tier resets daily at midnight. Upgrade for unlimited access and premium features.
                    </p>
                    <Link href="/pricing">
                      <Button className="w-full">
                        <Star className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Summaries */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <History className="w-5 h-5" />
                    Recent Summaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSummaries.map((item) => (
                      <div key={item.id} className="border-l-4 border-primary pl-4 py-3 bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="font-medium text-sm mb-2 line-clamp-2">
                          {item.title}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {item.mode}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.source} • {item.wordCount} words
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View All History
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Summaries</span>
                      <span className="font-semibold text-lg">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-semibold text-lg">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time Saved</span>
                      <span className="font-semibold text-lg text-green-600">24.5 hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Favorite Mode</span>
                      <Badge variant="secondary">
                        Business
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                      <span className="font-semibold text-lg text-blue-600">98.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}