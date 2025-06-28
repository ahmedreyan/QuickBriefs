'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveNavbar } from '@/components/ui/responsive-navbar';
import { motion } from 'framer-motion';
import { 
  Zap, 
  FileText, 
  Youtube, 
  Upload, 
  Sparkles, 
  Clock, 
  User,
  CreditCard,
  Copy,
  Download,
  RefreshCw,
  Star,
  Globe,
  BarChart3,
  GraduationCap,
  Briefcase,
  Users,
  LogOut,
  History,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EmailValidationService } from '@/lib/email-validation';
import { SecurityService } from '@/lib/security';
import { toast } from 'sonner';

export default function AppPage() {
  const { user, signOut } = useAuth();
  const [inputType, setInputType] = useState('url');
  const [summaryMode, setSummaryMode] = useState('business');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryData, setSummaryData] = useState<any>(null);
  const [credits, setCredits] = useState({ used: 2, total: 3 });
  const [totalSummaries, setTotalSummaries] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Security initialization
    SecurityService.enforceHTTPS();
    
    // Animate total summaries counter
    let start = 0;
    const target = 2847;
    const increment = target / 100;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setTotalSummaries(target);
        clearInterval(timer);
      } else {
        setTotalSummaries(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  const handleGenerate = async () => {
    if (credits.used >= credits.total || !content.trim()) return;
    
    // Validate input based on type
    if (inputType === 'url' && !SecurityService.validateInput(content, 'url')) {
      setError('Please enter a valid URL');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          mode: summaryMode,
          inputType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data.summary);
      setSummaryData(data);
      setCredits(prev => ({ ...prev, used: prev.used + 1 }));
      setTotalSummaries(prev => prev + 1);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputTypes = [
    {
      id: 'url',
      icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'URL/Blog',
      description: 'Extract from any website'
    },
    {
      id: 'youtube',
      icon: <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'YouTube',
      description: 'Analyze video transcripts'
    },
    {
      id: 'upload',
      icon: <Upload className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'Upload',
      description: 'Process documents & text'
    }
  ];

  const summaryModes = [
    {
      id: 'business',
      title: 'Business Brief',
      description: 'Strategic insights & actions',
      icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />,
      audience: 'Business professionals'
    },
    {
      id: 'student',
      title: 'Student Summary',
      description: 'Educational & study-friendly',
      icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />,
      audience: 'Students'
    },
    {
      id: 'genZ',
      title: 'Gen Z Style',
      description: 'Casual & relatable tone',
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      audience: 'Gen Z'
    }
  ];

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast.success('Summary copied to clipboard!');
    }
  };

  const downloadSummary = () => {
    if (summary && summaryData) {
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `summary-${summaryData.mode}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Summary downloaded!');
    }
  };

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <ResponsiveNavbar 
          isAuthenticated={true}
          userCredits={credits}
          notifications={0}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
          <motion.div 
            className="grid lg:grid-cols-3 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Welcome Section */}
              <motion.div
                variants={itemVariants}
                className="text-center py-6 sm:py-8"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">AI Content Summarization</h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
                  Transform any content into intelligent summaries tailored to your audience
                </p>
              </motion.div>

              {/* Generator Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg sm:text-xl lg:text-2xl">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      Generate Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {/* Input Type Selection */}
                    <div>
                      <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                        Choose Content Source
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {inputTypes.map((type) => (
                          <Button
                            key={type.id}
                            variant={inputType === type.id ? 'default' : 'outline'}
                            onClick={() => setInputType(type.id)}
                            className="flex flex-col items-center p-3 sm:p-4 h-auto space-y-2 touch-target text-center"
                          >
                            {type.icon}
                            <div>
                              <div className="font-semibold text-xs sm:text-sm">{type.title}</div>
                              <div className="text-xs opacity-80 hidden sm:block">{type.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Content Input */}
                    <div className="space-y-3 sm:space-y-4">
                      {inputType === 'url' && (
                        <div>
                          <Label htmlFor="url" className="font-medium text-sm sm:text-base">
                            Website URL or Article Link
                          </Label>
                          <Input
                            id="url"
                            placeholder="https://example.com/article"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-2 form-input-mobile"
                          />
                        </div>
                      )}
                      
                      {inputType === 'youtube' && (
                        <div>
                          <Label htmlFor="youtube" className="font-medium text-sm sm:text-base">
                            YouTube Video URL
                          </Label>
                          <Input
                            id="youtube"
                            placeholder="https://youtube.com/watch?v=..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-2 form-input-mobile"
                          />
                        </div>
                      )}
                      
                      {inputType === 'upload' && (
                        <div>
                          <Label htmlFor="text" className="font-medium text-sm sm:text-base">
                            Paste Text Content
                          </Label>
                          <Textarea
                            id="text"
                            placeholder="Paste your text content here (max 50,000 characters)..."
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={50000}
                            className="mt-2 form-input-mobile resize-none"
                          />
                          <div className="text-xs sm:text-sm text-muted-foreground mt-2">
                            {content.length}/50,000 characters
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Summary Mode Selection */}
                    <div>
                      <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                        Summary Format
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {summaryModes.map((mode) => (
                          <Button
                            key={mode.id}
                            variant={summaryMode === mode.id ? 'default' : 'outline'}
                            onClick={() => setSummaryMode(mode.id)}
                            className="flex flex-col items-center p-3 sm:p-4 h-auto space-y-2 text-left touch-target"
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center">
                              {mode.icon}
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-xs sm:text-sm">{mode.title}</div>
                              <div className="text-xs opacity-80 hidden sm:block">{mode.description}</div>
                              <div className="text-xs text-muted-foreground mt-1 hidden sm:block">{mode.audience}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4"
                      >
                        <p className="text-red-700 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerate}
                      disabled={!content.trim() || isLoading || credits.used >= credits.total}
                      className="w-full py-3 text-sm sm:text-base touch-target-lg"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-3 animate-spin" />
                          Generating Summary...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                          Generate Summary ({credits.total - credits.used} credits left)
                        </>
                      )}
                    </Button>

                    {credits.used >= credits.total && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-4 sm:py-6 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <p className="text-orange-700 mb-3 sm:mb-4 text-sm sm:text-base">You&apos;ve used all your free credits today!</p>
                        <Link href="/pricing">
                          <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 touch-target">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Upgrade for More Credits
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Summary Output */}
              {summary && summaryData && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                          Your Summary
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={copyToClipboard} className="touch-target">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={downloadSummary} className="touch-target">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/30 p-4 sm:p-6 rounded-lg border">
                        <p className="leading-relaxed text-sm sm:text-base">{summary}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6 pt-4 border-t gap-3 sm:gap-0">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            {summaryModes.find(m => m.id === summaryMode)?.title}
                          </Badge>
                          <Badge variant="secondary">
                            {summaryData.audience}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          {summaryData.processingTime}ms • {summaryData.wordCount} words
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Live Stats */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Live Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold mb-1">{totalSummaries.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Total Summaries Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold mb-1">1,203</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Active Users Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold mb-1 text-green-600">156 hrs</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Time Saved Today</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Credits Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      Daily Credits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-2 text-muted-foreground">
                          <span>Today&apos;s Usage</span>
                          <span className="font-semibold">{credits.used}/{credits.total}</span>
                        </div>
                        <Progress 
                          value={(credits.used / credits.total) * 100} 
                          className="h-2"
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Free credits reset daily at midnight. Upgrade for unlimited access and premium features.
                      </p>
                      <Link href="/pricing">
                        <Button className="w-full touch-target text-sm">
                          <Star className="w-4 h-4 mr-2" />
                          Get Unlimited Access
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <Link href="/app/history" className="block">
                      <Button variant="outline" className="w-full justify-start touch-target text-sm">
                        <History className="w-4 h-4 mr-3" />
                        View History
                      </Button>
                    </Link>
                    <Link href="/app/templates" className="block">
                      <Button variant="outline" className="w-full justify-start touch-target text-sm">
                        <FileText className="w-4 h-4 mr-3" />
                        Templates
                      </Button>
                    </Link>
                    <Link href="/app/settings" className="block">
                      <Button variant="outline" className="w-full justify-start touch-target text-sm">
                        <User className="w-4 h-4 mr-3" />
                        Settings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}