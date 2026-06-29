import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { analyze, getInsight } from '../controllers/competitorController'

const router = Router()
router.use(authenticate)
router.post('/:ideaId/analyze', analyze)
router.get('/:ideaId', getInsight)

export default router
