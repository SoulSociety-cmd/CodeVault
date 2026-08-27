import api from './api.js'

export const listSnippets = (params) => api.get('/snippets', { params })
export const searchSnippets = (params) => api.get('/snippets/search', { params })
export const popularTags = () => api.get('/snippets/popular-tags')
export const createSnippet = (snippet) => api.post('/snippets', snippet)
export const getSnippet = (id) => api.get(`/snippets/${id}`)
export const updateSnippet = (id, snippet) => api.put(`/snippets/${id}`, snippet)
export const deleteSnippet = (id) => api.delete(`/snippets/${id}`)
export const restoreSnippet = (id) => api.post(`/snippets/${id}/restore`)