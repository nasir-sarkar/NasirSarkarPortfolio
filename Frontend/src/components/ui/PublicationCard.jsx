import React from 'react'

export default function PublicationCard({ card }) {
  return (
    <div
      className="pub-card bg-white rounded-[8px] p-5 flex flex-col gap-[8px] transition-all duration-300 hover:-translate-y-[6px]"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.10)' }}
    >

      {/* Title */}
      <h4 className="text-[15px] font-[700] leading-[1.4]">
        {card.url ? (
          <a
            href={card.url}
            target="_blank"
            rel="noreferrer"
            className="text-[#0d0d0d] hover:text-[#f9004d] transition-all duration-300"
          >
            {card.title}
          </a>
        ) : (
          <span className="text-[#0d0d0d]">{card.title}</span>
        )}
      </h4>



      {/* Publisher + Year */}
      <div className="text-[12px] text-[#777] flex flex-wrap items-center gap-x-[14px] gap-y-[4px]">
        {card.publisher && (
          <span className="flex items-center gap-[5px]">
            <i className="fas fa-book text-[#f9004d]" />
            {card.publisher}
          </span>
        )}
        {card.year && (
          <span className="flex items-center gap-[5px]">
            <i className="far fa-calendar-alt text-[#f9004d]" />
            {card.year}
          </span>
        )}
      </div>



      {/* Description (optional) */}
      {card.description && (
        <p className="text-[13px] text-[#666] leading-[1.75] mt-[2px]">
          {card.description}
        </p>
      )}



      {/* Read More */}
      {card.url && (
        <a
          href={card.url}
          target="_blank"
          rel="noreferrer"
          className="pub-readmore text-[12px] font-[600] text-[#f9004d] mt-[4px] transition-all duration-300 hover:pl-[6px]"
        >
          View Publication <i className="fas fa-arrow-right" />
        </a>
      )}
    </div>
  )
}