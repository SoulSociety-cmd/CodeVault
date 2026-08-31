import { Copy, Eye, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import CodeEditor from '../components/CodeEditor.jsx'
import * as snippetService from '../services/snippetService.js'
import { useToast } from '../hooks/useToast.js'

export default function PublicSnippet() {
  const { slug } = useParams()
  const { showToast } = useToast()
  const [snippet, setSnippet] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    snippetService.getPublicSnippet(slug).then(({ data }) => setSnippet(data.data.snippet)).catch(() => setError('This snippet is private or does not exist.'))
  }, [slug])

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    showToast('Public link copied.', 'success')
  }

  if (error) return <main className="page-shell public-page"><p className="error">{error}</p><Link to="/login">Sign in</Link></main>
  if (!snippet) return <main className="page-shell public-page"><p className="status">Loading snippet...</p></main>

  return <main className="page-shell public-page"><div className="public-brand"><Link to="/login">CodeVault</Link><button type="button" onClick={copyLink}><Copy size={16} /> Copy link</button></div><div className="page-heading"><div><p className="eyebrow">PUBLIC SNIPPET / {snippet.language}</p><h1>{snippet.title}</h1><p>{snippet.description || 'Shared from CodeVault.'}</p></div></div><div className="detail-meta"><span><User size={14} /> {snippet.owner?.username || 'CodeVault user'}</span><span><Eye size={14} /> {snippet.views} views</span><span>{snippet.language}</span></div><div className="detail-code"><CodeEditor value={snippet.code} language={snippet.language} readOnly /></div><div className="tag-list">{snippet.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div></main>
}