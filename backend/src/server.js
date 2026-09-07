import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { connectDB } from './config/db.js'
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'
import snippetRoutes from './routes/snippetRoutes.js'
import collectionRoutes from './routes/collectionRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'

export const app = express()

function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue)
  if (!value || typeof value !== 'object') return value
  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.')) delete value[key]
    else value[key] = sanitizeValue(value[key])
  }
  return value
}

function sanitizeRequest(request, _response, next) {
  sanitizeValue(request.body)
  sanitizeValue(request.query)
  sanitizeValue(request.params)
  next()
}

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || false, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(sanitizeRequest)

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/snippets', snippetRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use(errorMiddleware)

export async function startServer() {
  const port = Number(process.env.PORT) || 5000
  if (!process.env.PORT) console.warn('PORT not set; using default port 5000.')
  const server = app.listen(port, () => {
    console.log(`CodeVault backend listening on port ${port}`)
  })
  try {
    await connectDB()
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
  }
  return server
}

if (process.env.NODE_ENV !== 'test') startServer()