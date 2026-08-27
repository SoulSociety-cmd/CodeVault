import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SnippetCard from '../components/SnippetCard.jsx'
import * as snippetService from '../services/snippetService.js'

export default function MySnippets() {
  const [snippets, setSnippets] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function loadSnippets() { try { const { data } = await snippetService.listSnippets(); setSnippets(data.data.snippets) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load snippets.') } }
  useEffect(() => {
    async function fetchSnippets() { await loadSnippets() }
    void fetchSnippets()
  }, [])
  async function handleDelete() { setDeleting(true); try { await snippetService.deleteSnippet(selected._id); setSelected(null); await loadSnippets() } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete snippet.') } finally { setDeleting(false) } }

  return <main className="page-shell"><div className="page-heading"><div><p className="eyebrow">CODEVAULT / LIBRARY</p><h1>My Snippets</h1><p>Keep your reusable code close, searchable, and versioned.</p></div><Link className="primary-button" to="/snippets/new">Create snippet</Link></div>{error && <p className="error">{error}</p>}{snippets.length ? <div className="snippet-grid">{snippets.map((snippet) => <SnippetCard key={snippet._id} snippet={snippet} onDelete={setSelected} />)}</div> : <div className="empty-state"><h2>Your vault is empty.</h2><p>Create your first snippet to start building your personal library.</p></div>}<ConfirmDialog open={Boolean(selected)} title="Delete this snippet?" message="It will move to Trash and can be restored later." onCancel={() => setSelected(null)} onConfirm={handleDelete} submitting={deleting} /></main>
}