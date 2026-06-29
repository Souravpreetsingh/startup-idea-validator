import { Router, Request, Response } from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth'
import { StartupIdea } from '../models/StartupIdea'
import { extractTextFromFile, buildIdeaFromText } from '../services/uploadService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { AppError } from '../utils/errors'
import type { AuthRequest } from '../types'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'))
    }
  },
})

const router = Router()

router.post(
  '/',
  authenticate,
  upload.single('file'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400)
    }

    const text = await extractTextFromFile(req.file.buffer, req.file.mimetype)
    const ideaData = buildIdeaFromText(text)

    const idea = await StartupIdea.create({
      ...ideaData,
      userId: req.userId,
    })

    sendSuccess(res, { idea: idea.toJSON(), extractedText: text.slice(0, 500) }, 'Pitch uploaded and analyzed', 201)
  })
)

export default router
