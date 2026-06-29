import mammoth from 'mammoth'

export async function extractTextFromFile(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  if (mimetype === 'application/pdf') {
    // Basic PDF text extraction (without pdf-parse dep, use simple approach)
    const text = buffer.toString('utf-8')
      .replace(/\/Type\s*\/Page[^>]*>/g, '')
      .replace(/[^a-zA-Z0-9\s.,!?;:'"()-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return text.slice(0, 5000)
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value.slice(0, 5000)
  }

  throw new Error(`Unsupported file type: ${mimetype}. Please upload PDF or DOCX.`)
}

export function buildIdeaFromText(text: string) {
  const lines = text.split('\n').filter(Boolean)

  return {
    title: lines[0]?.slice(0, 200) || 'Uploaded Pitch',
    description: text.slice(0, 3000),
    industry: guessIndustry(text),
    problemStatement: text.slice(0, 1000),
    expectedSolution: text.slice(0, 1000),
  }
}

function guessIndustry(text: string): string {
  const keywords: Record<string, string[]> = {
    SaaS: ['saas', 'subscription', 'cloud', 'software'],
    Fintech: ['fintech', 'banking', 'payment', 'finance', 'blockchain'],
    HealthTech: ['health', 'medical', 'healthcare', 'wellness'],
    EdTech: ['education', 'learning', 'edtech', 'course'],
    AI: ['ai', 'machine learning', 'artificial intelligence', 'llm', 'gpt'],
    Ecommerce: ['ecommerce', 'shop', 'retail', 'marketplace'],
  }

  const lower = text.toLowerCase()
  let bestMatch = 'Technology'
  let bestCount = 0

  for (const [industry, words] of Object.entries(keywords)) {
    const count = words.filter((w) => lower.includes(w)).length
    if (count > bestCount) {
      bestCount = count
      bestMatch = industry
    }
  }

  return bestMatch
}
