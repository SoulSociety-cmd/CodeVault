import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { connectDB } from './config/db.js'
import healthRoutes from './routes/healthRoutes.js'

const app = express()
const port = process.env.PORT

if (!port) {
  throw new Error('PORT must be set in the environment.')
}

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/health', healthRoutes)

connectDB().catch((error) => {
  console.error('MongoDB connection failed:', error.message)
})

app.listen(port, () => {
  console.log(`CodeVault backend listening on port ${port}`)
})