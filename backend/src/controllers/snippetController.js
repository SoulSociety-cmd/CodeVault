import * as snippetService from '../services/snippetService.js'

function sendError(response, error) {
  const status = error.statusCode || (error.message.includes('required') || error.message.includes('invalid') ? 400 : 500)
  return response.status(status).json({ success: false, message: error.message })
}

export async function listSnippets(request, response) {
  try {
    const result = await snippetService.searchSnippets(request.user.id, request.query)
    return response.json({ success: true, data: result })
  } catch (error) { return sendError(response, error) }
}

export async function searchSnippets(request, response) {
  try {
    const result = await snippetService.searchSnippets(request.user.id, request.query)
    return response.json({ success: true, data: result })
  } catch (error) { return sendError(response, error) }
}

export async function popularTags(request, response) {
  try {
    return response.json({ success: true, data: { tags: await snippetService.getPopularTags(request.user.id) } })
  } catch (error) { return sendError(response, error) }
}

export async function createSnippet(request, response) {
  try { return response.status(201).json({ success: true, data: { snippet: await snippetService.createSnippet(request.user.id, request.body) } }) } catch (error) { return sendError(response, error) }
}

export async function getSnippet(request, response) {
  try {
    const snippet = await snippetService.getSnippet(request.user.id, request.params.id)
    return snippet ? response.json({ success: true, data: { snippet } }) : response.status(404).json({ success: false, message: 'Snippet not found.' })
  } catch (error) { return sendError(response, error) }
}

export async function updateSnippet(request, response) {
  try {
    const snippet = await snippetService.updateSnippet(request.user.id, request.params.id, request.body)
    return snippet ? response.json({ success: true, data: { snippet } }) : response.status(404).json({ success: false, message: 'Snippet not found.' })
  } catch (error) { return sendError(response, error) }
}

export async function deleteSnippet(request, response) {
  try {
    const snippet = await snippetService.softDeleteSnippet(request.user.id, request.params.id)
    return snippet ? response.json({ success: true, data: { snippet } }) : response.status(404).json({ success: false, message: 'Snippet not found.' })
  } catch (error) { return sendError(response, error) }
}

export async function restoreSnippet(request, response) {
  try {
    const snippet = await snippetService.restoreSnippet(request.user.id, request.params.id)
    return snippet ? response.json({ success: true, data: { snippet } }) : response.status(404).json({ success: false, message: 'Snippet not found.' })
  } catch (error) { return sendError(response, error) }
}