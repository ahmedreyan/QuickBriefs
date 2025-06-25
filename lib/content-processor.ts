// Content processing utilities for different input types

export interface ProcessedContent {
  text: string;
  metadata: {
    title?: string;
    author?: string;
    publishDate?: string;
    wordCount: number;
    source: string;
  };
}

export class ContentProcessor {
  static async processUrl(url: string): Promise<ProcessedContent> {
    try {
      // In production, this would use cheerio to scrape the URL
      // For now, we'll return a mock response
      return {
        text: `Mock content extracted from URL: ${url}. This would contain the actual article text after web scraping.`,
        metadata: {
          title: "Sample Article Title",
          author: "Sample Author",
          publishDate: new Date().toISOString(),
          wordCount: 1500,
          source: url
        }
      };
    } catch (error) {
      throw new Error(`Failed to process URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async processYouTube(url: string): Promise<ProcessedContent> {
    try {
      // Extract video ID from URL
      const videoId = this.extractYouTubeVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // In production, this would use YouTube API to get transcript
      return {
        text: `Mock transcript content from YouTube video: ${videoId}. This would contain the actual video transcript.`,
        metadata: {
          title: "Sample YouTube Video",
          author: "Sample Channel",
          publishDate: new Date().toISOString(),
          wordCount: 800,
          source: url
        }
      };
    } catch (error) {
      throw new Error(`Failed to process YouTube video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async processText(text: string): Promise<ProcessedContent> {
    try {
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      
      return {
        text,
        metadata: {
          wordCount,
          source: 'direct_input'
        }
      };
    } catch (error) {
      throw new Error(`Failed to process text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  static validateContent(content: string, maxLength: number = 10000): boolean {
    return content.length > 0 && content.length <= maxLength;
  }

  static cleanText(text: string): string {
    // Remove excessive whitespace and normalize text
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
  }
}

// AI Summary Generator
export class SummaryGenerator {
  static generatePrompt(content: string, mode: 'business' | 'student' | 'code'): string {
    const basePrompt = `Please summarize the following content in exactly 100 words.`;
    
    const modePrompts = {
      business: `${basePrompt} Focus on key business insights, actionable recommendations, and strategic implications. Use executive language and highlight ROI, metrics, and decision-making factors.`,
      student: `${basePrompt} Create a clear, educational summary perfect for studying. Include main concepts, important facts, and learning objectives. Use simple language and organize information logically.`,
      code: `${basePrompt} Explain technical concepts in simple terms. Break down complex ideas, highlight key functions or methods, and provide practical understanding without jargon.`
    };

    return `${modePrompts[mode]}\n\nContent to summarize:\n${content}`;
  }

  static async generateSummary(content: string, mode: 'business' | 'student' | 'code'): Promise<string> {
    try {
      const prompt = this.generatePrompt(content, mode);
      
      // In production, this would integrate with OpenAI GPT-4
      // For now, we'll return a mock response
      const mockSummaries = {
        business: "This business analysis reveals key market opportunities and strategic advantages. The data indicates strong growth potential with 35% revenue increase projected. Implementation requires $50K investment with 6-month ROI timeline. Critical success factors include team training, technology upgrades, and customer acquisition strategies. Competitive analysis shows market gap opportunity. Risk mitigation involves diversified approach and phased rollout. Recommendation: proceed with pilot program to validate assumptions before full deployment. Expected outcomes include improved efficiency, reduced costs, and enhanced customer satisfaction leading to sustainable competitive advantage.",
        student: "The main concept revolves around systematic learning approaches and knowledge retention strategies. Key principles include active recall, spaced repetition, and interleaved practice. Research demonstrates that distributed practice sessions improve long-term memory consolidation by 40%. Important techniques involve creating mental models, connecting new information to existing knowledge, and regular self-testing. The study methodology emphasizes understanding over memorization, with practical applications in academic settings. Evidence suggests that multi-modal learning enhances comprehension. Students should implement these strategies gradually, focusing on consistency rather than intensity for optimal results and sustainable improvement.",
        code: "This technical implementation focuses on efficient data processing and user interface optimization. The codebase uses modern JavaScript frameworks with component-based architecture. Key functions handle API requests, state management, and responsive design patterns. Performance improvements include lazy loading, code splitting, and caching strategies. The system architecture follows MVC principles with clean separation of concerns. Database operations use optimized queries and indexing for faster response times. Error handling includes comprehensive logging and user-friendly feedback. Security measures implement input validation and authentication protocols. The solution provides scalable foundation for future enhancements and maintains backward compatibility."
      };

      return mockSummaries[mode];
    } catch (error) {
      throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static validateSummary(summary: string, targetWordCount: number = 100): boolean {
    const wordCount = summary.split(/\s+/).filter(word => word.length > 0).length;
    // Allow some flexibility in word count (±10 words)
    return wordCount >= targetWordCount - 10 && wordCount <= targetWordCount + 10;
  }
}