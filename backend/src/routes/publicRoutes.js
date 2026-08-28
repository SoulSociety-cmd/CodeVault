import { Router } from 'express'

import { getPublicSnippet } from '../controllers/snippetController.js'

const router = Router()

router.get('/snippets/:slug', getPublicSnippet)

export default router