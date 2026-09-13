import React, { useState } from 'react'
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  Button,
  alpha,
} from '@mui/material'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar'
import LogoutIcon from '@mui/icons-material/Logout'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { useAdmin } from './context/AdminContext'

const theme = createTheme({
  palette: {
    primary: { main: '#f9004d' },
    secondary: { main: '#111111' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  shape: { borderRadius: 12 },
})

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout } = useAdmin()
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ display: 'flex', minHeight: '100vh' }}>



        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} />



        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            ml: { xs: 0, lg: sidebarOpen ? '280px' : 0 },
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            width: { xs: '100%', lg: `calc(100% - ${sidebarOpen ? '280px' : '0px'})` },
            background: '#f5f5f5',
          }}
        >


          {/* GLOSSY DARK TOPBAR */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1100,
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',



              // Deep dark glossy background
              background: 'linear-gradient(135deg, #0a0a0a 0%, #0a0a0a 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',



              // Glossy border and shadow
              borderBottom: '1px solid rgba(249,0,77,0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',

              overflow: 'hidden',



              // Reddish radial glow
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-20%',
                width: '140%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(249,0,77,0.15), transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(40px)',
              },



              // Subtle top light reflection
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                pointerEvents: 'none',
              },
            }}
          >



            {/* Sidebar Toggle - Glossy Dark Style */}
            <IconButton
              onClick={toggleSidebar}
              sx={{
                width: 44,
                height: 46,
                borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.03)',
                color: '#fff',
                transition: 'all 0.25s ease',
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                border: '1px solid rgba(249,0,77,0.2)',
                backdropFilter: 'blur(4px)',

                '&:hover': {
                  bgcolor: alpha('#f9004d', 0.12),
                  color: '#f9004d',
                  borderColor: alpha('#f9004d', 0.5),
                  transform: sidebarOpen
                    ? 'rotate(0deg) scale(1.08)'
                    : 'rotate(180deg) scale(1.08)',
                  boxShadow: '0 0 12px rgba(249,0,77,0.3)',
                },
              }}
            >
              <ViewSidebarIcon sx={{ fontSize: 22 }} />
            </IconButton>



            {/* Glossy Logout Button */}
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              variant="outlined"
              sx={{
                borderColor: 'rgba(249,0,77,0.35)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: '12px',
                px: 2.5,
                py: 1,
                textTransform: 'none',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(4px)',
                background: 'rgba(0,0,0,0.2)',

                '&:hover': {
                  bgcolor: '#f9004d',
                  borderColor: '#f9004d',
                  color: '#fff',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(249,0,77,0.3)',
                },
              }}
            >
              Logout
            </Button>

          </Box>



          {/* Page Content - Light Background for your sections */}
          <Box sx={{ p: 3 }}>
            <Outlet />
          </Box>

        </Box>
      </Box>
    </ThemeProvider>
  )
}