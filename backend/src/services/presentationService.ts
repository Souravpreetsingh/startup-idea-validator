import type { IStartupIdeaDocument } from '../models/StartupIdea'
import type { IAnalysisResultDocument } from '../models/AnalysisResult'
import logger from '../config/logger'

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
  logger.info('[PresentationService] Generating presentation', { title: idea.title, industry: idea.industry })

  const budget = idea.budget || 'To be determined'
  const audience = idea.targetAudience || 'Target market to be defined'
  const problem = idea.problemStatement || 'A problem that needs solving'
  const solution = idea.expectedSolution || 'An innovative solution'
  const model = idea.businessModel || 'To be determined'

  const ideaScore = analysis?.ideaScore ?? 75
  const probability = analysis?.successProbability ?? 70
  const strengths = analysis?.swot?.strengths?.slice(0, 3) || ['Clear value proposition', 'Strong market timing', 'Experienced team']
  const competitors = analysis?.competitors?.slice(0, 3) || []
  const revenues = analysis?.revenueSuggestions?.slice(0, 3) || ['Subscription revenue', 'Professional services', 'Usage-based pricing']
  const roadmap = analysis?.mvpRoadmap?.slice(0, 4) || ['MVP development (Month 1-2)', 'Beta launch (Month 3)', 'Market launch (Month 5)', 'Scale operations (Month 7+)']
  const growth = analysis?.growthStrategy || 'Multi-channel customer acquisition with focus on product-led growth'

  const slides: Slide[] = [
    {
      title: idea.title,
      content: 'Transforming the ' + idea.industry + ' landscape through innovation',
      bullets: [`Industry: ${idea.industry}`, `Business Model: ${model}`, `Target Market: ${audience}`],
      notes: 'Welcome everyone. Today I am excited to present ' + idea.title + ', a venture that addresses significant opportunities in the ' + idea.industry + ' space.',
    },
    {
      title: 'The Problem',
      content: problem,
      bullets: [`Current pain points in ${idea.industry}`, 'Inefficient existing solutions', 'Growing demand for better alternatives', 'Estimated market gap: $1B+ addressable opportunity'],
      notes: 'We have identified a critical problem that affects our target customers daily. Current solutions are expensive, complex, and fail to deliver adequate results.',
    },
    {
      title: 'Our Solution',
      content: solution,
      bullets: ['Innovative approach to solving the problem', 'Built for modern user expectations', '10x improvement over existing alternatives', 'Scalable architecture from day one'],
      notes: 'Our solution directly addresses the pain points we identified. We have designed it with the user at the center, ensuring it is intuitive, powerful, and scalable.',
    },
    {
      title: 'Market Opportunity',
      content: `The ${idea.industry} market represents a significant and growing opportunity.`,
      bullets: ['Large Total Addressable Market (TAM)', 'Growing at significant CAGR', 'Clear customer segments identified', 'Favorable market trends and tailwinds'],
      notes: 'The market timing is ideal. Industry trends, regulatory changes, and customer demand are aligning perfectly for our solution.',
    },
    {
      title: 'Product & Technology',
      content: 'Our product delivers core value through innovative technology.',
      bullets: ['Core features addressing key user needs', 'Modern tech stack for rapid iteration', 'Built-in analytics and reporting', 'API-first architecture for integrations'],
      notes: 'We have built a robust technology platform that allows us to iterate quickly while maintaining enterprise-grade reliability and security.',
    },
    {
      title: 'Business Model',
      content: `Our ${model} model ensures predictable, recurring revenue.`,
      bullets: [`Revenue streams: ${revenues.join(', ')}`],
      notes: 'Our business model is designed for sustainable growth with clear unit economics and a path to profitability.',
    },
    {
      title: 'Competitive Landscape',
      content: 'We have a clear competitive advantage in our space.',
      bullets: competitors.length > 0
        ? competitors.map(c => `${c.name}: ${c.strengths.slice(0, 30)}`)
        : ['Limited direct competition in our niche', 'Existing solutions are outdated', 'Our approach is fundamentally different'],
      notes: 'Our competitive analysis reveals a clear opportunity. While there are existing players, none address the market the way we do.',
    },
    {
      title: 'Go-to-Market Strategy',
      content: growth,
      bullets: ['Customer acquisition through targeted channels', 'Strategic partnerships for distribution', 'Content marketing for organic growth', 'Sales team for enterprise accounts'],
      notes: 'Our GTM strategy is focused on efficient customer acquisition through a combination of inbound, outbound, and partnership channels.',
    },
    {
      title: 'Financial Projections',
      content: 'Strong unit economics with clear path to profitability.',
      bullets: [`Idea Score: ${ideaScore}/100`, `Success Probability: ${probability}%`, 'Projected revenue: ramping from initial launch', 'Clear milestones for each funding stage'],
      notes: 'Our financial model shows attractive unit economics with improving margins as we scale. We have identified the key metrics that drive our business.',
    },
    {
      title: 'The Team',
      content: 'Experienced team with domain expertise and execution capability.',
      bullets: ['Founder/team with relevant background', 'Domain expertise in ' + idea.industry, 'Advisory board with industry leaders', 'Strong technical execution capability'],
      notes: 'Our team combines deep domain knowledge with strong technical and business execution skills. We are the right team to execute on this vision.',
    },
    {
      title: 'Funding Ask',
      content: 'Seeking investment to accelerate product development and market penetration.',
      bullets: [`Budget: ${budget}`, 'Use of funds: Product development, Marketing, Team expansion', 'Timeline: 12-18 months runway', 'Milestones: MVP launch, initial customers, Series A readiness'],
      notes: 'We are seeking funding to execute our plan and reach key milestones that will position us for the next stage of growth.',
    },
    {
      title: 'Vision & Roadmap',
      content: 'Our long-term vision for transforming the industry.',
      bullets: roadmap,
      notes: 'Our vision extends beyond the initial product. We see a platform that becomes essential infrastructure for the industry.',
    },
  ]

  return { slides, theme: 'modern' }
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
