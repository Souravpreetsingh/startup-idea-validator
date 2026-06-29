import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getRecommendationsForUser } from '../controllers/team/recommendationController'

const router = Router()
router.use(authenticate)
router.get('/', getRecommendationsForUser)

export default router
