import { Router } from 'express'
import { generateAnalysis, getAnalysis, getAllAnalyses } from '../controllers/analysisController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { generateAnalysisSchema } from '../validations/analysis'

const router = Router()

router.use(authenticate)

router.post('/generate', validate(generateAnalysisSchema), generateAnalysis)
router.get('/', getAllAnalyses)
router.get('/:ideaId', getAnalysis)

export default router
