'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { toast } from 'sonner';

export default function AppPage() {
  const { user, signOut } = useAuth();
  const [inputType, setInputType] = useState('url');
  const [summaryMode, setSummaryMode] = useState('business');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryData, setSummaryData] = useState<any>(null);
  const [credits, setCredits] = useState({ used: 0, total: 3 });
  const [totalSummaries, setTotalSummaries] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

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
      description: 'Strategic insights & actions',
      icon: <Briefcase className="w-5 h-5" />,
      audience: 'Business professionals'
    },
    {
      id: 'student',
      title: 'Student Summary',
      description: 'Educational & study-friendly',
      icon: <GraduationCap className="w-5 h-5" />,
      audience: 'Students'
    },
    {
      id: 'genZ',
      title: 'Gen Z Style',
      description: 'Casual & relatable tone',
      icon: <Users className="w-5 h-5" />,
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-background" />
                </div>
                <span className="text-xl font-bold">QuickBriefs.ai</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="px-3 py-1">
                  <Star className="w-4 h-4 mr-2" />
                  {credits.used}/{credits.total} Credits Used
                </Badge>
                {user && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                )}
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
                transition={{ duration: 0.6 }}
                className="text-center py-8"
              >
                <h1 className="text-4xl font-bold mb-4">AI Content Summarization</h1>
                <p className="text-xl text-muted-foreground">
                  Transform any content into intelligent summaries tailored to your audience
                </p>
              </motion.div>

              {/* Generator Card */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Sparkles className="w-7 h-7" />
                      Generate Summary
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
                            Website URL or Article Link
                          </Label>
                          <Input
                            id="url"
                            placeholder="https://example.com/article"
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
                            placeholder="Paste your text content here (max 50,000 characters)..."
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={50000}
                            className="mt-2"
                          />
                          <div className="text-sm text-muted-foreground mt-2">
                            {content.length}/50,000 characters
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Summary Mode Selection */}
                    <div>
                      <Label className="text-base font-semibold mb-4 block">
                        Summary Format
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {summaryModes.map((mode) => (
                          <Button
                            key={mode.id}
                            variant={summaryMode === mode.id ? 'default' : 'outline'}
                            onClick={() => setSummaryMode(mode.id)}
                            className="flex flex-col items-center p-4 h-auto space-y-2 text-left"
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                              {mode.icon}
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-sm">{mode.title}</div>
                              <div className="text-xs opacity-80">{mode.description}</div>
                              <div className="text-xs text-muted-foreground mt-1">{mode.audience}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerate}
                      disabled={!content.trim() || isLoading || credits.used >= credits.total}
                      className="w-full py-3 text-base"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                          Generating Summary...
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
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <FileText className="w-6 h-6" />
                          Your Summary
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={downloadSummary}>
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
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {summaryModes.find(m => m.id === summaryMode)?.title}
                          </Badge>
                          <Badge variant="secondary">
                            {summaryData.audience}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {summaryData.processingTime}ms • {summaryData.wordCount} words
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live Stats */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5" />
                      Live Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">{totalSummaries.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Summaries Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">1,203</div>
                        <div className="text-sm text-muted-foreground">Active Users Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1 text-green-600">156 hrs</div>
                        <div className="text-sm text-muted-foreground">Time Saved Today</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Credits Card */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      Daily Credits
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
                        Free credits reset daily at midnight. Upgrade for unlimited access and premium features.
                      </p>
                      <Link href="/pricing">
                        <Button className="w-full">
                          <Star className="w-4 h-4 mr-2" />
                          Get Unlimited Access
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}