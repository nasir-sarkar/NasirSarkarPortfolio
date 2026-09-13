import React, { useState, useEffect } from 'react'
import SocialLinks from '../components/ui/SocialLinks'
import { smoothScrollTo } from '../utils/scroll'
import api from '../api/axios'

const navLinks = [
  { href: '#home',      label: 'Home' },
  { href: '#about',     label: 'About' },
  { href: '#services',  label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#skills',    label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#contact',   label: 'Contact' },
]

export default function Navbar({ onSidebarOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [socialLinks, setSocialLinks] = useState([])

  

  //   FETCH SOCIAL LINKS
  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const res = await api.get("/social-links")
        setSocialLinks(res.data)
      } catch (err) {
        console.log("Social links load error:", err)
      }
    }

    fetchSocial()
  }, [])



  //   SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)


      // Active section detection
      const sections = document.querySelectorAll('section[id]')
      const scrollPos = window.scrollY + 100
      sections.forEach((section) => {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
          setActiveSection(section.id)
        }
      })


      // Scroll-percentage CSS variable
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const totalScrollable = docHeight - winHeight
      const scrollPercent = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0
      document.documentElement.style.setProperty('--scroll-percentage', `${scrollPercent}%`)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    smoothScrollTo(href)
    setMobileOpen(false)
  }

  const toggleMobile = () => setMobileOpen((prev) => !prev)



  return (
    <>
      <header
        id="header"
        className={`fixed top-0 left-0 w-full z-[8000] transition-all duration-300 ${
          scrolled ? 'header-scrolled' : ''
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 lg:px-10 py-[18px]">
          {/* Logo */}
          <div>
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="text-[22px] font-[800] text-white tracking-tight"
            >
              <span className="text-[#f9004d]">Nasir</span>
              <span className="text-white"> Sarkar</span>
            </a>
          </div>



          {/* Desktop Nav */}
          <nav className="hidden lg:flex ml-[70px] mr-auto">
            <ul className="flex gap-[5px] items-center ml-[70px]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`nav-link text-[14px] font-[500] px-[14px] py-2 rounded text-white/85 ${
                      activeSection === link.href.slice(1) ? 'active' : ''
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>



          {/* Right Side */}
          <div className="flex items-center gap-[12px] sm:gap-[20px]">
            {/* Social Icons — desktop only */}
            <SocialLinks 
              links={socialLinks} 
              variant="light" 
              className="hidden lg:flex gap-5" 
            />

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-red bg-[#f9004d] text-white text-[12px] font-[700] px-[22px] py-[10px] rounded-full uppercase tracking-wide whitespace-nowrap transition-all duration-300 hover:bg-[#c41020]"
            >
              Contact Me
            </a>



            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col gap-[5px] cursor-pointer p-[5px]"
              onClick={toggleMobile}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : '',
                  transition: 'all 0.35s ease',
                }}
                className="block w-6 h-[2px] bg-white"
              />
              <span
                style={{
                  opacity: mobileOpen ? '0' : '1',
                  transition: 'all 0.35s ease',
                }}
                className="block w-6 h-[2px] bg-white"
              />
              <span
                style={{
                  transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : '',
                  transition: 'all 0.35s ease',
                }}
                className="block w-6 h-[2px] bg-white"
              />
            </button>
          </div>
        </div>
      </header>



      {/* Mobile Nav */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}