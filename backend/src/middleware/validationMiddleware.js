import mongoose from 'mongoose'

export function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

export function validateBody(validate) {
  return (request, _response, next) => {
    try {
      validate(request.body || {})
      next()
    } catch (error) {
      next(error)
    }
  }
}

export function validateParams(validate) {
  return (request, _response, next) => {
    try {
      validate(request.params)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export function validateQuery(validate) {
  return (request, _response, next) => {
    try {
      validate(request.query)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export function requireObjectId(value, label) {
  if (!mongoose.isValidObjectId(value)) throw validationError(`${label} is invalid.`)
}

function requireString(value, label, { min = 1, max = 10000 } = {}) {
  if (typeof value !== 'string' || value.trim().length < min) throw validationError(`${label} is invalid.`)
  if (value.length > max) throw validationError(`${label} is too long.`)
}

export function validateAuthBody({ register = false } = {}) {
  return (body) => {
    if (register) requireString(body.username, 'Username', { min: 3, max: 50 })
    requireString(body.email, 'Email', { max: 254 })
    if (!/^\S+@\S+\.\S+$/.test(body.email)) throw validationError('Email is invalid.')
    requireString(body.password, 'Password', { min: 8, max: 128 })
    if (register && body.password !== body.confirmPassword) throw validationError('Passwords do not match.')
  }
}

export function validateSnippetBody(body) {
  requireString(body.title, 'Title', { max: 160 })
  requireString(body.code, 'Code', { max: 500000 })
  requireString(body.language, 'Language', { max: 30 })
  if (body.description !== undefined) requireString(body.description, 'Description', { min: 0, max: 1000 })
  if (body.tags !== undefined && (!Array.isArray(body.tags) || body.tags.length > 30)) throw validationError('Tags are invalid.')
  if (body.collectionIds !== undefined && !Array.isArray(body.collectionIds)) throw validationError('Collection IDs are invalid.')
  if (body.visibility !== undefined && !['private', 'public'].includes(body.visibility)) throw validationError('Visibility is invalid.')
}

export function validateTagSuggestionBody(body) {
  requireString(body.code, 'Code', { max: 500000 })
  requireString(body.language, 'Language', { max: 30 })
  if (body.title !== undefined) requireString(body.title, 'Title', { min: 0, max: 160 })
  if (body.description !== undefined) requireString(body.description, 'Description', { min: 0, max: 1000 })
  if (body.tags !== undefined && (!Array.isArray(body.tags) || body.tags.length > 30 || body.tags.some((tag) => typeof tag !== 'string'))) {
    throw validationError('Tags are invalid.')
  }
}

export function validateCollectionBody(body) {
  requireString(body.name, 'Collection name', { max: 120 })
  if (body.description !== undefined) requireString(body.description, 'Description', { min: 0, max: 1000 })
  if (body.snippets !== undefined && (!Array.isArray(body.snippets) || body.snippets.length > 200)) throw validationError('Snippet IDs are invalid.')
}

export function validateSnippetQuery(query) {
  for (const key of ['q', 'language', 'tags', 'tag', 'visibility', 'sort', 'collection', 'favorite']) {
    const value = query[key]
    if (value !== undefined && typeof value !== 'string' && !Array.isArray(value)) throw validationError(`Query parameter ${key} is invalid.`)
  }
  if (query.q && query.q.length > 200) throw validationError('Search query is too long.')
  if (query.collection) requireObjectId(query.collection, 'Collection ID')
}

export function validateSlug(params) {
  requireString(params.slug, 'Slug', { max: 200 })
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(params.slug)) throw validationError('Slug is invalid.')
}