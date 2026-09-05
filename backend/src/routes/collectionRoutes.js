import { Router } from 'express'

import { requireAuth } from '../middleware/authMiddleware.js'
import { addSnippet, createCollection, deleteCollection, getCollection, listCollections, removeSnippet, updateCollection } from '../controllers/collectionController.js'
import { requireObjectId, validateBody, validateCollectionBody, validateParams } from '../middleware/validationMiddleware.js'

const router = Router()
router.use(requireAuth)
router.get('/', listCollections)
const collectionId = validateParams((params) => requireObjectId(params.id, 'Collection ID'))
const collectionSnippetIds = validateParams((params) => { requireObjectId(params.id, 'Collection ID'); requireObjectId(params.snippetId, 'Snippet ID') })
router.post('/', validateBody(validateCollectionBody), createCollection)
router.get('/:id', collectionId, getCollection)
router.put('/:id', collectionId, validateBody(validateCollectionBody), updateCollection)
router.delete('/:id', collectionId, deleteCollection)
router.post('/:id/snippets/:snippetId', collectionSnippetIds, addSnippet)
router.delete('/:id/snippets/:snippetId', collectionSnippetIds, removeSnippet)

export default router