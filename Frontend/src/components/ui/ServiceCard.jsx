import React from 'react'

export default function ServiceCard({ icon, title, desc }) {
  return (
    <div className="service-card h-full flex flex-col bg-white p-[35px_28px] rounded-[8px] border border-[#e5e5e5] cursor-default">


      {/* ICON */}
      <div className="service-icon w-[60px] h-[60px] bg-[rgba(232,25,44,0.08)] rounded-[8px] flex items-center justify-center text-[#f9004d] mb-[22px]">
        {icon}
      </div>


      {/* TITLE */}
      <h4 className="text-[16px] font-[700] text-[#0d0d0d] mb-3">
        <a href="#services" className="hover:text-[#f9004d] transition-all duration-300">
          {title}
        </a>
      </h4>


      {/* DESC */}
      <p className="text-[#777] text-[13.5px] leading-[1.75]">
        {desc}
      </p>
    </div>
  )
}