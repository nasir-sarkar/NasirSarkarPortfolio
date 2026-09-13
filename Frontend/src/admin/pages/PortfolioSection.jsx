import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, TextField,
  Button, IconButton, Grid, Card, CardContent,
} from '@mui/material'
import AddIcon    from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon   from '@mui/icons-material/Edit'
import api from '../../api/axios'

import SectionHeader    from '../components/SectionHeader'
import AlertMessages    from '../components/AlertMessages'
import PaperSection     from '../components/PaperSection'
import LoadingState     from '../components/LoadingState'
import ImgUploadField   from '../components/ImgUploadField'
import { useAdminForm } from '../hooks/useAdminForm'



// helpers
const emptyProject = () => ({
  cat: '', title: '', detailTitle: '', tech: '', link: '', liveLink: '',
  gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  description: '', features: [],
  imgBase64: '', imgMime: '',
  detailImage1Base64: '', detailImage1Mime: '',
  detailImage2Base64: '', detailImage2Mime: '',
})



// ProjectForm 
function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [form,       setForm]       = useState(initial || emptyProject())
  const [featInput,  setFeatInput]  = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addFeature = () => {
    const trimmed = featInput.trim()
    if (!trimmed) return
    set('features', [...(form.features || []), trimmed])
    setFeatInput('')
  }

  const removeFeature = (i) =>
    set('features', form.features.filter((_, idx) => idx !== i))




  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth size="small" label="Category" value={form.cat}
            onChange={e => set('cat', e.target.value)} placeholder="Web Development" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth size="small" label="Technologies" value={form.tech}
            onChange={e => set('tech', e.target.value)} placeholder="React, Node.js · 2025" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth size="small" label="Card Title" value={form.title}
            onChange={e => set('title', e.target.value)} placeholder="Event Booking System" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth size="small" label="Detail Page Title (optional)" value={form.detailTitle}
            onChange={e => set('detailTitle', e.target.value)} placeholder="Longer, more descriptive title" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth size="small" label="GitHub URL" value={form.link}
            onChange={e => set('link', e.target.value)} placeholder="https://github.com/..." />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth size="small" label="Live Demo URL (optional)" value={form.liveLink}
            onChange={e => set('liveLink', e.target.value)} placeholder="https://your-demo.com" />
        </Grid>
      </Grid>

      <TextField fullWidth multiline rows={4} label="Description" value={form.description}
        onChange={e => set('description', e.target.value)}
        placeholder="Describe what this project does..." />



      {/* Features */}
      <Box>
        <Typography variant="caption" sx={{
          fontWeight: 600, color: '#6b7280', textTransform: 'uppercase',
          fontSize: '0.65rem', letterSpacing: '0.5px', mb: 1, display: 'block',
        }}>
          Key Features
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField size="small" fullWidth value={featInput}
            onChange={e => setFeatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            placeholder="Type a feature and press Enter or Add" />
          <Button type="button" onClick={addFeature} variant="contained"
            sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#c2410c' }, textTransform: 'none', whiteSpace: 'nowrap' }}>
            Add
          </Button>
        </Box>
        {form.features?.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {form.features.map((f, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f9004d', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ flex: 1, color: '#374151' }}>{f}</Typography>
                <IconButton size="small" onClick={() => removeFeature(i)}
                  sx={{ color: '#9ca3af', '&:hover': { color: '#ef4444' } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>



      {/* Images */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ImgUploadField label="Card Thumbnail" base64={form.imgBase64} mime={form.imgMime}
            onChange={({ base64, mime }) => setForm(f => ({ ...f, imgBase64: base64, imgMime: mime }))} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ImgUploadField label="Detail Image 1" base64={form.detailImage1Base64} mime={form.detailImage1Mime}
            onChange={({ base64, mime }) => setForm(f => ({ ...f, detailImage1Base64: base64, detailImage1Mime: mime }))} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ImgUploadField label="Detail Image 2" base64={form.detailImage2Base64} mime={form.detailImage2Mime}
            onChange={({ base64, mime }) => setForm(f => ({ ...f, detailImage2Base64: base64, detailImage2Mime: mime }))} />
        </Grid>
      </Grid>



      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="button" onClick={() => onSave(form)} disabled={saving} variant="contained"
          sx={{ bgcolor: '#f9004d', '&:hover': { bgcolor: '#c41020' }, px: 4, py: 1 }}>
          {saving ? 'Saving…' : 'Save Project'}
        </Button>
        <Button type="button" onClick={onCancel} variant="outlined"
          sx={{ borderColor: '#e5e7eb', color: '#6b7280', '&:hover': { borderColor: '#9ca3af' } }}>
          Cancel
        </Button>
      </Box>
    </Box>
  )
}



// Main component 
export default function PortfolioSection() {
  const [portfolio,  setPortfolio]  = useState(null)
  const [mode,       setMode]       = useState('list')   
  const [editIndex,  setEditIndex]  = useState(null)

  const {
    showSuccess, showError, loading: pageLoading, setLoading,
    flash, flashError, clearSuccess, clearError,
  } = useAdminForm()

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/portfolio/getPortfolio')
      .then(res => setPortfolio(res.data || { projects: [] }))
      .catch(err => flashError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const projects        = portfolio?.projects || []
  const displayProjects = [...projects].reverse()

  const handleAdd = async (form) => {
    setSaving(true)
    try {
      const res = await api.post('/portfolio/addProject', form)
      setPortfolio(res.data)
      setMode('list')
      flash()
    } catch { flashError('Add failed!') }
    finally { setSaving(false) }
  }

  const handleEdit = async (form) => {
    setSaving(true)
    const originalIndex = projects.length - 1 - editIndex
    const projectId = projects[originalIndex]._id
    try {
      await api.put(`/portfolio/updateProject/${projectId}`, form)
      const res = await api.get('/portfolio/getPortfolio')
      setPortfolio(res.data)
      setMode('list')
      flash()
    } catch { flashError('Update failed!') }
    finally { setSaving(false) }
  }

  const handleDelete = async (reversedIndex) => {
    const originalIndex = projects.length - 1 - reversedIndex
    try {
      const res = await api.delete(`/portfolio/deleteProject/${originalIndex}`)
      setPortfolio(res.data)
      flash()
    } catch { flashError('Delete failed!') }
  }

  if (pageLoading) return <LoadingState />



  // Add form view
  if (mode === 'add') return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 3 }}>
        Add New Project
      </Typography>
      <Paper sx={{ p: 3 }}>
        <ProjectForm onSave={handleAdd} onCancel={() => setMode('list')} saving={saving} />
      </Paper>
    </Box>
  )



  // Edit form view
  if (mode === 'edit' && editIndex !== null) {
    const originalIndex = projects.length - 1 - editIndex
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 3 }}>
          Edit Project
        </Typography>
        <Paper sx={{ p: 3 }}>
          <ProjectForm
            initial={projects[originalIndex]}
            onSave={handleEdit}
            onCancel={() => setMode('list')}
            saving={saving}
          />
        </Paper>
      </Box>
    )
  }



  // List view
  return (
    <Box>
      <SectionHeader title="Portfolio Section" subtitle="Manage your portfolio projects" />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Portfolio updated successfully!"
        showError={showError}
        onCloseSuccess={clearSuccess}
        onCloseError={clearError}
      />

      <PaperSection
        title={`Current Projects (${projects.length})`}
        headerAction={
          <Button onClick={() => setMode('add')} startIcon={<AddIcon />} variant="contained"
            sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#c2410c' } }}>
            Add Project
          </Button>
        }
      >
        {displayProjects.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No projects yet. Add your first one!
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {displayProjects.map((proj, i) => {
              const thumbSrc = proj.imgBase64
                ? `data:${proj.imgMime || 'image/jpeg'};base64,${proj.imgBase64}`
                : null

              return (
                <Grid item xs={12} key={proj._id || i}>
                  <Card sx={{ position: 'relative', border: '1px solid rgba(0,0,0,0.08)', transition: 'border-color 0.2s' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ width: 80, height: 60, borderRadius: 2, overflow: 'hidden', flexShrink: 0, bgcolor: '#f3f4f6' }}>
                          {thumbSrc && <img src={thumbSrc} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937' }}>{proj.title}</Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>{proj.cat} · {proj.tech}</Typography>
                          {proj.description && (
                            <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mt: 0.5 }}>
                              {proj.description.slice(0, 100)}…
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                          <IconButton size="small" onClick={() => { setEditIndex(i); setMode('edit') }}
                            sx={{ color: '#6b7280', '&:hover': { color: '#f9004d' } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(i)} sx={{ color: '#f9004d' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </PaperSection>
    </Box>
  )
}
