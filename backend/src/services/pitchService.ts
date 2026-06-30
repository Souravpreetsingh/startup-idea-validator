import logger from '../config/logger'

export interface PitchOutput {
  elevatorPitch: string
  oneMinutePitch: string
  detailedPitch: string
  problemStatement: string
  visionStatement: string
}

export async function generatePitch(idea: {
  title: string
  description: string
  industry: string
  problemStatement?: string
  expectedSolution?: string
}): Promise<PitchOutput> {
  logger.info('[PitchService] Generating pitch materials', { title: idea.title, industry: idea.industry })

  const problem = idea.problemStatement || 'A significant problem that affects many people in the ' + idea.industry + ' space'
  const solution = idea.expectedSolution || `An innovative ${idea.industry} solution that addresses this problem effectively`

  const elevatorPitch = `${idea.title} helps ${idea.industry} professionals ${problem.toLowerCase().includes('problem') ? 'solve their most critical challenges' : problem.toLowerCase().slice(0, 40)} — so they can focus on what matters most.`

  const oneMinutePitch = `Hi, I'm the founder of ${idea.title}.

${problem} This is a critical challenge that affects millions of people and businesses in the ${idea.industry} space. Current solutions are expensive, complex, and fail to deliver real results.

That's where we come in. ${solution}. Our approach is fundamentally different — we've built a solution that is 10x more efficient, easier to use, and delivers measurable results.

We're currently in [stage] and looking for [partners/investors] to help us scale. Our goal is to become the go-to platform for ${idea.industry} professionals worldwide.

Would you like to learn more?`

  const detailedPitch = `${idea.title} — Transforming the ${idea.industry} Landscape

PROBLEM:
${problem}
This problem affects a large and growing market. Current solutions are inadequate because they are [slow/expensive/complex], leaving customers frustrated and underserved.

SOLUTION:
${solution}
Our solution is designed from the ground up to address these gaps. Key differentiators include: user-centric design, modern technology stack, and a business model aligned with customer success.

MARKET:
The ${idea.industry} market is large and growing. We have identified clear customer segments and understand their needs deeply. Our go-to-market strategy focuses on [channels] to reach customers efficiently.

TRACTION:
We have [validation from customer interviews / MVP in development / initial users] and are on track to achieve key milestones in the coming months.

BUSINESS MODEL:
Our revenue model is designed for sustainable growth with clear unit economics.

THE ASK:
We are seeking [investment amount] to accelerate product development, build our team, and execute our go-to-market plan. With this investment, we will achieve [key milestones] within 12-18 months.`

  const visionStatement = `${idea.title}'s vision is to become the essential platform that transforms how ${idea.industry} professionals work, enabling them to achieve more with less effort and driving meaningful innovation across the industry.`

  return {
    elevatorPitch,
    oneMinutePitch,
    detailedPitch,
    problemStatement: problem,
    visionStatement,
  }
}
