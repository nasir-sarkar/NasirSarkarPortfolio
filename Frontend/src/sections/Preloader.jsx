import React from 'react'

export default function Preloader({ hidden }) {
  return (
    <div
      id="preloader"
      className={`fixed inset-0 bg-[#0d0d0d] z-[99999] flex items-center justify-center transition-opacity duration-500 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      
      <div>
        <div className="spinner" />
      </div>
    </div>
  )
}
