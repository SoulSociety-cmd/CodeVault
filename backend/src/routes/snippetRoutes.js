import { Router } from 'express'

import { requireAuth } from '../middleware/authMiddleware.js'
import { createSnippet, deleteSnippet, favoriteSnippet, getSnippet, listSnippets, popularTags, restoreSnippet, searchSnippets, unfavoriteSnippet, updateSnippet } from '../controllers/snippetController.js'

const router = Router()

router.use(requireAuth)
router.get('/search', searchSnippets)
router.get('/popular-tags', popularTags)
router.get('/', listSnippets)
router.post('/', createSnippet)
router.get('/:id', getSnippet)
router.put('/:id', updateSnippet)
router.delete('/:id', deleteSnippet)
router.post('/:id/restore', restoreSnippet)
router.post('/:id/favorite', favoriteSnippet)
router.delete('/:id/favorite', unfavoriteSnippet)

export default router