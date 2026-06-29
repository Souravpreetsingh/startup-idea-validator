import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getBenchmark } from '../controllers/benchmarkingController'

const router = Router()
router.use(authenticate)
router.get('/:ideaId', getBenchmark)

export default router
