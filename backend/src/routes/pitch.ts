import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getPitch } from '../controllers/team/pitchController'

const router = Router()
router.use(authenticate)
router.get('/:ideaId', getPitch)

export default router
