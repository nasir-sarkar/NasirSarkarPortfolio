import React, { useEffect, useRef, useState } from 'react'
import aboutImg from '../assets/images/about.jpg'

import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import InfoList from '../components/ui/InfoList'
import Button from '../components/ui/Button'
import axios from '../api/axios'

export default function About() {
  const imgRef = useRef(null)
  const infoRef = useRef(null)

  const [about, setAbout] = useState(null)

  useIntersectionObserver([
    { ref: imgRef, animClass: 'fade-left' },
    { ref: infoRef, animClass: 'fade-right' },
  ])

 
  
  // FETCH FROM DB
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get('/about/getAbout')
        setAbout(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchAbout()
  }, [])

  if (!about) return null

  

  // CONVERT OBJECT
  const hasContent = (item) => item?.label?.trim() && item?.value?.trim()

  const leftItems = [
    hasContent(about?.info?.l1) && [about.info.l1.label, about.info.l1.value],
    hasContent(about?.info?.l2) && [about.info.l2.label, about.info.l2.value],
    hasContent(about?.info?.l3) && [about.info.l3.label, about.info.l3.value],
    hasContent(about?.info?.l4) && [about.info.l4.label, about.info.l4.value],
  ].filter(Boolean)

  const rightItems = [
    hasContent(about?.info?.l5) && [about.info.l5.label, about.info.l5.value],
    hasContent(about?.info?.l6) && [about.info.l6.label, about.info.l6.value],
    hasContent(about?.info?.l7) && [about.info.l7.label, about.info.l7.value],
    hasContent(about?.info?.l8) && [about.info.l8.label, about.info.l8.value],
  ].filter(Boolean)



  return (
    <section id="about" className="bg-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex items-center gap-[80px] flex-col lg:flex-row">



          {/* IMAGE */}
          <div ref={imgRef} className="lg:w-[400px] shrink-0 w-full max-w-[400px] mx-auto lg:mx-0">
            <div className="relative pb-[30px] pl-[30px]">

              <img
                src={aboutImg}
                alt="About"
                className="w-full rounded-[10px] relative z-10"
                style={{
                  height: '460px',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                }}
              />



              {/* EXPERIENCE BADGE */}
              <div
                className="absolute z-10 text-center text-white rounded-[20px] px-[26px] py-[22px]"
                style={{
                  bottom: '200px',
                  left: '-30px',
                  background: '#111',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  transform: 'rotate(-10deg)',
                }}
              >
                <span className="block text-[36px] font-[800] leading-none">
                  {about.experienceYears}
                </span>
                <span className="block text-[13px] font-[600]">
                  Years of<br />Experience
                </span>
              </div>

            </div>
          </div>



          {/* CONTENT */}
          <div ref={infoRef} className="flex-1">

            <span className="block text-[13px] font-[600] text-[#f9004d] uppercase tracking-[2px] mb-[10px]">
              {about.sectionTitle}
            </span>

            <h2 className="text-[38px] font-[700] text-[#0d0d0d] leading-[1.25] mb-[18px]">
              {about.firstHighlightedText}<br />
              <span className="text-[#f9004d]">
                {about.secondHighlightedText}
              </span>
            </h2>

            <p className="text-[#777] text-[15px] leading-[1.8] mb-[28px]">
              {about.objective}
            </p>



            {/* INFO LIST */}
            <div className="flex gap-10 mb-[5px] flex-col sm:flex-row">
              <div className="flex-1">
                <InfoList items={leftItems} />
              </div>
              <div className="flex-1">
                <InfoList items={rightItems} />
              </div>
            </div>



            {/* CV BUTTON */}
            <div className="mt-6">
              <Button
                href={about.cvLink}
                target="_blank"
                rel="noreferrer"
                variant="filled"
                className="!px-[25px] !py-[6px]"
              >
                Download CV
              </Button>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}