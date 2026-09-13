import { Alert } from '@mui/material'

export default function AlertMessages({
  showSuccess,
  successMsg = 'Changes saved successfully!',
  showError,
  errorMsg,
  onCloseSuccess,
  onCloseError,
}) {
  return (
    <>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={onCloseSuccess}>
          {successMsg}
        </Alert>
      )}
      {showError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={onCloseError}>
          {typeof showError === 'string' ? showError : errorMsg}
        </Alert>
      )}
    </>
  )
}
