import React from 'react'

export default function InfoList({ items = [], className = '' }) {
  return (
    <ul className={`space-y-[10px] ${className}`}>
      {items.map(([label, val]) => (
        <li key={label} className="text-[14px] text-[#444] leading-[1.6]">
          <span className="font-[600] text-[#0d0d0d] mr-[6px]">{label} :</span>
          {val}
        </li>
      ))}
    </ul>
  )
}
