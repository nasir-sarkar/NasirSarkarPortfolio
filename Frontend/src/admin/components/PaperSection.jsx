import { Box, Paper, Typography } from '@mui/material'
import AddButton from './AddButton'

export default function PaperSection({
  title,
  subtitle,
  addLabel,
  onAdd,
  headerAction,
  children,
  sx = {},
}) {
  const hasHeaderAction = onAdd || headerAction

  return (
    <Paper sx={{ p: 3, mb: 3, ...sx }}>
      {(title || hasHeaderAction) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: subtitle ? 1 : 3,
          }}
        >
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
          )}
          {hasHeaderAction && (
            headerAction ?? <AddButton label={addLabel || 'Add'} onClick={onAdd} />
          )}
        </Box>
      )}

      {subtitle && (
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
          {subtitle}
        </Typography>
      )}

      {children}
    </Paper>
  )
}
