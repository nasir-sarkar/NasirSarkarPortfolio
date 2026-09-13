import React, { useRef, useEffect, useState } from 'react'
import { useScrollAnimation } from '../hooks/useIntersectionObserver'
import SectionHeader from '../components/ui/SectionHeader'
import EduCard from '../components/ui/EduCard'
import api from '../api/axios'

export default function Education() {
  const headerRef = useScrollAnimation('fade-up')
  const cardRefs  = useRef([])

  const [educationCards, setEducationCards] = useState([])
  const [certCards,      setCertCards]      = useState([])
  const [loading,        setLoading]        = useState(true)


  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await api.get('/education/getEducation')
        if (res.data) {
          setEducationCards(res.data.educationCards || [])
          setCertCards(res.data.certCards || [])
        }
      } catch (err) {
        console.log("Education fetch error:", err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEducation()
  }, [])


  useEffect(() => {
    if (loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || '0', 10)
            setTimeout(() => entry.target.classList.add('visible'), delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    cardRefs.current.forEach((card, i) => {
      if (card) {
        card.classList.add('fade-up')
        card.dataset.delay = i * 100
        observer.observe(card)
      }
    })

    return () => observer.disconnect()
  }, [loading, educationCards, certCards])

  if (loading) return null



  // Newest first
  const displayEdu  = [...educationCards].reverse()
  const displayCert = [...certCards].reverse()

  let idx = 0


  
  return (
    <section id="education" className="bg-[#f7f7f7] py-[100px]">
      <div className="max-w-[1200px] mx-auto px-5">

        {/* Header */}
        <div ref={headerRef}>
          <SectionHeader
            eyebrow="Academic Journey"
            title="Education & Achievements"
            subtitle={
              <>
                My academic background that built the foundation<br />
                for my technical expertise
              </>
            }
          />
        </div>



        {/* Education Cards */}
        <div className="flex flex-wrap justify-center gap-[30px] mb-[30px]">
          {displayEdu.map((card, i) => (
            <div
              key={i}
              className="w-full md:w-[calc(50%-15px)]"
              ref={(el) => (cardRefs.current[idx++] = el)}
            >
              <EduCard card={card} hasImg={false} />
            </div>
          ))}
        </div>



        {/* Cert Cards */}
        <div className="flex flex-wrap justify-center gap-[30px]">
          {displayCert.map((card, i) => (
            <div
              key={i}
              className="w-full md:w-[calc(50%-15px)] lg:w-[calc(33.333%-20px)]"
              ref={(el) => (cardRefs.current[idx++] = el)}
            >
              <EduCard
                card={card}
                hasImg={!!card.imgBase64}
                imgSrc={
                  card.imgBase64
                    ? `data:${card.imgMime || 'image/png'};base64,${card.imgBase64}`
                    : null
                }
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}