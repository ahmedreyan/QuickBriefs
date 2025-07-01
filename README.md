# QuickBriefs.ai - Free AI Content Summarization

Transform any content into intelligent summaries with Google Gemini AI. Completely free, forever.

## Features

- **100% Free Forever** - No subscriptions, no hidden costs, unlimited usage
- **Google Gemini AI** - Powered by Google's advanced AI for intelligent summarization
- **Multiple Summary Modes** - Business briefs, student summaries, code explanations, Gen Z style
- **Multiple Input Types** - URLs, YouTube videos, direct text input
- **Structured Output** - TL;DR sections and key points for easy consumption
- **Export Options** - Download summaries as Markdown files
- **Mobile Responsive** - Works perfectly on all devices

## Summary Modes

1. **Business Brief** - Strategic insights and actionable recommendations for professionals
2. **Student Summary** - Educational breakdowns perfect for studying and learning  
3. **Code Explainer** - Technical concepts simplified for developers
4. **Gen Z Style** - Casual, relatable summaries with modern language

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Google Gemini Pro API
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **UI Components**: shadcn/ui, Framer Motion
- **Deployment**: Vercel/Netlify ready

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Get a free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
5. Run the development server: `npm run dev`

## Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

## API Endpoints

- `POST /api/generate-brief` - Generate AI summaries
- `GET /api/user-credits` - Get user usage info (always returns unlimited for free service)

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

- Email: hello@quickbriefs.ai
- Discord: [Join our community](https://discord.gg/SNtfZUjrqD)
- Documentation: [View docs](/docs)

---

**QuickBriefs.ai** - Making AI-powered content summarization accessible to everyone, completely free.