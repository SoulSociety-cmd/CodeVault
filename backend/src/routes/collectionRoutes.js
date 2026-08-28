import { Router } from 'express'

import { requireAuth } from '../middleware/authMiddleware.js'
import { addSnippet, createCollection, deleteCollection, getCollection, listCollections, removeSnippet, updateCollection } from '../controllers/collectionController.js'

const router = Router()
router.use(requireAuth)
router.get('/', listCollections)
router.post('/', createCollection)
router.get('/:id', getCollection)
router.put('/:id', updateCollection)
router.delete('/:id', deleteCollection)
router.post('/:id/snippets/:snippetId', addSnippet)
router.delete('/:id/snippets/:snippetId', removeSnippet)

export default router