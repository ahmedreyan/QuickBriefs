'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Heart, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Summaries",
      description: "Advanced Google Gemini AI creates intelligent summaries tailored to your needs"
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Multiple Summary Modes",
      description: "Business briefs, student summaries, code explanations, and Gen Z style breakdowns"
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in under 10 seconds with our optimized AI pipeline"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Always Free",
      description: "No hidden costs, no subscriptions, no limits. QuickBriefs.ai is completely free to use"
    }
  ];

  const capabilities = [
    "Process blog URLs and articles",
    "Analyze YouTube video transcripts", 
    "Handle direct text input up to 30,000 characters",
    "Generate structured summaries with TL;DR and key points",
    "Download summaries as Markdown files",
    "Multiple AI-powered summary formats",
    "Real-time processing with Google Gemini AI",
    "Mobile-responsive design",
    "Secure content processing",
    "No registration required"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold">QuickBriefs.ai</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button>Start Summarizing</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 px-4 py-2 bg-green-100 text-green-800 border-green-200">
            100% Free Forever
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            Powerful AI Summarization
            <span className="block text-green-600">Completely Free</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform any content into intelligent summaries with Google Gemini AI. 
            No costs, no limits, no catch - just powerful AI at your fingertips.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/app">
              <Button size="lg" className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700">
                Start Summarizing Now
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                View Documentation
              </Button>
            </Link>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Why Free?</h3>
            <p className="text-green-700">
              We believe powerful AI tools should be accessible to everyone. QuickBriefs.ai is our 
              contribution to democratizing AI technology for students, professionals, and creators worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Full Feature Set</h2>
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Summary Modes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">AI Summary Modes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Business Brief",
                description: "Strategic insights and actionable recommendations for professionals",
                color: "bg-blue-100 text-blue-800 border-blue-200"
              },
              {
                title: "Student Summary", 
                description: "Educational breakdowns perfect for studying and learning",
                color: "bg-green-100 text-green-800 border-green-200"
              },
              {
                title: "Code Explainer",
                description: "Technical concepts simplified for developers and engineers",
                color: "bg-purple-100 text-purple-800 border-purple-200"
              },
              {
                title: "Gen Z Style",
                description: "Casual, relatable summaries with authentic modern language",
                color: "bg-pink-100 text-pink-800 border-pink-200"
              }
            ].map((mode, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <Badge className={mode.color}>{mode.title}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mode.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Content?</h2>
          <p className="text-xl text-background/80 mb-8">
            Join thousands of users who are already saving hours every week with AI-powered summaries.
          </p>
          <Link href="/app">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Start Summarizing for Free
            </Button>
          </Link>
          <p className="text-sm text-background/60 mt-4">
            No registration required • No hidden costs • Always free
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-background" />
                </div>
                <span className="text-xl font-bold">QuickBriefs.ai</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Free AI-powered content summarization for everyone.
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
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><a href="mailto:hello@quickbriefs.ai" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 QuickBriefs.ai. All rights reserved. Always free, always powerful.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}