import { useState } from 'react'

export function useAdminForm() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError,   setShowError]   = useState('')
  const [loading,     setLoading]     = useState(false)


  /** Show success alert for 3s */
  const flash = (duration = 3000) => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), duration)
  }


  /** Show error alert */
  const flashError = (msg = 'Something went wrong.') => {
    setShowError(msg)
  }


  const clearError   = () => setShowError('')
  const clearSuccess = () => setShowSuccess(false)

  return {
    showSuccess,
    showError,
    loading,
    setLoading,
    flash,
    flashError,
    clearError,
    clearSuccess,
  }
}
