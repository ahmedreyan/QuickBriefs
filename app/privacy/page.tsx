'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Shield, Eye, Lock, Database, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Database className="w-6 h-6 text-blue-500" />,
      title: "Information We Collect",
      content: [
        "Account information (email, name) when you sign up",
        "Content you submit for summarization (temporarily processed)",
        "Usage analytics to improve our service",
        "Technical information (IP address, browser type) for security"
      ]
    },
    {
      icon: <Eye className="w-6 h-6 text-green-500" />,
      title: "How We Use Your Information",
      content: [
        "Process and generate summaries of your content",
        "Provide customer support and respond to inquiries",
        "Improve our AI models and service quality",
        "Send important updates about your account or service changes"
      ]
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-500" />,
      title: "Data Protection",
      content: [
        "All data is encrypted in transit and at rest",
        "Content submitted for summarization is not permanently stored",
        "We use industry-standard security measures",
        "Regular security audits and updates"
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6 text-orange-500" />,
      title: "Your Rights",
      content: [
        "Access your personal data at any time",
        "Request deletion of your account and data",
        "Opt out of non-essential communications",
        "Export your saved summaries and data"
      ]
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is fundamental to everything we do. This policy explains how we collect, 
            use, and protect your information when you use QuickBriefs.ai.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2025
          </p>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="shadow-lg bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">Privacy at a Glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">✅ What We Do</h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Process your content to generate summaries</li>
                    <li>• Encrypt all data in transit and at rest</li>
                    <li>• Give you full control over your data</li>
                    <li>• Use minimal data collection practices</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">❌ What We Don't Do</h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Sell your personal information</li>
                    <li>• Store your content permanently</li>
                    <li>• Share data with third parties for marketing</li>
                    <li>• Use your content to train public AI models</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Sections */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-8 mb-16"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Content Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                When you submit content for summarization, we process it using our AI models to generate 
                your summary. This content is:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• Processed in real-time and not stored permanently</li>
                <li>• Encrypted during transmission and processing</li>
                <li>• Only accessible to our AI processing systems</li>
                <li>• Automatically deleted after processing is complete</li>
              </ul>
              <p className="leading-relaxed">
                If you have an account and choose to save summaries, only the generated summary 
                (not the original content) is stored in your account.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Cookies and Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                We use minimal cookies and analytics to improve our service:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• Essential cookies for basic functionality</li>
                <li>• Anonymous usage analytics to understand how our service is used</li>
                <li>• No tracking cookies or third-party advertising</li>
                <li>• You can disable non-essential cookies in your browser</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                We use select third-party services to provide our functionality:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• AI processing services for generating summaries</li>
                <li>• Cloud hosting providers for secure infrastructure</li>
                <li>• Payment processors for subscription management</li>
                <li>• Email services for account communications</li>
              </ul>
              <p className="leading-relaxed">
                All third-party services are carefully vetted and required to maintain the same 
                privacy standards we uphold.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Contact & Data Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                If you have questions about this privacy policy or want to exercise your data rights, 
                you can contact us at:
              </p>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="font-medium">Email: privacy@quickbriefs.ai</p>
                <p className="text-sm text-muted-foreground mt-2">
                  We typically respond to privacy requests within 48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Updates */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-16"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                We may update this privacy policy from time to time to reflect changes in our practices 
                or for legal reasons. When we make significant changes, we'll notify you by email (if you 
                have an account) and update the "Last updated" date at the top of this policy.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Questions About Privacy?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're here to help. Reach out if you have any concerns or questions about how we handle your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:privacy@quickbriefs.ai">
              <Button size="lg" className="px-8">
                Contact Privacy Team
              </Button>
            </a>
            <Link href="/app">
              <Button size="lg" variant="outline" className="px-8">
                Try QuickBriefs.ai
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}