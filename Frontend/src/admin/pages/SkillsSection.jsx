import React, { useEffect, useState } from 'react'
import { Box, Paper, TextField, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAdmin } from '../context/AdminContext'

import SectionHeader    from '../components/SectionHeader'
import AlertMessages    from '../components/AlertMessages'
import PaperSection     from '../components/PaperSection'
import AddButton        from '../components/AddButton'
import SaveButton       from '../components/SaveButton'
import { useAdminForm } from '../hooks/useAdminForm'


export default function SkillsSection() {
  const { data, updateSkills } = useAdmin()

  const [skillsData, setSkillsData] = useState({ title: '', row1: [], row2: [] })
  const { showSuccess, flash, clearSuccess } = useAdminForm()

  useEffect(() => {
    if (!data?.skills) return
    setSkillsData({
      title: data.skillTitle || '',
      row1: data.skills.filter(s => s.row === 1).map(s => s.name),
      row2: data.skills.filter(s => s.row === 2).map(s => s.name),
    })
  }, [data?.skills, data?.skillTitle])

  const handleTitleChange = (e) =>
    setSkillsData(prev => ({ ...prev, title: e.target.value }))

  const handleRowChange = (row, index, value) => {
    const updated = [...skillsData[row]]
    updated[index] = value
    setSkillsData(prev => ({ ...prev, [row]: updated }))
  }

  const addSkill    = (row) =>
    setSkillsData(prev => ({ ...prev, [row]: [...prev[row], 'New Skill'] }))

  const removeSkill = (row, index) =>
    setSkillsData(prev => ({ ...prev, [row]: prev[row].filter((_, i) => i !== index) }))

  const handleSubmit = (e) => {
    e.preventDefault()
    updateSkills({
      title: skillsData.title,
      skills: [
        ...skillsData.row1.map(name => ({ name, row: 1 })),
        ...skillsData.row2.map(name => ({ name, row: 2 })),
      ],
    })
    flash()
  }



  // Reusable skill chip row
  const SkillRow = ({ rowKey, label }) => (
    <Box sx={{ mb: rowKey === 'row1' ? 4 : 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{label}</Box>
        <AddButton label="Add Skill" onClick={() => addSkill(rowKey)} />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {skillsData[rowKey].map((skill, index) => (
          <Paper key={index} variant="outlined"
            sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f9f9f9' }}>
            <TextField size="small" value={skill} sx={{ width: 150 }}
              onChange={(e) => handleRowChange(rowKey, index, e.target.value)} />
            <IconButton size="small" color="error" onClick={() => removeSkill(rowKey, index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Box>
    </Box>
  )


  
  return (
    <Box>
      <SectionHeader title="Skills Section" subtitle="Manage your skills and technologies" />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Skills section updated successfully!"
        onCloseSuccess={clearSuccess}
      />

      <form onSubmit={handleSubmit}>
        <PaperSection>
          <TextField fullWidth label="Section Title" value={skillsData.title}
            onChange={handleTitleChange} sx={{ mb: 4 }} />

          <SkillRow rowKey="row1" label="Row 1 (Left to Right)" />
          <SkillRow rowKey="row2" label="Row 2 (Right to Left - Reverse Marquee)" />
        </PaperSection>

        <SaveButton />
      </form>
    </Box>
  )
}
