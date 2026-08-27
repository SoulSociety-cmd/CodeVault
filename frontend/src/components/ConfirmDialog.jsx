export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, submitting = false }) {
  if (!open) return null
  return <div className="dialog-backdrop" role="presentation"><div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><h2 id="dialog-title">{title}</h2><p>{message}</p><div className="dialog-actions"><button type="button" onClick={onCancel} disabled={submitting}>Cancel</button><button type="button" className="danger" onClick={onConfirm} disabled={submitting}>{submitting ? 'Deleting...' : 'Delete snippet'}</button></div></div></div>
}