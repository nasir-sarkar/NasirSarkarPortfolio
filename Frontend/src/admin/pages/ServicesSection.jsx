import React, { useEffect, useState } from 'react'
import {
  Box, Typography, TextField, Button,
  IconButton, Grid, Card, CardContent, MenuItem,
} from '@mui/material'
import AddIcon    from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon   from '@mui/icons-material/Edit'
import {
  Code, Server, Monitor, Database, Layers,
  Wifi, Smartphone, Paintbrush, BarChart2, Cloud,
  Globe, Shield, Cpu, GitBranch, Terminal, Laptop,
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'

import SectionHeader      from '../components/SectionHeader'
import AlertMessages      from '../components/AlertMessages'
import PaperSection       from '../components/PaperSection'
import SaveButton         from '../components/SaveButton'
import EditCancelButtons  from '../components/EditCancelButtons'
import { useAdminForm }   from '../hooks/useAdminForm'



// Icon helpers 
const iconMap = {
  Code, Server, Monitor, Database, Layers,
  Wifi, Smartphone, Paintbrush, BarChart2, Cloud,
  Globe, Shield, Cpu, GitBranch, Terminal, Laptop,
}

const iconOptions = [
  { value: 'Code',       label: 'Code'      },
  { value: 'Laptop',     label: 'Laptop'    },
  { value: 'Server',     label: 'Server'    },
  { value: 'Monitor',    label: 'Monitor'   },
  { value: 'Database',   label: 'Database'  },
  { value: 'Layers',     label: 'Layers'    },
  { value: 'Wifi',       label: 'Wifi'      },
  { value: 'Smartphone', label: 'Mobile'    },
  { value: 'Paintbrush', label: 'Design'    },
  { value: 'BarChart2',  label: 'Analytics' },
  { value: 'Cloud',      label: 'Cloud'     },
  { value: 'Globe',      label: 'Globe'     },
  { value: 'Shield',     label: 'Shield'    },
  { value: 'Cpu',        label: 'CPU'       },
  { value: 'GitBranch',  label: 'Git'       },
  { value: 'Terminal',   label: 'Terminal'  },
]

function ServiceIcon({ name, size = 24, color = '#f9004d' }) {
  const IconComponent = iconMap[name] || Code
  return <IconComponent size={size} color={color} />
}

const EMPTY_FORM  = { icon: 'Code', title: '', desc: '' }
const CARD_WIDTH  = 380
const CARD_HEIGHT = 180



// Main component
export default function ServicesSection() {
  const { data, addService, updateServices, deleteService } = useAdmin()

  const [services,     setServices]     = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [formData,     setFormData]     = useState(EMPTY_FORM)

  const { showSuccess, loading, setLoading, flash, clearSuccess } = useAdminForm()

  useEffect(() => {
    if (data?.services?.length) setServices(data.services)
  }, [data?.services])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }



  // ADD SERVICE
  const handleAddService = async () => {
    if (!formData.title.trim() || !formData.desc.trim()) return
    setLoading(true)
    await addService({ ...formData })
    setFormData(EMPTY_FORM)
    setLoading(false)
    flash()
  }

  const editService = (reversedIndex) => {
    const realIndex = services.length - 1 - reversedIndex
    setFormData({ ...services[realIndex] })
    setEditingIndex(reversedIndex)
  }



  // UPDATE SERVICE
  const updateServiceLocal = async () => {
    if (editingIndex === null) return
    const realIndex = services.length - 1 - editingIndex
    const updated = [...services]
    updated[realIndex] = { ...formData }
    setServices(updated)
    setEditingIndex(null)
    setFormData(EMPTY_FORM)
    setLoading(true)
    await updateServices(updated)
    setLoading(false)
    flash()
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setFormData(EMPTY_FORM)
  }

  const handleDeleteService = async (reversedIndex) => {
    const realIndex = services.length - 1 - reversedIndex
    await deleteService(realIndex)
    if (editingIndex === reversedIndex) cancelEdit()
  }

  const displayServices = [...services].reverse()



  return (
    <Box>
      <SectionHeader title="Services Section" subtitle="Manage your services and offerings" />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Services updated successfully!"
        onCloseSuccess={clearSuccess}
      />



      {/* ── Add / Edit form ── */}
      <PaperSection title={editingIndex !== null ? 'Edit Service' : 'Add New Service'}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField select fullWidth label="Icon" name="icon"
              value={formData.icon} onChange={handleInputChange}>
              {iconOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ServiceIcon name={opt.value} size={18} color="#f9004d" />
                    {opt.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Title" name="title"
              value={formData.title} onChange={handleInputChange}
              placeholder="e.g. Web Development" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Description" name="desc"
              value={formData.desc} onChange={handleInputChange}
              placeholder="Short description..." />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          {editingIndex !== null ? (
            <EditCancelButtons
              updateLabel="Update Service"
              onUpdate={updateServiceLocal}
              onCancel={cancelEdit}
            />
          ) : (
            <Button variant="contained" startIcon={<AddIcon />}
              onClick={handleAddService} disabled={loading}
              sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#c2410c' } }}>
              {loading ? 'Adding...' : 'Add Service'}
            </Button>
          )}
        </Box>
      </PaperSection>



      {/* ── Service cards list ── */}
      <PaperSection title={`Current Services (${services.length})`}>
        {services.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No services yet. Add one above.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, '& > *': { width: CARD_WIDTH, flexShrink: 0 } }}>
            {displayServices.map((service, index) => (
              <Card key={index} sx={{
                width: CARD_WIDTH, height: CARD_HEIGHT,
                position: 'relative', display: 'flex', flexDirection: 'column',
                border: editingIndex === index ? '2px solid #f9004d' : '1px solid rgba(0,0,0,0.08)',
                transition: 'border-color 0.2s',
              }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      width: 50, height: 50, borderRadius: 2,
                      bgcolor: 'rgba(249,0,77,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <ServiceIcon name={service.icon} size={24} color="#f9004d" />
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {service.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                  }}>
                    {service.desc}
                  </Typography>
                </CardContent>

                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <IconButton size="small" onClick={() => editService(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteService(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </PaperSection>

    </Box>
  )
}