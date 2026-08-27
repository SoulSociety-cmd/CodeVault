import { Router } from 'express'

import { login, logout, me, register } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const authRoutes = Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.get('/me', requireAuth, me)

export default authRoutes