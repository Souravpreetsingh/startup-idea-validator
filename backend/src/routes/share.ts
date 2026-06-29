import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { create, getShared } from '../controllers/shareController'

const router = Router()
router.post('/', authenticate, create)
router.get('/:token', getShared)

export default router
