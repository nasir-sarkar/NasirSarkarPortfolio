import React from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { NavLink } from 'react-router-dom'


import DashboardIcon      from '@mui/icons-material/Dashboard'
import HomeIcon           from '@mui/icons-material/Home'
import PersonIcon         from '@mui/icons-material/Person'
import CodeIcon           from '@mui/icons-material/Code'
import BuildIcon          from '@mui/icons-material/Build'
import WorkIcon           from '@mui/icons-material/Work'
import SchoolIcon         from '@mui/icons-material/School'
import ContactMailIcon    from '@mui/icons-material/ContactMail'
import InfoIcon           from '@mui/icons-material/Info'
import VisibilityIcon     from '@mui/icons-material/Visibility'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ShareIcon          from '@mui/icons-material/Share' 


const menuItems = [
  { path: '/admin',            icon: DashboardIcon,           label: 'Dashboard'        },
  { path: '/admin/social',     icon: ShareIcon,               label: 'Social Links'     },
  { path: '/admin/hero',       icon: HomeIcon,                label: 'Hero Section'     },
  { path: '/admin/about',      icon: PersonIcon,              label: 'About Section'    },
  { path: '/admin/skills',     icon: CodeIcon,                label: 'Skills Section'   },
  { path: '/admin/services',   icon: BuildIcon,               label: 'Services Section' },
  { path: '/admin/portfolio',  icon: WorkIcon,                label: 'Portfolio Section'},
  { path: '/admin/education',  icon: SchoolIcon,              label: 'Education Section'},
  { path: '/admin/contact',    icon: ContactMailIcon,         label: 'Contact Section'  },
  { path: '/admin/footer',     icon: InfoIcon,                label: 'Footer Section'   },
  { path: '/admin/admins',     icon: AdminPanelSettingsIcon,  label: 'Admin Users'      },
]



export default function AdminSidebar({ isOpen }) {
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>



      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
          <span style={{ color: '#f9004d' }}>Admin</span> Panel
        </Box>
      </Box>



      {/* Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List sx={{ px: 2, py: 2 }}>
          {menuItems.map((item) => {
            const isDashboard = item.path === '/admin'
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <NavLink
                  to={item.path}
                  end={isDashboard}
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  {({ isActive }) => (
                    <ListItemButton
                      sx={{
                        borderRadius: 2,
                        bgcolor: isActive ? '#f9004d' : 'transparent',
                        '&:hover': {
                          bgcolor: isActive ? '#f9004d' : 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                        <item.icon />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        sx={{ '& .MuiTypography-root': { color: 'white', fontSize: 14 } }}
                      />
                    </ListItemButton>
                  )}
                </NavLink>
              </ListItem>
            )
          })}
        </List>
      </Box>



      {/* Footer */}
      <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <ListItemButton sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ color: 'white' }}>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="View Website" sx={{ color: 'white' }} />
          </ListItemButton>
        </NavLink>
      </Box>
    </Box>
  )



  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        display: { xs: 'none', lg: 'block' },
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: '#111111',
          color: 'white',
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          transform: isOpen ? 'translateX(0)' : 'translateX(-280px)',
          transition: 'transform 0.3s ease',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}