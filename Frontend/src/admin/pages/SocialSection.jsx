import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Grid,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import api from '../../api/axios'

export default function SocialSection() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)



  // Icon options for dropdown
  const iconOptions = [
    { value: 'fab fa-facebook-f', label: 'Facebook' },
    { value: 'fab fa-twitter', label: 'Twitter' },
    { value: 'fab fa-instagram', label: 'Instagram' },
    { value: 'fab fa-linkedin-in', label: 'LinkedIn' },
    { value: 'fab fa-github', label: 'GitHub' },
    { value: 'fab fa-youtube', label: 'YouTube' },
    { value: 'fab fa-tiktok', label: 'TikTok' },
    { value: 'fab fa-pinterest', label: 'Pinterest' },
    { value: 'fab fa-snapchat', label: 'Snapchat' },
    { value: 'fab fa-whatsapp', label: 'WhatsApp' },
    { value: 'fab fa-telegram', label: 'Telegram' },
    { value: 'fab fa-discord', label: 'Discord' },
    { value: 'fab fa-reddit-alien', label: 'Reddit' },
    { value: 'fab fa-tumblr', label: 'Tumblr' },
    { value: 'fab fa-flickr', label: 'Flickr' },
    { value: 'fab fa-behance', label: 'Behance' },
    { value: 'fab fa-dribbble', label: 'Dribbble' },
    { value: 'fab fa-medium-m', label: 'Medium' },
    { value: 'fab fa-dev', label: 'Dev.to' },
    { value: 'fab fa-stack-overflow', label: 'Stack Overflow' },
    { value: 'fab fa-codepen', label: 'CodePen' },
    { value: 'fab fa-jsfiddle', label: 'JSFiddle' },
    { value: 'fab fa-slack', label: 'Slack' },
    { value: 'fab fa-skype', label: 'Skype' },
    { value: 'fas fa-envelope', label: 'Email' },
    { value: 'fas fa-envelope-open', label: 'Email (Open)' },
    { value: 'fas fa-paper-plane', label: 'Email (Paper Plane)' },
  ]


  

  //   FETCH DATA
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await api.get("/social-links")
      setLinks(res.data || [])
    } catch (err) {
      console.log("Fetch error:", err)
    }
  }



  //   HANDLE CHANGE
  const handleChange = (index, field, value) => {
    const updated = [...links]
    updated[index][field] = value
    setLinks(updated)
  }



  //   ADD NEW LINK
  const addLink = () => {
    setLinks([
      ...links,
      { label: 'New Social Link', href: '', icon: 'fab fa-facebook-f', order: links.length + 1 }
    ])
  }

  

  //   DELETE LINK
  const deleteLink = (index) => {
    const updated = links.filter((_, i) => i !== index)
    setLinks(updated)
  }

 

  //   SAVE DATA
  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post("/social-links", { links })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.log(err)
      alert("Save failed ❌")
    }
    setLoading(false)
  }



  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
        Social Links Section
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
        Manage your social media links
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowSuccess(false)}>
          Social links updated successfully!
        </Alert>
      )}

      <form onSubmit={handleSave}>



        {/* SOCIAL LINKS             */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Social Links
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addLink}
              sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#c2410c' } }}
            >
              Add Social Link
            </Button>
          </Box>

          {links.length === 0 ? (
            <Typography sx={{ color: '#6b7280', textAlign: 'center', py: 4 }}>
              No social links added yet. Click "Add Social Link" to get started.
            </Typography>
          ) : (
            links.map((link, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Label"
                      placeholder="e.g., GitHub, Twitter, LinkedIn"
                      value={link.label || ''}
                      onChange={(e) => handleChange(index, 'label', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="URL"
                      placeholder="https://..."
                      value={link.href || ''}
                      onChange={(e) => handleChange(index, 'href', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Icon Class</InputLabel>
                      <Select
                        value={link.icon || ''}
                        label="Icon Class"
                        onChange={(e) => handleChange(index, 'icon', e.target.value)}
                      >
                        {iconOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <i className={option.value} style={{ marginRight: '10px' }}></i>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <IconButton color="error" onClick={() => deleteLink(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))
          )}
        </Paper>



        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: '#f9004d',
            '&:hover': { bgcolor: '#c41020' },
            px: 4,
            py: 1.5,
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>

      </form>
    </Box>
  )
}