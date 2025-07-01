'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp,
  Code,
  CheckCircle,
  AlertCircle,
  Heart,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
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
  const [totalSummaries, setTotalSummaries] = useState(0);
  const [userSummaryCount, setUserSummaryCount] = useState(0);
  const [error, setError] = useState('');
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    // Security initialization
    SecurityService.enforceHTTPS();
    
    // Load user's summary count from localStorage
    const savedCount = localStorage.getItem('quickbriefs_summary_count');
    if (savedCount) {
      setUserSummaryCount(parseInt(savedCount));
    }
    
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
    if (!content.trim()) {
      setError('Please enter some content to summarize');
      return;
    }
    
    // Check if user has reached free limit and needs to sign in
    if (!user && userSummaryCount >= 3) {
      setShowSignInPrompt(true);
      return;
    }
    
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
      setTotalSummaries(prev => prev + 1);
      
      // Update user's summary count
      if (!user) {
        const newCount = userSummaryCount + 1;
        setUserSummaryCount(newCount);
        localStorage.setItem('quickbriefs_summary_count', newCount.toString());
        
        // Show sign-in prompt after 3rd summary
        if (newCount >= 3) {
          setTimeout(() => setShowSignInPrompt(true), 2000);
        }
      }
      
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
      description: 'Extract from any website',
      premium: false
    },
    {
      id: 'youtube',
      icon: <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'YouTube',
      description: 'Analyze video transcripts',
      premium: !user
    },
    {
      id: 'upload',
      icon: <Upload className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'Upload',
      description: 'Process documents & text',
      premium: false
    }
  ];

  const summaryModes = [
    {
      id: 'business',
      title: 'Business Brief',
      description: 'Strategic insights & actions',
      icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />,
      audience: 'Business professionals',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'student',
      title: 'Student Summary',
      description: 'Educational & study-friendly',
      icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />,
      audience: 'Students',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 'code',
      title: 'Code Explainer',
      description: 'Technical concepts simplified',
      icon: <Code className="w-4 h-4 sm:w-5 sm:h-5" />,
      audience: 'Developers',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'genZ',
      title: 'Gen Z Style',
      description: 'Casual & relatable tone',
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      audience: 'Gen Z',
      color: 'bg-pink-100 text-pink-800 border-pink-200'
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
      const content = `# Summary\n\n## TL;DR\n${summaryData.tldr}\n\n## Key Points\n${summaryData.keyPoints?.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n') || 'No key points available'}\n\n---\nGenerated by QuickBriefs.ai\nMode: ${summaryData.mode}\nWord Count Reduction: ${summaryData.reductionPercentage}%`;
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `summary-${summaryData.mode}-${Date.now()}.md`;
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <ResponsiveNavbar 
        isAuthenticated={!!user}
        userCredits={{ used: userSummaryCount, total: user ? -1 : 3 }}
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
                Transform any content into intelligent summaries powered by advanced AI
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                {!user && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {3 - userSummaryCount} free summaries remaining
                  </Badge>
                )}
                {user && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Heart className="w-3 h-3 mr-1" />
                    Premium Features Unlocked
                  </Badge>
                )}
                <Badge variant="outline">
                  🔥 Beta
                </Badge>
              </div>
            </motion.div>

            {/* Sign-in Prompt Modal */}
            {showSignInPrompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowSignInPrompt(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-background rounded-lg p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Unlock Premium Features!</h3>
                    <p className="text-muted-foreground mb-6">
                      You've used your 3 free summaries. Sign in to unlock unlimited summaries, 
                      YouTube processing, PDF support, and more premium features.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Link href="/auth/login">
                        <Button className="w-full">
                          Sign In for Premium Features
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSignInPrompt(false)}
                        className="w-full"
                      >
                        Maybe Later
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

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
                          onClick={() => {
                            if (type.premium && !user) {
                              toast.error('Sign in to unlock this premium feature');
                              return;
                            }
                            setInputType(type.id);
                          }}
                          className="flex flex-col items-center p-3 sm:p-4 h-auto space-y-2 touch-target text-center relative"
                          disabled={type.premium && !user}
                        >
                          {type.premium && !user && (
                            <Lock className="absolute top-2 right-2 w-3 h-3 text-muted-foreground" />
                          )}
                          {type.icon}
                          <div>
                            <div className="font-semibold text-xs sm:text-sm">{type.title}</div>
                            <div className="text-xs opacity-80 hidden sm:block">{type.description}</div>
                            {type.premium && !user && (
                              <Badge className="mt-1 text-xs bg-purple-100 text-purple-800 border-purple-200">
                                Premium
                              </Badge>
                            )}
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
                          {!user && (
                            <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                              Premium Feature
                            </Badge>
                          )}
                        </Label>
                        <Input
                          id="youtube"
                          placeholder="https://youtube.com/watch?v=..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="mt-2 form-input-mobile"
                          disabled={!user}
                        />
                        {!user && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Sign in to unlock YouTube video processing
                          </p>
                        )}
                      </div>
                    )}
                    
                    {inputType === 'upload' && (
                      <div>
                        <Label htmlFor="text" className="font-medium text-sm sm:text-base">
                          Paste Text Content
                        </Label>
                        <Textarea
                          id="text"
                          placeholder="Paste your text content here (max 30,000 characters)..."
                          rows={6}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          maxLength={30000}
                          className="mt-2 form-input-mobile resize-none"
                        />
                        <div className="text-xs sm:text-sm text-muted-foreground mt-2">
                          {content.length}/30,000 characters
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Mode Selection */}
                  <div>
                    <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                      Summary Format
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                      className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!content.trim() || isLoading || (!user && userSummaryCount >= 3)}
                    className="w-full py-3 text-sm sm:text-base touch-target-lg"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-3 animate-spin" />
                        Generating Summary...
                      </>
                    ) : !user && userSummaryCount >= 3 ? (
                      <>
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                        Sign In for More Summaries
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                        Generate Summary
                      </>
                    )}
                  </Button>

                  {!user && (
                    <div className="text-center py-4 sm:py-6 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-700 mb-2 text-sm sm:text-base font-medium">
                        🎉 {3 - userSummaryCount} free summaries remaining
                      </p>
                      <p className="text-blue-600 text-xs sm:text-sm">
                        Sign in after your 3rd summary to unlock premium features and unlimited access.
                      </p>
                    </div>
                  )}

                  {user && (
                    <div className="text-center py-4 sm:py-6 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-700 mb-2 text-sm sm:text-base font-medium">
                        🎉 Premium features unlocked!
                      </p>
                      <p className="text-green-600 text-xs sm:text-sm">
                        Unlimited summaries, YouTube processing, PDF support, and more.
                      </p>
                    </div>
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
                  <CardContent className="space-y-6">
                    {/* TL;DR Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        TL;DR
                      </h3>
                      <p className="text-blue-700 leading-relaxed">{summaryData.tldr}</p>
                    </div>

                    {/* Key Points Section */}
                    {summaryData.keyPoints && summaryData.keyPoints.length > 0 && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Key Points
                        </h3>
                        <ul className="space-y-2">
                          {summaryData.keyPoints.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Metrics */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6 pt-4 border-t gap-3 sm:gap-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant="outline" 
                          className={summaryModes.find(m => m.id === summaryMode)?.color}
                        >
                          {summaryModes.find(m => m.id === summaryMode)?.title}
                        </Badge>
                        <Badge variant="secondary">
                          {summaryData.reductionPercentage}% reduction
                        </Badge>
                        <Badge variant="outline">
                          {summaryData.originalWordCount} → {summaryData.summaryWordCount} words
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        {summaryData.processingTime}ms
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

            {/* Usage Status */}
            <motion.div variants={itemVariants}>
              {!user ? (
                <Card className="shadow-lg bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base sm:text-lg text-blue-800">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      Free Trial
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold mb-1 text-blue-700">{3 - userSummaryCount}</div>
                        <div className="text-xs sm:text-sm text-blue-600">Free Summaries Remaining</div>
                      </div>
                      <p className="text-xs sm:text-sm text-blue-700 leading-relaxed text-center">
                        After 3 summaries, sign in to unlock premium features and unlimited access.
                      </p>
                      <Link href="/auth/login">
                        <Button className="w-full touch-target text-sm bg-blue-600 hover:bg-blue-700">
                          <Star className="w-4 h-4 mr-2" />
                          Sign In for Premium
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base sm:text-lg text-green-800">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                      Premium Active
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Beta Feature
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold mb-1 text-green-700">∞</div>
                        <div className="text-xs sm:text-sm text-green-600">Unlimited Summaries</div>
                      </div>
                      <p className="text-xs sm:text-sm text-green-700 leading-relaxed text-center">
                        Premium features unlocked! Enjoy unlimited summaries and advanced features.
                      </p>
                      <Button 
                        onClick={signOut}
                        variant="outline" 
                        className="w-full touch-target text-sm border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                  <Link href="/docs" className="block">
                    <Button variant="outline" className="w-full justify-start touch-target text-sm">
                      <FileText className="w-4 h-4 mr-3" />
                      Documentation
                    </Button>
                  </Link>
                  <a href="https://discord.gg/D4tWx9QqwB" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full justify-start touch-target text-sm">
                      <Users className="w-4 h-4 mr-3" />
                      Join Community
                    </Button>
                  </a>
                  <Link href="/about" className="block">
                    <Button variant="outline" className="w-full justify-start touch-target text-sm">
                      <Heart className="w-4 h-4 mr-3" />
                      About Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}