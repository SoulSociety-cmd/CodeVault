import jwt from 'jsonwebtoken'

import { getUserById } from '../services/authService.js'

export async function requireAuth(request, response, next) {
  try {
    const token = request.cookies?.token
    if (!token || !process.env.JWT_SECRET) return response.status(401).json({ success: false, message: 'Authentication required.' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await getUserById(payload.sub)
    if (!user) return response.status(401).json({ success: false, message: 'Authentication required.' })
    request.user = user
    return next()
  } catch {
    return response.status(401).json({ success: false, message: 'Authentication required.' })
  }
}