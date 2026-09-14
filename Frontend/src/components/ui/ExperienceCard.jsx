import React from 'react'

export default function ExperienceCard({ card }) {
  const logoSrc = card.logoBase64
    ? `data:${card.logoMime || 'image/png'};base64,${card.logoBase64}`
    : null

  return (
    <div
      className="exp-card bg-white rounded-[8px] p-5 flex gap-4 transition-all duration-300 hover:-translate-y-[6px]"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.10)' }}
    >

      {/* Company Logo */}
      <div className="w-[54px] h-[54px] rounded-full overflow-hidden shrink-0 bg-[#f4f4f4] border border-[#e5e5e5] flex items-center justify-center">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={card.companyName}
            className="w-full h-full object-cover block"
          />
        ) : (
          <i className="fas fa-building text-[#f9004d] text-[18px]" />
        )}
      </div>



      {/* Content */}
      <div className="flex-1 min-w-0">

        {/* Position */}
        <h4 className="text-[15px] font-[700] text-[#0d0d0d] leading-[1.3]">
          {card.position}
        </h4>



        {/* Company + Employment Type */}
        <div className="text-[13px] mt-[3px]">
          {card.companyLink ? (
            <a
              href={card.companyLink}
              target="_blank"
              rel="noreferrer"
              className="text-[#f9004d] font-[600] hover:text-[#c41020] transition-all duration-300"
            >
              {card.companyName}
            </a>
          ) : (
            <span className="text-[#f9004d] font-[600]">{card.companyName}</span>
          )}
          {card.employmentType && (
            <span className="text-[#777] font-[500]"> &middot; {card.employmentType}</span>
          )}
        </div>



        {/* Location / Location Type / Date */}
        <div className="text-[12px] text-[#777] mt-[8px] flex flex-wrap items-center gap-x-[14px] gap-y-[4px]">
          {card.location && (
            <span className="flex items-center gap-[5px]">
              <i className="fas fa-map-marker-alt text-[#f9004d]" />
              {card.location}
            </span>
          )}
          {card.locationType && (
            <span className="flex items-center gap-[5px]">
              <i className="fas fa-briefcase text-[#f9004d]" />
              {card.locationType}
            </span>
          )}
          {card.date && (
            <span className="flex items-center gap-[5px]">
              <i className="far fa-calendar-alt text-[#f9004d]" />
              {card.date}
            </span>
          )}
        </div>



        {/* Skills (optional) */}
        {Array.isArray(card.skills) && card.skills.length > 0 && (
          <div className="flex flex-wrap gap-[6px] mt-[12px]">
            {card.skills.map((skill, i) => (
              <span
                key={i}
                className="text-[11px] font-[600] text-[#333] bg-[#f9f9f9] border border-[#e0e0e0] rounded-[6px] px-[10px] py-[4px]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}