import React from 'react'

export default function Button({
  children,
  href,
  onClick,
  variant = 'filled',
  as: Tag = 'a',
  target,
  rel,
  type,
  className = '',
  style,
}) {
  const base =
    'inline-block text-[13px] font-[600] px-[32px] py-[13px] rounded-full uppercase tracking-wide border-2 transition-all duration-300 cursor-pointer'



  const variants = {
    filled: 'bg-[#f9004d] text-white border-[#f9004d] btn-red',
    outline: 'bg-transparent text-[#f9004d] border-[#f9004d] btn-outline',
  }


  
  const props = {
    className: `${base} ${variants[variant]} ${className}`,
    onClick,
    style,
  }


  
  if (Tag === 'a') {
    props.href = href
    if (target) props.target = target
    if (rel) props.rel = rel
  } else {
    props.type = type || 'button'
  }

  return <Tag {...props}>{children}</Tag>
}
