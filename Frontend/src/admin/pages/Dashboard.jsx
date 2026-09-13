import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import DashboardIcon      from '@mui/icons-material/Dashboard'
import PersonIcon         from '@mui/icons-material/Person'
import CodeIcon           from '@mui/icons-material/Code'
import BuildIcon          from '@mui/icons-material/Build'
import WorkIcon           from '@mui/icons-material/Work'
import ContactMailIcon    from '@mui/icons-material/ContactMail'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { useAdmin } from '../context/AdminContext'


const ACCENT    = '#f9004d'
const ACCENT15  = 'rgba(249,0,77,0.12)'
const ACCENT08  = 'rgba(249,0,77,0.06)'

export default function Dashboard() {
  const { data } = useAdmin()


  const stats = [
    { label: 'Hero Section',  status: 'Active', icon: DashboardIcon,  color: '#6366f1', bgColor: '#eef2ff', borderColor: '#c7d2fe' },
    { label: 'About Section', status: 'Active', icon: PersonIcon,     color: '#10b981', bgColor: '#ecfdf5', borderColor: '#a7f3d0' },
    { label: 'Skills',        count: data.skills?.length        ?? 0, icon: CodeIcon,        color: '#8b5cf6', bgColor: '#f5f3ff', borderColor: '#ddd6fe' },
    { label: 'Services',      count: data.services?.length      ?? 0, icon: BuildIcon,       color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fde68a' },
    { label: 'Contact Info',  count: data.contact?.contactInfo?.length ?? 0, icon: ContactMailIcon, color: ACCENT, bgColor: '#fff1f5', borderColor: '#fbcfe8' },
    { label: 'Social Links',  count: data.contact?.socialLinks?.length ?? 0, icon: WorkIcon,  color: '#0ea5e9', bgColor: '#f0f9ff', borderColor: '#bae6fd' },
  ]



  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 3, md: 5 }, background: '#f8fafc' }}>

      {/* ── Header ── */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Dashboard
        </Typography>
        <Typography sx={{ color: '#475569', mt: 0.75, fontSize: 14, fontWeight: 500 }}>
          Manage your portfolio content in one place
        </Typography>
        <Box sx={{ mt: 2.5, height: '3px', width: 60, borderRadius: '2px', background: ACCENT }} />
      </Box>



      {/* ── Stat Cards ── */}
      <Grid container spacing={3}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              sx={{
                height: 200,
                borderRadius: '24px',
                background: '#ffffff',
                border: `2px solid ${stat.borderColor}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'default',
                transition: 'all 0.25s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: stat.color,
                  boxShadow: `0 20px 40px -12px ${stat.color}40`,
                },
              }}
            >
              <CardContent sx={{ p: '24px !important' }}>

                {/* Icon square */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '16px',
                    background: stat.bgColor,
                    border: `2px solid ${stat.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: stat.color,
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <stat.icon sx={{ color: stat.color, fontSize: 28 }} />
                </Box>

                {/* Value / Badge */}
                {stat.count !== undefined ? (
                  <Typography sx={{ fontSize: 42, fontWeight: 800, color: '#0f172a', lineHeight: 1, mb: 1 }}>
                    {stat.count}
                  </Typography>
                ) : (
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      mb: 1,
                      height: 26,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      background: stat.bgColor,
                      color: stat.color,
                      border: `1.5px solid ${stat.borderColor}`,
                      borderRadius: '8px',
                    }}
                  />
                )}

                {/* Label */}
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', letterSpacing: '0.07em', textTransform: 'uppercase', mt: 1 }}>
                  {stat.label}
                </Typography>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>



      {/* ── Tip Card ── */}
      <Box
        sx={{
          mt: 4,
          p: '24px 28px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #fef2f5 100%)',
          border: `2px solid ${ACCENT}25`,
          boxShadow: `0 8px 28px ${ACCENT}12`,
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: ACCENT08,
            border: `2px solid ${ACCENT15}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <TipsAndUpdatesIcon sx={{ color: ACCENT, fontSize: 24 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: 16, mb: 0.5 }}>
            Keep your portfolio updated regularly
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>
            Changes are reflected instantly on your live website
          </Typography>
        </Box>
      </Box>

    </Box>
  )
}