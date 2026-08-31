import express from 'express'
import { getStats } from '../controllers/dashboardController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// All dashboard routes require authentication
router.use(requireAuth)

// Get dashboard stats
router.get('/stats', getStats)

export default router
