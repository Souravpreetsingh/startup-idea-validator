import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { createPresentation, exportPresentation } from '../controllers/presentationController'

const router = Router()
router.use(authenticate)
router.post('/:ideaId', createPresentation)
router.get('/:ideaId/export', exportPresentation)

export default router
