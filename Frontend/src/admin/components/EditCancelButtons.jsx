import { Box, Button } from '@mui/material'

export default function EditCancelButtons({
  updateLabel = 'Update',
  onUpdate,
  onCancel,
  loading = false,
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="contained"
        onClick={onUpdate}
        disabled={loading}
        sx={{ bgcolor: '#f9004d', '&:hover': { bgcolor: '#c41020' } }}
      >
        {loading ? 'Saving...' : updateLabel}
      </Button>
      <Button variant="outlined" onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  )
}
