import React, { useState, useEffect } from 'react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  
  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 200)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })


  return (
    <button
      className={`back-to-top ${show ? 'show' : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
    >
      <i className="fas fa-arrow-up" />
    </button>
  )
}
