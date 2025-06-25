'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Heart, Target, Users, Lightbulb, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
        {/* Hero Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">About QuickBriefs.ai</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born from a passion for efficiency and powered by the vision of a 19-year-old entrepreneur 
            who believes technology should simplify, not complicate our lives.
          </p>
        </motion.div>

        {/* Founder Story */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Heart className="w-7 h-7 text-red-500" />
                The Story Behind QuickBriefs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">
                At just 19 years old, our founder discovered a universal problem: we're drowning in information. 
                Whether it's research papers for university, industry reports for work, or simply staying updated 
                with the latest trends, the sheer volume of content we need to process is overwhelming.
              </p>
              <p className="text-lg leading-relaxed">
                What started as a personal solution to digest lengthy academic papers quickly evolved into something 
                much bigger. QuickBriefs.ai represents the intersection of youthful innovation and practical necessity—a 
                tool that doesn't just summarize text, but transforms how we consume and understand information.
              </p>
              <p className="text-lg leading-relaxed">
                This isn't just another AI tool. It's a micro-SaaS built with genuine passion for solving real problems. 
                Every feature, every improvement, every line of code is driven by the belief that technology should 
                amplify human potential, not replace it.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-500" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">
                  To democratize information consumption by making complex content accessible to everyone. 
                  We believe that understanding shouldn't be limited by time constraints or reading speed.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">
                  A world where knowledge is instantly accessible and actionable. Where students, professionals, 
                  and curious minds can focus on applying insights rather than extracting them.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">What Drives Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="w-8 h-8 text-green-500" />,
                title: "User-Centric",
                description: "Every decision is made with our users in mind. Simple, intuitive, and genuinely helpful."
              },
              {
                icon: <Rocket className="w-8 h-8 text-purple-500" />,
                title: "Innovation",
                description: "Constantly pushing boundaries to deliver cutting-edge solutions that actually work."
              },
              {
                icon: <Heart className="w-8 h-8 text-red-500" />,
                title: "Authenticity",
                description: "Built by real people solving real problems, not corporate committees chasing trends."
              }
            ].map((value, index) => (
              <Card key={index} className="text-center shadow-lg">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* The Micro-SaaS Philosophy */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">The Micro-SaaS Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                We're proud to be a micro-SaaS. This means we're small, focused, and agile. We don't have 
                layers of bureaucracy or feature bloat. Instead, we have:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Direct connection</strong> with our users and their needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Rapid iteration</strong> based on real feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Sustainable pricing</strong> that reflects genuine value</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Personal touch</strong> in everything we do</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're just getting started. Every user, every piece of feedback, every summary generated 
            helps us build something truly special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="px-8">
                Try QuickBriefs.ai
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="px-8">
                Join Our Community
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}