import { Router } from 'express'
import { getTrends } from '../controllers/team/trendController'

const router = Router()
router.get('/', getTrends)

export default router
