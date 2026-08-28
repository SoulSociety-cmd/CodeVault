import { Download, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ConfirmDialog from '../components/ConfirmDialog.jsx'
import * as snippetService from '../services/snippetService.js'
import CodeEditor from '../components/CodeEditor.jsx'
import { downloadCode } from '../utils/codeUtils.js'

export default function SnippetDetails() {
  const { id } = useParams(); const navigate = useNavigate(); const [snippet, setSnippet] = useState(null); const [error, setError] = useState(''); const [confirming, setConfirming] = useState(false); const [fullscreen, setFullscreen] = useState(false)
  useEffect(() => { snippetService.getSnippet(id).then(({ data }) => setSnippet(data.data.snippet)).catch((requestError) => setError(requestError.response?.data?.message || 'Snippet not found.')) }, [id])
  async function remove() { try { await snippetService.deleteSnippet(id); navigate('/snippets') } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete snippet.') } }
  async function toggleFavorite() { try { const { data } = await (snippet.favorites > 0 ? snippetService.unfavoriteSnippet(id) : snippetService.favoriteSnippet(id)); setSnippet(data.data.snippet) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update favorite.') } }
  if (error) return <main className="page-shell"><p className="error">{error}</p><Link to="/snippets">Back to snippets</Link></main>
  if (!snippet) return <main className="page-shell"><p className="status">Loading snippet...</p></main>
  const isFavorite = snippet.favorites > 0
  return <main className="page-shell"><div className="page-heading"><div><p className="eyebrow">{snippet.language} / {snippet.visibility}</p><h1>{snippet.title}</h1><p>{snippet.description}</p></div><div className="card-actions"><button type="button" className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`} onClick={toggleFavorite}><Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'Unfavorite' : 'Favorite'}</button><Link to={`/snippets/${id}/edit`}>Edit</Link><button type="button" className="danger-text" onClick={() => setConfirming(true)}>Delete</button></div></div><div className="detail-meta"><span>Updated {new Date(snippet.updatedAt).toLocaleString()}</span><span>{snippet.views} views</span><span>{snippet.favorites} favorites</span></div><div className="detail-code"><div className="detail-code-actions"><button type="button" onClick={() => downloadCode(snippet.title, snippet.language, snippet.code)}><Download size={16} /> Download</button></div><CodeEditor value={snippet.code} language={snippet.language} readOnly fullscreen={fullscreen} onToggleFullscreen={() => setFullscreen((current) => !current)} /></div><div className="tag-list">{snippet.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div><ConfirmDialog open={confirming} title="Delete this snippet?" message="It will move to Trash and can be restored later." onCancel={() => setConfirming(false)} onConfirm={remove} /></main>
}
