import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault(); setError('')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setSubmitting(true)
    try { await login(form); navigate('/dashboard') } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to sign in.') } finally { setSubmitting(false) }
  }

  return <AuthForm title="Welcome back" subtitle="Sign in to your CodeVault workspace." error={error} onSubmit={handleSubmit} submitting={submitting}>
    <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
    <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
    <button disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
    <p className="switch">New to CodeVault? <Link to="/register">Create an account</Link></p>
  </AuthForm>
}

function AuthForm({ title, subtitle, error, onSubmit, children }) {
  return <main className="auth-shell"><form className="auth-form" onSubmit={onSubmit}><span className="eyebrow">CODEVAULT / AUTH</span><h1>{title}</h1><p className="subtitle">{subtitle}</p>{error && <p className="error">{error}</p>}{children}</form></main>
}

export { AuthForm }