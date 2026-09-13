import { Box, Typography } from '@mui/material'

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  )
}
