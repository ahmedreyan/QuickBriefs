'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Zap, 
  MessageSquare, 
  Users, 
  Heart, 
  ExternalLink,
  Lightbulb,
  HelpCircle,
  Megaphone,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const communityFeatures = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
      title: "Real-time Chat",
      description: "Connect with other users, share tips, and get instant help from our community."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "Feature Requests",
      description: "Suggest new features and vote on what you'd like to see next in QuickBriefs.ai."
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-green-500" />,
      title: "Support & Help",
      description: "Get help from experienced users and our team when you need it most."
    },
    {
      icon: <Megaphone className="w-8 h-8 text-purple-500" />,
      title: "Updates & News",
      description: "Be the first to know about new features, improvements, and company updates."
    }
  ];

  const stats = [
    { number: "1,200+", label: "Community Members" },
    { number: "50+", label: "Daily Messages" },
    { number: "95%", label: "Questions Answered" },
    { number: "24/7", label: "Community Support" }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Graduate Student",
      content: "The Discord community is amazing! I got help with optimizing my research summaries within minutes.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Alex R.",
      role: "Product Manager", 
      content: "Love how active and helpful everyone is. The feature request channel actually led to improvements I suggested!",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Jamie L.",
      role: "Developer",
      content: "Great place to share use cases and learn new ways to integrate QuickBriefs into my workflow.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold">QuickBriefs.ai</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button>Try Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with fellow users, share insights, get support, and help shape the future of QuickBriefs.ai. 
            Our Discord community is the heart of everything we do.
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              🔥 Beta Community
            </Badge>
            <Badge variant="outline">
              Early Access Features
            </Badge>
          </div>
          <a 
            href="https://discord.gg/D4tWx9QqwB" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="px-8 py-3 text-lg">
              <MessageSquare className="mr-3 w-6 h-6" />
              Join Discord Community
              <ExternalLink className="ml-3 w-5 h-5" />
            </Button>
          </a>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center shadow-lg">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* What You'll Find */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">What You'll Find in Our Community</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {communityFeatures.map((feature, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Beta Features Preview */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <Card className="shadow-lg bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-purple-800">
                <Star className="w-7 h-7 text-purple-500" />
                Beta Community Benefits
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Beta Feature
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-purple-700">
                As a beta community member, you'll get exclusive access to:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-purple-800">🚀 Early Access</h3>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>• Preview new features before public release</li>
                    <li>• Test browser extension beta versions</li>
                    <li>• Influence product development direction</li>
                    <li>• Direct feedback channel to our team</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-purple-800">💡 Community Perks</h3>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>• Priority support and assistance</li>
                    <li>• Feature request voting power</li>
                    <li>• Beta tester recognition badges</li>
                    <li>• Exclusive community events and AMAs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Heart className="w-7 h-7 text-red-500" />
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                Our community thrives on mutual respect, helpfulness, and shared learning. Here's what makes our Discord special:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">✅ We Encourage</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Asking questions, no matter how basic</li>
                    <li>• Sharing your use cases and success stories</li>
                    <li>• Providing constructive feedback on beta features</li>
                    <li>• Helping other community members</li>
                    <li>• Suggesting new features and improvements</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-red-600">❌ Please Avoid</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Spam or self-promotion</li>
                    <li>• Sharing inappropriate content</li>
                    <li>• Being disrespectful to other members</li>
                    <li>• Off-topic discussions in focused channels</li>
                    <li>• Sharing sensitive or private information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Testimonials */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-muted-foreground text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Discord Channels Preview */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Discord Channels</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "👋 welcome", desc: "Get started and introduce yourself" },
              { name: "💬 general-chat", desc: "General discussions and community talk" },
              { name: "🆘 support", desc: "Get help with QuickBriefs.ai" },
              { name: "💡 feature-requests", desc: "Suggest new features and improvements" },
              { name: "🎯 use-cases", desc: "Share how you use QuickBriefs.ai" },
              { name: "🧪 beta-testing", desc: "Test new features and provide feedback", beta: true },
              { name: "📢 announcements", desc: "Latest updates and news" },
              { name: "🔧 browser-extension", desc: "Beta testing for upcoming extension", beta: true }
            ].map((channel, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-4">
                  <div className="font-mono text-sm font-semibold mb-2 flex items-center gap-2">
                    {channel.name}
                    {channel.beta && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                        Beta
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{channel.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Become part of a growing community of professionals, students, and creators who are 
                transforming how they consume information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://discord.gg/D4tWx9QqwB" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="px-8">
                    <MessageSquare className="mr-2 w-5 h-5" />
                    Join Discord Now
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <Link href="/app">
                  <Button size="lg" variant="outline" className="px-8">
                    Try QuickBriefs.ai First
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}