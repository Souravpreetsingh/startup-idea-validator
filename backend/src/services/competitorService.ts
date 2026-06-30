import { CompetitorInsight, type ICompetitorDetail } from '../models/CompetitorInsight'
import type { IStartupIdeaDocument } from '../models/StartupIdea'
import logger from '../config/logger'

const competitorDatabase: Record<string, Omit<ICompetitorDetail, '_id'>[]> = {
  'Healthcare': [
    { name: 'Epic Systems', funding: '$2.5B+ total', strengths: ['Dominant EHR market share', 'Massive installed base of hospitals'], weaknesses: ['Slow innovation cycle', 'Complex integration', 'High total cost of ownership'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '250M+' },
    { name: 'Cerner (Oracle Health)', funding: '$5B+ total', strengths: ['Strong analytics capabilities', 'Cloud migration support'], weaknesses: ['Post-acquisition integration uncertainty', 'Customer support quality decline'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '200M+' },
    { name: 'Practice Fusion', funding: '$150M+', strengths: ['Free EHR offering', 'Large SMB user base'], weaknesses: ['Limited feature set', 'Data monetization concerns'], marketPosition: 'challenger', pricingStrategy: 'freemium', estimatedUserBase: '30M+' },
  ],
  'Fintech': [
    { name: 'Stripe', funding: '$8.7B', strengths: ['Developer-first platform', 'Global payment reach'], weaknesses: ['Complex pricing structure', 'Limited regulated vertical support'], marketPosition: 'market leader', pricingStrategy: 'per-unit', estimatedUserBase: 'Millions of businesses' },
    { name: 'Plaid', funding: '$3.1B', strengths: ['Data aggregation leadership', 'Strong API documentation'], weaknesses: ['Narrow focus on data connectivity', 'Regulatory risks in open banking'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '200M+' },
    { name: 'Square (Block)', funding: '$6B+', strengths: ['Integrated payments + POS ecosystem', 'Strong SMB brand'], weaknesses: ['SMB focus limits enterprise appeal', 'Thin margins on payment processing'], marketPosition: 'market leader', pricingStrategy: 'per-unit', estimatedUserBase: '50M+' },
  ],
  'EdTech': [
    { name: 'Coursera', funding: '$464M', strengths: ['Top university partnerships', 'Recognized credentials'], weaknesses: ['Low course completion rates', 'Generic learning paths'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '100M+' },
    { name: 'Udemy', funding: '$311M', strengths: ['Vast course library', 'Marketplace model for instructors'], weaknesses: ['Variable content quality', 'Instructor retention challenges'], marketPosition: 'market leader', pricingStrategy: 'one-time purchase', estimatedUserBase: '50M+' },
    { name: 'Khan Academy', funding: '$100M+ (non-profit)', strengths: ['Free high-quality content', 'Strong K-12 brand recognition'], weaknesses: ['Limited monetization options', 'Narrow subject range beyond K-12'], marketPosition: 'niche player', pricingStrategy: 'freemium', estimatedUserBase: '100M+' },
  ],
  'AI & Machine Learning': [
    { name: 'OpenAI', funding: '$13B+', strengths: ['Foundation model leadership', 'Massive compute resources'], weaknesses: ['High API costs', 'Limited model customization', 'Data privacy concerns'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '100M+' },
    { name: 'Hugging Face', funding: '$395M', strengths: ['Open-source ecosystem', 'Strong community'], weaknesses: ['Monetization model evolving', 'Enterprise support still maturing'], marketPosition: 'challenger', pricingStrategy: 'freemium', estimatedUserBase: '10M+' },
    { name: 'Anthropic', funding: '$7.6B', strengths: ['Safety-first approach', 'Strong enterprise interest'], weaknesses: ['Smaller ecosystem', 'Limited third-party integrations'], marketPosition: 'challenger', pricingStrategy: 'subscription', estimatedUserBase: 'Millions' },
  ],
  'E-commerce': [
    { name: 'Amazon', funding: 'Public (trillion-dollar market cap)', strengths: ['Prime ecosystem', 'Logistics dominance', 'Customer trust'], weaknesses: ['Third-party seller quality control', 'Counterfeit challenges'], marketPosition: 'market leader', pricingStrategy: 'per-unit', estimatedUserBase: '300M+' },
    { name: 'Shopify', funding: '$2B+', strengths: ['Merchant-friendly platform', 'Extensive app ecosystem'], weaknesses: ['Vendor lock-in concerns', 'Transaction fees', 'Scaling costs'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '2M+ merchants' },
    { name: 'Etsy', funding: 'Public ($20B+ market cap)', strengths: ['Handmade/niche focus', 'Engaged community', 'Strong brand'], weaknesses: ['Growth limitations outside niche', 'Seller fee increases'], marketPosition: 'niche player', pricingStrategy: 'per-unit', estimatedUserBase: '80M+' },
  ],
  'SaaS': [
    { name: 'Salesforce', funding: 'Public ($200B+ market cap)', strengths: ['CRM market leader', 'AppExchange ecosystem'], weaknesses: ['High total cost of ownership', 'Complex customization'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '150K+ companies' },
    { name: 'Atlassian', funding: 'Public ($60B+ market cap)', strengths: ['Strong developer tools', 'Bottom-up adoption model'], weaknesses: ['Limited enterprise support', 'Feature fragmentation across products'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '200K+ companies' },
    { name: 'HubSpot', funding: 'Public ($30B+ market cap)', strengths: ['Inbound marketing authority', 'All-in-one platform'], weaknesses: ['Pricing escalates quickly', 'Limited deep functionality per module'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '150K+ companies' },
  ],
  'Food & Beverage': [
    { name: 'DoorDash', funding: 'Public ($40B+ market cap)', strengths: ['Largest US delivery market share', 'Advanced logistics tech'], weaknesses: ['Unprofitable unit economics', 'Driver classification regulatory risks'], marketPosition: 'market leader', pricingStrategy: 'per-unit', estimatedUserBase: '30M+' },
    { name: 'Uber Eats', funding: 'Part of Uber ($120B+ market cap)', strengths: ['Global presence in 6,000+ cities', 'Uber cross-sell opportunities'], weaknesses: ['Brand perception challenges', 'Intense competition in every market'], marketPosition: 'market leader', pricingStrategy: 'per-unit', estimatedUserBase: '80M+' },
    { name: 'HelloFresh', funding: 'Public ($10B+ market cap)', strengths: ['Meal kit market leader', 'Data-driven personalization'], weaknesses: ['High logistics costs', 'Elevated churn rate'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '7M+' },
  ],
  'Real Estate': [
    { name: 'Zillow', funding: 'Public ($20B+ market cap)', strengths: ['Massive user base (200M+ monthly)', 'Zestimate valuation data moat'], weaknesses: ['Agent-centric business model', 'Limited transaction integration'], marketPosition: 'market leader', pricingStrategy: 'freemium', estimatedUserBase: '200M+' },
    { name: 'CoStar', funding: 'Public ($35B+ market cap)', strengths: ['Commercial real estate data dominance', 'Professional-grade tools'], weaknesses: ['High subscription costs', 'Limited consumer-facing products'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '5M+' },
    { name: 'Redfin', funding: 'Public ($5B+ market cap)', strengths: ['Integrated brokerage model', 'Lower commission fees'], weaknesses: ['Limited market coverage', 'Agent productivity challenges'], marketPosition: 'challenger', pricingStrategy: 'per-unit', estimatedUserBase: '40M+' },
  ],
  'Sustainability & CleanTech': [
    { name: 'Climeworks', funding: '$800M+', strengths: ['Direct air capture pioneer', 'Strong corporate partnerships'], weaknesses: ['Extremely high per-ton costs', 'Limited scalability at current tech'], marketPosition: 'niche player', pricingStrategy: 'subscription', estimatedUserBase: 'Enterprise partnerships' },
    { name: 'Watershed', funding: '$200M+', strengths: ['Enterprise carbon accounting leader', 'Strong founding team'], weaknesses: ['Premium pricing', 'Complex implementation for non-technical clients'], marketPosition: 'challenger', pricingStrategy: 'subscription', estimatedUserBase: '500+ companies' },
    { name: 'Tesla Energy', funding: 'Part of Tesla (trillion-dollar market cap)', strengths: ['Brand power', 'Integrated solar + battery storage'], weaknesses: ['Service capacity constraints', 'Premium pricing vs competitors'], marketPosition: 'market leader', pricingStrategy: 'one-time purchase', estimatedUserBase: 'Millions of users' },
  ],
  'Gaming': [
    { name: 'Unity Technologies', funding: 'Public ($15B+ market cap)', strengths: ['Cross-platform engine leadership', 'Strong indie developer community'], weaknesses: ['Runtime fee controversy', 'Complex licensing model'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '1.5M+ developers' },
    { name: 'Epic Games', funding: '$17B+ total', strengths: ['Unreal Engine leadership', 'Fortnite ecosystem'], weaknesses: ['Limited non-gaming engine adoption', 'Legal battles with Apple/Google'], marketPosition: 'market leader', pricingStrategy: 'freemium', estimatedUserBase: '500M+' },
    { name: 'Roblox Corporation', funding: 'Public ($40B+ market cap)', strengths: ['UGC platform with strong monetization', 'Addictive social gameplay'], weaknesses: ['Young user base (under 13)', 'Content moderation challenges'], marketPosition: 'market leader', pricingStrategy: 'freemium', estimatedUserBase: '200M+' },
  ],
  'Social Media': [
    { name: 'TikTok (ByteDance)', funding: 'Private ($300B+ valuation)', strengths: ['Algorithmic feed discovery', 'Viral organic reach', 'Creator monetization tools'], weaknesses: ['Regulatory uncertainty in US', 'Data privacy concerns'], marketPosition: 'market leader', pricingStrategy: 'advertising', estimatedUserBase: '1B+' },
    { name: 'Discord', funding: '$1B+', strengths: ['Community-focused design', 'Gaming roots with broad appeal', 'High-quality voice chat'], weaknesses: ['Perceived as gaming-only', 'Monetization still developing'], marketPosition: 'challenger', pricingStrategy: 'subscription', estimatedUserBase: '150M+' },
    { name: 'Reddit', funding: 'Public ($10B+ market cap)', strengths: ['Deep community engagement', 'Authentic content', 'Strong niche communities'], weaknesses: ['Moderation challenges', 'Limited ad inventory vs competitors'], marketPosition: 'niche player', pricingStrategy: 'advertising', estimatedUserBase: '500M+' },
  ],
}

function generateMarketPosition(idea: IStartupIdeaDocument, competitors: Omit<ICompetitorDetail, '_id'>[]): string {
  if (competitors.length === 0) {
    return `${idea.title} enters a ${idea.industry} market with potential to carve a niche. Early mover advantage is possible in underserved segments.`
  }

  const leaders = competitors.filter(c => c.marketPosition === 'market leader').length
  const challengers = competitors.filter(c => c.marketPosition === 'challenger').length

  if (leaders >= 2) {
    return `${idea.title} faces a market dominated by established leaders (${competitors.map(c => c.name).join(', ')}). Success requires differentiation through vertical specialization, superior UX, or innovative pricing. Focus on an underserved niche within ${idea.industry} rather than competing head-on.`
  }

  if (challengers >= 2) {
    return `The ${idea.industry} market has active challengers but no clear dominant player yet. ${idea.title} has an opportunity to establish leadership by moving quickly and building strong network effects before competitors entrench.`
  }

  return `${idea.title} enters the ${idea.industry} space with competitive positioning dependent on execution. Focus on a specific customer segment and deliver a 10x better experience compared to alternatives.`
}

export async function analyzeCompetitors(idea: IStartupIdeaDocument): Promise<ICompetitorDetail[]> {
  const existing = await CompetitorInsight.findOne({ ideaId: idea._id })
  if (existing && Date.now() - existing.generatedAt.getTime() < 3600000) {
    return existing.competitors
  }

  logger.info('[CompetitorService] Generating local competitor analysis', { title: idea.title, industry: idea.industry })

  const competitors = competitorDatabase[idea.industry] || [
    { name: 'Market Incumbent A', funding: '$500M+', strengths: ['Established market presence', 'Brand recognition'], weaknesses: ['Legacy technology stack', 'Slow innovation cycle'], marketPosition: 'market leader', pricingStrategy: 'subscription', estimatedUserBase: '10M+' },
    { name: 'Emerging Startup B', funding: '$50M+', strengths: ['Modern technology', 'Aggressive growth strategy'], weaknesses: ['Unprofitable operations', 'Limited market penetration'], marketPosition: 'challenger', pricingStrategy: 'freemium', estimatedUserBase: '1M+' },
    { name: 'Niche Player C', funding: 'Bootstrapped', strengths: ['Deep domain expertise', 'Loyal customer base'], weaknesses: ['Limited resources for scaling', 'Narrow feature set'], marketPosition: 'niche player', pricingStrategy: 'one-time purchase', estimatedUserBase: '100K+' },
  ]

  const marketPosition = generateMarketPosition(idea, competitors)

  const insight = await CompetitorInsight.findOneAndUpdate(
    { ideaId: idea._id },
    {
      ideaId: idea._id,
      userId: idea.userId,
      competitors,
      marketPosition,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  )

  return insight.competitors
}

export async function getCompetitorInsight(ideaId: string) {
  return CompetitorInsight.findOne({ ideaId })
}
