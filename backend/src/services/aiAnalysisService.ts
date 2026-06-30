import { env } from '../config/env'
import { IStartupIdeaDocument } from '../models/StartupIdea'
import logger from '../config/logger'

const TIMEOUT_MS = 30000

export interface Competitor {
  name: string
  strengths: string
  weaknesses: string
}

export interface Swot {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface AnalysisOutput {
  ideaScore: number
  marketDemand: string
  competition: string
  competitors: Competitor[]
  swot: Swot
  revenueSuggestions: string[]
  growthStrategy: string
  mvpRoadmap: string[]
  successProbability: number
}

const industryProfiles: Record<string, {
  marketGrowth: string
  competitionLevel: string
  avgScore: number
  trends: string[]
  challenges: string[]
}> = {
  'Healthcare': {
    marketGrowth: 'The healthcare SaaS market is growing at 15.7% CAGR, driven by digital transformation and regulatory mandates for electronic health records.',
    competitionLevel: 'Moderately competitive with established players like Epic and Cerner, but significant room for vertical-specific solutions.',
    avgScore: 72,
    trends: ['Telemedicine adoption accelerating', 'AI-powered diagnostics demand', 'Value-based care models gaining traction'],
    challenges: ['Regulatory compliance (HIPAA, GDPR)', 'Long enterprise sales cycles', 'Integration with legacy systems'],
  },
  'Fintech': {
    marketGrowth: 'Global fintech market projected to reach $882B by 2030 at 16.5% CAGR, with strong growth in payments, lending, and insurtech.',
    competitionLevel: 'Highly competitive with well-funded startups and incumbent banks digitizing rapidly.',
    avgScore: 75,
    trends: ['Embedded finance becoming standard', 'Decentralized finance (DeFi) maturing', 'BNPL and alternative credit scoring on the rise'],
    challenges: ['Regulatory hurdles and licensing requirements', 'High customer acquisition costs', 'Security and fraud prevention'],
  },
  'EdTech': {
    marketGrowth: 'EdTech market expected to grow to $740B by 2030 at 16.5% CAGR, accelerated by hybrid learning models.',
    competitionLevel: 'Fragmented market with many niche players but few dominant platforms outside of Coursera and Udemy.',
    avgScore: 68,
    trends: ['Personalized learning paths using AI', 'Micro-credentials and skills-based hiring', 'Corporate training and upskilling demand'],
    challenges: ['Low user engagement and completion rates', 'School district budget constraints', 'Content quality consistency'],
  },
  'AI & Machine Learning': {
    marketGrowth: 'AI market projected to reach $1.8T by 2030 at 37% CAGR, the fastest-growing technology segment.',
    competitionLevel: 'Extremely competitive with massive investments, but high demand means opportunities in vertical applications.',
    avgScore: 78,
    trends: ['Generative AI transforming content creation', 'AI-powered automation across industries', 'Edge AI and on-device ML growing'],
    challenges: ['High compute costs and model training expenses', 'Data privacy concerns', 'Talent shortage and retention'],
  },
  'E-commerce': {
    marketGrowth: 'Global e-commerce market at $6.3T, growing at 10.4% CAGR with social commerce as the fastest segment.',
    competitionLevel: 'Extremely saturated with Amazon dominating, but niche D2C and specialized marketplaces still thrive.',
    avgScore: 65,
    trends: ['Social commerce and livestream shopping', 'Sustainability and ethical consumerism', 'Augmented reality try-before-you-buy'],
    challenges: ['Logistics and supply chain complexity', 'Thin margins and price wars', 'Customer retention vs acquisition costs'],
  },
  'SaaS': {
    marketGrowth: 'Global SaaS market expected to reach $720B by 2028 at 18% CAGR, driven by digital transformation across all sectors.',
    competitionLevel: 'Highly competitive with low barriers to entry, but niche B2B solutions with strong moats succeed.',
    avgScore: 70,
    trends: ['Product-led growth becoming standard', 'AI features becoming table stakes', 'Vertical SaaS outperforming horizontal'],
    challenges: ['High churn rates in SMB segment', 'Long sales cycles for enterprise', 'Integration complexity with existing tools'],
  },
  'Food & Beverage': {
    marketGrowth: 'Food tech market growing at 11.6% CAGR, with alternative proteins and food delivery leading growth.',
    competitionLevel: 'Very competitive in delivery and restaurant tech, but food production and supply chain innovation less crowded.',
    avgScore: 62,
    trends: ['Plant-based and alternative proteins', 'Smart kitchen and automation', 'Direct-to-consumer food brands'],
    challenges: ['Thin margins in food business', 'Supply chain volatility', 'Food safety regulations'],
  },
  'Real Estate': {
    marketGrowth: 'PropTech market growing at 16.3% CAGR, with smart buildings and digital mortgage leading transformation.',
    competitionLevel: 'Moderately competitive with Zillow and CoStar dominating, but commercial and niche residential segments open.',
    avgScore: 67,
    trends: ['Virtual property tours becoming standard', 'AI-powered property valuation', 'Co-living and flexible workspace models'],
    challenges: ['Interest rate sensitivity', 'Regulatory and zoning complexities', 'Offline relationship-driven nature of deals'],
  },
  'Sustainability & CleanTech': {
    marketGrowth: 'CleanTech market projected to reach $3.4T by 2030 at 22% CAGR, driven by climate regulations and consumer demand.',
    competitionLevel: 'Growing rapidly with increasing VC interest, but still less crowded than traditional tech sectors.',
    avgScore: 76,
    trends: ['Carbon accounting and offset markets', 'Circular economy business models', 'Renewable energy management platforms'],
    challenges: ['High upfront capital requirements', 'Regulatory uncertainty', 'Technology maturity and scalability'],
  },
  'Gaming': {
    marketGrowth: 'Global gaming market worth $385B, growing at 8.7% CAGR with mobile gaming leading.',
    competitionLevel: 'Extremely competitive in game development, but game tech tools and infrastructure less crowded.',
    avgScore: 68,
    trends: ['Cloud gaming expanding access', 'User-generated content platforms', 'Blockchain and digital ownership in games'],
    challenges: ['High development costs and timelines', 'Discovery and user acquisition costs', 'Monetization balancing user experience'],
  },
  'Social Media': {
    marketGrowth: 'Social media market at $223B, growing at 12.2% CAGR with creator economy and community platforms rising.',
    competitionLevel: 'Extremely competitive with network effects favoring incumbents, but niche communities still viable.',
    avgScore: 66,
    trends: ['Decentralized social networks emerging', 'Creator monetization tools', 'Audio-first and ephemeral content'],
    challenges: ['Moderation and trust issues', 'User attention competition', 'Regulatory scrutiny on data practices'],
  },
}

const businessModelProfiles: Record<string, { score: number; description: string; suggestions: string[] }> = {
  'SaaS': { score: 15, description: 'recurring subscription model providing predictable revenue', suggestions: ['Tiered subscription plans', 'Annual prepayment discounts', 'Usage-based add-ons'] },
  'Marketplace': { score: 13, description: 'two-sided network with take-rate commissions', suggestions: ['Transaction commission fees', 'Premium listing subscriptions', 'Featured placement charges'] },
  'E-commerce': { score: 10, description: 'direct product sales with inventory management', suggestions: ['Product bundling strategies', 'Subscription replenishment model', 'Wholesale/B2B channel'] },
  'Freemium': { score: 12, description: 'free tier for acquisition, premium for monetization', suggestions: ['Premium feature unlocks', 'Team/enterprise upgrades', 'API access fees'] },
  'Advertising': { score: 8, description: 'user attention monetized through ads', suggestions: ['Targeted advertising tiers', 'Sponsored content partnerships', 'Data insights reports'] },
  'Subscription': { score: 14, description: 'recurring revenue with customer retention focus', suggestions: ['Monthly/annual billing options', 'Loyalty rewards programs', 'Premium content gating'] },
  'One-time Purchase': { score: 7, description: 'single transaction with upsell opportunities', suggestions: ['Post-purchase upsells', 'Maintenance/support contracts', 'Add-on feature purchases'] },
  'Consulting': { score: 9, description: 'service-based revenue with scaling challenges', suggestions: ['Productize consulting offerings', 'Retainer agreements', 'Training and certification programs'] },
}

const awardGenerators = [
  (is: number) => is >= 85 ? 'Disruptor of the Year' : null,
  (is: number) => is >= 75 && is < 85 ? 'High Potential Venture' : null,
  (is: number) => is >= 65 && is < 75 ? 'Promising Startup' : null,
  (is: number) => is >= 50 && is < 65 ? 'Needs Refinement' : null,
  (is: number) => is < 50 ? 'Early Stage Concept' : null,
]

const modelGenerators = [
  'Revenue-based financing: align repayments with revenue for flexible capital.',
  'Strategic partnerships: leverage established distribution channels for rapid growth.',
  'Platform ecosystem play: build APIs and integrations to become infrastructure.',
  'Content marketing funnel: create authority content driving organic acquisition.',
  'Community-led growth: build user community driving retention and referrals.',
  'Land and expand: start with small teams, expand org-wide post-adoption.',
]

function generateScoring(idea: IStartupIdeaDocument): { ideaScore: number; successProbability: number } {
  let score = 50

  const industry = industryProfiles[idea.industry]
  if (industry) {
    score += (industry.avgScore - 50) * 0.3
  }

  if (idea.businessModel && businessModelProfiles[idea.businessModel]) {
    score += businessModelProfiles[idea.businessModel].score * 0.5
  }

  if (idea.targetAudience && idea.targetAudience.length > 10) {
    score += 5
  }
  if (idea.problemStatement && idea.problemStatement.length > 30) {
    score += 5
  }
  if (idea.expectedSolution && idea.expectedSolution.length > 30) {
    score += 5
  }
  if (idea.description && idea.description.length > 100) {
    score += 5
  }

  if (idea.budget) {
    const budget = parseInt(idea.budget.replace(/[^0-9]/g, ''))
    if (!isNaN(budget)) {
      if (budget >= 100000) score += 8
      else if (budget >= 50000) score += 5
      else if (budget >= 10000) score += 3
      else if (budget >= 5000) score += 1
    }
  }

  score = Math.max(10, Math.min(98, Math.round(score)))
  const probability = Math.max(5, Math.min(95, score + Math.round(Math.random() * 10 - 5)))

  return { ideaScore: score, successProbability: probability }
}

function generateMarketDemand(idea: IStartupIdeaDocument): string {
  const industry = industryProfiles[idea.industry]
  const base = industry
    ? industry.marketGrowth
    : 'The market for this solution is emerging with growing awareness and adoption.'

  const audienceSpecificity = idea.targetAudience && idea.targetAudience.length > 10
    ? ' Your clearly defined target audience suggests strong product-market fit potential.'
    : ' Consider narrowing your target audience to increase market penetration.'

  const problemRelevance = idea.problemStatement && idea.problemStatement.length > 30
    ? ' The problem you address has clear market pain points, indicating genuine demand.'
    : ' Validating the problem severity with potential customers is recommended before full development.'

  return `${base}${audienceSpecificity}${problemRelevance}`
}

function generateCompetition(idea: IStartupIdeaDocument): string {
  const industry = industryProfiles[idea.industry]

  if (industry) {
    const trend = industry.trends[Math.floor(Math.random() * industry.trends.length)]
    const challenge = industry.challenges[Math.floor(Math.random() * industry.challenges.length)]
    return `${industry.competitionLevel} Key trend to watch: ${trend}. Major challenge: ${challenge}.`
  }

  return 'The competitive landscape varies by segment. Early market research and competitive analysis are essential to identify direct and indirect competitors.'
}

function generateCompetitors(idea: IStartupIdeaDocument): Competitor[] {
  const competitorPool: Record<string, Competitor[]> = {
    'Healthcare': [
      { name: 'Epic Systems', strengths: 'Dominant EHR market share, massive installed base', weaknesses: 'Slow innovation, complex integration, high costs' },
      { name: 'Cerner (Oracle Health)', strengths: 'Strong analytics, cloud migration support', weaknesses: 'Post-acquisition integration uncertainty, customer support issues' },
      { name: 'Practice Fusion', strengths: 'Free EHR offering, large SMB user base', weaknesses: 'Limited features, data monetization concerns' },
    ],
    'Fintech': [
      { name: 'Stripe', strengths: 'Developer-first platform, global reach', weaknesses: 'Complex pricing, limited support for regulated verticals' },
      { name: 'Plaid', strengths: 'Data aggregation leadership, strong API docs', weaknesses: 'Narrow focus on data connectivity, regulatory risks' },
      { name: 'Square (Block)', strengths: 'Integrated payments + POS ecosystem', weaknesses: 'SMB focus limits enterprise appeal' },
    ],
    'EdTech': [
      { name: 'Coursera', strengths: 'Top university partnerships, recognized credentials', weaknesses: 'Low completion rates, generic learning paths' },
      { name: 'Udemy', strengths: 'Vast course library, marketplace model', weaknesses: 'Variable quality, instructor retention challenges' },
      { name: 'Khan Academy', strengths: 'Free content, strong K-12 brand', weaknesses: 'Limited monetization, narrow subject range' },
    ],
    'AI & Machine Learning': [
      { name: 'OpenAI', strengths: 'Foundation model leadership, massive compute resources', weaknesses: 'High API costs, model control limitations, privacy concerns' },
      { name: 'Hugging Face', strengths: 'Open-source ecosystem, community-driven', weaknesses: 'Monetization model evolving, enterprise support maturing' },
      { name: 'Anthropic', strengths: 'Safety-first approach, strong enterprise interest', weaknesses: 'Smaller ecosystem, limited third-party integrations' },
    ],
    'E-commerce': [
      { name: 'Amazon', strengths: 'Prime ecosystem, logistics dominance, customer trust', weaknesses: 'Third-party seller scrutiny, counterfeit challenges' },
      { name: 'Shopify', strengths: 'Merchant-friendly platform, extensive app ecosystem', weaknesses: 'Vendor lock-in, transaction fees, scaling costs' },
      { name: 'Etsy', strengths: 'Handmade/niche focus, engaged community', weaknesses: 'Growth limitations in non-niche categories' },
    ],
    'SaaS': [
      { name: 'Salesforce', strengths: 'CRM market leader, AppExchange ecosystem', weaknesses: 'High total cost of ownership, complex customization' },
      { name: 'Atlassian', strengths: 'Strong developer tools, bottom-up adoption model', weaknesses: 'Limited enterprise support, feature fragmentation' },
      { name: 'HubSpot', strengths: 'Inbound marketing authority, all-in-one platform', weaknesses: 'Pricing escalates quickly, limited deep functionality' },
    ],
    'Food & Beverage': [
      { name: 'DoorDash', strengths: 'Largest US delivery market share, logistics tech', weaknesses: 'Unprofitable unit economics, driver classification risks' },
      { name: 'Uber Eats', strengths: 'Global presence, Uber cross-sell opportunities', weaknesses: 'Brand perception issues, intense competition' },
      { name: 'HelloFresh', strengths: 'Meal kit leader, data-driven personalization', weaknesses: 'Logistics costs, high churn rate' },
    ],
    'Real Estate': [
      { name: 'Zillow', strengths: 'Massive user base, Zestimate data moat', weaknesses: 'Agent-centric model, limited transaction integration' },
      { name: 'CoStar', strengths: 'Commercial data dominance, professional tools', weaknesses: 'High subscription costs, limited consumer presence' },
      { name: 'Redfin', strengths: 'Integrated brokerage model, lower commission fees', weaknesses: 'Limited market coverage, agent productivity challenges' },
    ],
    'Sustainability & CleanTech': [
      { name: 'Climeworks', strengths: 'Direct air capture pioneer, strong partnerships', weaknesses: 'Extremely high costs, limited scalability' },
      { name: 'Watershed', strengths: 'Enterprise carbon accounting leader, strong team', weaknesses: 'Premium pricing, complex implementation' },
      { name: 'Tesla Energy', strengths: 'Brand power, integrated solar + storage', weaknesses: 'Service capacity constraints, premium pricing' },
    ],
    'Gaming': [
      { name: 'Unity', strengths: 'Cross-platform engine, strong indie community', weaknesses: 'Runtime fees controversy, complex licensing' },
      { name: 'Epic Games', strengths: 'Unreal Engine leadership, Fortnite ecosystem', weaknesses: 'Limited non-gaming adoption, legal battles' },
      { name: 'Roblox', strengths: 'UGC platform, monetization, social features', weaknesses: 'Young user base, moderation challenges' },
    ],
    'Social Media': [
      { name: 'TikTok', strengths: 'Algorithmic feed, viral potential, creator tools', weaknesses: 'Regulatory uncertainty, data privacy concerns' },
      { name: 'Discord', strengths: 'Community focus, gaming roots, voice quality', weaknesses: 'Limited monetization, niche perception' },
      { name: 'Reddit', strengths: 'Deep community engagement, authentic content', weaknesses: 'Moderation challenges, limited ad inventory' },
    ],
  }

  const competitors = competitorPool[idea.industry]
  if (competitors) {
    return competitors.slice(0, 3)
  }

  return [
    { name: 'Direct Competitor A', strengths: 'Established market presence and brand recognition', weaknesses: 'Slow to innovate, legacy technology stack' },
    { name: 'Direct Competitor B', strengths: 'Strong funding and aggressive growth strategy', weaknesses: 'Unprofitable, burning cash rapidly' },
    { name: 'Indirect Alternative', strengths: 'Different approach to same problem', weaknesses: 'Does not fully address core user needs' },
  ]
}

function generateSwot(idea: IStartupIdeaDocument): Swot {
  const industry = industryProfiles[idea.industry]
  const hasAudience = idea.targetAudience && idea.targetAudience.length > 10
  const hasProblem = idea.problemStatement && idea.problemStatement.length > 30
  const hasSolution = idea.expectedSolution && idea.expectedSolution.length > 30
  const hasBudget = idea.budget && parseInt(idea.budget.replace(/[^0-9]/g, '')) >= 10000

  const strengths = [
    `Clear focus on the ${idea.industry} industry with targeted solution design`,
    hasAudience ? `Well-defined target audience (${idea.targetAudience})` : 'Flexibility to pivot and refine target market',
    hasProblem ? `Addresses a specific, articulated problem in the market` : 'Opportunity to define and validate the core problem',
    hasSolution ? `Proposed solution directly addresses identified market gaps` : 'Open-ended solution space allows for iterative development',
    hasBudget ? `Adequate initial budget to develop MVP and conduct market validation` : 'Lean approach encourages efficient resource allocation',
  ]

  const weaknesses = [
    hasAudience ? 'Market education may be required for novel solutions' : 'Target audience needs sharper definition to focus marketing',
    hasProblem ? 'Solution complexity may extend development timeline' : 'Problem statement needs validation through customer discovery',
    !hasBudget && 'Limited budget may restrict development scope and runway',
    'Competitive hiring landscape for technical talent in this sector',
    'User acquisition costs may be higher than anticipated in initial projections',
  ].filter(Boolean)

  const opportunities = [
    industry ? industry.trends[0] : 'Growing market awareness of the problem creates tailwinds',
    industry ? industry.trends[1] : 'Technology advancements reduce development costs and time-to-market',
    'API and platform ecosystem enables faster integration and deployment',
    'Remote work trends expand available talent pool and reduce operational costs',
    'Increasing VC interest in this space provides funding optionality',
  ]

  const threats = [
    industry ? industry.challenges[0] : 'Regulatory changes could impact business model',
    industry ? industry.challenges[1] : 'Larger competitors may enter this space with more resources',
    'Economic downturn could affect customer budgets and spending',
    'Rapid technology changes may require premature pivots',
    'Data privacy regulations becoming stricter globally',
  ]

  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4) as string[],
    opportunities: opportunities.slice(0, 4),
    threats: threats.slice(0, 4),
  }
}

function generateRevenueSuggestions(idea: IStartupIdeaDocument): string[] {
  const modelSuggestions = idea.businessModel && businessModelProfiles[idea.businessModel]
    ? businessModelProfiles[idea.businessModel].suggestions
    : ['Tiered pricing model with free, pro, and enterprise plans', 'Usage-based pricing for scalability']

  const randomPick = () => modelGenerators[Math.floor(Math.random() * modelGenerators.length)]

  const suggestions = [...modelSuggestions]
  while (suggestions.length < 3) {
    const pick = randomPick()
    if (!suggestions.includes(pick)) suggestions.push(pick)
  }

  return suggestions.slice(0, 4)
}

function generateGrowthStrategy(idea: IStartupIdeaDocument): string {
  const industry = industryProfiles[idea.industry]
  const industryContext = industry
    ? `In the ${idea.industry} sector, `
    : ''

  const strategies = [
    `${industryContext}adopt a product-led growth approach with a free tier driving organic adoption, then convert users through value demonstration and team-based upsells.`,
    `${industryContext}focus on content marketing and thought leadership to build authority, combined with targeted outbound to ideal customer profiles identified through market research.`,
    `${industryContext}leverage strategic partnerships with existing platforms and complementary service providers to access established user bases and distribution channels.`,
    `${industryContext}implement a community-led growth strategy, building a user community that drives engagement, retention, and organic referrals through network effects.`,
    `${industryContext}pursue a vertical-first strategy, dominating a specific niche or geographic market before expanding horizontally into adjacent segments.`,
  ]

  return strategies[Math.floor(Math.random() * strategies.length)]
}

function generateMvpRoadmap(idea: IStartupIdeaDocument): string[] {
  return [
    `Month 1-2: Core feature development & MVP build with essential functionality for ${idea.industry}`,
    `Month 2-3: Alpha launch with 10-20 beta testers for initial validation and feedback collection`,
    `Month 3-4: Iterate based on feedback, add key integrations and polish UX`,
    `Month 4-5: Public beta launch with targeted customer acquisition campaign`,
    `Month 5-6: Full launch with pricing tiers, analytics, and customer success processes`,
  ]
}

export async function analyzeStartupIdea(idea: IStartupIdeaDocument): Promise<AnalysisOutput> {
  logger.info('[Analysis] Starting local rule-based analysis', { title: idea.title, industry: idea.industry })

  const { ideaScore, successProbability } = generateScoring(idea)

  const result: AnalysisOutput = {
    ideaScore,
    marketDemand: generateMarketDemand(idea),
    competition: generateCompetition(idea),
    competitors: generateCompetitors(idea),
    swot: generateSwot(idea),
    revenueSuggestions: generateRevenueSuggestions(idea),
    growthStrategy: generateGrowthStrategy(idea),
    mvpRoadmap: generateMvpRoadmap(idea),
    successProbability,
  }

  logger.info('[Analysis] Analysis completed', { score: ideaScore, probability: successProbability })
  return result
}
