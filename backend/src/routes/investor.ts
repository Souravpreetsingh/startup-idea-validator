import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getInvestorMatch } from '../controllers/team/investorController'

const router = Router()
router.use(authenticate)
router.get('/:ideaId', getInvestorMatch)

export default router
