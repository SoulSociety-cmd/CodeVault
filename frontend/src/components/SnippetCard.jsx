import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import CodeEditor from './CodeEditor.jsx'
import * as snippetService from '../services/snippetService.js'

export default function SnippetCard({ snippet, onDelete = () => {}, onFavorite }) {
  const [isFavorite, setIsFavorite] = useState(snippet.favorites > 0)
  async function toggleFavorite() { if (onFavorite !== undefined) { await onFavorite({ ...snippet, favorites: isFavorite ? 0 : 1 }); setIsFavorite((current) => !current); return } await (isFavorite ? snippetService.unfavoriteSnippet(snippet._id) : snippetService.favoriteSnippet(snippet._id)); setIsFavorite((current) => !current) }
  return <article className="snippet-card"><div className="snippet-card-header"><div><p className="eyebrow">{snippet.language}</p><h2>{snippet.title}</h2></div><div className="snippet-card-status"><span className="visibility">{snippet.visibility}</span><button type="button" className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`} aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'} onClick={toggleFavorite}><Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} /></button></div></div><p>{snippet.description || 'No description yet.'}</p><div className="tag-list">{snippet.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div><p className="snippet-updated">Updated {new Date(snippet.updatedAt).toLocaleString()}</p><CodeEditor value={snippet.code} language={snippet.language} readOnly /><div className="card-actions"><Link to={`/snippets/${snippet._id}`}>Open</Link><Link to={`/snippets/${snippet._id}/edit`}>Edit</Link><button type="button" className="text-button danger-text" onClick={() => onDelete(snippet)}>Delete</button></div></article>
}