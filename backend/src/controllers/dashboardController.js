import { getDashboardStats } from '../services/dashboardService.js'

export async function getStats(req, res) {
  try {
    const userId = req.user.id

    const data = await getDashboardStats(userId)

    res.json({
      status: 'success',
      data,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    })
  }
}
