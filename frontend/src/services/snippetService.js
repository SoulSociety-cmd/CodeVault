import api from './api.js'

export const listSnippets = () => api.get('/snippets')
export const createSnippet = (snippet) => api.post('/snippets', snippet)
export const getSnippet = (id) => api.get(`/snippets/${id}`)
export const updateSnippet = (id, snippet) => api.put(`/snippets/${id}`, snippet)
export const deleteSnippet = (id) => api.delete(`/snippets/${id}`)
export const restoreSnippet = (id) => api.post(`/snippets/${id}/restore`)