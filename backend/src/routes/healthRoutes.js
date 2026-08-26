import { Router } from 'express'

const healthRoutes = Router()

healthRoutes.get('/', (_request, response) => {
  response.json({ status: 'ok' })
})

export default healthRoutes