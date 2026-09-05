import { Router } from 'express'

import { getPublicSnippet } from '../controllers/snippetController.js'
import { validateParams, validateSlug } from '../middleware/validationMiddleware.js'

const router = Router()

router.get('/snippets/:slug', validateParams(validateSlug), getPublicSnippet)

export default router