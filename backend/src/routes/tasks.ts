import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { list, update, remove } from '../controllers/taskController'

const router = Router()
router.use(authenticate)
router.get('/', list)
router.put('/:id', update)
router.delete('/:id', remove)

export default router
