import api from './api.js'

export const register = (payload) => api.post('/auth/register', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const logout = () => api.post('/auth/logout')
export const getMe = () => api.get('/auth/me')