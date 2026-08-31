import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SnippetCard from '../components/SnippetCard.jsx'
import * as snippetService from '../services/snippetService.js'
import { useToast } from '../hooks/useToast.js'
import { SkeletonList } from '../components/Loading.jsx'

export default function MySnippets() {
  const [snippets, setSnippets] = useState([])
  const [count, setCount] = useState(0)
  const [popular, setPopular] = useState([])
  const [filters, setFilters] = useState({ q: '', language: '', tags: '', visibility: '', collection: '', favorite: false, sort: 'updated' })
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchSnippets() {
      try {
        setLoading(true)
        const { data } = await snippetService.listSnippets({ ...filters, favorite: filters.favorite ? 'true' : undefined })
        setSnippets(data.data.snippets)
        setCount(data.data.count)
        setError('')
      } catch (requestError) {
        const msg = requestError.response?.data?.message || 'Unable to load snippets.'
        setError(msg)
        showToast(msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    void fetchSnippets()
  }, [filters, showToast])

  useEffect(() => { 
    snippetService.popularTags()
      .then(({ data }) => setPopular(data.data.tags))
      .catch(() => {}) 
  }, [])

  async function handleDelete() { 
    setDeleting(true)
    try { 
      await snippetService.deleteSnippet(selected._id)
      setSnippets((current) => current.filter((snippet) => snippet._id !== selected._id))
      setCount((current) => Math.max(0, current - 1))
      setSelected(null)
      showToast('Snippet deleted successfully', 'success')
    } catch (requestError) { 
      const msg = requestError.response?.data?.message || 'Unable to delete snippet.'
      setError(msg)
      showToast(msg, 'error')
    } finally { 
      setDeleting(false) 
    } 
  }

  function changeFilter(event) { 
    const { name, value, type, checked } = event.target
    setFilters((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value })) 
  }

  function chooseTag(tag) { 
    setFilters((current) => ({ ...current, tags: tag })) 
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CODEVAULT / LIBRARY</p>
          <h1>My Snippets</h1>
          <p>Keep your reusable code close, searchable, and versioned.</p>
        </div>
        <Link className="primary-button" to="/snippets/new">
          <Plus size={16} /> Create snippet
        </Link>
      </div>

      <section className="library-tools">
        <div className="filter-grid">
          <label>
            Search
            <input
              name="q"
              value={filters.q}
              onChange={changeFilter}
              placeholder="Title, code, tag..."
            />
          </label>
          <label>
            Language
            <select name="language" value={filters.language} onChange={changeFilter}>
              <option value="">All languages</option>
              {['javascript', 'typescript', 'python', 'cpp', 'java', 'html', 'css', 'sql', 'go', 'rust'].map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </label>
          <label>
            Visibility
            <select name="visibility" value={filters.visibility} onChange={changeFilter}>
              <option value="">Any visibility</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </label>
          <label>
            Sort
            <select name="sort" value={filters.sort} onChange={changeFilter}>
              <option value="updated">Recently updated</option>
              <option value="created">Recently created</option>
              <option value="viewed">Most viewed</option>
              <option value="favorited">Most favorited</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </label>
          <label>
            Tags
            <input
              name="tags"
              value={filters.tags}
              onChange={changeFilter}
              placeholder="algorithm, auth"
            />
          </label>
          <label>
            Collection
            <input
              name="collection"
              value={filters.collection}
              onChange={changeFilter}
              placeholder="Collection ID"
            />
          </label>
          <label className="check-filter">
            <input
              type="checkbox"
              name="favorite"
              checked={filters.favorite}
              onChange={changeFilter}
            />{' '}
            Favorited only
          </label>
        </div>

        <div className="popular-tags">
          <strong>Popular tags</strong>
          {popular.map((tag) => (
            <button
              type="button"
              key={tag.name}
              className={filters.tags === tag.name ? 'active' : ''}
              onClick={() => chooseTag(tag.name)}
            >
              #{tag.name} <small>{tag.count}</small>
            </button>
          ))}
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="snippet-grid">
          <SkeletonList />
        </div>
      ) : snippets.length ? (
        <>
          <p className="result-count">{count} {count === 1 ? 'snippet' : 'snippets'}</p>
          <div className="snippet-grid">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                onDelete={() => setSelected(snippet)}
                onFavorite={() => {}}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h2>You haven't saved any snippets yet.</h2>
          <p>Create your first snippet to get started organizing your code.</p>
          <Link className="primary-button" to="/snippets/new">
            <Plus size={16} /> Create your first snippet
          </Link>
        </div>
      )}

      {selected && (
        <ConfirmDialog
          open
          title="Delete snippet"
          message={`Are you sure you want to delete "${selected.title}"?`}
          confirmText={deleting ? 'Deleting...' : 'Delete'}
          onConfirm={handleDelete}
          onCancel={() => setSelected(null)}
          disabled={deleting}
          danger
        />
      )}
    </main>
  )
}
