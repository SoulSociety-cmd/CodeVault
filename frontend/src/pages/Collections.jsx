import { useCallback, useEffect, useState } from 'react'
import { FolderPlus } from 'lucide-react'
import * as collectionService from '../services/collectionService.js'
import * as snippetService from '../services/snippetService.js'
import { useToast } from '../hooks/useToast.js'
import { SkeletonList } from '../components/Loading.jsx'

export default function Collections() {
  const [collections, setCollections] = useState([]); const [snippets, setSnippets] = useState([]); const [form, setForm] = useState({ name: '', description: '' }); const [editing, setEditing] = useState(null); const [error, setError] = useState('')
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const { showToast } = useToast()
  const load = useCallback(async function loadCollections() {
      try {
        setLoading(true)
        const [{ data: collectionData }, { data: snippetData }] = await Promise.all([
          collectionService.listCollections(),
          snippetService.listSnippets({ sort: 'alphabetical' }),
        ])
        setCollections(collectionData.data.collections)
        setSnippets(snippetData.data.snippets)
        setError('')
      } catch (requestError) {
        const message = requestError.response?.data?.message || 'Unable to load collections.'
        setError(message)
        showToast(message, 'error')
      } finally {
        setLoading(false)
      }
  }, [showToast])
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])
  async function save(event) {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) await collectionService.updateCollection(editing._id, form)
      else await collectionService.createCollection(form)
      setForm({ name: '', description: '' })
      setEditing(null)
      showToast(editing ? 'Collection updated.' : 'Collection created.', 'success')
      await load()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to save collection.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }
  async function remove(collection) { try { await collectionService.deleteCollection(collection._id); await load() } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete collection.') } }
  async function changeSnippet(collection, snippetId, included) { try { await (included ? collectionService.removeSnippet(collection._id, snippetId) : collectionService.addSnippet(collection._id, snippetId)); await load() } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update collection.') } }
  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CODEVAULT / COLLECTIONS</p>
          <h1>Collections</h1>
          <p>Group snippets into focused working sets.</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <form className="collection-form" onSubmit={save}>
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Collection name"
          required
          disabled={saving}
        />
        <input
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Description"
          disabled={saving}
        />
        <button className="primary-button" disabled={saving}>
          {saving ? 'Saving...' : editing ? 'Save collection' : 'Create collection'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null)
              setForm({ name: '', description: '' })
            }}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <SkeletonList />
      ) : collections.length ? (
        <div className="collection-grid">
          {collections.map((collection) => (
            <article className="collection-card" key={collection._id}>
              <div className="collection-card-header">
                <div>
                  <h2>{collection.name}</h2>
                  <p>{collection.description || 'No description yet.'}</p>
                </div>
                <strong>{collection.snippets?.length || 0}</strong>
              </div>
              <div className="collection-snippets">
                {snippets.map((snippet) => {
                  const included = collection.snippets?.some((item) => (item._id || item) === snippet._id)
                  return (
                    <label key={snippet._id}>
                      <input
                        type="checkbox"
                        checked={included}
                        onChange={() => changeSnippet(collection, snippet._id, included)}
                      />
                      {snippet.title}
                    </label>
                  )
                })}
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(collection)
                    setForm({ name: collection.name, description: collection.description || '' })
                  }}
                >
                  Rename
                </button>
                <button type="button" className="danger-text" onClick={() => remove(collection)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FolderPlus size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
          <h2>No collections yet.</h2>
          <p>Create a collection to organize your snippets.</p>
        </div>
      )}
    </main>
  )
}