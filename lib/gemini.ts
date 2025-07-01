// AI integration for text summarization (provider abstracted)

interface SummaryResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface SummaryRequest {
  content: string;
  mode: 'business' | 'student' | 'code' | 'genZ';
  inputType: 'url' | 'youtube' | 'upload';
}

interface SummaryResult {
  tldr: string;
  keyPoints: string[];
  originalWordCount: number;
  summaryWordCount: number;
  reductionPercentage: number;
  mode: string;
  processingTime: number;
  timestamp: string;
}

export class GeminiService {
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private static readonly MAX_CONTENT_LENGTH = 30000;
  private static readonly TIMEOUT_MS = 30000; // 30 second timeout

  // Summary mode prompts
  private static readonly PROMPTS = {
    business: `You are a sharp business analyst. Analyze the following content and provide a summary in this EXACT format:

**TL;DR:** [2-3 sentence paragraph with key business insights, strategic implications, and actionable takeaways]

**Key Points:**
• [Strategic insight or market opportunity]
• [Actionable recommendation with business impact]
• [Financial/operational implication]
• [Risk assessment or competitive advantage]
• [Implementation priority or next steps]

Focus on: ROI, market positioning, competitive advantages, strategic decisions, and business value. Be direct, data-driven, and executive-ready. No fluff.`,

    student: `You are a friendly study buddy. Break down the following content into an easy-to-understand summary in this EXACT format:

**TL;DR:** [2-3 sentences explaining the main concept in simple, clear language that's perfect for studying]

**Key Points:**
• [Main concept explained simply]
• [Important fact or principle to remember]
• [Practical application or example]
• [Connection to broader topic or field]
• [Study tip or memory aid]

Focus on: core concepts, learning objectives, practical examples, and study-friendly explanations. Make it clear, engaging, and perfect for retention.`,

    code: `You are a patient coding mentor. Explain the following technical content like I'm 5 (but skip the toys) in this EXACT format:

**TL;DR:** [2-3 sentences explaining what the code/concept does in plain English, focusing on the "why" and "how"]

**Key Points:**
• [What this code/concept actually does]
• [How it works (simplified explanation)]
• [When and why you'd use it]
• [Common gotchas or important details]
• [Best practices or next steps]

Focus on: practical understanding, real-world applications, simplified explanations, and actionable insights. No jargon unless absolutely necessary.`,

    genZ: `You're the coolest tech friend who explains things without being cringe. Break down this content in this EXACT format:

**TL;DR:** [2-3 sentences that hit different - explain the main vibe in a way that actually makes sense, no cap]

**Key Points:**
• [Main point that actually slaps]
• [Something that's lowkey important to know]
• [Real talk about why this matters]
• [The tea on how to use this info]
• [Final thoughts that are chef's kiss]

Focus on: being real, practical value, current vibes, and making complex stuff actually understandable. Keep it authentic but informative - we're not trying to be cringe here.`
  };

  static async generateSummary(request: SummaryRequest): Promise<SummaryResult> {
    const startTime = Date.now();

    try {
      // Validate input
      this.validateInput(request);

      // Get the appropriate prompt
      const prompt = this.buildPrompt(request.content, request.mode);

      // Call AI API
      const aiResponse = await this.callAIAPI(prompt);

      // Parse and format response
      const summary = this.parseAIResponse(aiResponse);

      // Calculate metrics
      const originalWordCount = this.countWords(request.content);
      const summaryWordCount = this.countWords(summary.tldr + ' ' + summary.keyPoints.join(' '));
      const reductionPercentage = Math.round(((originalWordCount - summaryWordCount) / originalWordCount) * 100);
      const processingTime = Date.now() - startTime;

      return {
        tldr: summary.tldr,
        keyPoints: summary.keyPoints,
        originalWordCount,
        summaryWordCount,
        reductionPercentage,
        mode: request.mode,
        processingTime,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  private static validateInput(request: SummaryRequest): void {
    if (!request.content || request.content.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }

    if (request.content.length > this.MAX_CONTENT_LENGTH) {
      throw new Error(`Content too long. Maximum ${this.MAX_CONTENT_LENGTH} characters allowed.`);
    }

    if (!['business', 'student', 'code', 'genZ'].includes(request.mode)) {
      throw new Error('Invalid summary mode');
    }

    // Check for minimum content length
    if (this.countWords(request.content) < 50) {
      throw new Error('Content too short. Please provide at least 50 words for meaningful summarization.');
    }
  }

  private static buildPrompt(content: string, mode: string): string {
    const basePrompt = this.PROMPTS[mode as keyof typeof this.PROMPTS];
    return `${basePrompt}\n\nContent to summarize:\n\n${content}`;
  }

  private static async callAIAPI(prompt: string): Promise<SummaryResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('AI API key not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`AI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please try again with shorter content');
      }
      
      throw error;
    }
  }

  private static parseAIResponse(response: SummaryResponse): { tldr: string; keyPoints: string[] } {
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No response generated from AI API');
    }

    const text = response.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('Empty response from AI API');
    }

    // Parse the structured response
    const tldrMatch = text.match(/\*\*TL;DR:\*\*\s*(.*?)(?=\*\*Key Points:\*\*)/s);
    const keyPointsMatch = text.match(/\*\*Key Points:\*\*\s*(.*?)$/s);

    if (!tldrMatch || !keyPointsMatch) {
      // Fallback parsing if format doesn't match exactly
      return this.fallbackParsing(text);
    }

    const tldr = tldrMatch[1].trim();
    const keyPointsText = keyPointsMatch[1].trim();
    
    // Extract bullet points
    const keyPoints = keyPointsText
      .split(/[•\-\*]\s*/)
      .filter(point => point.trim().length > 0)
      .map(point => point.trim())
      .slice(0, 5); // Limit to 5 key points

    return {
      tldr: tldr || 'Summary generated successfully.',
      keyPoints: keyPoints.length > 0 ? keyPoints : ['Key insights extracted from content.']
    };
  }

  private static fallbackParsing(text: string): { tldr: string; keyPoints: string[] } {
    // Split text into sentences and take first few as TL;DR
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const tldr = sentences.slice(0, 2).join('. ').trim() + '.';
    
    // Extract any bullet points or numbered items
    const bulletPoints = text.match(/[•\-\*\d+\.]\s*[^\n•\-\*\d+\.]+/g) || [];
    const keyPoints = bulletPoints
      .map(point => point.replace(/^[•\-\*\d+\.]\s*/, '').trim())
      .filter(point => point.length > 10)
      .slice(0, 5);

    return {
      tldr: tldr || 'Content summarized successfully.',
      keyPoints: keyPoints.length > 0 ? keyPoints : ['Key insights extracted from the provided content.']
    };
  }

  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'API configuration error. Please contact support.';
      }
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again with shorter content.';
      }
      if (error.message.includes('quota')) {
        return 'Service temporarily unavailable. Please try again later.';
      }
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }

  // Content extraction utilities
  static async extractFromUrl(url: string): Promise<string> {
    try {
      // In production, you'd use a service like Mercury Parser or Readability
      // For now, return a placeholder that indicates URL processing
      return `Content extracted from URL: ${url}. This would contain the actual article text after web scraping.`;
    } catch (error) {
      throw new Error('Failed to extract content from URL');
    }
  }

  static async extractFromYouTube(url: string): Promise<string> {
    try {
      // In production, you'd use YouTube API to get transcript
      const videoId = this.extractYouTubeVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      return `Transcript extracted from YouTube video: ${videoId}. This would contain the actual video transcript.`;
    } catch (error) {
      throw new Error('Failed to extract YouTube transcript');
    }
  }

  private static extractYouTubeVideoId(url: string): string | null {
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
}