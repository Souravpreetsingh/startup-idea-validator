import type { IStartupIdeaDocument } from '../models/StartupIdea'
import type { IAnalysisResultDocument } from '../models/AnalysisResult'
import logger from '../config/logger'

export interface MentorRecommendation {
  mentorType: string
  expertise: string[]
  skillsNeeded: string[]
  guidanceTopics: string[]
  suggestedBackground: string
}

const mentorProfiles: Record<string, MentorRecommendation[]> = {
  'Healthcare': [
    {
      mentorType: 'HealthTech Founder / CEO',
      expertise: ['Healthcare regulation (HIPAA, FDA)', 'Hospital sales cycles', 'Clinical validation'],
      skillsNeeded: ['Regulatory strategy', 'Enterprise healthcare sales', 'Clinical trial design'],
      guidanceTopics: ['Navigating FDA clearance', 'Hospital procurement process', 'Building a clinical advisory board'],
      suggestedBackground: 'A founder who has taken a HealthTech product from concept to hospital deployment, ideally with experience navigating HIPAA compliance and FDA regulations.',
    },
    {
      mentorType: 'Healthcare Industry Veteran / Physician Executive',
      expertise: ['Clinical workflow understanding', 'Provider network relationships', 'Medical affairs'],
      skillsNeeded: ['Clinical terminology and workflows', 'KOL relationship building', 'Value-based care models'],
      guidanceTopics: ['Understanding clinician pain points', 'Designing for clinical workflows', 'Building key opinion leader relationships'],
      suggestedBackground: 'An MD or PhD with startup experience who can bridge the gap between clinical needs and technology solutions.',
    },
  ],
  'Fintech': [
    {
      mentorType: 'Fintech Founder / CTO',
      expertise: ['Payment infrastructure', 'Regulatory compliance', 'Banking partnerships'],
      skillsNeeded: ['Compliance and licensing strategy', 'Bank partnership development', 'Fraud prevention architecture'],
      guidanceTopics: ['Choosing the right regulatory framework', 'Building banking partnerships', 'Scaling payment infrastructure'],
      suggestedBackground: 'A technical founder who has built and scaled a fintech product through regulatory hurdles and achieved significant transaction volume.',
    },
    {
      mentorType: 'Banking / Payments Executive',
      expertise: ['Financial services strategy', 'Risk management', 'Distribution partnerships'],
      skillsNeeded: ['Capital planning', 'Risk assessment frameworks', 'B2B partnership negotiation'],
      guidanceTopics: ['Navigating bank partnerships', 'Understanding capital requirements', 'Distribution through financial institutions'],
      suggestedBackground: 'A senior banking executive who understands both traditional finance and fintech disruption, with network in the financial services industry.',
    },
  ],
  'EdTech': [
    {
      mentorType: 'EdTech Growth Executive',
      expertise: ['K-12 / Higher Ed sales', 'Curriculum design', 'Learning science'],
      skillsNeeded: ['School district procurement', 'Learning outcome measurement', 'Content strategy'],
      guidanceTopics: ['Navigating school district sales cycles', 'Measuring learning outcomes', 'Building content that drives engagement'],
      suggestedBackground: 'An experienced EdTech operator who has successfully sold to school districts or universities and understands learning science principles.',
    },
  ],
  'AI & Machine Learning': [
    {
      mentorType: 'AI Research Scientist / ML Engineer',
      expertise: ['Model architecture', 'Training pipelines', 'MLOps'],
      skillsNeeded: ['Model optimization for production', 'Data pipeline architecture', 'ML infrastructure'],
      guidanceTopics: ['Choosing the right model architecture', 'Building scalable training pipelines', 'MLOps best practices'],
      suggestedBackground: 'A senior ML engineer or research scientist with experience deploying models to production at scale, ideally from a leading AI lab or tech company.',
    },
    {
      mentorType: 'AI Product Leader',
      expertise: ['AI product-market fit', 'User experience with AI', 'AI ethics'],
      skillsNeeded: ['Product strategy for AI', 'User research for AI products', 'Responsible AI practices'],
      guidanceTopics: ['Finding product-market fit with AI', 'Designing AI user experiences', 'Building responsible AI systems'],
      suggestedBackground: 'A product leader who has shipped AI-powered products to millions of users, understanding both technical capabilities and user needs.',
    },
  ],
  'SaaS': [
    {
      mentorType: 'SaaS Growth Expert',
      expertise: ['PLG strategy', 'Sales-led growth', 'Customer success'],
      skillsNeeded: ['Pricing and packaging', 'Sales process design', 'Customer success operations'],
      guidanceTopics: ['Building a product-led growth engine', 'Designing pricing tiers', 'Reducing churn through customer success'],
      suggestedBackground: 'A SaaS operator who has scaled a company from zero to $10M+ ARR with experience in both PLG and enterprise sales motions.',
    },
  ],
  'E-commerce': [
    {
      mentorType: 'D2C Brand Builder',
      expertise: ['Brand strategy', 'Customer acquisition', 'Retention marketing'],
      skillsNeeded: ['Performance marketing', 'Email/SMS marketing', 'Customer lifetime value optimization'],
      guidanceTopics: ['Brand positioning in crowded markets', 'Customer acquisition channel mix', 'Building customer loyalty programs'],
      suggestedBackground: 'A founder or marketing executive who has built a D2C brand from zero to significant revenue, with expertise in performance marketing and brand building.',
    },
  ],
  'Sustainability & CleanTech': [
    {
      mentorType: 'CleanTech Founder / CTO',
      expertise: ['Climate technology', 'Hardware-software integration', 'Grant funding'],
      skillsNeeded: ['Technology commercialization', 'Government grant writing', 'Carbon impact measurement'],
      guidanceTopics: ['Commercializing climate technology', 'Navigating government grants and incentives', 'Measuring and communicating carbon impact'],
      suggestedBackground: 'A founder who has taken a climate technology from R&D to commercial deployment, with experience in both technology development and fundraising.',
    },
  ],
}

export async function recommendMentors(
  idea: IStartupIdeaDocument,
  analysis?: IAnalysisResultDocument | null,
  userGoals?: string,
): Promise<MentorRecommendation> {
  logger.info('[MentorService] Generating mentor recommendations', { title: idea.title, industry: idea.industry })

  const industryMentors = mentorProfiles[idea.industry]
  const generalMentor: MentorRecommendation = {
    mentorType: `Experienced ${idea.industry} Founder`,
    expertise: [idea.industry, 'Startup Growth', 'Fundraising', 'Team Building'],
    skillsNeeded: ['Product-Market Fit', 'Go-to-Market Strategy', 'Team Building', 'Fundraising'],
    guidanceTopics: ['Validating your business model', 'Finding product-market fit', 'Raising your first round', 'Building your founding team'],
    suggestedBackground: `A founder who has built and scaled a company in the ${idea.industry} space, ideally with exit experience and relevant network in the industry.`,
  }

  if (industryMentors && industryMentors.length > 0) {
    const mentor = industryMentors[0]

    if (analysis) {
      const weaknesses = analysis.swot?.weaknesses || []
      if (weaknesses.length > 0) {
        mentor.suggestedBackground += ` This mentor is particularly suited to address your key weaknesses: ${weaknesses.slice(0, 2).join(', ')}.`
      }
    }

    if (userGoals) {
      mentor.guidanceTopics.push(`Achieving your specific goal: ${userGoals}`)
    }

    return mentor
  }

  return generalMentor
}
