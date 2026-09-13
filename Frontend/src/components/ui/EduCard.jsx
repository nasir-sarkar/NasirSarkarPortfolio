import React from 'react'

export default function EduCard({ card, hasImg = false, imgSrc }) {
  return (
    <div
      className="edu-card bg-white rounded-[8px] overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-[6px]"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.10)' }}
    >


      {/* Image */}
      {hasImg && imgSrc && (
        <div className="h-[160px] w-full overflow-hidden border-b border-[#e5e5e5] bg-[#f4f4f4] flex items-center justify-center">
          <img
            src={imgSrc}
            alt={card.title}
            className="w-full h-full object-contain block"
          />
        </div>
      )}



      {/* Meta */}
      <div className="flex gap-4 px-4 pt-3 pb-1.5">
        <span className="text-[11px] text-[#777] flex items-center gap-1.5">
          <i className={`${card.meta?.dateIcon} text-[#f9004d]`} />
          {card.meta?.date}
        </span>
        <span className="text-[11px] text-[#777] flex items-center gap-1.5">
          <i className={`${card.meta?.commentIcon} text-[#f9004d]`} />
          {card.meta?.comment}
        </span>
      </div>



      {/* Title */}
      <h4 className="text-[14px] font-[700] px-4 pb-2.5 leading-[1.2]">
        <a
          href={card.titleLink}
          target="_blank"
          rel="noreferrer"
          className="text-[#0d0d0d] hover:text-[#f9004d] transition-all duration-300"
        >
          {card.title}
        </a>
      </h4>



      {/* Author */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-t border-b border-[#e5e5e5]">
        <div className="w-9 h-9 rounded-full bg-[rgba(232,25,44,0.1)] flex items-center justify-center text-[#f9004d] text-[15px] shrink-0">
          <i className={card.authorIcon} />
        </div>
        <div>
          <h6 className="text-[12px] font-[700] text-[#0d0d0d] m-0">
            {card.authorName}
          </h6>
          <span className="text-[10px] text-[#777]">
            {card.authorSub}
          </span>
        </div>
      </div>



      {/* Read More */}
      <a
        href={card.readMoreLink}
        target="_blank"
        rel="noreferrer"
        className="edu-readmore mt-auto block px-4 py-2.5 text-[12px] font-[600] text-[#f9004d] transition-all duration-300 hover:pl-[22px]"
      >
        {card.readMore} <i className="fas fa-arrow-right" />
      </a>
    </div>
  )
}