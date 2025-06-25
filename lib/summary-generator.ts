// Enhanced summary generation utilities with multiple format support

export interface SummaryConfig {
  mode: 'standard' | 'business' | 'student' | 'technical' | 'genZ';
  maxLength: number;
  audience: string;
  requirements: {
    mustInclude: string[];
    mustAvoid: string[];
  };
}

export interface SummaryResult {
  summary: string;
  wordCount: number;
  mode: string;
  audience: string;
  processingTime: number;
  timestamp: string;
}

export class EnhancedSummaryGenerator {
  private static readonly SUMMARY_CONFIGS: Record<string, SummaryConfig> = {
    standard: {
      mode: 'standard',
      maxLength: 250,
      audience: 'general',
      requirements: {
        mustInclude: ['key points', 'main insights', 'practical applications'],
        mustAvoid: ['fluff', 'redundant information', 'unnecessary context']
      }
    },
    business: {
      mode: 'business',
      maxLength: 250,
      audience: 'business professionals',
      requirements: {
        mustInclude: ['strategic insights', 'market implications', 'actionable takeaways', 'business value'],
        mustAvoid: ['technical jargon', 'academic theory', 'personal opinions']
      }
    },
    student: {
      mode: 'student',
      maxLength: 250,
      audience: 'students',
      requirements: {
        mustInclude: ['core concepts', 'key learnings', 'academic relevance', 'study points'],
        mustAvoid: ['complex terminology', 'advanced concepts', 'industry-specific details']
      }
    },
    technical: {
      mode: 'technical',
      maxLength: 250,
      audience: 'developers',
      requirements: {
        mustInclude: ['technical details', 'implementation specifics', 'code examples', 'system architecture'],
        mustAvoid: ['business context', 'marketing language', 'non-technical explanations']
      }
    },
    genZ: {
      mode: 'genZ',
      maxLength: 250,
      audience: 'Gen Z',
      requirements: {
        mustInclude: ['relatable examples', 'current references', 'practical value'],
        mustAvoid: ['formal language', 'corporate speak', 'outdated references']
      }
    }
  };

  static generatePrompt(content: string, mode: string): string {
    const config = this.SUMMARY_CONFIGS[mode];
    if (!config) {
      throw new Error(`Invalid summary mode: ${mode}`);
    }

    const prompts = {
      standard: `Create a focused 1-minute summary of this content. Extract only the most important points and key takeaways. Avoid any unnecessary details or filler content. Be direct and concise. Maximum ${config.maxLength} words.`,
      
      business: `Analyze this content from a business perspective. Highlight key strategic insights, market implications, and actionable takeaways. Focus on business value and practical applications. Deliver insights in a professional, executive-summary style. Maximum ${config.maxLength} words.`,
      
      student: `Break down this content into clear, educational points. Focus on core concepts, key learnings, and academic relevance. Present information in a structured, easy-to-understand format ideal for study and retention. Maximum ${config.maxLength} words.`,
      
      technical: `Extract technical details and specifications from this content. Focus on code examples, technical requirements, implementation details, and system architecture. Present information in a developer-friendly format. Maximum ${config.maxLength} words.`,
      
      genZ: `Translate this content into Gen Z-friendly language. Use current slang, casual tone, and relatable examples. Keep it real, engaging, and straight to the point. Make complex ideas accessible without losing key information. Maximum ${config.maxLength} words.`
    };

    return `${prompts[mode as keyof typeof prompts]}\n\nContent to summarize:\n${content}`;
  }

  static async generateSummary(content: string, mode: string): Promise<SummaryResult> {
    const startTime = Date.now();
    
    try {
      const config = this.SUMMARY_CONFIGS[mode];
      if (!config) {
        throw new Error(`Invalid summary mode: ${mode}`);
      }

      const prompt = this.generatePrompt(content, mode);
      
      // In production, this would integrate with OpenAI GPT-4
      // For now, we'll return enhanced mock responses
      const summary = await this.getMockSummary(mode, content);
      
      const processingTime = Date.now() - startTime;
      const wordCount = summary.split(/\s+/).filter(word => word.length > 0).length;

      return {
        summary,
        wordCount,
        mode,
        audience: config.audience,
        processingTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async getMockSummary(mode: string, content: string): Promise<string> {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const mockSummaries = {
      standard: "This content covers essential concepts and practical applications that are immediately actionable. The main insights focus on systematic approaches to problem-solving and implementation strategies. Key takeaways include the importance of structured methodology, data-driven decision making, and continuous improvement processes. The material emphasizes practical applications over theoretical concepts, making it highly relevant for immediate use. Critical success factors involve proper planning, stakeholder engagement, and measurable outcomes. The content provides clear guidance on best practices and common pitfalls to avoid. Implementation requires careful consideration of resources, timeline, and expected results. Overall, this represents a comprehensive guide to effective execution and sustainable results in the given domain.",

      business: "This analysis reveals significant market opportunities with strong competitive advantages and clear value propositions. Strategic insights indicate 35% growth potential through targeted market expansion and operational efficiency improvements. Key business implications include reduced operational costs, enhanced customer satisfaction, and improved market positioning. Actionable takeaways focus on immediate implementation of process optimization, technology integration, and team development initiatives. ROI projections show positive returns within 6-8 months with proper execution. Market analysis suggests first-mover advantages in emerging segments. Risk mitigation strategies include diversified approaches and phased rollouts. Critical success metrics involve customer acquisition costs, lifetime value optimization, and operational efficiency gains. Executive recommendation: proceed with pilot program validation before full-scale deployment to maximize business value and minimize implementation risks.",

      student: "The core concepts center on fundamental principles that form the foundation for advanced understanding. Key learning objectives include mastering basic terminology, understanding cause-and-effect relationships, and applying theoretical knowledge to practical scenarios. Important definitions and frameworks provide structure for deeper analysis and critical thinking. The material emphasizes step-by-step progression from basic concepts to complex applications. Study strategies should focus on active recall, spaced repetition, and connecting new information to existing knowledge. Academic relevance spans multiple disciplines and real-world applications. Essential skills developed include analytical thinking, problem-solving methodologies, and evidence-based reasoning. Assessment preparation should emphasize understanding underlying principles rather than memorization. The structured approach facilitates knowledge retention and practical application in academic and professional contexts.",

      technical: "The technical architecture implements modern design patterns with scalable infrastructure and optimized performance characteristics. Core system requirements include Node.js runtime, React framework, and TypeScript for type safety. Implementation details focus on component-based architecture with clean separation of concerns and modular design principles. Key technical specifications involve API endpoints, database schema optimization, and caching strategies for improved response times. Code examples demonstrate best practices for error handling, input validation, and security measures. System architecture follows microservices patterns with containerized deployment and automated CI/CD pipelines. Performance optimizations include lazy loading, code splitting, and efficient state management. Security implementations cover authentication protocols, data encryption, and input sanitization. Development workflow incorporates testing frameworks, code quality tools, and documentation standards for maintainable and scalable solutions.",

      genZ: "Okay, so this content is actually pretty fire and breaks down some complex stuff in a way that makes sense. The main points hit different because they're actually practical and not just theoretical nonsense. Key insights are giving major value - we're talking about real strategies that actually work in the real world, not just textbook theory. The approach is lowkey genius because it focuses on what matters most and cuts through all the fluff. No cap, this is the kind of content that actually helps you level up your game. The practical applications are chef's kiss because they're immediately actionable and don't require a PhD to understand. Bottom line: this content delivers exactly what it promises without the usual corporate speak. It's giving main character energy for anyone trying to improve their situation and actually get results."
    };

    return mockSummaries[mode as keyof typeof mockSummaries] || mockSummaries.standard;
  }

  static validateSummary(summary: string, mode: string): boolean {
    const config = this.SUMMARY_CONFIGS[mode];
    if (!config) return false;

    const wordCount = summary.split(/\s+/).filter(word => word.length > 0).length;
    
    // Check word count is within acceptable range
    if (wordCount > config.maxLength + 20) return false;
    
    // Check for required elements (basic validation)
    const lowerSummary = summary.toLowerCase();
    const hasRequiredElements = config.requirements.mustInclude.some(requirement => 
      lowerSummary.includes(requirement.toLowerCase())
    );
    
    return hasRequiredElements;
  }

  static getSummaryConfig(mode: string): SummaryConfig | null {
    return this.SUMMARY_CONFIGS[mode] || null;
  }

  static getAllModes(): string[] {
    return Object.keys(this.SUMMARY_CONFIGS);
  }
}