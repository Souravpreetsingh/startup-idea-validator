import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { downloadIcs, getGoogleCalendarUrl } from '../controllers/calendarController'

const router = Router()
router.use(authenticate)
router.get('/:id/ics', downloadIcs)
router.get('/:id/google', getGoogleCalendarUrl)

export default router
