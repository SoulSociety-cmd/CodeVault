import { useContext } from 'react'

import { ToastContext } from '../context/toastContextValue.js'

export function useToast() {
  return useContext(ToastContext)
}