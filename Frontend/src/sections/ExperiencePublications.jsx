import React, { useRef, useEffect, useState } from 'react'
import { useScrollAnimation } from '../hooks/useIntersectionObserver'
import SectionHeader from '../components/ui/SectionHeader'
import ExperienceCard from '../components/ui/ExperienceCard'
import PublicationCard from '../components/ui/PublicationCard'
import api from '../api/axios'
import { useLoading } from '../context/LoadingContext'

export default function ExperiencePublications() {
  const headerRef = useScrollAnimation('fade-up')
  const cardRefs  = useRef([])

  const [experienceCards,  setExperienceCards]  = useState([])
  const [publicationCards, setPublicationCards] = useState([])
  const [loading,          setLoading]          = useState(true)
  const { markReady } = useLoading()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, pubRes] = await Promise.all([
          api.get('/experience/getExperience'),
          api.get('/publications/getPublications'),
        ])
        setExperienceCards(expRes.data?.experienceCards || [])
        setPublicationCards(pubRes.data?.publicationCards || [])
        markReady('experience')
      } catch (err) {
        console.log("Experience/Publications fetch error:", err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
  }, [loading, experienceCards, publicationCards])

  if (loading) return null



  // Newest first
  const displayExperience  = [...experienceCards].reverse()
  const displayPublications = [...publicationCards].reverse()

  let idx = 0



  return (
    <section id="experience" className="bg-white pt-[50px] pb-[100px]">
      <div className="max-w-[1200px] mx-auto px-5">

        {/* Header */}
        <div ref={headerRef}>
          <SectionHeader
            eyebrow="Career & Research"
            title="Experience & Publications"
            subtitle={
              <>
                Professional roles I've held and research work<br />
                I've contributed to along the way
              </>
            }
          />
        </div>



        <div className="flex flex-col lg:flex-row gap-[50px]">

          {/* LEFT — Experience */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[20px] font-[700] text-[#0d0d0d] mb-[25px] flex items-center gap-[10px]">
              <i className="fas fa-briefcase text-[#f9004d]" />
              Experience
            </h3>

            <div className="flex flex-col gap-[22px]">
              {displayExperience.map((card, i) => (
                <div key={i} ref={(el) => (cardRefs.current[idx++] = el)}>
                  <ExperienceCard card={card} />
                </div>
              ))}

              {displayExperience.length === 0 && (
                <p className="text-[#999] text-[14px]">More experience coming soon.</p>
              )}
            </div>
          </div>



          {/* RIGHT — Publications */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[20px] font-[700] text-[#0d0d0d] mb-[25px] flex items-center gap-[10px]">
              <i className="fas fa-book-open text-[#f9004d]" />
              Publications
            </h3>

            <div className="flex flex-col gap-[22px]">
              {displayPublications.map((card, i) => (
                <div key={i} ref={(el) => (cardRefs.current[idx++] = el)}>
                  <PublicationCard card={card} />
                </div>
              ))}

              {displayPublications.length === 0 && (
                <p className="text-[#999] text-[14px]">Publications coming soon.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}