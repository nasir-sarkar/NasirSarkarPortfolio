import React, { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, Paper, TextField, Button,
  IconButton, Grid, Card, CardContent, Tabs, Tab, Chip,
} from '@mui/material'
import AddIcon          from '@mui/icons-material/Add'
import DeleteIcon       from '@mui/icons-material/Delete'
import EditIcon         from '@mui/icons-material/Edit'
import UploadFileIcon   from '@mui/icons-material/UploadFile'
import ImageIcon        from '@mui/icons-material/Image'
import api from '../../api/axios'

import SectionHeader     from '../components/SectionHeader'
import AlertMessages     from '../components/AlertMessages'
import PaperSection      from '../components/PaperSection'
import EditCancelButtons from '../components/EditCancelButtons'
import LoadingState      from '../components/LoadingState'
import { useAdminForm }  from '../hooks/useAdminForm'



// Constants 
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '24px 0' }}>
      {value === index && children}
    </div>
  )
}


const EMPTY_EDU = {
  meta: { date: '', comment: '', dateIcon: 'far fa-calendar-alt', commentIcon: 'fas fa-graduation-cap' },
  title: '', titleLink: '', authorIcon: 'fas fa-medal', authorName: '', authorSub: '', readMore: 'Read More', readMoreLink: '',
}


const EMPTY_CERT = {
  imgBase64: '', imgMime: '',
  meta: { date: '', comment: '', dateIcon: 'far fa-calendar-alt', commentIcon: 'fas fa-network-wired' },
  title: '', titleLink: '', authorIcon: 'fas fa-award', authorName: '', authorSub: 'Certified', readMore: 'Credential', readMoreLink: '',
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
  const [tabValue,        setTabValue]        = useState(0)
  const [educationCards,  setEducationCards]  = useState([])
  const [certCards,       setCertCards]       = useState([])
  const [editingEduIndex,  setEditingEduIndex]  = useState(null)
  const [editingCertIndex, setEditingCertIndex] = useState(null)
  const [eduForm,          setEduForm]          = useState({ ...EMPTY_EDU })
  const [certForm,         setCertForm]         = useState({ ...EMPTY_CERT })
  const [certImgPreview,   setCertImgPreview]   = useState(null)

  const imgInputRef = useRef()

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
          setCertCards(res.data.certCards || [])
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
  const handleCertChange = makeChangeHandler(setCertForm)



  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      const [meta, base64] = dataUrl.split(',')
      const mime = meta.match(/:(.*?);/)[1]
      setCertForm(prev => ({ ...prev, imgBase64: base64, imgMime: mime }))
      setCertImgPreview(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setCertForm(prev => ({ ...prev, imgBase64: '', imgMime: '' }))
    setCertImgPreview(null)
    if (imgInputRef.current) imgInputRef.current.value = ''
  }



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



  // Certification CRUD
  const addCertification = async () => {
    if (!certForm.title || !certForm.meta.date) return
    try {
      const res = await api.post('/education/addCertCard', certForm)
      setCertCards(res.data.certCards || [])
      setCertForm({ ...EMPTY_CERT, meta: { ...EMPTY_CERT.meta } })
      setCertImgPreview(null)
      if (imgInputRef.current) imgInputRef.current.value = ''
    } catch (err) { flashError('Failed to add cert: ' + err.message) }
  }

  const updateCertificationItem = async () => {
    if (!certForm.title || !certForm.meta.date) return
    try {
      const updated = [...certCards]
      updated[certCards.length - 1 - editingCertIndex] = { ...certForm }
      const res = await api.put('/education/updateEducation', { certCards: updated })
      setCertCards(res.data.certCards || [])
      setCertForm({ ...EMPTY_CERT, meta: { ...EMPTY_CERT.meta } })
      setCertImgPreview(null)
      setEditingCertIndex(null)
      if (imgInputRef.current) imgInputRef.current.value = ''
    } catch (err) { flashError('Failed to update cert: ' + err.message) }
  }

  const deleteCertification = async (reversedIndex) => {
    try {
      const res = await api.delete(`/education/deleteCertCard/${certCards.length - 1 - reversedIndex}`)
      setCertCards(res.data.certCards || [])
    } catch (err) { flashError('Failed to delete cert: ' + err.message) }
  }

  const editCertification = (reversedIndex) => {
    const cert = certCards[certCards.length - 1 - reversedIndex]
    setCertForm({ ...cert, meta: { ...cert.meta } })
    setEditingCertIndex(reversedIndex)
    setCertImgPreview(cert.imgBase64 && cert.imgMime ? `data:${cert.imgMime};base64,${cert.imgBase64}` : null)
  }

  const cancelEditCert = () => {
    setCertForm({ ...EMPTY_CERT, meta: { ...EMPTY_CERT.meta } })
    setEditingCertIndex(null)
    setCertImgPreview(null)
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  if (loading) return <LoadingState message="Loading education data..." />

  const displayEdu  = [...educationCards].reverse()
  const displayCert = [...certCards].reverse()

  return (
    <Box>
      <SectionHeader
        title="Education Section"
        subtitle="Manage your education and certifications — images are stored in the database"
      />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Saved successfully!"
        showError={showError}
        onCloseSuccess={clearSuccess}
        onCloseError={clearError}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label={`Education (${educationCards.length})`} />
          <Tab label={`Certifications (${certCards.length})`} />
        </Tabs>



        {/* ── Education Tab ── */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>



        {/* ── Certifications Tab ── */}
        <TabPanel value={tabValue} index={1}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              {editingCertIndex !== null ? 'Edit Certification' : 'Add New Certification'}
            </Typography>
            <Grid container spacing={2}>
              {/* Image upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Certification Image</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{
                    width: 160, height: 80, border: '2px dashed #ddd', borderRadius: 2,
                    overflow: 'hidden', bgcolor: '#f9f9f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {certImgPreview
                      ? <img src={certImgPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <ImageIcon sx={{ color: '#ccc', fontSize: 36 }} />}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <input ref={imgInputRef} type="file" accept="image/*"
                      style={{ display: 'none' }} onChange={handleImageUpload} />
                    <Button variant="outlined" startIcon={<UploadFileIcon />}
                      onClick={() => imgInputRef.current?.click()}
                      sx={{ borderColor: '#f9004d', color: '#f9004d', '&:hover': { borderColor: '#c41020', bgcolor: 'rgba(249,0,77,0.04)' } }}>
                      {certImgPreview ? 'Change Image' : 'Upload Image'}
                    </Button>
                    {certImgPreview && (
                      <Button variant="text" color="error" size="small" onClick={clearImage}>
                        Remove Image
                      </Button>
                    )}
                    {certForm.imgBase64 && (
                      <Typography variant="caption" color="success.main">✓ Image ready to save</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <MetaFields form={certForm} onChange={handleCertChange} />

              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Certification Title" name="title"
                  value={certForm.title} onChange={handleCertChange}
                  placeholder="Cisco Networking Academy – IT Essentials" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Title Link (Credential URL)" name="titleLink"
                  value={certForm.titleLink} onChange={handleCertChange}
                  placeholder="https://www.credly.com/badges/..." />
              </Grid>

              <AuthorFields 
                form={certForm} 
                onChange={handleCertChange} 
                label="Recipient Name" 
                namePlaceholder="Nasir Sarkar" 
              />

              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Credential URL" name="readMoreLink"
                  value={certForm.readMoreLink} onChange={handleCertChange}
                  placeholder="https://www.credly.com/badges/..." />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              {editingCertIndex !== null ? (
                <EditCancelButtons updateLabel="Update Certification" onUpdate={updateCertificationItem} onCancel={cancelEditCert} />
              ) : (
                <Button variant="contained" startIcon={<AddIcon />} onClick={addCertification}
                  sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#cc6200' } }}>
                  Add Certification
                </Button>
              )}
            </Box>
          </Paper>

          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Certifications ({certCards.length})
          </Typography>
          <Grid container spacing={2}>
            {displayCert.map((cert, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ '&:hover': { boxShadow: 3 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        {cert.imgBase64 ? (
                          <Box sx={{ width: '100%', height: 70, mb: 1.5, borderRadius: 1, overflow: 'hidden', bgcolor: '#f4f4f4', border: '1px solid #eee' }}>
                            <img src={`data:${cert.imgMime || 'image/png'};base64,${cert.imgBase64}`} alt={cert.title}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <ImageIcon sx={{ color: '#ccc' }} />
                            <Typography variant="caption" color="text.secondary">No image</Typography>
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                          <Chip size="small" label={cert.meta?.date} />
                          <Chip size="small" label={cert.meta?.comment} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>{cert.title}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <i className={cert.authorIcon} style={{ color: '#f9004d' }} />
                          <Typography variant="body2">{cert.authorName}</Typography>
                          <Typography variant="caption" color="text.secondary">({cert.authorSub})</Typography>
                        </Box>
                        {cert.readMoreLink && (
                          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                            <a href={cert.readMoreLink} target="_blank" rel="noreferrer" style={{ color: '#f9004d' }}>
                              {cert.readMore} →
                            </a>
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <IconButton onClick={() => editCertification(index)}><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => deleteCertification(index)}><DeleteIcon /></IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {certCards.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No certifications added yet.
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </Box>
  )
}