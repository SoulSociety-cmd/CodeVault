import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth.js'
import { AuthForm } from './Login.jsx'

export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false)
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })
  async function handleSubmit(event) {
    event.preventDefault(); setError('')
    if (form.username.trim().length < 3) return setError('Username must be at least 3 characters.')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    setSubmitting(true)
    try { await register(form); navigate('/dashboard') } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to create account.') } finally { setSubmitting(false) }
  }
  return <AuthForm title="Create your vault" subtitle="Keep your best code close at hand." error={error} onSubmit={handleSubmit} submitting={submitting}>
    <label>Username<input value={form.username} onChange={update('username')} required /></label>
    <label>Email<input type="email" value={form.email} onChange={update('email')} required /></label>
    <label>Password<input type="password" value={form.password} onChange={update('password')} required /></label>
    <label>Confirm password<input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required /></label>
    <button disabled={submitting}>{submitting ? 'Creating...' : 'Create account'}</button>
    <p className="switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </AuthForm>
}