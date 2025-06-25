'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Zap, Crown, Rocket, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "PRO Account",
      icon: <Crown className="w-6 h-6" />,
      price: 9,
      annualPrice: 7,
      description: "Boost your personal HF experience",
      features: [
        "8x ZeroGPU quota and highest queue priority",
        "20x included credits across all Inference Providers",
        "10x private storage capacity",
        "Spaces Dev Mode & ZeroGPU Spaces hosting",
        "Write and publish blog articles on your HF profile",
        "Dataset Viewer for private datasets",
        "Show your support with a Pro badge"
      ],
      cta: "Get PRO",
      ctaVariant: "default" as const,
      popular: true,
      gradient: true
    },
    {
      name: "Team",
      icon: <Rocket className="w-6 h-6" />,
      price: 20,
      annualPrice: 16,
      description: "Instant setup for growing teams",
      features: [
        "SSO and SAML support",
        "Choose data location with Storage Regions",
        "Detailed action reviews with Audit Logs",
        "Granular access control via Resource Groups",
        "Repository usage Analytics",
        "Set auth policies and default repository visibility",
        "Centralized token control and approvals",
        "Dataset Viewer for private datasets",
        "Advanced compute options for Spaces"
      ],
      additionalFeatures: [
        "All organization members get ZeroGPU and Inference Providers PRO benefits"
      ],
      cta: "Get Team (via credit card)",
      ctaVariant: "outline" as const,
      popular: false
    },
    {
      name: "Enterprise",
      icon: <Zap className="w-6 h-6" />,
      price: 50,
      annualPrice: 40,
      description: "Custom onboarding and enterprise features",
      features: [
        "All benefits from the Team plan",
        "Managed billing with annual commitments",
        "Legal and Compliance processes",
        "Personalized support"
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How accurate are the AI summaries?",
      answer: "Our AI achieves 98% accuracy by using advanced GPT-4 models and custom optimization for different content types."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Premium subscription at any time. You'll continue to have access until the end of your billing period."
    },
    {
      question: "What content types are supported?",
      answer: "We support blog URLs, YouTube videos, PDF files, and direct text input up to 50,000 characters."
    },
    {
      question: "Is there an API available?",
      answer: "Yes, PRO users get access to our REST API for integrating QuickBriefs into their own applications."
    },
    {
      question: "How do team accounts work?",
      answer: "Team accounts provide shared access, centralized billing, and advanced collaboration features for organizations."
    }
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
              <span className="text-xl font-bold">
                QuickBriefs.ai
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 px-4 py-2 bg-yellow-100 text-yellow-800 border-yellow-200">
            Pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            Leveling up AI collaboration and compute.
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Give your personal account or your organization the most advanced platform to build AI.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              Annual
            </span>
            <Badge className="ml-2">
              Save 20%
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative shadow-lg ${plan.popular ? 'ring-2 ring-primary scale-105' : ''} ${plan.gradient ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200' : ''}`}>
                
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {plan.name === "PRO Account" ? "PRO" : plan.name === "Team" ? "Team" : "Enterprise"}
                    </Badge>
                    <div className="text-lg font-bold">{plan.name}</div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-left">
                      <div className="text-sm text-muted-foreground mb-1">
                        {plan.name === "Enterprise" ? "Starting at" : "Subscribe for"}
                      </div>
                      <div className="text-4xl font-bold">
                        ${isAnnual ? plan.annualPrice : plan.price}
                        <span className="text-lg text-muted-foreground">
                          {plan.name === "Team" || plan.name === "Enterprise" ? " per user per month" : " per month"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full ${plan.gradient ? 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white' : ''}`}
                    variant={plan.ctaVariant}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.additionalFeatures && (
                    <div className="pt-4 border-t">
                      <div className="space-y-3">
                        {plan.additionalFeatures.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-3">
                            <Plus className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Start Summarizing Today
          </h2>
          <p className="text-xl text-background/80 mb-8">
            Join thousands of professionals saving hours every week.
          </p>
          <Link href="/app">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
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
                Transform any content into actionable insights with AI-powered summaries.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/app" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><a href="mailto:hello@quickbriefs.ai" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 QuickBriefs.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}