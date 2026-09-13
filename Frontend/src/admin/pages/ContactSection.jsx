import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, TextField, Button, IconButton,
  Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from '@mui/material'
import AddIcon         from '@mui/icons-material/Add'
import DeleteIcon      from '@mui/icons-material/Delete'
import EditIcon        from '@mui/icons-material/Edit'
import VisibilityIcon  from '@mui/icons-material/Visibility'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { useAdmin } from '../context/AdminContext'

import SectionHeader     from '../components/SectionHeader'
import AlertMessages     from '../components/AlertMessages'
import PaperSection      from '../components/PaperSection'
import EditCancelButtons from '../components/EditCancelButtons'
import { useAdminForm }  from '../hooks/useAdminForm'



// ── Icon options
const contactIconOptions = [
  { value: 'fas fa-phone-alt',      label: 'Phone'    },
  { value: 'fas fa-envelope',       label: 'Email'    },
  { value: 'fas fa-map-marker-alt', label: 'Location' },
  { value: 'fab fa-github',         label: 'GitHub'   },
  { value: 'fab fa-linkedin-in',    label: 'LinkedIn' },
  { value: 'fab fa-twitter',        label: 'Twitter'  },
  { value: 'fab fa-facebook-f',     label: 'Facebook' },
]

const socialIconOptions = [
  { value: 'fab fa-github',      label: 'GitHub'    },
  { value: 'fab fa-linkedin-in', label: 'LinkedIn'  },
  { value: 'fab fa-twitter',     label: 'Twitter'   },
  { value: 'fab fa-facebook-f',  label: 'Facebook'  },
  { value: 'fab fa-instagram',   label: 'Instagram' },
  { value: 'fab fa-youtube',     label: 'YouTube'   },
  { value: 'fas fa-envelope',    label: 'Email'     },
]



// ── Reusable inline add/edit form 
function InlineForm({ title, fields, formData, onChange, isEditing, onAdd, onUpdate, onCancel, addLabel }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>{title}</Typography>
      <Grid container spacing={2}>
        {fields.map(({ name, label, xs, md, select, options }) => (
          <Grid item xs={xs} md={md} key={name}>
            {select ? (
              <TextField select fullWidth label={label} name={name}
                value={formData[name]} onChange={onChange} SelectProps={{ native: true }}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </TextField>
            ) : (
              <TextField fullWidth label={label} name={name}
                value={formData[name]} onChange={onChange} />
            )}
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2 }}>
        {isEditing ? (
          <EditCancelButtons updateLabel={`Update ${addLabel}`} onUpdate={onUpdate} onCancel={onCancel} />
        ) : (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}
            sx={{ bgcolor: '#ff7a00', '&:hover': { bgcolor: '#c2410c' } }}>
            {addLabel}
          </Button>
        )}
      </Box>
    </Paper>
  )
}



// ── Reusable icon card
function IconCard({ icon, label, detail, onEdit, onDelete }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            bgcolor: 'rgba(232,25,44,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className={icon} style={{ color: '#f9004d', fontSize: 20 }} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>{label}</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#333', wordBreak: 'break-all', mb: 1 }}>{detail}</Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={onEdit}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={onDelete}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}



// ── Main component 
export default function ContactSection() {
  const { data, updateContact } = useAdmin()


  const [contactInfo,  setContactInfo]  = useState([])
  const [socialLinks,  setSocialLinks]  = useState([])
  const [messages,     setMessages]     = useState([])


  const [editingContactIndex, setEditingContactIndex] = useState(null)
  const [editingSocialIndex,  setEditingSocialIndex]  = useState(null)


  const [contactForm, setContactForm] = useState({ icon: 'fas fa-phone-alt', label: '', val: '', href: '' })
  const [socialForm,  setSocialForm]  = useState({ icon: 'fab fa-github', label: '', href: '' })


  // Message dialog
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [selectedMessage,   setSelectedMessage]   = useState(null)

  const { showSuccess, showError, flash, flashError, clearSuccess, clearError, setLoading, loading } = useAdminForm()



  // ── Sync from context 
  useEffect(() => {
    if (data.contact) {
      setContactInfo(data.contact.contactInfo || [])
      setSocialLinks(data.contact.socialLinks  || [])
    }
  }, [data.contact])



  // ── Fetch messages
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/messages/getMessages`)
      .then(r => r.json())
      .then(setMessages)
      .catch(err => console.error('Failed to fetch messages:', err))
  }, [])



  // Contact info handlers
  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }



  // ADD CONTACT INFO 
  const addContactInfo = async () => {
    if (!contactForm.label || !contactForm.val) return
    const updated = [...contactInfo, { ...contactForm }]
    setContactInfo(updated)
    setContactForm({ icon: 'fas fa-phone-alt', label: '', val: '', href: '' })
    // Direct DB update
    setLoading(true)
    await updateContact({ contactInfo: updated, socialLinks })
    setLoading(false)
    flash()
  }


  const editContactInfo = (index) => {
    setContactForm(contactInfo[index])
    setEditingContactIndex(index)
  }



  // UPDATE CONTACT INFO 
  const updateContactInfo = async () => {
    if (!contactForm.label || !contactForm.val) return
    const updated = [...contactInfo]
    updated[editingContactIndex] = { ...contactForm }
    setContactInfo(updated)
    setContactForm({ icon: 'fas fa-phone-alt', label: '', val: '', href: '' })
    setEditingContactIndex(null)
    // Direct DB update
    setLoading(true)
    await updateContact({ contactInfo: updated, socialLinks })
    setLoading(false)
    flash()
  }

  const cancelContactEdit = () => {
    setEditingContactIndex(null)
    setContactForm({ icon: 'fas fa-phone-alt', label: '', val: '', href: '' })
  }



  // DELETE CONTACT INFO 
  const removeContactInfo = async (index) => {
    const updated = contactInfo.filter((_, i) => i !== index)
    setContactInfo(updated)
    // Direct DB update
    setLoading(true)
    await updateContact({ contactInfo: updated, socialLinks })
    setLoading(false)
    flash()
  }



  // Social link handlers
  const handleSocialChange = (e) => {
    const { name, value } = e.target
    setSocialForm(prev => ({ ...prev, [name]: value }))
  }



  // ADD SOCIAL LINK
  const addSocialLink = async () => {
    if (!socialForm.label || !socialForm.href) return
    const updated = [...socialLinks, { ...socialForm }]
    setSocialLinks(updated)
    setSocialForm({ icon: 'fab fa-github', label: '', href: '' })
    // Direct DB update
    setLoading(true)
    await updateContact({ contactInfo, socialLinks: updated })
    setLoading(false)
    flash()
  }

  const editSocialLink = (index) => {
    setSocialForm(socialLinks[index])
    setEditingSocialIndex(index)
  }



  // UPDATE SOCIAL LINK
  const updateSocialLink = async () => {
    if (!socialForm.label || !socialForm.href) return
    const updated = [...socialLinks]
    updated[editingSocialIndex] = { ...socialForm }
    setSocialLinks(updated)
    setSocialForm({ icon: 'fab fa-github', label: '', href: '' })
    setEditingSocialIndex(null)
    // Direct DB update
    setLoading(true)
    await updateContact({ contactInfo, socialLinks: updated })
    setLoading(false)
    flash()
  }

  const cancelSocialEdit = () => {
    setEditingSocialIndex(null)
    setSocialForm({ icon: 'fab fa-github', label: '', href: '' })
  }



  // DELETE SOCIAL LINK 
  const removeSocialLink = async (index) => {
    const updated = socialLinks.filter((_, i) => i !== index)
    setSocialLinks(updated)
    // Direct DB update
    setLoading(true)
    await updateContact({ contactInfo, socialLinks: updated })
    setLoading(false)
    flash()
  }



  // ── Message handlers 
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/deleteMessage/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== id))
        flash()
      }
    } catch (err) { console.error(err) }
  }

  const handleDeleteAllMessages = async () => {
    if (!window.confirm('Delete ALL messages? This cannot be undone.')) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/deleteAllMessages`, { method: 'DELETE' })
      if (res.ok) { setMessages([]); flash() }
    } catch (err) { console.error(err) }
  }



  // ── Field configs for InlineForm
  const contactFields = [
    { name: 'icon',  label: 'Icon',           xs: 12, md: 3, select: true, options: contactIconOptions },
    { name: 'label', label: 'Label',          xs: 12, md: 3 },
    { name: 'val',   label: 'Value',          xs: 12, md: 4 },
    { name: 'href',  label: 'Link (optional)',xs: 12, md: 2 },
  ]

  const socialFields = [
    { name: 'icon',  label: 'Icon',  xs: 12, md: 4, select: true, options: socialIconOptions },
    { name: 'label', label: 'Label', xs: 12, md: 4 },
    { name: 'href',  label: 'URL',   xs: 12, md: 4 },
  ]

  return (
    <Box>
      <SectionHeader title="Contact Section" subtitle="Manage your contact information and social links" />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Changes saved successfully!"
        showError={showError}
        onCloseSuccess={clearSuccess}
        onCloseError={clearError}
      />



      {/* ── Contact Information ── */}
      <PaperSection title={`Contact Information (${contactInfo.length})`}>
        <InlineForm
          title={editingContactIndex !== null ? 'Edit Contact Info' : 'Add New Contact Info'}
          fields={contactFields}
          formData={contactForm}
          onChange={handleContactChange}
          isEditing={editingContactIndex !== null}
          onAdd={addContactInfo}
          onUpdate={updateContactInfo}
          onCancel={cancelContactEdit}
          addLabel="Add Contact Info"
        />
        <Grid container spacing={2}>
          {contactInfo.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <IconCard icon={item.icon} label={item.label} detail={item.val}
                onEdit={() => editContactInfo(index)} onDelete={() => removeContactInfo(index)} />
            </Grid>
          ))}
        </Grid>
        {contactInfo.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No contact information added yet.
          </Typography>
        )}
      </PaperSection>



      {/* ── Social Links ── */}
      <PaperSection title={`Social Media Links (${socialLinks.length})`}>
        <InlineForm
          title={editingSocialIndex !== null ? 'Edit Social Link' : 'Add New Social Link'}
          fields={socialFields}
          formData={socialForm}
          onChange={handleSocialChange}
          isEditing={editingSocialIndex !== null}
          onAdd={addSocialLink}
          onUpdate={updateSocialLink}
          onCancel={cancelSocialEdit}
          addLabel="Add Social Link"
        />
        <Grid container spacing={2}>
          {socialLinks.map((link, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <IconCard icon={link.icon} label={link.label} detail={link.href}
                onEdit={() => editSocialLink(index)} onDelete={() => removeSocialLink(index)} />
            </Grid>
          ))}
        </Grid>
        {socialLinks.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No social links added yet.
          </Typography>
        )}
      </PaperSection>



      {/* ── Inbox ── */}
      <PaperSection
        title={`Inbox (${messages.length})`}
        sx={{ mt: 3 }}
        headerAction={
          messages.length > 0 ? (
            <Button variant="contained" color="error" startIcon={<DeleteSweepIcon />}
              onClick={handleDeleteAllMessages}
              sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}>
              Delete All
            </Button>
          ) : null
        }
      >
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No messages yet.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  {['Name', 'Email', 'Subject', 'Date', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 'bold' }} align={h === 'Actions' ? 'center' : 'left'}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg._id} hover>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell>
                      {msg.subject
                        ? <Chip label={msg.subject} size="small" variant="outlined" />
                        : <Typography variant="body2" color="text.secondary">-</Typography>}
                    </TableCell>
                    <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" sx={{ mr: 1 }}
                        onClick={() => { setSelectedMessage(msg); setShowMessageDialog(true) }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteMessage(msg._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </PaperSection>



      {/* ── Message detail dialog ── */}
      <Dialog open={showMessageDialog} onClose={() => setShowMessageDialog(false)} maxWidth="md" fullWidth>
        {selectedMessage && (
          <>
            <DialogTitle sx={{ bgcolor: '#f9004d', color: 'white' }}>
              Message from {selectedMessage.name}
            </DialogTitle>
            <DialogContent dividers>
              {[
                { label: 'From',    value: `${selectedMessage.name} (${selectedMessage.email})` },
                selectedMessage.phone   && { label: 'Phone',   value: selectedMessage.phone },
                selectedMessage.subject && { label: 'Subject', value: selectedMessage.subject },
              ].filter(Boolean).map(({ label, value }) => (
                <Box key={label} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">{label}:</Typography>
                  <Typography variant="body1">{value}</Typography>
                </Box>
              ))}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Message:</Typography>
                <Paper sx={{ p: 2, bgcolor: '#f9fafb', mt: 1 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </Typography>
                </Paper>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Received:</Typography>
                <Typography variant="body2">{new Date(selectedMessage.createdAt).toLocaleString()}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowMessageDialog(false)}>Close</Button>
              <Button variant="contained" color="error"
                onClick={() => { handleDeleteMessage(selectedMessage._id); setShowMessageDialog(false) }}
                sx={{ bgcolor: '#dc2626' }}>
                Delete Message
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}