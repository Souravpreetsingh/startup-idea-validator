import { Router } from 'express'
import { signup, login, logout, getMe, forgotPassword, resetPassword } from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/auth'

const router = Router()

router.post('/signup', validate(signupSchema), signup)
router.post('/login', validate(loginSchema), login)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getMe)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword)

export default router
