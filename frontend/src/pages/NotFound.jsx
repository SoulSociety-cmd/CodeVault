import { ArrowLeft, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return <main className="not-found page-shell"><SearchX size={48} /><p className="eyebrow">404 / NOT FOUND</p><h1>This page went missing.</h1><p>The address may be wrong, or the snippet may have moved.</p><Link className="primary-button" to="/"><ArrowLeft size={16} /> Back to CodeVault</Link></main>
}
