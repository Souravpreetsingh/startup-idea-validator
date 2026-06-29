import { Router } from 'express'
import { sendMessage, getChatHistory, getChatById, deleteChat } from '../controllers/chatController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { sendMessageSchema } from '../validations/chat'

const router = Router()

router.use(authenticate)

router.post('/', validate(sendMessageSchema), sendMessage)
router.get('/', getChatHistory)
router.get('/:id', getChatById)
router.delete('/:id', deleteChat)

export default router
