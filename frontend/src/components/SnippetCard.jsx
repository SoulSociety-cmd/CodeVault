import { Link } from 'react-router-dom'

export default function SnippetCard({ snippet, onDelete }) {
  return <article className="snippet-card"><div className="snippet-card-header"><div><p className="eyebrow">{snippet.language}</p><h2>{snippet.title}</h2></div><span className="visibility">{snippet.visibility}</span></div><p>{snippet.description || 'No description yet.'}</p><div className="tag-list">{snippet.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div><pre>{snippet.code}</pre><div className="card-actions"><Link to={`/snippets/${snippet._id}`}>Open</Link><Link to={`/snippets/${snippet._id}/edit`}>Edit</Link><button type="button" className="text-button danger-text" onClick={() => onDelete(snippet)}>Delete</button></div></article>
}