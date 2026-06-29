import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getBadges, refreshBadges } from '../controllers/team/badgeController'

const router = Router()
router.use(authenticate)
router.get('/', getBadges)
router.post('/refresh', refreshBadges)

export default router
