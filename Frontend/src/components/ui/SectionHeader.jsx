import React from 'react'

export default function SectionHeader({ eyebrow, title, subtitle, center = true, className = '' }) {
  
  return (
    <div className={`${center ? 'text-center' : ''} mb-[60px] ${className}`}>
      {eyebrow && (
        <span className="block text-[13px] font-[600] text-[#f9004d] uppercase tracking-[2px] mb-[10px]">
          {eyebrow}
        </span>
      )}

      <h2 className="text-[38px] font-[700] text-[#0d0d0d] leading-[1.25] mb-[18px]">
        {title}
      </h2>

      {subtitle && (
        <p className="text-[#777] text-[15px] max-w-[550px] mx-auto leading-[1.75]">
          {subtitle}
        </p>
      )}
    </div>
  )
  
}
