import { useRef } from 'react'
import { Box, Button, Typography } from '@mui/material'

export default function ImgUploadField({ label, base64, mime, onChange }) {
  const inputRef = useRef()
  const src = base64 ? `data:${mime || 'image/jpeg'};base64,${base64}` : null

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const [meta, b64] = reader.result.split(',')
      const fileMime = meta.match(/:(.*?);/)[1]
      onChange({ base64: b64, mime: fileMime })
    }
    reader.readAsDataURL(file)
  }

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          fontSize: '0.65rem',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </Typography>

      <Box
        onClick={() => inputRef.current.click()}
        sx={{
          width: '100%',
          height: 112,
          borderRadius: 2,
          border: '2px dashed',
          borderColor: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          overflow: 'hidden',
          mt: 0.5,
          '&:hover': { borderColor: '#f9004d' },
        }}
      >
        {src ? (
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Typography variant="caption" color="text.secondary">
            Click to upload
          </Typography>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {base64 && (
        <Button
          type="button"
          onClick={() => onChange({ base64: '', mime: '' })}
          size="small"
          sx={{ mt: 0.5, color: '#ef4444', fontSize: '0.7rem', textTransform: 'none' }}
        >
          Remove
        </Button>
      )}
    </Box>
  )
}
