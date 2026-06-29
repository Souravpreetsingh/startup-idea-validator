import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getMentor } from '../controllers/mentorController'

const router = Router()
router.use(authenticate)
router.post('/:ideaId', getMentor)

export default router
