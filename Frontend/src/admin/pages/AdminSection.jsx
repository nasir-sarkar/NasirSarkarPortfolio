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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Chip,
} from '@mui/material'
import AddIcon    from '@mui/icons-material/Add'
import EditIcon   from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon   from '@mui/icons-material/Save'
import CloseIcon  from '@mui/icons-material/Close'
import api        from '../../api/axios'

const emptyForm = { name: '', email: '', password: '' }

export default function AdminSection() {

  const [users,       setUsers]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [alert,       setAlert]       = useState({ show: false, type: 'success', msg: '' })



  // Dialog state
  const [dialogOpen,  setDialogOpen]  = useState(false)
  const [dialogMode,  setDialogMode]  = useState('add')   
  const [editId,      setEditId]      = useState(null)
  const [form,        setForm]        = useState(emptyForm)
  const [formError,   setFormError]   = useState('')



  // Delete confirm dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' })

  
  
  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/users')
      setUsers(res.data || [])
    } catch (err) {
      showAlert('error', 'Failed to fetch admin users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  

  // SHOW ALERT
  const showAlert = (type, msg) => {
    setAlert({ show: true, type, msg })
    setTimeout(() => setAlert({ show: false, type: 'success', msg: '' }), 3000)
  }


  
  // OPEN ADD DIALOG
  const openAddDialog = () => {
    setForm(emptyForm)
    setFormError('')
    setDialogMode('add')
    setEditId(null)
    setDialogOpen(true)
  }



  // OPEN EDIT DIALOG
  const openEditDialog = (user) => {
    setForm({ name: user.name, email: user.email, password: '' })
    setFormError('')
    setDialogMode('edit')
    setEditId(user._id)
    setDialogOpen(true)
  }

  

  // HANDLE FORM CHANGE
  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  
  
  // VALIDATE
  const validate = () => {
    if (!form.name.trim())  return 'Name is required'
    if (!form.email.trim()) return 'Email is required'
    if (dialogMode === 'add' && !form.password.trim()) return 'Password is required'
    return ''
  }

  
  
  // SUBMIT (ADD or UPDATE)
  const handleSubmit = async () => {
    const err = validate()
    if (err) { setFormError(err); return }

    try {
      if (dialogMode === 'add') {
        await api.post('/admin/users', form)
        showAlert('success', 'Admin user added successfully!')
      } else {
        const payload = { name: form.name, email: form.email }
        if (form.password.trim()) payload.password = form.password
        await api.put(`/admin/users/${editId}`, payload)
        showAlert('success', 'Admin user updated successfully!')
      }
      setDialogOpen(false)
      fetchUsers()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong')
    }
  }

  

  // DELETE
  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${deleteDialog.id}`)
      showAlert('success', 'Admin user deleted successfully!')
      setDeleteDialog({ open: false, id: null, name: '' })
      fetchUsers()
    } catch (err) {
      showAlert('error', 'Failed to delete user')
      setDeleteDialog({ open: false, id: null, name: '' })
    }
  }

  
  
  // RENDER
  return (
    <Box>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Admin Users
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Manage admin accounts — add, edit or remove users
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          sx={{
            bgcolor: '#ff7a00',
            '&:hover': { bgcolor: '#c2410c' },
          }}
        >
          Add User
        </Button>
      </Box>



      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.msg}
        </Alert>
      )}



      {/* Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>

        {/* Table Header */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Admin Users
          </Typography>
          <Chip
            label={`${users.length} user${users.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ bgcolor: '#fff0f3', color: '#f9004d', fontWeight: 600, border: '1px solid #ffd6e0' }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: 13 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: 13 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: 13 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: 13 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: 13 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>


            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    No admin users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      '&:hover': { bgcolor: '#fafafa' },
                      '&:last-child td': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ color: '#9ca3af', fontSize: 13 }}>
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: '#f9004d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 14,
                            flexShrink: 0,
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ color: '#6b7280', fontSize: 14 }}>
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontFamily: 'monospace',
                          color: '#9ca3af',
                          bgcolor: '#f3f4f6',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block',
                        }}
                      >
                        {user._id}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => openEditDialog(user)}
                          size="small"
                          sx={{
                            mr: 1,
                            color: '#6b7280',
                            '&:hover': { color: '#f9004d', bgcolor: '#fff0f3' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => setDeleteDialog({ open: true, id: user._id, name: user.name })}
                          size="small"
                          sx={{
                            color: '#6b7280',
                            '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


      
      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          pb: 1,
          borderBottom: '1px solid #f0f0f0',
          px: 3,
          pt: 2.5
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {dialogMode === 'add' ? 'Add New Admin User' : 'Edit Admin User'}
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small" sx={{ color: '#6b7280' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, px: 3 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              variant="outlined"
            />

            <TextField
              fullWidth
              placeholder="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              variant="outlined"
            />

            <TextField
              fullWidth
              placeholder={dialogMode === 'edit' ? 'New Password (leave blank to keep current)' : 'Password'}
              name="password"
              type="password"
              value={form.password}
              onChange={handleFormChange}
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid #f0f0f0' }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ 
              color: '#6b7280', 
              mr: 1,
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            sx={{
              bgcolor: '#f9004d',
              '&:hover': { bgcolor: '#c41020' },
            }}
          >
            {dialogMode === 'add' ? 'Add User' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      
      
      {/* DELETE CONFIRM DIALOG */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          borderBottom: '1px solid #f0f0f0',
          px: 3,
          pt: 2.5,
          pb: 2
        }}>
          Delete Admin User
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 3 }}>
          <Typography sx={{ color: '#6b7280' }}>
            Are you sure you want to delete <strong style={{ color: '#111' }}>{deleteDialog.name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid #f0f0f0' }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null, name: '' })}
            sx={{ 
              color: '#6b7280',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#b91c1c' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}