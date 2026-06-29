import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { createVersion, listVersions, getOneVersion, restore } from '../controllers/versionController'

const router = Router()
router.use(authenticate)
router.post('/:ideaId', createVersion)
router.get('/:ideaId', listVersions)
router.get('/:ideaId/:version', getOneVersion)
router.post('/:ideaId/:version/restore', restore)

export default router
