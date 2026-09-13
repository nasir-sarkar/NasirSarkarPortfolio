import React, { useState, useEffect } from 'react'
import { Box, Paper, TextField, IconButton, Grid, Switch, FormControlLabel } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAdmin } from '../context/AdminContext'

import SectionHeader    from '../components/SectionHeader'
import AlertMessages    from '../components/AlertMessages'
import PaperSection     from '../components/PaperSection'
import SaveButton       from '../components/SaveButton'
import { useAdminForm } from '../hooks/useAdminForm'



// Generic list manager used for all three footer lists
function FooterList({ items, onChange, onRemove, fields }) {
  return (
    <>
      {items.map((item, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {fields.map(({ key, label, xs, md, type }) => (
              <Grid item xs={xs} md={md} key={key}>
                {type === 'switch' ? (
                  <FormControlLabel
                    label={label}
                    control={
                      <Switch
                        checked={!!item[key]}
                        onChange={(e) => onChange(index, key, e.target.checked)}
                      />
                    }
                  />
                ) : (
                  <TextField fullWidth label={label} value={item[key] || ''}
                    onChange={(e) => onChange(index, key, e.target.value)} />
                )}
              </Grid>
            ))}
            <Grid item xs={12} md={1}>
              <IconButton color="error" onClick={() => onRemove(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </>
  )
}



// Field configs for each list
const CONTACT_FIELDS = [
  { key: 'label', label: 'Label',          xs: 12, md: 3 },
  { key: 'val',   label: 'Value',          xs: 12, md: 5 },
  { key: 'href',  label: 'Link (optional)',xs: 12, md: 3 },
]

const LINK_FIELDS = [
  { key: 'label',    label: 'Label',    xs: 12, md: 4 },
  { key: 'href',     label: 'Link',     xs: 12, md: 5 },
  { key: 'external', label: 'External', xs: 12, md: 2, type: 'switch' },
]



// Main component
export default function FooterSection() {
  const { data, updateFooter } = useAdmin()

  const [footerContactInfo, setFooterContactInfo] = useState([])
  const [footerInfoLinks,   setFooterInfoLinks]   = useState([])
  const [footerQuickLinks,  setFooterQuickLinks]  = useState([])

  const { showSuccess, flash, clearSuccess } = useAdminForm()

  useEffect(() => {
    if (data.footer) {
      setFooterContactInfo(data.footer.footerContactInfo || [])
      setFooterInfoLinks(data.footer.footerInfoLinks     || [])
      setFooterQuickLinks(data.footer.footerQuickLinks   || [])
    }
  }, [data.footer])



  // Generic field change handler
  const makeChange = (setter) => (index, field, value) => {
    setter(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }



  // Generic remove handler
  const makeRemove = (setter) => (index) =>
    setter(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = (e) => {
    e.preventDefault()
    updateFooter({ footerContactInfo, footerInfoLinks, footerQuickLinks })
    flash()
  }


  
  return (
    <Box>
      <SectionHeader title="Footer Section" subtitle="Manage your footer content" />

      <AlertMessages
        showSuccess={showSuccess}
        successMsg="Footer section updated successfully!"
        onCloseSuccess={clearSuccess}
      />

      <form onSubmit={handleSubmit}>



        <PaperSection
          title="Contact Information"
          addLabel="Add Contact Info"
          onAdd={() => setFooterContactInfo(prev => [...prev, { label: 'New Field', val: '', href: null }])}
        >
          <FooterList
            items={footerContactInfo}
            fields={CONTACT_FIELDS}
            onChange={makeChange(setFooterContactInfo)}
            onRemove={makeRemove(setFooterContactInfo)}
          />
        </PaperSection>



        <PaperSection
          title="Information Links"
          addLabel="Add Link"
          onAdd={() => setFooterInfoLinks(prev => [...prev, { label: 'New Link', href: '#', external: false }])}
        >
          <FooterList
            items={footerInfoLinks}
            fields={LINK_FIELDS}
            onChange={makeChange(setFooterInfoLinks)}
            onRemove={makeRemove(setFooterInfoLinks)}
          />
        </PaperSection>



        <PaperSection
          title="Quick Links"
          addLabel="Add Link"
          onAdd={() => setFooterQuickLinks(prev => [...prev, { label: 'New Link', href: '#', external: false }])}
        >
          <FooterList
            items={footerQuickLinks}
            fields={LINK_FIELDS}
            onChange={makeChange(setFooterQuickLinks)}
            onRemove={makeRemove(setFooterQuickLinks)}
          />
        </PaperSection>

        <SaveButton />

      </form>
    </Box>
  )
}
