import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import SnippetCard from '../components/SnippetCard.jsx'
import * as snippetService from '../services/snippetService.js'
import { useToast } from '../hooks/useToast.js'
import { SkeletonList } from '../components/Loading.jsx'
import { Search } from 'lucide-react'

export default function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const [result, setResult] = useState({ snippets: [], count: 0 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const { data } = await snippetService.searchSnippets({ q: query })
        setResult(data.data)
        setError('')
      } catch (requestError) {
        const msg = requestError.response?.data?.message || 'Unable to search snippets.'
        setError(msg)
        showToast(msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [query, showToast])

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CODEVAULT / SEARCH</p>
          <h1>Search results</h1>
          <p>
            {query ? (
              <>
                Matches for <strong>{query}</strong>
              </>
            ) : (
              'Search your snippet library.'
            )}
          </p>
        </div>
        <Link className="primary-button" to="/snippets">
          Back to library
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="snippet-grid">
          <SkeletonList />
        </div>
      ) : result.snippets.length ? (
        <>
          <p className="result-count">
            {result.count} {result.count === 1 ? 'snippet' : 'snippets'} found
          </p>
          <div className="snippet-grid">
            {result.snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                onDelete={() => {}}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Search size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
          <h2>No snippets found.</h2>
          <p>Try another title, tag, language, or code fragment.</p>
        </div>
      )}
    </main>
  )
}
