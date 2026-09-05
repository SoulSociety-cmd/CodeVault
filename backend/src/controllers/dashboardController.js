import { getDashboardStats } from '../services/dashboardService.js'

export async function getStats(req, res) {
  try {
    const userId = req.user.id

    const data = await getDashboardStats(userId)

    res.json({
      status: 'success',
      data,
    })
  } catch (error) { throw error }
}
