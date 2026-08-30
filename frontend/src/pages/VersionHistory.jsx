import { DiffEditor } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import * as snippetService from '../services/snippetService.js'

export default function VersionHistory() {
  const { id } = useParams()
  const [snippet, setSnippet] = useState(null)
  const [versions, setVersions] = useState([])
  const [selectedOld, setSelectedOld] = useState('')
  const [selectedNew, setSelectedNew] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [{ data: snippetData }, { data: versionData }] = await Promise.all([
          snippetService.getSnippet(id),
          snippetService.getSnippetVersions(id),
        ])
        const list = [...(versionData?.data?.versions || [])].sort((a, b) => Number(b.version) - Number(a.version))
        setSnippet(snippetData?.data?.snippet || null)
        setVersions(list)
        if (list.length > 0) {
          setSelectedOld(String(list[list.length - 1].version))
          setSelectedNew(String(list[0].version))
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load version history.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const oldVersion = versions.find((item) => String(item.version) === selectedOld) || versions[versions.length - 1] || null
  const newVersion = versions.find((item) => String(item.version) === selectedNew) || versions[0] || null

  if (loading) return <main className="page-shell"><p className="status">Loading version history...</p></main>
  if (error) return <main className="page-shell"><p className="error">{error}</p><Link to="/snippets">Back to snippets</Link></main>

  return <main className="page-shell">
    <div className="version-header">
      <div>
        <p className="eyebrow">VERSION HISTORY</p>
        <h1>{snippet?.title || 'Snippet versions'}</h1>
      </div>
      <Link to={`/snippets/${id}`} className="primary-button">Back to snippet</Link>
    </div>

    <div className="version-list">
      {versions.length === 0 ? <div className="empty-state">No versions yet.</div> : versions.map((version) => (
        <div key={version._id} className="version-item">
          <div>
            <strong>v{version.version}</strong>
          </div>
          <small>{new Date(version.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>

    <div className="compare-controls">
      <label>
        Old version
        <select value={selectedOld} onChange={(event) => setSelectedOld(event.target.value)} disabled={versions.length === 0}>
          {versions.map((version) => <option key={`old-${version._id}`} value={String(version.version)}>v{version.version}</option>)}
        </select>
      </label>
      <label>
        New version
        <select value={selectedNew} onChange={(event) => setSelectedNew(event.target.value)} disabled={versions.length === 0}>
          {versions.map((version) => <option key={`new-${version._id}`} value={String(version.version)}>v{version.version}</option>)}
        </select>
      </label>
    </div>

    <div className="diff-panel">
      {oldVersion && newVersion ? (
        <DiffEditor
          height="520px"
          language={snippet?.language || 'javascript'}
          original={oldVersion.code || ''}
          modified={newVersion.code || ''}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            renderSideBySide: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      ) : <div className="empty-state">Select two versions to compare.</div>}
    </div>
  </main>
}
