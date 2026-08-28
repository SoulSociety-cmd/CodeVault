import api from './api.js'

export const listCollections = () => api.get('/collections')
export const createCollection = (data) => api.post('/collections', data)
export const updateCollection = (id, data) => api.put(`/collections/${id}`, data)
export const deleteCollection = (id) => api.delete(`/collections/${id}`)
export const addSnippet = (id, snippetId) => api.post(`/collections/${id}/snippets/${snippetId}`)
export const removeSnippet = (id, snippetId) => api.delete(`/collections/${id}/snippets/${snippetId}`)