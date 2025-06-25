'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Zap, 
  FileText, 
  Youtube, 
  Upload, 
  Settings, 
  Download,
  Copy,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const steps = [
    {
      title: "Choose Your Content Source",
      description: "Select how you want to input your content",
      options: [
        { icon: <FileText className="w-5 h-5" />, name: "URL/Blog", desc: "Paste any website or blog URL" },
        { icon: <Youtube className="w-5 h-5" />, name: "YouTube", desc: "Enter a YouTube video URL" },
        { icon: <Upload className="w-5 h-5" />, name: "Text Upload", desc: "Paste text directly or upload a document" }
      ]
    },
    {
      title: "Select Summary Format",
      description: "Choose the style that best fits your needs",
      options: [
        { icon: <Settings className="w-5 h-5" />, name: "Business Brief", desc: "Executive insights and action items" },
        { icon: <FileText className="w-5 h-5" />, name: "Student Summary", desc: "Educational notes and key concepts" },
        { icon: <Settings className="w-5 h-5" />, name: "Code Explainer", desc: "Technical concepts simplified" }
      ]
    },
    {
      title: "Get Your Summary",
      description: "Receive your AI-generated summary in seconds",
      options: [
        { icon: <Copy className="w-5 h-5" />, name: "Copy Text", desc: "Copy to clipboard for easy sharing" },
        { icon: <Download className="w-5 h-5" />, name: "Download", desc: "Save as PDF or text file" },
        { icon: <Clock className="w-5 h-5" />, name: "Save History", desc: "Access your summaries anytime (with account)" }
      ]
    }
  ];

  const tips = [
    {
      type: "success",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      title: "Best Practices",
      content: "For best results, use content that's at least 500 words long. Shorter content may not provide enough context for meaningful summaries."
    },
    {
      type: "warning", 
      icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
      title: "Content Limits",
      content: "Text input is limited to 10,000 characters. For longer content, consider breaking it into sections or using URL input instead."
    },
    {
      type: "info",
      icon: <Info className="w-5 h-5 text-blue-500" />,
      title: "Processing Time",
      content: "Most summaries are generated in 5-10 seconds. Complex or very long content may take up to 30 seconds to process."
    }
  ];

  const faqs = [
    {
      question: "What types of content work best?",
      answer: "QuickBriefs.ai works excellently with articles, blog posts, research papers, documentation, and educational content. The AI performs best with well-structured, informative text."
    },
    {
      question: "How accurate are the summaries?",
      answer: "Our AI achieves 98%+ accuracy by using advanced language models trained specifically for summarization. The system understands context and maintains the original meaning while condensing content."
    },
    {
      question: "Can I customize the summary length?",
      answer: "Currently, summaries are optimized to around 100 words for maximum clarity and usefulness. Premium users will soon have access to custom length options."
    },
    {
      question: "What languages are supported?",
      answer: "QuickBriefs.ai primarily supports English content. We're working on adding support for Spanish, French, German, and other major languages."
    },
    {
      question: "Is my content stored or shared?",
      answer: "We prioritize your privacy. Content is processed securely and not stored permanently. Summaries are only saved if you have an account and choose to save them."
    },
    {
      question: "How do I get more credits?",
      answer: "Free users get 3 summaries per day. Create an account for additional features, or upgrade to Premium for unlimited summaries and advanced features."
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
          <h1 className="text-5xl font-bold mb-6">Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know to get the most out of QuickBriefs.ai. 
            From basic usage to advanced tips and tricks.
          </p>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Quick Start Guide</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {step.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                        <div className="text-muted-foreground mt-1">
                          {option.icon}
                        </div>
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Tips & Best Practices */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Tips & Best Practices</h2>
          <div className="space-y-4">
            {tips.map((tip, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {tip.icon}
                    <div>
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{tip.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Summary Formats Explained */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Summary Formats Explained</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Business Brief",
                badge: "Executive",
                description: "Perfect for professionals who need actionable insights and strategic recommendations.",
                features: ["Key metrics and KPIs", "Action items", "Strategic insights", "ROI analysis", "Risk assessment"]
              },
              {
                title: "Student Summary", 
                badge: "Academic",
                description: "Designed for learners who want to understand and retain key concepts effectively.",
                features: ["Main concepts", "Learning objectives", "Key definitions", "Study notes", "Memory aids"]
              },
              {
                title: "Code Explainer",
                badge: "Technical", 
                description: "Ideal for developers and technical professionals dealing with complex documentation.",
                features: ["Code breakdown", "Technical concepts", "Implementation guide", "Best practices", "Examples"]
              }
            ].map((format, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{format.title}</CardTitle>
                    <Badge variant="secondary">{format.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {format.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 text-lg">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Now that you know how it works, try QuickBriefs.ai for yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="px-8">
                Start Summarizing
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="px-8">
                Join Community
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}