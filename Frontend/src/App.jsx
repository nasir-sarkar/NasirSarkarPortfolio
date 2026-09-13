import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import Preloader from './sections/Preloader'
import Sidebar from './sections/Sidebar'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Skills from './sections/Skills'
import Portfolio from './sections/Portfolio'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import BackToTop from './sections/BackToTop'
import ProjectDetail from './sections/Projectdetail' 

import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import HeroSection from './admin/pages/HeroSection'
import AboutSection from './admin/pages/AboutSection'
import SkillsSection from './admin/pages/SkillsSection'
import ServicesSection from './admin/pages/ServicesSection'
import PortfolioSection from './admin/pages/PortfolioSection'
import EducationSection from './admin/pages/EducationSection'
import ContactSection from './admin/pages/ContactSection'
import FooterSection from './admin/pages/FooterSection'

import { AdminProvider } from './admin/context/AdminContext'
import LoginPanel from './admin/pages/LoginPanel'
import ProtectedRoute from './admin/ProtectedRoute'
import AdminSection from './admin/pages/AdminSection'
import SocialSection from './admin/pages/SocialSection'


/* HOME */
function Home({ preloaderHidden, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <Preloader hidden={preloaderHidden} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onSidebarOpen={() => setSidebarOpen(true)} />
      <main>
        <Hero />
        <About />
        <Services />
        <Skills />
        <Portfolio />
        <Education />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}



/*  APP  */
export default function App() {
  const [preloaderHidden, setPreloaderHidden] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)


  /* Preloader */
  useEffect(() => {
    const handleLoad = () => setTimeout(() => setPreloaderHidden(true), 800)
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }
    return () => window.removeEventListener('load', handleLoad)
  }, [])


  /* Lock body scroll when sidebar open */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
  }, [sidebarOpen])

  return (
    <HashRouter>
      <AdminProvider>
        <Routes>


          {/*  PUBLIC */}
          <Route
            path="/"
            element={
              <Home
                preloaderHidden={preloaderHidden}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />



          {/*  PROJECT DETAIL  */}
          <Route path="/project/:projectId" element={<ProjectDetail />} />



          {/* LOGIN */}
          <Route path="/login" element={<LoginPanel />} />



          {/*  PROTECTED ADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="hero" element={<HeroSection />} />
            <Route path="about" element={<AboutSection />} />
            <Route path="skills" element={<SkillsSection />} />
            <Route path="services" element={<ServicesSection />} />
            <Route path="portfolio" element={<PortfolioSection />} />
            <Route path="education" element={<EducationSection />} />
            <Route path="contact" element={<ContactSection />} />
            <Route path="footer" element={<FooterSection />} />
            <Route path="admins" element={<AdminSection />} />
            <Route path="social" element={<SocialSection />} />
          </Route>



          {/*  FALLBACK  */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </AdminProvider>
    </HashRouter>
  )
}