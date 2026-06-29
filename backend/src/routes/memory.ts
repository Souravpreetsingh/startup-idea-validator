import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getMemory, updateMemory } from '../controllers/memoryController'

const router = Router()
router.use(authenticate)
router.get('/', getMemory)
router.put('/', updateMemory)

export default router
