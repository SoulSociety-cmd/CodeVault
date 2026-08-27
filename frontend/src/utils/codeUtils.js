const extensions = { c: 'c', cpp: 'cpp', java: 'java', python: 'py', javascript: 'js', typescript: 'ts', html: 'html', css: 'css', sql: 'sql', json: 'json', bash: 'sh', go: 'go', rust: 'rs', php: 'php' }

export function downloadCode(title, language, code) {
  const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'snippet'
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${slug}.${extensions[language] || 'txt'}`
  link.click()
  URL.revokeObjectURL(link.href)
}