import { useState } from 'react'

import { ToastContext } from './toastContextValue.js'

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')

  function showToast(nextMessage) {
    setMessage(nextMessage)
    window.setTimeout(() => setMessage(''), 2200)
  }

  return <ToastContext.Provider value={{ showToast }}>{children}{message && <div className="toast" role="status">{message}</div>}</ToastContext.Provider>
}

