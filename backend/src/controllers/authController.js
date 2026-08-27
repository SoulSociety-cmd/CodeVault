import { authenticateUser, createToken, getUserById, registerUser } from '../services/authService.js'

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function sendError(response, error) {
  const status = error.code === 11000 ? 409 : error.message.includes('Invalid') ? 401 : 400
  return response.status(status).json({ success: false, message: error.code === 11000 ? 'Username or email is already in use.' : error.message })
}

export async function register(request, response) {
  try {
    const user = await registerUser(request.body)
    response.cookie('token', createToken(user.id), cookieOptions)
    return response.status(201).json({ success: true, data: { user } })
  } catch (error) { return sendError(response, error) }
}

export async function login(request, response) {
  try {
    const user = await authenticateUser(request.body)
    response.cookie('token', createToken(user.id), cookieOptions)
    return response.json({ success: true, data: { user } })
  } catch (error) { return sendError(response, error) }
}

export function logout(_request, response) {
  response.clearCookie('token', cookieOptions)
  return response.json({ success: true, message: 'Logged out successfully.' })
}

export async function me(request, response) {
  const user = await getUserById(request.user.id)
  if (!user) return response.status(401).json({ success: false, message: 'Authentication required.' })
  return response.json({ success: true, data: { user } })
}