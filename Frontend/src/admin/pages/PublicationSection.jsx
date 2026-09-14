import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, TextField, Button,
  IconButton, Grid, Card, CardContent,
} from '@mui/material'
import AddIcon      from '@mui/icons-material/Add'
import DeleteIcon   from '@mui/icons-material/Delete'
import EditIcon     from '@mui/icons-material/Edit'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import api from '../../api/axios'

import SectionHeader     from '../components/SectionHeader'
import AlertMessages     from '../components/AlertMessages'
import EditCancelButtons from '../components/EditCancelButtons'
import LoadingState      from '../components/LoadingState'
import { useAdminForm }  from '../hooks/useAdminForm'



const EMPTY_PUBLICATION = {
  title: '', publisher: '', year: '', url: '', description: '',
}



// Main component
export default function PublicationSection() {
  const [publicationCards, setPublicationCards] = useState([])
  const [editingIndex,     setEditingIndex]     = useState(null)
  const [form,             setForm]             = useState({ ...EMPTY_PUBLICATION })

  const {
    showSuccess, showError, loading, setLoading,
    flash, flashError, clearSuccess, clearError,
  } = useAdminForm()


  useEffect(() => {
    setLoading(true)
    api.get('/publications/getPublications')
      .then(res => {
        if (res.data) {
          setPublicationCards(res.data.publicationCards || [])
        }
      })
      .catch(err => flashError('Failed to load: ' + err.message))
      .finally(() => setLoading(false))
  }, [])


  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }



  // Publication CRUD
  const addPublication = async () => {
    if (!form.title || !form.publisher || !form.year) return
    try {
      const res = await api.post('/publications/addPublicationCard', form)
      setPublicationCards(res.data.publicationCards || [])
      setForm({ ...EMPTY_PUBLICATION })
      flash()
    } catch (err) { flashError('Failed to add: ' + err.message) }
  }

  const updatePublicationItem = async () => {
    if (!form.title || !form.publisher || !form.year) return
    try {
      const updated = [...publicationCards]
      updated[publicationCards.length - 1 - editingIndex] = { ...form }
      const res = await api.put('/publications/updatePublications', { publicationCards: updated })
      setPublicationCards(res.data.publicationCards || [])
      setForm({ ...EMPTY_PUBLICATION })
      setEditingIndex(null)
      flash()
    } catch (err) { flashError('Failed to update: ' + err.message) }
  }

  const deletePublication = async (reversedIndex) => {
    try {
      const res = await api.delete(`/publications/deletePublicationCard/${publicationCards.length - 1 - reversedIndex}`)
      setPublicationCards(res.data.publicationCards || [])
    } catch (err) { flashError('Failed to delete: ' + err.message) }
  }

  const editPublication = (reversedIndex) => {
    const card = publicationCards[publicationCards.length - 1 - reversedIndex]
    setForm({ ...EMPTY_PUBLICATION, ...card })
    setEditingIndex(reversedIndex)
  }

  const cancelEdit = () => {
    setForm({ ...EMPTY_PUBLICATION })
    setEditingIndex(null)
  }

  if (loading) return <LoadingState message="Loading publication data..." />

  const displayPublications = [...publicationCards].reverse()

  return (
    <Box>
      <SectionHeader
        title="Publications Section"
        subtitle="Manage your published research papers and articles"
      />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Saved successfully!"
        showError={showError}
        onCloseSuccess={clearSuccess}
        onCloseError={clearError}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          {editingIndex !== null ? 'Edit Publication' : 'Add New Publication'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField fullWidth label="Title" name="title"
              value={form.title} onChange={handleChange}
              placeholder="ALISD-Net: Autoimmune Liver Injury Severity Detection Network" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Publication Year" name="year"
              value={form.year} onChange={handleChange} placeholder="2026" />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Publisher" name="publisher"
              value={form.publisher} onChange={handleChange} placeholder="IEEE TENCON" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Publication URL" name="url"
              value={form.url} onChange={handleChange} placeholder="https://ieeexplore.ieee.org/..." />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth multiline minRows={3} label="Description (optional)" name="description"
              value={form.description} onChange={handleChange}
              placeholder="Brief summary of the publication..." />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          {editingIndex !== null ? (
            <EditCancelButtons updateLabel="Update Publication" onUpdate={updatePublicationItem} onCancel={cancelEdit} />
          ) : (
            <Button variant="contained" startIcon={<AddIcon />} onClick={addPublication}
              sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#cc6200' } }}>
              Add Publication
            </Button>
          )}
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Publications ({publicationCards.length})
      </Typography>
      <Grid container spacing={2}>
        {displayPublications.map((pub, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <MenuBookIcon sx={{ color: '#f9004d', mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{pub.title}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {pub.publisher} {pub.year && `· ${pub.year}`}
                      </Typography>
                      {pub.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {pub.description}
                        </Typography>
                      )}
                      {pub.url && (
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          <a href={pub.url} target="_blank" rel="noreferrer" style={{ color: '#f9004d' }}>
                            View Publication →
                          </a>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <IconButton onClick={() => editPublication(index)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => deletePublication(index)}><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {publicationCards.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No publications added yet.
        </Typography>
      )}
    </Box>
  )
}