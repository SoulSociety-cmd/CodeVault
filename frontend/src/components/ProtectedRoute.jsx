import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth()
  if (loading) return <main className="auth-shell"><p className="status">Checking your session...</p></main>
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />
}