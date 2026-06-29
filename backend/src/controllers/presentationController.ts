import { Response } from 'express'
import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'
import { generatePresentation, generateHtmlSlides } from '../services/presentationService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const createPresentation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const idea = await StartupIdea.findById(ideaId)
  if (!idea) throw new NotFoundError('Startup idea')
  if (idea.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  const analysis = await AnalysisResult.findOne({ ideaId })
  const presentation = await generatePresentation(idea, analysis)

  sendSuccess(res, { presentation }, 'Presentation generated')
})

export const exportPresentation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const idea = await StartupIdea.findById(ideaId)
  if (!idea) throw new NotFoundError('Startup idea')
  if (idea.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  const analysis = await AnalysisResult.findOne({ ideaId })
  const presentation = await generatePresentation(idea, analysis)
  const html = generateHtmlSlides(presentation)

  const format = (req.query.format as string) || 'html'

  if (format === 'pdf') {
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${idea.title.replace(/\s+/g, '_')}_pitch.pdf"`)
    const PDFDocument = (await import('pdfkit')).default
    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' })
    doc.pipe(res)
    doc.fontSize(28).text(presentation.slides[0]?.title || idea.title, { align: 'center' })
    presentation.slides.slice(1).forEach((slide, i) => {
      doc.addPage()
      doc.fontSize(20).text(slide.title, { align: 'center' })
      doc.moveDown()
      doc.fontSize(14).text(slide.content)
      slide.bullets.forEach(b => { doc.fontSize(12).text(`• ${b}`); doc.moveDown(0.5) })
    })
    doc.end()
  } else {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Disposition', `attachment; filename="${idea.title.replace(/\s+/g, '_')}_pitch.html"`)
    res.send(html)
  }
})
