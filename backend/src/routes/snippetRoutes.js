import { Router } from 'express'

import { requireAuth } from '../middleware/authMiddleware.js'
import { createSnippet, deleteSnippet, favoriteSnippet, getSnippet, getSnippetVersion, listSnippetVersions, listSnippets, popularTags, restoreSnippet, searchSnippets, setVisibility, unfavoriteSnippet, updateSnippet } from '../controllers/snippetController.js'

const router = Router()

router.use(requireAuth)
router.get('/search', searchSnippets)
router.get('/popular-tags', popularTags)
router.get('/', listSnippets)
router.post('/', createSnippet)
router.get('/:id/versions/:version', getSnippetVersion)
router.get('/:id/versions', listSnippetVersions)
router.get('/:id', getSnippet)
router.put('/:id', updateSnippet)
router.patch('/:id/visibility', setVisibility)
router.delete('/:id', deleteSnippet)
router.post('/:id/restore', restoreSnippet)
router.post('/:id/favorite', favoriteSnippet)
router.delete('/:id/favorite', unfavoriteSnippet)

export default router