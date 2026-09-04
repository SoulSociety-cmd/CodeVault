import { useEffect, useState } from 'react'
import SnippetCard from '../components/SnippetCard.jsx'
import * as snippetService from '../services/snippetService.js'
import { useToast } from '../hooks/useToast.js'
import { SkeletonList } from '../components/Loading.jsx'
import { Heart } from 'lucide-react'

export default function Favorites() {
  const [snippets, setSnippets] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const { data } = await snippetService.listSnippets({ favorite: 'true', sort: 'updated' })
        setSnippets(data.data.snippets)
        setError('')
      } catch (requestError) {
        const msg = requestError.response?.data?.message || 'Unable to load favorites.'
        setError(msg)
        showToast(msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [showToast])

  async function removeFavorite(snippet) {
    try {
      await snippetService.unfavoriteSnippet(snippet._id)
      setSnippets((current) => current.filter((item) => item._id !== snippet._id))
      showToast('Removed from favorites', 'success')
    } catch (requestError) {
      const msg = requestError.response?.data?.message || 'Unable to update favorite.'
      setError(msg)
      showToast(msg, 'error')
    }
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CODEVAULT / FAVORITES</p>
          <h1>Favorites</h1>
          <p>Your most important snippets, ready to hand.</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="snippet-grid">
          <SkeletonList />
        </div>
      ) : snippets.length ? (
        <div className="snippet-grid">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet._id}
              snippet={snippet}
              onFavorite={removeFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
          <h2>No favorite snippets yet.</h2>
          <p>Favorite a snippet to keep it close.</p>
        </div>
      )}
    </main>
  )
}