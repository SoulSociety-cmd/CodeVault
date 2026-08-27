import { useEffect, useState } from 'react'

import { AuthContext } from './authContext.js'
import * as authService from '../services/authService.js'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getMe()
      .then(({ data }) => setCurrentUser(data.data.user))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(credentials) {
    const { data } = await authService.login(credentials)
    setCurrentUser(data.data.user)
    return data.data.user
  }

  async function register(credentials) {
    const { data } = await authService.register(credentials)
    setCurrentUser(data.data.user)
    return data.data.user
  }

  async function logout() {
    await authService.logout()
    setCurrentUser(null)
  }

  return <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

