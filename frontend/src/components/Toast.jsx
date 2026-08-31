import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import '../styles/toast.css'

export default function Toast({ id, message, type = 'info', onClose }) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <AlertCircle size={20} />
      case 'warning':
        return <AlertTriangle size={20} />
      case 'info':
      default:
        return <Info size={20} />
    }
  }

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  )
}
