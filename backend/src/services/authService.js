import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function publicUser(user) {
  return { id: user._id, username: user.username, email: user.email, avatar: user.avatar, createdAt: user.createdAt, updatedAt: user.updatedAt }
}

function validateCredentials({ username, email, password, confirmPassword }, isRegister) {
  if (isRegister && (!username || username.trim().length < 3)) throw new Error('Username must be at least 3 characters.')
  if (!email || !emailPattern.test(email)) throw new Error('Please provide a valid email.')
  if (!password || password.length < 8) throw new Error('Password must be at least 8 characters.')
  if (isRegister && password !== confirmPassword) throw new Error('Passwords do not match.')
}

export async function registerUser(input) {
  validateCredentials(input, true)
  const username = input.username.trim()
  const email = input.email.trim().toLowerCase()
  const existingUser = await User.findOne({ $or: [{ username }, { email }] })
  if (existingUser) throw new Error(existingUser.email === email ? 'Email is already in use.' : 'Username is already in use.')
  const passwordHash = await bcrypt.hash(input.password, 12)
  const user = await User.create({ username, email, passwordHash })
  return publicUser(user)
}

export async function authenticateUser(input) {
  validateCredentials(input, false)
  const email = input.email.trim().toLowerCase()
  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new Error('Invalid email or password.')
  return publicUser(user)
}

export function createToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be set in the environment.')
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function getUserById(userId) {
  const user = await User.findById(userId)
  return user ? publicUser(user) : null
}