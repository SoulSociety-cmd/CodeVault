import { Router } from 'express'

import { requireAuth } from '../middleware/authMiddleware.js'
import { createSnippet, deleteSnippet, getSnippet, listSnippets, restoreSnippet, updateSnippet } from '../controllers/snippetController.js'

const router = Router()

router.use(requireAuth)
router.get('/', listSnippets)
router.post('/', createSnippet)
router.get('/:id', getSnippet)
router.put('/:id', updateSnippet)
router.delete('/:id', deleteSnippet)
router.post('/:id/restore', restoreSnippet)

export default router