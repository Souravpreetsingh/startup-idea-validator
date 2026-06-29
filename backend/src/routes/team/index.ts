import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import * as ctrl from '../../controllers/team/teamController'

const router = Router()
router.use(authenticate)

router.post('/', ctrl.create)
router.get('/', ctrl.list)
router.get('/:id', ctrl.getOne)
router.post('/:id/invite', ctrl.invite)
router.post('/invite/:inviteId/accept', ctrl.acceptInvite)
router.put('/:id/role/:userId', ctrl.updateRole)
router.delete('/:id/members/:userId', ctrl.remove)

export default router
