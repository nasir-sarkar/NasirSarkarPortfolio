import { Button } from '@mui/material'

export default function SaveButton({ label = 'Save Changes', loading = false, onClick }) {
  return (
    <Button
      type={onClick ? 'button' : 'submit'}
      variant="contained"
      disabled={loading}
      onClick={onClick}
      sx={{
        bgcolor: '#f9004d',
        '&:hover': { bgcolor: '#c41020' },
        px: 4,
        py: 1.5,
      }}
    >
      {loading ? 'Saving...' : label}
    </Button>
  )
}
