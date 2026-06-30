import type { IStartupIdeaDocument } from '../models/StartupIdea'
import logger from '../config/logger'

export interface InvestorMatch {
  investorType: string
  fundingStage: string
  estimatedFunding: string
  expectations: string
}

export interface InvestorOutput {
  investors: InvestorMatch[]
  fundingStage: string
  estimatedFunding: string
  pitchSuggestions: string[]
}

const investorProfiles: Record<string, InvestorMatch[]> = {
  'Healthcare': [
    { investorType: 'HealthTech VCs (e.g., Flare Capital, Define Ventures)', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$500K - $2M', expectations: 'Clinical validation, regulatory pathway clarity, strong founding team with domain expertise' },
    { investorType: 'Corporate Venture Arms (e.g., Optum Ventures, Kaiser Permanente Ventures)', fundingStage: 'Seed / Series A', estimatedFunding: '$2M - $5M', expectations: 'Pilot programs with healthcare systems, HIPAA compliance, clear ROI metrics' },
    { investorType: 'Government Grants (NIH, SBIR, STTR)', fundingStage: 'Grant funding', estimatedFunding: '$100K - $1M', expectations: 'Scientific rigor, clear methodology, potential for broad health impact' },
  ],
  'Fintech': [
    { investorType: 'Fintech-focused VCs (e.g., Ribbit Capital, Anthemis Group)', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$500K - $3M', expectations: 'MVP with initial traction, regulatory awareness, strong technical team' },
    { investorType: 'Bank Strategic Investors (e.g., Citi Ventures, Goldman Sachs)', fundingStage: 'Seed / Series A', estimatedFunding: '$2M - $10M', expectations: 'Partnership potential, compliance readiness, scalable technology' },
    { investorType: 'Accelerators (YC, Techstars Fintech, Plug and Play)', fundingStage: 'Pre-seed', estimatedFunding: '$100K - $500K', expectations: 'Clear problem statement, large addressable market, coachable founders' },
  ],
  'EdTech': [
    { investorType: 'EdTech VCs (e.g., Learn Capital, Reach Capital)', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$500K - $2M', expectations: 'Pilot results with schools/universities, clear learning outcome metrics, scalable content strategy' },
    { investorType: 'Impact Investors (e.g., Omidyar Network, Emerson Collective)', fundingStage: 'Seed / Series A', estimatedFunding: '$1M - $5M', expectations: 'Measurable educational impact, sustainable unit economics, diverse founding team' },
    { investorType: 'Corporate Training Budgets (B2B channel)', fundingStage: 'Revenue-based', estimatedFunding: '$200K - $1M (initial contracts)', expectations: 'Enterprise-ready product, integration with LMS, clear ROI for corporate clients' },
  ],
  'AI & Machine Learning': [
    { investorType: 'AI-focused VCs (e.g., Air Street Capital, Radical Ventures)', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$1M - $5M', expectations: 'Technical moat (novel architecture/data), impressive demo, strong research team' },
    { investorType: 'Cloud Platform Credits (AWS, Google, Microsoft)', fundingStage: 'Non-dilutive', estimatedFunding: '$50K - $250K in credits', expectations: 'Using their infrastructure, potential enterprise customer, technical viability' },
    { investorType: 'Deep Tech VCs (e.g., Lux Capital, DCVC)', fundingStage: 'Seed / Series A', estimatedFunding: '$3M - $10M', expectations: 'Published research or patents, clear commercialization path, defensible IP' },
  ],
  'SaaS': [
    { investorType: 'SaaS-focused VCs (e.g., SaaStr Fund, OpenView, Bessemer)', fundingStage: 'Seed', estimatedFunding: '$1M - $3M', expectations: '$5K+ MRR, 100+ active users, <5% monthly churn, clear ICP' },
    { investorType: 'Product-Led Growth Investors (e.g., Accel, Index Ventures)', fundingStage: 'Seed / Series A', estimatedFunding: '$3M - $15M', expectations: 'Strong product-market fit, viral coefficient >0.5, expanding ACV' },
    { investorType: 'Vertical SaaS Investors (e.g., Emergence Capital, Lightspeed)', fundingStage: 'Series A', estimatedFunding: '$5M - $15M', expectations: 'Dominance in a vertical, expansion roadmap, experienced founding team' },
  ],
  'E-commerce': [
    { investorType: 'D2C-focused VCs (e.g., Forerunner Ventures, True Ventures)', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$500K - $2M', expectations: 'Initial traction (revenue/customers), strong brand vision, community building' },
    { investorType: 'Marketplace Investors (e.g., Benchmark, NFX)', fundingStage: 'Seed', estimatedFunding: '$2M - $5M', expectations: 'Network effects demonstrated, supply-side liquidity, strong unit economics' },
    { investorType: 'Revenue-Based Financing (e.g., Shopify Capital, ClearCo)', fundingStage: 'Growth', estimatedFunding: '$50K - $2M (based on revenue)', expectations: 'Consistent monthly revenue, low refund rate, clear growth plan' },
  ],
  'Food & Beverage': [
    { investorType: 'FoodTech VCs (e.g., Acre Venture Partners, S2G Ventures)', fundingStage: 'Seed', estimatedFunding: '$1M - $3M', expectations: 'Product-market fit demonstration, supply chain validation, strong food science team' },
    { investorType: 'Restaurant Industry Angels', fundingStage: 'Pre-seed', estimatedFunding: '$250K - $1M', expectations: 'Operator experience, industry connections, proven concept' },
    { investorType: 'CPG Accelerators (e.g., Kraft Heinz Springboard, Chobani Incubator)', fundingStage: 'Pre-seed', estimatedFunding: '$50K - $250K', expectations: 'Scalable production, differentiated product, retail readiness' },
  ],
  'Real Estate': [
    { investorType: 'PropTech VCs (e.g., Navitas Capital, MetaProp)', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$500K - $3M', expectations: 'Industry partnerships, data advantages, clear regulatory compliance' },
    { investorType: 'Real Estate Family Offices', fundingStage: 'Seed / Series A', estimatedFunding: '$2M - $5M', expectations: 'Industry connections, pilot properties, strong operational plan' },
    { investorType: 'Construction/Development Accelerators', fundingStage: 'Pre-seed', estimatedFunding: '$100K - $500K', expectations: 'Industry expertise, working prototype, clear B2B value proposition' },
  ],
  'Sustainability & CleanTech': [
    { investorType: 'Climate Tech VCs (e.g., Breakthrough Energy Ventures, Lowercarbon Capital)', fundingStage: 'Seed / Series A', estimatedFunding: '$2M - $10M', expectations: 'Scientific validation, clear carbon impact metrics, scalable technology' },
    { investorType: 'Government Climate Funds (DOE, ARPA-E, EIB)', fundingStage: 'Grant / Non-dilutive', estimatedFunding: '$500K - $5M', expectations: 'Technical feasibility, environmental impact, job creation potential' },
    { investorType: 'Corporate Sustainability Funds', fundingStage: 'Seed / Series A', estimatedFunding: '$1M - $5M', expectations: 'Alignment with ESG goals, partnership potential, measurable outcomes' },
  ],
  'Gaming': [
    { investorType: 'Gaming VCs (e.g., Makers Fund, Bitkraft Ventures, Griffin Gaming Partners)', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$500K - $3M', expectations: 'Vertical slice/demo, community building, genre expertise' },
    { investorType: 'Platform Funds (Unity, Epic Games, Roblox)', fundingStage: 'Grant / Investment', estimatedFunding: '$50K - $500K', expectations: 'Platform usage, exclusive or early access content, growth potential' },
    { investorType: 'Gaming Angels (ex-game founders/execs)', fundingStage: 'Pre-seed', estimatedFunding: '$250K - $1M', expectations: 'Proven game design team, clear vision, genre opportunity' },
  ],
  'Social Media': [
    { investorType: 'Social/Consumer VCs (e.g., a16z Consumer, Sequoia Consumer)', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$1M - $5M', expectations: 'User engagement metrics, viral coefficient, community health, strong product sense' },
    { investorType: 'Creator Economy Investors (e.g., SignalFire, Patreon-backers)', fundingStage: 'Seed', estimatedFunding: '$2M - $5M', expectations: 'Creator adoption, distribution strategy, monetization potential' },
    { investorType: 'Community Platform Accelerators', fundingStage: 'Pre-seed', estimatedFunding: '$100K - $500K', expectations: 'Active beta community, clear differentiation from incumbents, moderation plan' },
  ],
}

export async function matchInvestors(idea: {
  title: string
  description: string
  industry: string
  businessModel?: string
  budget?: string
}): Promise<InvestorOutput> {
  logger.info('[InvestorService] Generating investor matches', { title: idea.title, industry: idea.industry })

  const matches = investorProfiles[idea.industry] || [
    { investorType: 'Generalist Early-Stage VCs', fundingStage: 'Pre-seed / Seed', estimatedFunding: '$500K - $2M', expectations: 'Strong founding team, large addressable market, initial traction' },
    { investorType: 'Angel Investors / Syndicates', fundingStage: 'Pre-seed', estimatedFunding: '$100K - $500K', expectations: 'Domain expertise, MVP with user feedback, clear use of funds' },
    { investorType: 'Accelerator Programs (YC, Techstars, 500 Global)', fundingStage: 'Pre-seed', estimatedFunding: '$100K - $500K', expectations: 'Full-time founders, coachable team, large ambition' },
  ]

  let budget = 0
  if (idea.budget) {
    const parsed = parseInt(idea.budget.replace(/[^0-9]/g, ''))
    if (!isNaN(parsed)) budget = parsed
  }

  let fundingStage: string
  let estimatedFunding: string

  if (budget >= 50000) {
    fundingStage = 'Seed / Series A'
    estimatedFunding = '$500K - $5M'
  } else if (budget >= 10000) {
    fundingStage = 'Pre-seed / Seed'
    estimatedFunding = '$250K - $2M'
  } else {
    fundingStage = 'Pre-seed'
    estimatedFunding = '$50K - $500K'
  }

  const pitchSuggestions = [
    `Lead with the ${idea.industry} market opportunity and your team's unique insight into this space`,
    `Demonstrate early validation: customer interviews, pilot users, or initial revenue signals`,
    `Show clear unit economics and a path to profitability within 18-24 months of funding`,
    `Highlight your competitive advantage — why your team can execute where others have failed`,
    `Have a specific, well-defined use of funds with measurable milestones for the next 12-18 months`,
  ]

  return {
    investors: matches,
    fundingStage,
    estimatedFunding,
    pitchSuggestions,
  }
}
