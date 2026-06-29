import PDFDocument from 'pdfkit'
import { IAnalysisResultDocument } from '../models/AnalysisResult'
import { IStartupIdeaDocument } from '../models/StartupIdea'

function addSection(doc: PDFKit.PDFDocument, title: string, content: string) {
  doc.fontSize(16).font('Helvetica-Bold').text(title, { underline: true })
  doc.moveDown(0.5)
  doc.fontSize(12).font('Helvetica').text(content)
  doc.moveDown(1.5)
}

function addList(doc: PDFKit.PDFDocument, title: string, items: string[]) {
  doc.fontSize(16).font('Helvetica-Bold').text(title, { underline: true })
  doc.moveDown(0.5)
  doc.fontSize(12).font('Helvetica')
  items.forEach((item) => {
    doc.text(`• ${item}`)
  })
  doc.moveDown(1.5)
}

export function generateAnalysisPDF(
  analysis: IAnalysisResultDocument,
  idea: IStartupIdeaDocument
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.fontSize(24).font('Helvetica-Bold').text('Startup Analysis Report', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(14).font('Helvetica').text(idea.title, { align: 'center' })
    doc.moveDown(0.3)
    doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' })
    doc.moveDown(2)

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#cccccc')
    doc.moveDown(2)

    doc.fontSize(14).font('Helvetica-Bold').text(`Idea Score: ${analysis.ideaScore}/100`)
    doc.fontSize(14).font('Helvetica-Bold').text(`Success Probability: ${analysis.successProbability}%`)
    doc.moveDown(2)

    addSection(doc, 'Market Demand', analysis.marketDemand)
    addSection(doc, 'Competition', analysis.competition)

    addList(doc, 'Strengths', analysis.swot.strengths)
    addList(doc, 'Weaknesses', analysis.swot.weaknesses)
    addList(doc, 'Opportunities', analysis.swot.opportunities)
    addList(doc, 'Threats', analysis.swot.threats)

    addList(doc, 'Revenue Suggestions', analysis.revenueSuggestions)
    addSection(doc, 'Growth Strategy', analysis.growthStrategy)
    addList(doc, 'MVP Roadmap', analysis.mvpRoadmap)

    if (analysis.competitors?.length) {
      doc.addPage()
      doc.fontSize(18).font('Helvetica-Bold').text('Competitor Analysis', { underline: true })
      doc.moveDown(1)
      analysis.competitors.forEach((comp) => {
        doc.fontSize(14).font('Helvetica-Bold').text(comp.name)
        doc.fontSize(12).font('Helvetica').text(`Strengths: ${comp.strengths}`)
        doc.fontSize(12).font('Helvetica').text(`Weaknesses: ${comp.weaknesses}`)
        doc.moveDown(1)
      })
    }

    doc.end()
  })
}
