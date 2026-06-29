import { Router } from 'express'
import { createIdea, getIdeas, getIdea, updateIdea, deleteIdea } from '../controllers/ideaController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createIdeaSchema, updateIdeaSchema } from '../validations/idea'

const router = Router()

router.use(authenticate)

router.post('/create', validate(createIdeaSchema), createIdea)
router.get('/', getIdeas)
router.get('/:id', getIdea)
router.put('/:id', validate(updateIdeaSchema), updateIdea)
router.delete('/:id', deleteIdea)

export default router
