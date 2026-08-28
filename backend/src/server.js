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

const app = express()
const port = process.env.PORT

if (!port) {
  throw new Error('PORT must be set in the environment.')
}

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/snippets', snippetRoutes)
app.use('/api/collections', collectionRoutes)

connectDB().catch((error) => {
  console.error('MongoDB connection failed:', error.message)
})

app.listen(port, () => {
  console.log(`CodeVault backend listening on port ${port}`)
})