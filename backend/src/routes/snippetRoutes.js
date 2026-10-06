import { Router } from 'express'

import { requireAuth } from '../middleware/authMiddleware.js'
import { createSnippet, deleteSnippet, favoriteSnippet, getSnippet, getSnippetVersion, listSnippetVersions, listSnippets, popularTags, restoreSnippet, searchSnippets, setVisibility, suggestTags, unfavoriteSnippet, updateSnippet } from '../controllers/snippetController.js'
import rateLimit from 'express-rate-limit'
import { requireObjectId, validateBody, validateParams, validateQuery, validateSnippetBody, validateSnippetQuery, validateTagSuggestionBody, validationError } from '../middleware/validationMiddleware.js'

const router = Router()

router.use(requireAuth)
const searchLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many search requests. Please try again later.' } })
const tagSuggestionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many tag suggestion requests. Please try again later.' } })
const snippetId = validateParams((params) => requireObjectId(params.id, 'Snippet ID'))
const versionParams = validateParams((params) => { requireObjectId(params.id, 'Snippet ID'); if (!/^\d+$/.test(params.version)) throw validationError('Version is invalid.') })

router.get('/search', searchLimiter, validateQuery(validateSnippetQuery), searchSnippets)
router.get('/popular-tags', popularTags)
router.post('/suggest-tags', tagSuggestionLimiter, validateBody(validateTagSuggestionBody), suggestTags)
router.get('/', validateQuery(validateSnippetQuery), listSnippets)
router.post('/', validateBody(validateSnippetBody), createSnippet)
router.get('/:id/versions/:version', versionParams, getSnippetVersion)
router.get('/:id/versions', snippetId, listSnippetVersions)
router.get('/:id', snippetId, getSnippet)
router.put('/:id', snippetId, validateBody(validateSnippetBody), updateSnippet)
router.patch('/:id/visibility', snippetId, validateBody((body) => { if (!['private', 'public'].includes(body.visibility)) throw validationError('Visibility is invalid.') }), setVisibility)
router.delete('/:id', snippetId, deleteSnippet)
router.post('/:id/restore', snippetId, restoreSnippet)
router.post('/:id/favorite', snippetId, favoriteSnippet)
router.delete('/:id/favorite', snippetId, unfavoriteSnippet)

export default router