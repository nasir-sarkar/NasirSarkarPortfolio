import React, { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, Paper, TextField, Button,
  IconButton, Grid, Card, CardContent, Chip,
} from '@mui/material'
import AddIcon        from '@mui/icons-material/Add'
import DeleteIcon     from '@mui/icons-material/Delete'
import EditIcon       from '@mui/icons-material/Edit'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import BusinessIcon   from '@mui/icons-material/Business'
import api from '../../api/axios'

import SectionHeader     from '../components/SectionHeader'
import AlertMessages     from '../components/AlertMessages'
import EditCancelButtons from '../components/EditCancelButtons'
import LoadingState      from '../components/LoadingState'
import { useAdminForm }  from '../hooks/useAdminForm'



const EMPTY_EXPERIENCE = {
  logoBase64: '', logoMime: '',
  position: '', companyName: '', companyLink: '',
  employmentType: 'Full-time', location: '', locationType: 'On-site',
  date: '', skills: '',
}



// Main component
export default function ExperienceSection() {
  const [experienceCards, setExperienceCards] = useState([])
  const [editingIndex,    setEditingIndex]    = useState(null)
  const [form,            setForm]            = useState({ ...EMPTY_EXPERIENCE })
  const [logoPreview,     setLogoPreview]     = useState(null)

  const logoInputRef = useRef()

  const {
    showSuccess, showError, loading, setLoading,
    flash, flashError, clearSuccess, clearError,
  } = useAdminForm()


  useEffect(() => {
    setLoading(true)
    api.get('/experience/getExperience')
      .then(res => {
        if (res.data) {
          setExperienceCards(res.data.experienceCards || [])
        }
      })
      .catch(err => flashError('Failed to load: ' + err.message))
      .finally(() => setLoading(false))
  }, [])


  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }



  // Logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      const [meta, base64] = dataUrl.split(',')
      const mime = meta.match(/:(.*?);/)[1]
      setForm(prev => ({ ...prev, logoBase64: base64, logoMime: mime }))
      setLogoPreview(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const clearLogo = () => {
    setForm(prev => ({ ...prev, logoBase64: '', logoMime: '' }))
    setLogoPreview(null)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }


  const buildPayload = () => ({
    ...form,
    skills: form.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
  })



  // Experience CRUD
  const addExperience = async () => {
    if (!form.position || !form.companyName || !form.date) return
    try {
      const res = await api.post('/experience/addExperienceCard', buildPayload())
      setExperienceCards(res.data.experienceCards || [])
      setForm({ ...EMPTY_EXPERIENCE })
      setLogoPreview(null)
      if (logoInputRef.current) logoInputRef.current.value = ''
      flash()
    } catch (err) { flashError('Failed to add: ' + err.message) }
  }

  const updateExperienceItem = async () => {
    if (!form.position || !form.companyName || !form.date) return
    try {
      const updated = [...experienceCards]
      updated[experienceCards.length - 1 - editingIndex] = buildPayload()
      const res = await api.put('/experience/updateExperience', { experienceCards: updated })
      setExperienceCards(res.data.experienceCards || [])
      setForm({ ...EMPTY_EXPERIENCE })
      setLogoPreview(null)
      setEditingIndex(null)
      if (logoInputRef.current) logoInputRef.current.value = ''
      flash()
    } catch (err) { flashError('Failed to update: ' + err.message) }
  }

  const deleteExperience = async (reversedIndex) => {
    try {
      const res = await api.delete(`/experience/deleteExperienceCard/${experienceCards.length - 1 - reversedIndex}`)
      setExperienceCards(res.data.experienceCards || [])
    } catch (err) { flashError('Failed to delete: ' + err.message) }
  }

  const editExperience = (reversedIndex) => {
    const card = experienceCards[experienceCards.length - 1 - reversedIndex]
    setForm({
      ...EMPTY_EXPERIENCE,
      ...card,
      skills: Array.isArray(card.skills) ? card.skills.join(', ') : (card.skills || ''),
    })
    setLogoPreview(
      card.logoBase64 ? `data:${card.logoMime || 'image/png'};base64,${card.logoBase64}` : null
    )
    setEditingIndex(reversedIndex)
  }

  const cancelEdit = () => {
    setForm({ ...EMPTY_EXPERIENCE })
    setLogoPreview(null)
    setEditingIndex(null)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  if (loading) return <LoadingState message="Loading experience data..." />

  const displayExperience = [...experienceCards].reverse()

  return (
    <Box>
      <SectionHeader
        title="Experience Section"
        subtitle="Manage your work experience — company logos are stored in the database"
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
          {editingIndex !== null ? 'Edit Experience' : 'Add New Experience'}
        </Typography>

        <Grid container spacing={2}>

          {/* Logo upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Company Logo</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: '50%', border: '2px dashed #ddd',
                overflow: 'hidden', bgcolor: '#f9f9f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {logoPreview
                  ? <img src={logoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <BusinessIcon sx={{ color: '#ccc', fontSize: 28 }} />}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <input ref={logoInputRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handleLogoUpload} />
                <Button variant="outlined" startIcon={<UploadFileIcon />}
                  onClick={() => logoInputRef.current?.click()}
                  sx={{ borderColor: '#f9004d', color: '#f9004d', '&:hover': { borderColor: '#c41020', bgcolor: 'rgba(249,0,77,0.04)' } }}>
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </Button>
                {logoPreview && (
                  <Button variant="text" color="error" size="small" onClick={clearLogo}>
                    Remove Logo
                  </Button>
                )}
                {form.logoBase64 && (
                  <Typography variant="caption" color="success.main">✓ Logo ready to save</Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Position" name="position"
              value={form.position} onChange={handleChange} placeholder="Software Developer Intern" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Company Name" name="companyName"
              value={form.companyName} onChange={handleChange} placeholder="PAP International Ltd." />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Company Website Link" name="companyLink"
              value={form.companyLink} onChange={handleChange} placeholder="https://company-website.com" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select fullWidth label="Employment Type" name="employmentType"
              value={form.employmentType} onChange={handleChange} SelectProps={{ native: true }}>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Volunteer">Volunteer</option>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Location" name="location"
              value={form.location} onChange={handleChange} placeholder="Dhaka, Bangladesh" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Location Type" name="locationType"
              value={form.locationType} onChange={handleChange} SelectProps={{ native: true }}>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Date" name="date"
              value={form.date} onChange={handleChange} placeholder="Feb, 2026 to May, 2026" />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Skills (comma separated, optional)" name="skills"
              value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          {editingIndex !== null ? (
            <EditCancelButtons updateLabel="Update Experience" onUpdate={updateExperienceItem} onCancel={cancelEdit} />
          ) : (
            <Button variant="contained" startIcon={<AddIcon />} onClick={addExperience}
              sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#cc6200' } }}>
              Add Experience
            </Button>
          )}
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Experience ({experienceCards.length})
      </Typography>
      <Grid container spacing={2}>
        {displayExperience.map((exp, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <Box sx={{
                      width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
                      bgcolor: '#f4f4f4', border: '1px solid #eee', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {exp.logoBase64
                        ? <img src={`data:${exp.logoMime || 'image/png'};base64,${exp.logoBase64}`} alt={exp.companyName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <BusinessIcon sx={{ color: '#ccc' }} />}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{exp.position}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {exp.companyName} {exp.employmentType && `· ${exp.employmentType}`}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        {exp.location && <Chip size="small" label={exp.location} />}
                        {exp.locationType && <Chip size="small" label={exp.locationType} />}
                        {exp.date && <Chip size="small" label={exp.date} />}
                      </Box>
                      {exp.skills?.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                          {exp.skills.map((s, i) => (
                            <Chip key={i} size="small" variant="outlined" label={s} />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <IconButton onClick={() => editExperience(index)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => deleteExperience(index)}><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {experienceCards.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No experience added yet.
        </Typography>
      )}
    </Box>
  )
}