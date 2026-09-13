import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

export default function AddButton({ label = 'Add', onClick, loading = false, ...props }) {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
      disabled={loading}
      sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#c2410c' }, ...props.sx }}
      {...props}
    >
      {loading ? 'Adding...' : label}
    </Button>
  )
}
