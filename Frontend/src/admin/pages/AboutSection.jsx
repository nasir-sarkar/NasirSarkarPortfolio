import React, { useEffect, useState } from 'react'
import { Box, TextField, Button, IconButton, Grid } from '@mui/material'
import AddIcon    from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAdmin } from '../context/AdminContext'

import SectionHeader    from '../components/SectionHeader'
import AlertMessages    from '../components/AlertMessages'
import PaperSection     from '../components/PaperSection'
import SaveButton       from '../components/SaveButton'
import { useAdminForm } from '../hooks/useAdminForm'



const InfoRows = ({ side, items, onChange, onRemove }) => (
  <>
    {items.map((item, index) => (
      <Grid container spacing={2} key={index} mb={2}>
        <Grid item xs={5}>
          <TextField fullWidth label="Label" value={item.label}
            onChange={(e) => onChange(side, index, 'label', e.target.value)} />
        </Grid>
        <Grid item xs={5}>
          <TextField fullWidth label="Value" value={item.value}
            onChange={(e) => onChange(side, index, 'value', e.target.value)} />
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={() => onRemove(side, index)} sx={{ color: '#f9004d' }}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    ))}
  </>
)



export default function AboutSection() {
  const { data, updateAbout } = useAdmin()

  const [aboutData,  setAboutData]  = useState(null)
  const [infoLeft,   setInfoLeft]   = useState([])
  const [infoRight,  setInfoRight]  = useState([])

  const { showSuccess, flash, clearSuccess } = useAdminForm()



  useEffect(() => {
    if (data?.about) {
      const about = data.about
      setAboutData(about)
      setInfoLeft([about?.info?.l1, about?.info?.l2, about?.info?.l3, about?.info?.l4].filter(Boolean))
      setInfoRight([about?.info?.l5, about?.info?.l6, about?.info?.l7, about?.info?.l8].filter(Boolean))
    }
  }, [data.about])



  const handleAboutChange = (e) => {
    const { name, value } = e.target
    setAboutData(prev => ({ ...prev, [name]: value }))
  }



  const handleInfoChange = (side, index, field, value) => {
    const setter = side === 'left' ? setInfoLeft : setInfoRight
    const list   = side === 'left' ? infoLeft    : infoRight
    const updated = [...list]
    updated[index][field] = value
    setter(updated)
  }



  const addInfoItem = (side) => {
    const newItem = { label: 'New Field', value: 'Value' }
    side === 'left'
      ? setInfoLeft(prev  => [...prev, newItem])
      : setInfoRight(prev => [...prev, newItem])
  }



  const removeInfoItem = (side, index) => {
    side === 'left'
      ? setInfoLeft(prev  => prev.filter((_, i) => i !== index))
      : setInfoRight(prev => prev.filter((_, i) => i !== index))
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...aboutData,
      info: {
        l1: infoLeft[0],  l2: infoLeft[1],  l3: infoLeft[2],  l4: infoLeft[3],
        l5: infoRight[0], l6: infoRight[1], l7: infoRight[2], l8: infoRight[3],
      },
    }
    try {
      await updateAbout(payload)
      flash()
    } catch (err) {
      console.log(err)
    }
  }

  if (!aboutData) return <Box><p>Loading...</p></Box>



  return (
    <Box>
      <SectionHeader title="About Section" subtitle="Edit About page content from database" />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="About updated successfully!"
        onCloseSuccess={clearSuccess}
      />

      <form onSubmit={handleSubmit}>



        <PaperSection title="Main Content">
          <Grid container spacing={2} mt={1}>
            {[
              { label: 'Section Title',          name: 'sectionTitle' },
              { label: 'First Highlighted Text', name: 'firstHighlightedText' },
              { label: 'Second Highlighted Text',name: 'secondHighlightedText' },
            ].map(({ label, name }) => (
              <Grid item xs={12} key={name}>
                <TextField fullWidth label={label} name={name}
                  value={aboutData[name] || ''} onChange={handleAboutChange} />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Objective" name="objective"
                value={aboutData.objective || ''} onChange={handleAboutChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="CV Link" name="cvLink"
                value={aboutData.cvLink || ''} onChange={handleAboutChange} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Experience Years" name="experienceYears"
                value={aboutData.experienceYears || ''} onChange={handleAboutChange} />
            </Grid>
          </Grid>
        </PaperSection>



        <PaperSection
          title="Left Info"
          headerAction={
            <Button startIcon={<AddIcon />} onClick={() => addInfoItem('left')}
              sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#c2410c' }, color: 'white' }}>
              Add
            </Button>
          }
        >
          <InfoRows side="left" items={infoLeft} onChange={handleInfoChange} onRemove={removeInfoItem} />
        </PaperSection>



        <PaperSection
          title="Right Info"
          headerAction={
            <Button startIcon={<AddIcon />} onClick={() => addInfoItem('right')}
              sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#c2410c' }, color: 'white' }}>
              Add
            </Button>
          }
        >
          <InfoRows side="right" items={infoRight} onChange={handleInfoChange} onRemove={removeInfoItem} />
        </PaperSection>


        <SaveButton />

      </form>
    </Box>
  )
}