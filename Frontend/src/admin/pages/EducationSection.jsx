import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, TextField, Button,
  IconButton, Grid, Card, CardContent, Chip,
} from '@mui/material'
import AddIcon          from '@mui/icons-material/Add'
import DeleteIcon       from '@mui/icons-material/Delete'
import EditIcon         from '@mui/icons-material/Edit'
import api from '../../api/axios'

import SectionHeader     from '../components/SectionHeader'
import AlertMessages     from '../components/AlertMessages'
import PaperSection      from '../components/PaperSection'
import EditCancelButtons from '../components/EditCancelButtons'
import LoadingState      from '../components/LoadingState'
import { useAdminForm }  from '../hooks/useAdminForm'



// Constants
const EMPTY_EDU = {
  meta: { date: '', comment: '', dateIcon: 'far fa-calendar-alt', commentIcon: 'fas fa-graduation-cap' },
  title: '', titleLink: '', authorIcon: 'fas fa-medal', authorName: '', authorSub: '', readMore: 'Read More', readMoreLink: '',
}


const iconOptions = [
  { value: 'fas fa-medal',       label: 'Medal' },
  { value: 'fas fa-star',        label: 'Star' },
  { value: 'fas fa-award',       label: 'Award' },
  { value: 'fas fa-trophy',      label: 'Trophy' },
  { value: 'fas fa-certificate', label: 'Certificate' },
]


const commentIconOptions = [
  { value: 'fas fa-graduation-cap', label: 'Graduation Cap' },
  { value: 'fas fa-flask',           label: 'Flask' },
  { value: 'fas fa-network-wired',   label: 'Network' },
  { value: 'fas fa-code',            label: 'Code' },
  { value: 'fas fa-laptop-code',     label: 'Laptop Code' },
]



// Shared meta fields
function MetaFields({ form, onChange }) {
  return (
    <>
      <Grid item xs={12} md={3}>
        <TextField fullWidth label="Date" name="meta.date"
          value={form.meta.date} onChange={onChange} placeholder="2022 – Present" />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField fullWidth label="Subject" name="meta.comment"
          value={form.meta.comment} onChange={onChange} placeholder="CSE" />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField select fullWidth label="Date Icon" name="meta.dateIcon"
          value={form.meta.dateIcon} onChange={onChange} SelectProps={{ native: true }}>
          <option value="far fa-calendar-alt">Calendar</option>
          <option value="far fa-clock">Clock</option>
        </TextField>
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField select fullWidth label="Comment Icon" name="meta.commentIcon"
          value={form.meta.commentIcon} onChange={onChange} SelectProps={{ native: true }}>
          {commentIconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </TextField>
      </Grid>
    </>
  )
}



// Author Icon / Name / Sub fields
function AuthorFields({ form, onChange, label = "Achievement / CGPA", namePlaceholder = 'CGPA: 3.82' }) {
  return (
    <>
      <Grid item xs={12} md={4}>
        <TextField select fullWidth label="Author Icon" name="authorIcon"
          value={form.authorIcon} onChange={onChange} SelectProps={{ native: true }}>
          {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField fullWidth label={label} name="authorName"
          value={form.authorName} onChange={onChange} placeholder={namePlaceholder} />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField fullWidth label="Sub Label" name="authorSub"
          value={form.authorSub} onChange={onChange} placeholder="Current" />
      </Grid>
    </>
  )
}



// Main component
export default function EducationSection() {
  const [educationCards,  setEducationCards]  = useState([])
  const [editingEduIndex,  setEditingEduIndex]  = useState(null)
  const [eduForm,          setEduForm]          = useState({ ...EMPTY_EDU })

  const {
    showSuccess, showError, loading, setLoading,
    flash, flashError, clearSuccess, clearError,
  } = useAdminForm()


  useEffect(() => {
    setLoading(true)
    api.get('/education/getEducation')
      .then(res => {
        if (res.data) {
          setEducationCards(res.data.educationCards || [])
        }
      })
      .catch(err => flashError('Failed to load: ' + err.message))
      .finally(() => setLoading(false))
  }, [])


  // Generic nested-field change handler
  const makeChangeHandler = (setter) => (e) => {
    const { name, value } = e.target
    if (name.startsWith('meta.')) {
      const field = name.split('.')[1]
      setter(prev => ({ ...prev, meta: { ...prev.meta, [field]: value } }))
    } else {
      setter(prev => ({ ...prev, [name]: value }))
    }
  }


  const handleEduChange  = makeChangeHandler(setEduForm)



  // Education CRUD
  const addEducation = async () => {
    if (!eduForm.title || !eduForm.meta.date) return
    try {
      const res = await api.post('/education/addEducationCard', eduForm)
      setEducationCards(res.data.educationCards || [])
      setEduForm({ ...EMPTY_EDU, meta: { ...EMPTY_EDU.meta } })
    } catch (err) { flashError('Failed to add: ' + err.message) }
  }

  const updateEducationItem = async () => {
    if (!eduForm.title || !eduForm.meta.date) return
    try {
      const updated = [...educationCards]
      updated[educationCards.length - 1 - editingEduIndex] = { ...eduForm }
      const res = await api.put('/education/updateEducation', { educationCards: updated })
      setEducationCards(res.data.educationCards || [])
      setEduForm({ ...EMPTY_EDU, meta: { ...EMPTY_EDU.meta } })
      setEditingEduIndex(null)
    } catch (err) { flashError('Failed to update: ' + err.message) }
  }

  const deleteEducation = async (reversedIndex) => {
    try {
      const res = await api.delete(`/education/deleteEducationCard/${educationCards.length - 1 - reversedIndex}`)
      setEducationCards(res.data.educationCards || [])
    } catch (err) { flashError('Failed to delete: ' + err.message) }
  }

  const editEducation = (reversedIndex) => {
    const card = educationCards[educationCards.length - 1 - reversedIndex]
    setEduForm({ ...card, meta: { ...card.meta } })
    setEditingEduIndex(reversedIndex)
  }

  const cancelEditEdu = () => {
    setEduForm({ ...EMPTY_EDU, meta: { ...EMPTY_EDU.meta } })
    setEditingEduIndex(null)
  }


  if (loading) return <LoadingState message="Loading education data..." />

  const displayEdu  = [...educationCards].reverse()

  return (
    <Box>
      <SectionHeader
        title="Education Section"
        subtitle="Manage your education history — images are stored in the database"
      />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Saved successfully!"
        showError={showError}
        onCloseSuccess={clearSuccess}
        onCloseError={clearError}
      />

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          {editingEduIndex !== null ? 'Edit Education' : 'Add New Education'}
        </Typography>
        <Grid container spacing={2}>
          <MetaFields form={eduForm} onChange={handleEduChange} />
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Institution Title" name="title"
              value={eduForm.title} onChange={handleEduChange}
              placeholder="American International University-Bangladesh (AIUB)" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Title Link" name="titleLink"
              value={eduForm.titleLink} onChange={handleEduChange}
              placeholder="https://www.aiub.edu/" />
          </Grid>
          <AuthorFields form={eduForm} onChange={handleEduChange} />
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Read More Link" name="readMoreLink"
              value={eduForm.readMoreLink} onChange={handleEduChange}
              placeholder="https://www.aiub.edu/" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          {editingEduIndex !== null ? (
            <EditCancelButtons updateLabel="Update Education" onUpdate={updateEducationItem} onCancel={cancelEditEdu} />
          ) : (
            <Button variant="contained" startIcon={<AddIcon />} onClick={addEducation}
              sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#cc6200' } }}>
              Add Education
            </Button>
          )}
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Education ({educationCards.length})
      </Typography>
      <Grid container spacing={2}>
        {displayEdu.map((edu, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label={edu.meta?.date} icon={<i className={edu.meta?.dateIcon} />} />
                      <Chip size="small" label={edu.meta?.comment} icon={<i className={edu.meta?.commentIcon} />} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{edu.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <i className={edu.authorIcon} style={{ color: '#f9004d' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{edu.authorName}</Typography>
                      <Typography variant="caption" color="text.secondary">({edu.authorSub})</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton onClick={() => editEducation(index)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => deleteEducation(index)}><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {educationCards.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No education added yet.
        </Typography>
      )}
    </Box>
  )
}