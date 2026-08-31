import Editor from '@monaco-editor/react'
import { Copy, Maximize2, Minimize2 } from 'lucide-react'
import { useState } from 'react'

import { useToast } from '../hooks/useToast.js'

export default function CodeEditor({ value, language, readOnly, onChange, fullscreen = false, onToggleFullscreen }) {
  const { showToast } = useToast()
  const [wordWrap, setWordWrap] = useState(true)
  const [fontSize, setFontSize] = useState(14)

  async function copyCode() {
    await navigator.clipboard.writeText(value || '')
    showToast('Code copied to clipboard.', 'success')
  }

  return <div className={`code-editor ${fullscreen ? 'code-editor-fullscreen' : ''}`}>
    <div className="editor-toolbar">
      <div className="editor-controls">
        <button type="button" onClick={() => setWordWrap((current) => !current)}>{wordWrap ? 'Wrap on' : 'Wrap off'}</button>
        <label>Font size<select value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))}><option value="12">12</option><option value="14">14</option><option value="16">16</option><option value="18">18</option><option value="20">20</option></select></label>
      </div>
      <div className="editor-controls">
        <button type="button" title="Copy code" aria-label="Copy code" onClick={copyCode}><Copy size={16} /> Copy</button>
        {onToggleFullscreen && <button type="button" title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={onToggleFullscreen}>{fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>}
      </div>
    </div>
    <Editor height={fullscreen ? "calc(100vh - 58px)" : "420px"} language={language} value={value} onChange={(nextValue) => onChange?.(nextValue || '')} theme="vs-dark" options={{ readOnly, minimap: { enabled: true }, folding: true, lineNumbers: 'on', wordWrap: wordWrap ? 'on' : 'off', fontSize }} />
  </div>
}