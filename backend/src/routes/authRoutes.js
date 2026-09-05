import { Router } from 'express'

import { login, logout, me, register } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import rateLimit from 'express-rate-limit'
import { validateAuthBody, validateBody } from '../middleware/validationMiddleware.js'

const authRoutes = Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many authentication attempts. Please try again later.' } })

authRoutes.post('/register', authLimiter, validateBody(validateAuthBody({ register: true })), register)
authRoutes.post('/login', authLimiter, validateBody(validateAuthBody()), login)
authRoutes.post('/logout', logout)
authRoutes.get('/me', requireAuth, me)

export default authRoutes