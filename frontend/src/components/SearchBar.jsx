import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import * as snippetService from '../services/snippetService.js'

export default function SearchBar({ className = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState(new URLSearchParams(location.search).get('q') || '')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const requestId = useRef(0)

  useEffect(() => {
    const query = value.trim()
    if (!query) return undefined
    const timer = setTimeout(async () => {
      const currentRequest = ++requestId.current
      try {
        const { data } = await snippetService.searchSnippets({ q: query, sort: 'updated' })
        if (currentRequest === requestId.current) { setResults(data.data.snippets.slice(0, 5)); setOpen(true) }
      } catch { setResults([]) }
    }, 280)
    return () => clearTimeout(timer)
  }, [value])

  function submit(event) {
    event.preventDefault()
    const query = value.trim()
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`)
    setOpen(false)
  }

  function changeValue(event) {
    const nextValue = event.target.value
    setValue(nextValue)
    if (!nextValue.trim()) { setResults([]); setOpen(false) }
  }

  return <div className={`search-wrap ${className}`}>
    <form className="search-bar" onSubmit={submit} role="search">
      <Search size={17} aria-hidden="true" />
      <input value={value} onChange={changeValue} onFocus={() => results.length && setOpen(true)} placeholder="Search snippets..." aria-label="Search snippets" />
      <kbd>Enter</kbd>
    </form>
    {open && <div className="quick-results" role="listbox">
      {results.length ? results.map((snippet) => <button type="button" key={snippet._id} onMouseDown={() => navigate(`/snippets/${snippet._id}`)}><span>{snippet.title}</span><small>{snippet.language}</small></button>) : <p>No matching snippets</p>}
      {results.length > 0 && <button type="button" className="quick-results-all" onMouseDown={submit}>View all results</button>}
    </div>}
  </div>
}
