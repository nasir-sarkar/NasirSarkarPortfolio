import { Box, Typography } from '@mui/material'

export default function SectionHeader({ title, subtitle }) {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}