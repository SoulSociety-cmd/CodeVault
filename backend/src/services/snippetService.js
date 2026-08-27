import mongoose from 'mongoose'

import Snippet from '../models/Snippet.js'
import SnippetVersion from '../models/SnippetVersion.js'

const allowedLanguages = new Set(['c', 'cpp', 'java', 'python', 'javascript', 'typescript', 'html', 'css', 'sql', 'json', 'bash', 'go', 'rust', 'php'])
const sortFields = {
  updated: { updatedAt: -1 },
  created: { createdAt: -1 },
  viewed: { views: -1, updatedAt: -1 },
  favorited: { favorites: -1, updatedAt: -1 },
  alphabetical: { title: 1 },
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function asList(value) {
  return (Array.isArray(value) ? value : [value]).flatMap((item) => typeof item === 'string' ? item.split(',') : []).map((item) => item.trim().toLowerCase()).filter(Boolean)
}

function normalizeInput(input) {
  const data = {
    title: typeof input.title === 'string' ? input.title.trim() : '',
    description: typeof input.description === 'string' ? input.description.trim() : '',
    code: typeof input.code === 'string' ? input.code : '',
    language: typeof input.language === 'string' ? input.language.trim().toLowerCase() : '',
    tags: Array.isArray(input.tags) ? input.tags.filter((tag) => typeof tag === 'string').map((tag) => tag.trim().toLowerCase()).filter(Boolean) : [],
    visibility: input.visibility === 'public' ? 'public' : 'private',
    collectionIds: Array.isArray(input.collectionIds) ? input.collectionIds : [],
  }
  if (!data.title || !data.code || !allowedLanguages.has(data.language)) throw new Error('Title, code, and a supported language are required.')
  if (data.collectionIds.some((id) => !mongoose.isValidObjectId(id))) throw new Error('Collection IDs are invalid.')
  return data
}

function makeSlug(title) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'snippet'
  return `${base}-${Math.random().toString(36).slice(2, 8)}`
}

function ownerQuery(id, ownerId, includeDeleted = false) {
  const query = { _id: id, owner: ownerId }
  if (!includeDeleted) query.deletedAt = null
  return query
}

async function findOwnedSnippet(ownerId, id, includeDeleted = false) {
  const snippet = await Snippet.findById(id)
  if (!snippet) return null
  if (snippet.owner.toString() !== ownerId.toString()) {
    const error = new Error('You do not own this snippet.')
    error.statusCode = 403
    throw error
  }
  if (!includeDeleted && snippet.deletedAt) return null
  return snippet
}

export async function searchSnippets(ownerId, options = {}) {
  const query = { owner: ownerId, deletedAt: null }
  const search = typeof options.q === 'string' ? options.q.trim().slice(0, 200) : ''
  const languages = asList(options.language)
  const tags = asList(options.tags || options.tag)
  const visibility = asList(options.visibility)

  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i')
    query.$or = [{ title: pattern }, { description: pattern }, { tags: pattern }, { language: pattern }, { code: pattern }]
  }
  if (languages.length) query.language = { $in: languages }
  if (tags.length) query.tags = { $all: tags }
  if (visibility.length) query.visibility = { $in: visibility.filter((item) => ['private', 'public'].includes(item)) }
  if (options.collection) {
    if (!mongoose.isValidObjectId(options.collection)) throw new Error('Collection ID is invalid.')
    query.collectionIds = options.collection
  }
  if (options.favorite === 'true' || options.favorite === '1') query.favorites = { $gt: 0 }

  const sort = sortFields[options.sort] || sortFields.updated
  const [snippets, count] = await Promise.all([
    Snippet.find(query).sort(sort).lean(),
    Snippet.countDocuments(query),
  ])
  return { snippets, count }
}

export async function listSnippets(ownerId) {
  const result = await searchSnippets(ownerId)
  return result.snippets
}

export async function getPopularTags(ownerId) {
  return Snippet.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(ownerId), deletedAt: null } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 12 },
    { $project: { _id: 0, name: '$_id', count: 1 } },
  ])
}

export async function createSnippet(ownerId, input) {
  const data = normalizeInput(input)
  return Snippet.create({ ...data, owner: ownerId, slug: makeSlug(data.title) })
}

export async function getSnippet(ownerId, id) {
  return Snippet.findOne(ownerQuery(id, ownerId)).lean()
}

export async function updateSnippet(ownerId, id, input) {
  const data = normalizeInput(input)
  const snippet = await findOwnedSnippet(ownerId, id)
  if (!snippet) return null
  const latest = await SnippetVersion.findOne({ snippetId: snippet._id }).sort({ version: -1 }).select('version').lean()
  await SnippetVersion.create({ snippetId: snippet._id, version: (latest?.version || 0) + 1, code: data.code, createdBy: ownerId })
  Object.assign(snippet, data)
  await snippet.save()
  return snippet.toObject()
}

export async function softDeleteSnippet(ownerId, id) {
  const snippet = await findOwnedSnippet(ownerId, id)
  if (!snippet) return null
  snippet.deletedAt = new Date()
  await snippet.save()
  return snippet.toObject()
}

export async function restoreSnippet(ownerId, id) {
  const snippet = await findOwnedSnippet(ownerId, id, true)
  if (!snippet) return null
  snippet.deletedAt = null
  await snippet.save()
  return snippet.toObject()
}