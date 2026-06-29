import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import type { IStartupIdeaDocument } from '../models/StartupIdea'
import type { IAnalysisResultDocument } from '../models/AnalysisResult'
import logger from '../config/logger'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

export interface Slide {
  title: string
  content: string
  bullets: string[]
  notes?: string
}

interface PresentationOutput {
  slides: Slide[]
  theme: string
}

export async function generatePresentation(
  idea: IStartupIdeaDocument,
  analysis?: IAnalysisResultDocument | null,
): Promise<PresentationOutput> {
  const prompt = `You are a startup pitch deck designer. Create a compelling investor presentation for this startup.

Startup: "${idea.title}"
Industry: ${idea.industry}
Description: ${idea.description}
Target Audience: ${idea.targetAudience || 'N/A'}
Business Model: ${idea.businessModel || 'N/A'}
Budget: ${idea.budget || 'N/A'}
${analysis ? `
Analysis Score: ${analysis.ideaScore}/100
Success Probability: ${analysis.successProbability}%
Competitors: ${analysis.competitors.map(c => c.name).join(', ')}
Strengths: ${analysis.swot.strengths.join(', ')}
Revenue Models: ${analysis.revenueSuggestions.join(', ')}
Growth Strategy: ${analysis.growthStrategy}
` : ''}

Return ONLY valid JSON (no markdown):
{
  "theme": "modern | professional | creative | minimalist",
  "slides": [
    {
      "title": "Slide Title",
      "content": "Key message for this slide (1-2 sentences)",
      "bullets": ["bullet1", "bullet2", "bullet3"],
      "notes": "Speaker notes for presenting this slide"
    }
  ]
}

Required slides (in order):
1. Title Slide - startup name, tagline
2. Problem - the problem being solved
3. Solution - how the product solves it
4. Market Size - TAM/SAM/SOM
5. Product - key features and screenshots description
6. Business Model - revenue streams, pricing
7. Competition - competitive advantage
8. Marketing Strategy - go-to-market plan
9. Financial Projections - revenue forecast, key metrics
10. Team - founder backgrounds, advisors
11. Funding Ask - amount needed, use of funds
12. Vision - long-term vision and mission

Generate exactly 12 slides with compelling, investor-ready content.`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    const jsonStr = firstBrace !== -1 && lastBrace !== -1 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned
    const parsed: PresentationOutput = JSON.parse(jsonStr)

    if (!parsed.slides?.length) throw new Error('No slides generated')
    return parsed
  } catch (err) {
    logger.warn('[Presentation] AI generation failed, using fallback:', err)
    return {
      theme: 'modern',
      slides: [
        { title: idea.title, content: `${idea.description?.slice(0, 100)}...`, bullets: [`Industry: ${idea.industry}`], notes: 'Welcome everyone' },
        { title: 'Problem', content: 'The problem we are solving', bullets: [idea.problemStatement || 'Market gap identified'], notes: '' },
        { title: 'Solution', content: 'Our solution', bullets: [idea.expectedSolution || 'Innovative approach'], notes: '' },
        { title: 'Market Size', content: 'Large addressable market', bullets: ['Growing industry', 'Strong demand'], notes: '' },
        { title: 'Funding Ask', content: 'Seeking investment to scale', bullets: ['Product development', 'Marketing', 'Team growth'], notes: '' },
      ],
    }
  }
}

export function generateHtmlSlides(presentation: PresentationOutput): string {
  const slides = presentation.slides.map((slide, i) => `
    <div class="slide" style="display:${i === 0 ? 'flex' : 'none'};flex-direction:column;justify-content:center;align-items:center;min-height:100vh;padding:60px;page-break-after:always;">
      <h2 style="font-size:36px;margin-bottom:24px;color:#1c1b1a;">${slide.title}</h2>
      <p style="font-size:18px;color:#5e5d55;max-width:700px;text-align:center;margin-bottom:24px;">${slide.content}</p>
      <ul style="list-style:none;padding:0;">
        ${slide.bullets.map(b => `<li style="font-size:16px;color:#78776f;padding:8px 0;border-bottom:1px solid #e5e2df;">✦ ${b}</li>`).join('')}
      </ul>
      ${slide.notes ? `<p style="margin-top:24px;font-size:14px;color:#a09f98;font-style:italic;">${slide.notes}</p>` : ''}
    </div>
  `).join('')

  return `<!DOCTYPE html><html><head>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', system-ui, sans-serif; background: #fcf9f6; }
      @media print { .slide { page-break-after: always; } }
    </style>
  </head><body>${slides}</body></html>`
}
