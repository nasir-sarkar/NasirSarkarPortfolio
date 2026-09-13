import React from 'react'

export default function SocialLinks({
  links = [],
  variant = 'dark',
  className = ''
}) {
  const variantClass = {
    dark: 'w-[38px] h-[38px] bg-[#f7f7f7] text-[#0d0d0d] rounded-full flex items-center justify-center text-[15px] border border-[#e5e5e5] social-link',
    light: 'text-white/75 text-[15px] hover:text-[#f9004d] transition-all duration-300',
    sidebar: 'w-[38px] h-[38px] bg-white/10 text-white rounded-full flex items-center justify-center text-[14px] transition-all duration-300 sidebar-social-link',
  }[variant]

  return (
    <div className={`flex gap-[10px] ${className}`}>
      {links.map((item, i) => (
        <a
          key={item._id || i}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className={variantClass}
        >
          <i className={item.icon} />
        </a>
      ))}
    </div>
  )
}