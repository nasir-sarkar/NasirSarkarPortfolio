import React, { useState, useEffect } from 'react'
import { Box, Paper, TextField, Grid } from '@mui/material'
import { Typography } from '@mui/material'
import api from '../../api/axios'

import SectionHeader    from '../components/SectionHeader'
import AlertMessages    from '../components/AlertMessages'
import PaperSection     from '../components/PaperSection'
import SaveButton       from '../components/SaveButton'
import LoadingState     from '../components/LoadingState'
import { useAdminForm } from '../hooks/useAdminForm'



export default function HeroSection() {
  const [formData, setFormData] = useState({
    name:           '',
    role:           '',
    role2:          '',
    tagline:        '',
    target_number1: '', label1: '',
    target_number2: '', label2: '',
    target_number3: '', label3: '',
  })
  const [pageLoading, setPageLoading] = useState(true)

  const { showSuccess, showError, flash, flashError, clearError, clearSuccess } = useAdminForm()



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/home/getHome')
        if (res.data) setFormData(res.data)
      } catch (err) {
        flashError('Failed to load: ' + err.message)
      } finally {
        setPageLoading(false)
      }
    }
    fetchData()
  }, [])



  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/home/updateHome', formData)
      flash()
    } catch (err) {
      flashError('Failed to save: ' + err.message)
    }
  }

  if (pageLoading) return <LoadingState />



  return (
    <Box>
      <SectionHeader
        title="Hero Section"
        subtitle="Edit the main hero/banner section of your portfolio"
      />



      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Hero section updated successfully!"
        showError={showError}
        onCloseSuccess={clearSuccess}
        onCloseError={clearError}
      />



      <form onSubmit={handleSubmit}>

        <PaperSection title="Hero Content">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Name" name="name"
                value={formData.name || ''} onChange={handleChange}
                placeholder="Nasir" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Role 1" name="role"
                value={formData.role || ''} onChange={handleChange}
                placeholder="Web Developer" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Role 2 (optional)" name="role2"
                value={formData.role2 || ''} onChange={handleChange}
                placeholder="SQA Engineer" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Tagline" name="tagline"
                value={formData.tagline || ''} onChange={handleChange}
                placeholder="Frontend Based Developer" />
            </Grid>
          </Grid>
        </PaperSection>



        <PaperSection
          title="Statistics (at most 3)"
          subtitle="Leave the label empty to hide that stat counter completely on the website"
        >
          {[1, 2, 3].map((n) => (
            <Paper key={n} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#555', fontWeight: 600 }}>
                Stat {n}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Label (leave empty to hide)"
                    name={`label${n}`} value={formData[`label${n}`] || ''}
                    onChange={handleChange} placeholder="e.g. Projects Completed" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Target Number"
                    name={`target_number${n}`} value={formData[`target_number${n}`] || ''}
                    onChange={handleChange} placeholder="e.g. 4"
                    inputProps={{ inputMode: 'decimal' }} />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </PaperSection>



        <SaveButton />

      </form>
    </Box>
  )
}