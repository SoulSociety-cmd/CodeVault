import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SnippetCard from '../components/SnippetCard.jsx'
import * as snippetService from '../services/snippetService.js'

export default function MySnippets() {
  const [snippets, setSnippets] = useState([])
  const [count, setCount] = useState(0)
  const [popular, setPopular] = useState([])
  const [filters, setFilters] = useState({ q: '', language: '', tags: '', visibility: '', collection: '', favorite: false, sort: 'updated' })
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchSnippets() {
      try { const { data } = await snippetService.listSnippets({ ...filters, favorite: filters.favorite ? 'true' : undefined }); setSnippets(data.data.snippets); setCount(data.data.count) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load snippets.') }
    }
    void fetchSnippets()
  }, [filters])
  useEffect(() => { snippetService.popularTags().then(({ data }) => setPopular(data.data.tags)).catch(() => {}) }, [])
  async function handleDelete() { setDeleting(true); try { await snippetService.deleteSnippet(selected._id); setSnippets((current) => current.filter((snippet) => snippet._id !== selected._id)); setCount((current) => Math.max(0, current - 1)); setSelected(null) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete snippet.') } finally { setDeleting(false) } }
  function changeFilter(event) { const { name, value, type, checked } = event.target; setFilters((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value })) }
  function chooseTag(tag) { setFilters((current) => ({ ...current, tags: tag })) }

  return <main className="page-shell"><div className="page-heading"><div><p className="eyebrow">CODEVAULT / LIBRARY</p><h1>My Snippets</h1><p>Keep your reusable code close, searchable, and versioned.</p></div><Link className="primary-button" to="/snippets/new">Create snippet</Link></div><section className="library-tools"><div className="filter-grid"><label>Search<input name="q" value={filters.q} onChange={changeFilter} placeholder="Title, code, tag..." /></label><label>Language<select name="language" value={filters.language} onChange={changeFilter}><option value="">All languages</option>{['javascript', 'typescript', 'python', 'cpp', 'java', 'html', 'css', 'sql', 'go', 'rust'].map((language) => <option key={language}>{language}</option>)}</select></label><label>Visibility<select name="visibility" value={filters.visibility} onChange={changeFilter}><option value="">Any visibility</option><option value="private">Private</option><option value="public">Public</option></select></label><label>Sort<select name="sort" value={filters.sort} onChange={changeFilter}><option value="updated">Recently updated</option><option value="created">Recently created</option><option value="viewed">Most viewed</option><option value="favorited">Most favorited</option><option value="alphabetical">Alphabetical</option></select></label><label>Tags<input name="tags" value={filters.tags} onChange={changeFilter} placeholder="algorithm, auth" /></label><label>Collection<input name="collection" value={filters.collection} onChange={changeFilter} placeholder="Collection ID" /></label><label className="check-filter"><input type="checkbox" name="favorite" checked={filters.favorite} onChange={changeFilter} /> Favorited only</label></div><div className="popular-tags"><strong>Popular tags</strong>{popular.map((tag) => <button type="button" key={tag.name} className={filters.tags === tag.name ? 'active' : ''} onClick={() => chooseTag(tag.name)}>#{tag.name} <small>{tag.count}</small></button>)}</div></section>{error && <p className="error">{error}</p>}<p className="result-count">{count} snippets</p>{snippets.length ? <div className="snippet-grid">{snippets.map((snippet) => <SnippetCard key={snippet._id} snippet={snippet} onDelete={setSelected} />)}</div> : <div className="empty-state"><h2>{count ? 'No snippets match these filters.' : 'Your vault is empty.'}</h2><p>{count ? 'Try broadening your search or clearing a filter.' : 'Create your first snippet to start building your personal library.'}</p></div>}<ConfirmDialog open={Boolean(selected)} title="Delete this snippet?" message="It will move to Trash and can be restored later." onCancel={() => setSelected(null)} onConfirm={handleDelete} submitting={deleting} /></main>
}