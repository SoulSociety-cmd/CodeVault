import { useEffect, useState } from 'react'
import SnippetCard from '../components/SnippetCard.jsx'
import * as snippetService from '../services/snippetService.js'

export default function Favorites() {
  const [snippets, setSnippets] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { snippetService.listSnippets({ favorite: 'true', sort: 'updated' }).then(({ data }) => setSnippets(data.data.snippets)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load favorites.')) }, [])
  async function removeFavorite(snippet) { try { await snippetService.unfavoriteSnippet(snippet._id); setSnippets((current) => current.filter((item) => item._id !== snippet._id)) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update favorite.') } }
  return <main className="page-shell"><div className="page-heading"><div><p className="eyebrow">CODEVAULT / FAVORITES</p><h1>Favorites</h1><p>Your most important snippets, ready to hand.</p></div></div>{error && <p className="error">{error}</p>}{snippets.length ? <div className="snippet-grid">{snippets.map((snippet) => <SnippetCard key={snippet._id} snippet={snippet} onFavorite={removeFavorite} />)}</div> : <div className="empty-state"><h2>No favorites yet.</h2><p>Favorite a snippet to keep it close.</p></div>}</main>
}