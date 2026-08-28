import mongoose from 'mongoose'

import Collection from '../models/Collection.js'
import Snippet from '../models/Snippet.js'

function validateId(id, label = 'Collection ID') {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error(`${label} is invalid.`)
    error.statusCode = 400
    throw error
  }
}

function normalizeInput(input = {}) {
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const description = typeof input.description === 'string' ? input.description.trim() : ''
  if (!name) throw new Error('Collection name is required.')
  if (name.length > 120) throw new Error('Collection name is too long.')
  return { name, description }
}

async function findOwnedCollection(ownerId, id) {
  validateId(id)
  const collection = await Collection.findById(id)
  if (!collection) return null
  if (collection.owner.toString() !== ownerId.toString()) {
    const error = new Error('You do not own this collection.')
    error.statusCode = 403
    throw error
  }
  return collection
}

async function ownedSnippetIds(ownerId, ids) {
  const uniqueIds = [...new Set(ids.map(String))]
  if (uniqueIds.some((id) => !mongoose.isValidObjectId(id))) throw new Error('Snippet IDs are invalid.')
  const snippets = await Snippet.find({ _id: { $in: uniqueIds }, owner: ownerId, deletedAt: null }).select('_id').lean()
  if (snippets.length !== uniqueIds.length) {
    const error = new Error('One or more snippets were not found or are not owned by you.')
    error.statusCode = 403
    throw error
  }
  return snippets.map((snippet) => snippet._id)
}

export async function listCollections(ownerId) {
  return Collection.find({ owner: ownerId }).populate({ path: 'snippets', match: { deletedAt: null }, options: { sort: { updatedAt: -1 } } }).sort({ updatedAt: -1 }).lean()
}

export async function getCollection(ownerId, id) {
  const collection = await findOwnedCollection(ownerId, id)
  return collection ? collection.populate({ path: 'snippets', match: { deletedAt: null }, options: { sort: { updatedAt: -1 } } }) : null
}

export async function createCollection(ownerId, input) {
  const data = normalizeInput(input)
  const collection = await Collection.create({ ...data, owner: ownerId })
  return collection.toObject()
}

export async function updateCollection(ownerId, id, input) {
  const collection = await findOwnedCollection(ownerId, id)
  if (!collection) return null
  const data = normalizeInput(input)
  const ids = input.snippets === undefined ? collection.snippets : await ownedSnippetIds(ownerId, Array.isArray(input.snippets) ? input.snippets : [])
  const previousIds = collection.snippets.map(String)
  collection.set({ ...data, snippets: ids })
  await collection.save()
  await Snippet.updateMany({ _id: { $in: previousIds } }, { $pull: { collectionIds: collection._id } })
  if (ids.length) await Snippet.updateMany({ _id: { $in: ids } }, { $addToSet: { collectionIds: collection._id } })
  return collection.toObject()
}

export async function deleteCollection(ownerId, id) {
  const collection = await findOwnedCollection(ownerId, id)
  if (!collection) return null
  await Snippet.updateMany({ _id: { $in: collection.snippets } }, { $pull: { collectionIds: collection._id } })
  await collection.deleteOne()
  return collection.toObject()
}

export async function addSnippet(ownerId, id, snippetId) {
  const collection = await findOwnedCollection(ownerId, id)
  if (!collection) return null
  const [ownedId] = await ownedSnippetIds(ownerId, [snippetId])
  await Collection.updateOne({ _id: collection._id }, { $addToSet: { snippets: ownedId } })
  await Snippet.updateOne({ _id: ownedId }, { $addToSet: { collectionIds: collection._id } })
  return getCollection(ownerId, id)
}

export async function removeSnippet(ownerId, id, snippetId) {
  const collection = await findOwnedCollection(ownerId, id)
  if (!collection) return null
  validateId(snippetId, 'Snippet ID')
  await Collection.updateOne({ _id: collection._id }, { $pull: { snippets: snippetId } })
  await Snippet.updateOne({ _id: snippetId, owner: ownerId }, { $pull: { collectionIds: collection._id } })
  return getCollection(ownerId, id)
}