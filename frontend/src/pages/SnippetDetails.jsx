import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ConfirmDialog from '../components/ConfirmDialog.jsx'
import * as snippetService from '../services/snippetService.js'

export default function SnippetDetails() {
  const { id } = useParams(); const navigate = useNavigate(); const [snippet, setSnippet] = useState(null); const [error, setError] = useState(''); const [confirming, setConfirming] = useState(false)
  useEffect(() => { snippetService.getSnippet(id).then(({ data }) => setSnippet(data.data.snippet)).catch((requestError) => setError(requestError.response?.data?.message || 'Snippet not found.')) }, [id])
  async function remove() { try { await snippetService.deleteSnippet(id); navigate('/snippets') } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete snippet.') } }
  if (error) return <main className="page-shell"><p className="error">{error}</p><Link to="/snippets">Back to snippets</Link></main>
  if (!snippet) return <main className="page-shell"><p className="status">Loading snippet...</p></main>
  return <main className="page-shell"><div className="page-heading"><div><p className="eyebrow">{snippet.language} / {snippet.visibility}</p><h1>{snippet.title}</h1><p>{snippet.description}</p></div><div className="card-actions"><Link to={`/snippets/${id}/edit`}>Edit</Link><button type="button" className="danger-text" onClick={() => setConfirming(true)}>Delete</button></div></div><div className="detail-meta"><span>Updated {new Date(snippet.updatedAt).toLocaleString()}</span><span>{snippet.views} views</span><span>{snippet.favorites} favorites</span></div><pre className="detail-code"><code>{snippet.code}</code></pre><div className="tag-list">{snippet.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div><ConfirmDialog open={confirming} title="Delete this snippet?" message="It will move to Trash and can be restored later." onCancel={() => setConfirming(false)} onConfirm={remove} /></main>
}