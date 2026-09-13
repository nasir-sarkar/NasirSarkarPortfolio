import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../../api/axios'

const AdminContext = createContext()

const HOME_API     = "/home"
const ABOUT_API    = "/about"
const SERVICES_API = "/services"
const SKILLS_API   = "/skills"
const CONTACT_API  = "/contact"
const FOOTER_API   = "/footer"
const ADMIN_API    = "/admin"

export function AdminProvider({ children }) {

  const [data, setData] = useState({
    hero:       null,
    about:      null,
    services:   [],
    skills:     [],
    skillTitle: '',
    contact: {
      contactInfo: [],
      socialLinks: []
    },
    footer: {
      footerContactInfo: [],
      footerInfoLinks:   [],
      footerQuickLinks:  []
    }
  })

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuth') === 'true'
  )

  
  
  // FETCH HOME
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await api.get(`${HOME_API}/getHome`)
        if (res.data) {
          setData(prev => ({
            ...prev,
            hero: {
              name:    res.data.name    || "",
              role:    res.data.role    || "",
              tagline: res.data.tagline || "",
              stats: [
                { label: res.data.label1 || "", target: res.data.target_number1 || 0 },
                { label: res.data.label2 || "", target: res.data.target_number2 || 0 },
                { label: res.data.label3 || "", target: res.data.target_number3 || 0 }
              ]
            }
          }))
        }
      } catch (err) {
        console.log("Home fetch error:", err.message)
      }
    }
    fetchHome()
  }, [])

  
  
  // FETCH ABOUT
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get(`${ABOUT_API}/getAbout`)
        if (res.data) {
          setData(prev => ({ ...prev, about: res.data }))
        }
      } catch (err) {
        console.log("About fetch error:", err.message)
      }
    }
    fetchAbout()
  }, [])

  
  
  // FETCH SERVICES
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`${SERVICES_API}/getServices`)
        if (res.data) {
          setData(prev => ({
            ...prev,
            services: res.data.services || []
          }))
        }
      } catch (err) {
        console.log("Services fetch error:", err.message)
      }
    }
    fetchServices()
  }, [])

  

  // FETCH SKILLS
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get(`${SKILLS_API}/getSkills`)
        if (res.data) {
          setData(prev => ({
            ...prev,
            skills:     res.data.skills || [],
            skillTitle: res.data.title  || ''
          }))
        }
      } catch (err) {
        console.log("Skills fetch error:", err.message)
      }
    }
    fetchSkills()
  }, [])

 
  
  // FETCH CONTACT
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get(`${CONTACT_API}/getContact`)
        if (res.data) {
          setData(prev => ({
            ...prev,
            contact: {
              contactInfo: res.data.contactInfo || [],
              socialLinks: res.data.socialLinks || []
            }
          }))
        }
      } catch (err) {
        console.log("Contact fetch error:", err.message)
      }
    }
    fetchContact()
  }, [])

 
  
  // FETCH FOOTER
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await api.get(`${FOOTER_API}/getFooter`)
        if (res.data) {
          setData(prev => ({
            ...prev,
            footer: {
              footerContactInfo: res.data.footerContactInfo || [],
              footerInfoLinks:   res.data.footerInfoLinks   || [],
              footerQuickLinks:  res.data.footerQuickLinks  || []
            }
          }))
        }
      } catch (err) {
        console.log("Footer fetch error:", err.message)
      }
    }
    fetchFooter()
  }, [])

  
  
  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post(`${ADMIN_API}/login`, { email, password })
      if (res.data?.success) {
        localStorage.setItem('isAuth', 'true')
        setIsAuthenticated(true)
        return { success: true }
      }
      return { success: false, message: res.data?.message || "Invalid credentials" }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials"
      return { success: false, message }
    }
  }

 
  
  // LOGOUT
  const logout = () => {
    localStorage.removeItem('isAuth')
    setIsAuthenticated(false)
  }

  
  
  // UPDATE HERO
  const updateHero = async (heroData) => {
    try {
      const payload = {
        name:           heroData.name,
        role:           heroData.role,
        tagline:        heroData.tagline,
        label1:         heroData.stats?.[0]?.label   || "",
        target_number1: parseFloat(heroData.stats?.[0]?.target) || 0,
        label2:         heroData.stats?.[1]?.label   || "",
        target_number2: parseFloat(heroData.stats?.[1]?.target) || 0,
        label3:         heroData.stats?.[2]?.label   || "",
        target_number3: parseFloat(heroData.stats?.[2]?.target) || 0
      }
      setData(prev => ({ ...prev, hero: heroData }))
      await api.put(`${HOME_API}/updateHome`, payload)
    } catch (err) {
      console.log("Hero update error:", err.message)
    }
  }

  
  
  // UPDATE ABOUT
  const updateAbout = async (aboutData) => {
    try {
      setData(prev => ({ ...prev, about: aboutData }))
      await api.put(`${ABOUT_API}/updateAbout`, aboutData)
    } catch (err) {
      console.log("About update error:", err.message)
    }
  }

  
  
  // ADD SINGLE SERVICE
  const addService = async (newService) => {
    try {
      const res = await api.post(`${SERVICES_API}/addService`, newService)
      if (res.data?.services) {
        setData(prev => ({ ...prev, services: res.data.services }))
      }
    } catch (err) {
      console.log("Add service error:", err.message)
    }
  }

  

  // UPDATE ALL SERVICES
  const updateServices = async (services) => {
    try {
      setData(prev => ({ ...prev, services }))
      await api.put(`${SERVICES_API}/updateServices`, { services })
    } catch (err) {
      console.log("Services update error:", err.message)
    }
  }

  
  
  // DELETE SINGLE SERVICE
  const deleteService = async (index) => {
    try {
      const res = await api.delete(`${SERVICES_API}/deleteService/${index}`)
      if (res.data?.services) {
        setData(prev => ({ ...prev, services: res.data.services }))
      }
    } catch (err) {
      console.log("Delete service error:", err.message)
    }
  }

 
  
  // UPDATE SKILLS
  const updateSkills = async (payload) => {
    try {
      setData(prev => ({
        ...prev,
        skills:     payload.skills || [],
        skillTitle: payload.title  || ''
      }))
      await api.put(`${SKILLS_API}/updateSkills`, payload)
    } catch (err) {
      console.log("Skills update error:", err.message)
    }
  }


  
// UPDATE CONTACT
const updateContact = async (payload) => {
  try {
    const res = await api.put(`${CONTACT_API}/updateContact`, payload)
    setData(prev => ({
      ...prev,
      contact: {
        contactInfo: res.data.contactInfo || [],
        socialLinks: res.data.socialLinks || []
      }
    }))
    return { success: true }
  } catch (err) {
    console.error("Contact update error:", err)
    return { success: false, message: err.message }
  }
}

 

  // UPDATE FOOTER
  const updateFooter = async (payload) => {
    try {
      setData(prev => ({
        ...prev,
        footer: {
          footerContactInfo: payload.footerContactInfo || [],
          footerInfoLinks:   payload.footerInfoLinks   || [],
          footerQuickLinks:  payload.footerQuickLinks  || []
        }
      }))
      await api.put(`${FOOTER_API}/updateFooter`, payload)
    } catch (err) {
      console.log("Footer update error:", err.message)
    }
  }

  return (
    <AdminContext.Provider value={{
      data,
      updateHero,
      updateAbout,
      addService,
      updateServices,
      deleteService,
      updateSkills,
      updateContact,
      updateFooter,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)