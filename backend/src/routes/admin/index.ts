import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import { adminOnly } from '../../middleware/security/adminAuth'
import { getDashboard, getUsers, getAnalytics } from '../../controllers/admin/adminController'
import { getPerformance } from '../../controllers/admin/performanceController'

const router = Router()

router.use(authenticate)
router.use(adminOnly)

router.get('/dashboard', getDashboard)
router.get('/users', getUsers)
router.get('/analytics', getAnalytics)
router.get('/performance', getPerformance)

export default router
