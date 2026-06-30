import logger from '../config/logger'

const TIMEOUT_MS = 30000

interface ChatMessage {
  role: string
  content: string
}

const fallbackReply = 'I apologize, but I am unable to process your request at the moment. Please try again in a few moments.'

const startupAdvice: Record<string, string[]> = {
  'validation': [
    'Validating your startup idea starts with customer discovery. Interview 20-30 potential users to identify their pain points and willingness to pay. Use the "Mom Test" methodology to avoid biased feedback.',
    'The Lean Startup approach recommends building an MVP (Minimum Viable Product) with just enough features to test your core value proposition. Focus on one key assumption at a time.',
    'Create a problem-solution canvas: clearly define the problem, who has it, and how your solution is 10x better than existing alternatives. If you cannot articulate this in one sentence, refine further.',
  ],
  'fundraising': [
    'Fundraising stages typically follow: Pre-seed ($500K-$2M) from angels/accelerators, Seed ($2M-$5M) from VCs, Series A ($5M-$15M) for product-market fit scaling. Each stage requires different metrics.',
    'Your pitch deck should have 10-12 slides covering: Problem, Solution, Market Size, Product, Business Model, Traction, Competition, Team, Financials, Ask. Keep it visually clean, under 10MB.',
    'Venture capitalists invest in teams as much as ideas. Highlight your domain expertise, previous exits, or relevant experience. A strong team can pivot a weak idea, but a weak team cannot execute a great one.',
  ],
  'business model': [
    'SaaS with recurring revenue is the gold standard for predictable growth. Aim for $10K MRR to prove product-market fit, $100K MRR for Series A readiness.',
    'Marketplace businesses are hard to start (chicken-and-egg problem) but create powerful network effects. Focus on the supply side first in most cases.',
    'Freemium works best when the free tier acts as a funnel for paid conversions. Typical conversion rates are 2-5%. Ensure your paid features offer clear incremental value.',
  ],
  'marketing': [
    'Content marketing is the highest ROI channel for B2B startups. Publish每周 2-3 pieces targeting long-tail keywords relevant to your ICP. Expect 6-9 months to see meaningful organic traction.',
    'Product-led growth (PLG) means your product itself drives acquisition, retention, and expansion. Slack, Dropbox, and Calendly are classic PLG success stories.',
    'For B2C, focus on social media and viral loops. Dropbox\'s referral program (giving free storage for referrals) is the gold standard.',
  ],
  'competition': [
    'Use a competitive matrix mapping competitors on 2 axes: features vs ease-of-use, or price vs quality. Find whitespace where no one competes effectively.',
    'Blue Ocean Strategy suggests creating uncontested market space rather than fighting in crowded red oceans. Can you redefine the category?',
    'Direct competitors solve the same problem the same way. Indirect competitors solve the same problem differently. Substitutes solve a different problem but compete for the same budget.',
  ],
  'mvp': [
    'Your MVP should test your riskiest assumption first. Build the smallest possible thing that lets you learn whether customers will pay.',
    'A concierge MVP delivers the service manually behind the scenes to validate demand before building automation. This is faster and cheaper than building software first.',
    'The Wizard of Oz MVP looks automated to the user but is actually operated manually. Zappos started this way - the founder bought shoes from stores and shipped them himself.',
  ],
  'pricing': [
    'Value-based pricing captures more upside than cost-plus pricing. Research what customers currently pay for alternatives and price at a fraction of the value you create.',
    'Tiered pricing with 3 plans (Basic, Pro, Enterprise) is the most common SaaS model. Price the middle tier at what you want most customers to buy.',
    'Annual prepayment discounts of 15-20% improve cash flow and reduce churn. Offer a 30-day money-back guarantee to reduce purchase risk.',
  ],
  'team': [
    'The ideal founding team combines "Hipster, Hacker, and Hustler" - design, technology, and business expertise. Cover these three areas in your first 3 hires.',
    'Equity split should be based on future contribution, not past. Use a 4-year vesting with 1-year cliff for all co-founders. Equal splits are common but not always fair.',
    'Remote-first teams access wider talent pools but require strong async communication culture. Set clear written processes from day one.',
  ],
}

function getKeywordResponse(message: string): string | null {
  const lower = message.toLowerCase()

  const keywords: Record<string, string> = {
    'hello|hi|hey|greetings': "Hello! I'm Validator AI, your startup advisor. I can help with idea validation, fundraising, business models, marketing, competition analysis, MVP planning, pricing, and team building. What would you like to discuss?",
    'thank|thanks|appreciate': "You're welcome! Feel free to ask more questions as you build your startup. I'm here to help at every stage.",
    'help|what can you|capabilities': 'I specialize in: 1) Startup idea validation & market analysis, 2) Fundraising strategy & pitch deck review, 3) Business model design & monetization, 4) Competition analysis & positioning, 5) MVP planning & product strategy, 6) Pricing strategy, 7) Team building & equity planning. What area are you interested in?',
    'pitch deck|slides': 'A strong pitch deck has: 1) Clear problem statement, 2) Your unique solution, 3) Market size (TAM/SAM/SOM), 4) Business model, 5) Traction metrics, 6) Competition (with your advantage), 7) Team backgrounds, 8) Financial projections, 9) The ask (how much and what for). Keep it under 15 slides with minimal text per slide.',
  }

  for (const [pattern, response] of Object.entries(keywords)) {
    const regex = new RegExp(pattern)
    if (regex.test(lower)) {
      return response
    }
  }

  return null
}

function getAdviceForTopic(message: string): string | null {
  const lower = message.toLowerCase()

  for (const [topic, responses] of Object.entries(startupAdvice)) {
    if (lower.includes(topic)) {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  return null
}

function generateGeneralResponse(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('idea') || lower.includes('startup')) {
    return `Great question about your startup idea! To give you the best advice, I'd love to know more about:
1) What industry are you targeting?
2) Who is your target customer?
3) What problem are you solving?
4) What stage are you at (idea, MVP, launched)?

The more context you provide, the more specific my guidance can be.`
  }

  if (lower.includes('how') || lower.includes('what') || lower.includes('where') || lower.includes('why')) {
    return 'That is a great question! In general, startup success comes from: deeply understanding customer problems, building iteratively based on feedback, maintaining cash efficiency, and surrounding yourself with mentors who have relevant experience. Could you share more context so I can give a more specific answer?'
  }

  if (lower.length < 10) {
    return `I'm happy to help! I can assist with validating startup ideas, fundraising strategy, business models, competitor analysis, MVP planning, and more. What specific aspect of your startup would you like to explore?`
  }

  return `Thank you for sharing. Here are a few actionable steps to consider:

1) Validate your core assumption: What is the single riskiest assumption in your plan? Design an experiment to test it this week.

2) Talk to 10 potential customers: Ask about their current workflow, frustrations, and what they have tried. Do NOT pitch your solution.

3) Define your metric: Pick one north star metric that indicates real value delivery (not vanity metrics).

4) Start building your audience: Even before launch, start sharing insights related to your industry on LinkedIn or Twitter to build credibility.

Would you like me to dive deeper into any of these areas?`
}

function buildSystemPrompt(): string {
  return "You are Validator AI, an expert startup advisor. You provide concise, practical advice on startup validation, fundraising, business models, and growth."
}

export async function chatWithAI(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  logger.info('[AI Chat] Processing message', { message: message.slice(0, 60) })

  const trimmed = message.trim()
  if (!trimmed) return 'Please enter a message.'

  const keywordResponse = getKeywordResponse(trimmed)
  if (keywordResponse) return keywordResponse

  const adviceResponse = getAdviceForTopic(trimmed)
  if (adviceResponse) return adviceResponse

  return generateGeneralResponse(trimmed)
}
