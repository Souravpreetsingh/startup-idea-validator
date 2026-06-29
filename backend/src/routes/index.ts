import { Router } from 'express'
import authRoutes from './auth'
import userRoutes from './user'
import ideaRoutes from './ideas'
import analysisRoutes from './analysis'
import chatRoutes from './chat'
import uploadRoutes from './upload'
import exportRoutes from './exportRoute'
import favoriteRoutes from './favorites'
import memoryRoutes from './memory'
import activityRoutes from './activity'
import adminRoutes from './admin'
import teamRoutes from './team'
import investorRoutes from './investor'
import recommendationRoutes from './recommendations'
import pitchRoutes from './pitch'
import trendRoutes from './trends'
import badgeRoutes from './badges'
import competitorRoutes from './competitors'
import versionRoutes from './versions'
import taskRoutes from './tasks'
import calendarRoutes from './calendar'
import shareRoutes from './share'
import docsRoutes from './docs'
import presentationRoutes from './presentation'
import benchmarkingRoutes from './benchmarking'
import mentorRoutes from './mentor'
import { analyzeStartup } from '../controllers/analyzeStartupController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/ideas', ideaRoutes)
router.use('/analysis', analysisRoutes)
router.use('/chat', chatRoutes)
router.use('/upload', uploadRoutes)
router.use('/export', exportRoutes)
router.use('/favorites', favoriteRoutes)
router.use('/memory', memoryRoutes)
router.use('/activity', activityRoutes)
router.use('/admin', adminRoutes)
router.use('/teams', teamRoutes)
router.use('/investor', investorRoutes)
router.use('/recommendations', recommendationRoutes)
router.use('/pitch', pitchRoutes)
router.use('/trends', trendRoutes)
router.use('/badges', badgeRoutes)
router.use('/competitors', competitorRoutes)
router.use('/versions', versionRoutes)
router.use('/tasks', taskRoutes)
router.use('/calendar', calendarRoutes)
router.use('/share', shareRoutes)
router.use('/docs', docsRoutes)
router.use('/presentation', presentationRoutes)
router.use('/benchmarking', benchmarkingRoutes)
router.use('/mentor', mentorRoutes)

// Backward-compatible endpoint for older deployed frontends
router.post('/analyze-startup', authenticate, analyzeStartup)

export default router
