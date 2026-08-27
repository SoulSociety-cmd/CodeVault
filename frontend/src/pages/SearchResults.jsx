import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import SnippetCard from '../components/SnippetCard.jsx'
import * as snippetService from '../services/snippetService.js'

export default function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const [result, setResult] = useState({ snippets: [], count: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try { const { data } = await snippetService.searchSnippets({ q: query }); setResult(data.data) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to search snippets.') }
    }
    void load()
  }, [query])

  return <main className="page-shell"><div className="page-heading"><div><p className="eyebrow">CODEVAULT / SEARCH</p><h1>Search results</h1><p>{query ? <>Matches for <strong>{query}</strong></> : 'Search your snippet library.'}</p></div><Link className="primary-button" to="/snippets">Back to library</Link></div>{error && <p className="error">{error}</p>}<p className="result-count">{result.count} {result.count === 1 ? 'snippet' : 'snippets'} found</p>{result.snippets.length ? <div className="snippet-grid">{result.snippets.map((snippet) => <SnippetCard key={snippet._id} snippet={snippet} onDelete={() => {}} />)}</div> : <div className="empty-state"><h2>No snippets found.</h2><p>Try another title, tag, language, or code fragment.</p></div>}</main>
}
