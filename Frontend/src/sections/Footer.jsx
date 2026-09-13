import React, { useState, useEffect } from 'react'
import { smoothScrollTo } from '../utils/scroll'

function NavLink({ item }) {
  const handleClick = (e) => {
    e.preventDefault()
    smoothScrollTo(item.href)
  }

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className="footer-link text-[13.5px] text-[#999]">
        {item.label}
      </a>
    )
  }
  return (
    <a href={item.href} onClick={handleClick} className="footer-link text-[13.5px] text-[#999]">
      {item.label}
    </a>
  )
}


function FooterColumn({ title, children }) {
  return (
    <div>
      <h5 className="text-[15px] font-[700] text-white mb-[22px] pb-[10px] border-b-2 border-white/[0.06]">
        {title}
      </h5>
      {children}
    </div>
  )
}


export default function Footer() {
  const [footerContactInfo, setFooterContactInfo] = useState([])
  const [footerInfoLinks,   setFooterInfoLinks]   = useState([])
  const [footerQuickLinks,  setFooterQuickLinks]  = useState([])


  
  // FETCH FROM DB
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/footer/getFooter`)
      .then((res) => res.json())
      .then((data) => {
        setFooterContactInfo(data.footerContactInfo || [])
        setFooterInfoLinks(data.footerInfoLinks     || [])
        setFooterQuickLinks(data.footerQuickLinks   || [])
      })
      .catch((err) => console.error('Failed to fetch footer data:', err))
  }, [])


  const handleLogoClick = (e) => {
    e.preventDefault()
    smoothScrollTo('#home')
  }


  return (
    <footer className="bg-[#111111]">
      <div className="py-[80px] pb-[30px]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[150px]">


            {/* Brand column */}
            <div>
              <div className="mb-5">
                <a
                  href="#home"
                  onClick={handleLogoClick}
                  className="text-[22px] font-[800]"
                >
                  <span className="text-[#f9004d]">Nasir</span>
                  <span className="text-white"> Sarkar</span>
                </a>
              </div>
              <div className="space-y-[10px]">
                {footerContactInfo.map((item) => (
                  <p key={item.label} className="text-[13.5px] text-[#999]">
                    <strong className="text-white/60">{item.label}:</strong>{' '}
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[#999] hover:text-[#f9004d] transition-all duration-300"
                      >
                        {item.val}
                      </a>
                    ) : (
                      item.val
                    )}
                  </p>
                ))}
              </div>
            </div>


            {/* Information column */}
            <FooterColumn title="Information">
              <ul className="space-y-[10px]">
                {footerInfoLinks.map((item) => (
                  <li key={item.label}>
                    <NavLink item={item} />
                  </li>
                ))}
              </ul>
            </FooterColumn>


            {/* Quick Links column */}
            <FooterColumn title="Quick Links">
              <ul className="space-y-[10px]">
                {footerQuickLinks.filter((item) => item.label !== 'Projects').map((item) => (
                  <li key={item.label}>
                    <NavLink item={item} />
                  </li>
                ))}
                <li>
                  <a href="#/login" className="footer-link text-[13.5px] text-[#999]">
                    Admin Login
                  </a>
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>
      </div>


      {/* Bottom bar */}
      <div className="bg-black/30 py-5 text-center">
        <div className="max-w-[1200px] mx-auto px-5">
          <p className="text-[#999] text-[13px]">
            © 2026 All rights reserved | Designed & Developed by{' '}
            <a
              href="#home"
              onClick={handleLogoClick}
              className="text-[#f9004d] hover:text-[#c41020] transition-all duration-300"
            >
              Nasir Sarkar
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}