import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useIntersectionObserver'
import SectionHeader from '../components/ui/SectionHeader'
import Button from '../components/ui/Button'
import api from '../api/axios'


function PortfolioCard({ proj, animRef }) {
  const navigate = useNavigate()

  const imgSrc = proj.imgBase64
    ? `data:${proj.imgMime || 'image/jpeg'};base64,${proj.imgBase64}`
    : null

  const handleReadMore = (e) => {
    e.stopPropagation()
    navigate(`/project/${proj._id}`)
  }



  return (
    <div
      ref={animRef}
      className="portfolio-item rounded-[8px] overflow-hidden bg-white cursor-pointer flex flex-col w-full md:w-[calc(50%-15px)] lg:w-[calc(25%-23px)]"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.10)' }}
    >

      {/* Thumbnail — clicking the image still opens GitHub */}
      <div
        className="overflow-hidden"
        style={{ background: proj.gradient || 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
        onClick={() => window.open(proj.link, '_blank')}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={proj.title} className="portfolio-img-fill" />
        ) : (
          <div
            className="portfolio-img-fill flex items-center justify-center"
            style={{ minHeight: '180px' }}
          >
            <i className="fas fa-image text-white opacity-20 text-5xl" />
          </div>
        )}
      </div>



      {/* Card body */}
      <div className="p-[22px] flex flex-col flex-1">
        <span className="block text-[11px] font-[700] text-[#f9004d] uppercase tracking-[1.5px] mb-2">
          {proj.cat}
        </span>
        <h5 className="text-[16px] font-[700] mb-1">
          <button
            onClick={handleReadMore}
            className="text-[#0d0d0d] hover:text-[#f9004d] transition-all duration-300 text-left"
          >
            {proj.title}
          </button>
        </h5>
        <p className="text-[#777] text-[13px] mb-4">{proj.tech}</p>



        {/* Read More */}
        <div className="mt-auto">
          <button
            onClick={handleReadMore}
            className="text-[12px] font-[700] text-[#f9004d] uppercase tracking-[1px] hover:opacity-70 transition-opacity duration-200 flex items-center gap-1"
          >
            Read More <i className="fas fa-arrow-right text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  )
}



export default function Portfolio() {
  const headerRef = useScrollAnimation('fade-up')
  const itemRefs  = useRef([])

  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/portfolio/getPortfolio')
        if (res.data) {
          setProjects(res.data.projects || [])
        }
      } catch (err) {
        console.log('Portfolio fetch error:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  const displayProjects = [...projects].reverse()

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

    itemRefs.current.forEach((item, i) => {
      if (item) {
        item.classList.add('fade-up')
        item.dataset.delay = i * 100
        observer.observe(item)
      }
    })

    return () => observer.disconnect()
  }, [loading, projects])

  if (loading) return null


  
  return (
    <section id="portfolio" className="bg-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-5">
        <div ref={headerRef}>
          <SectionHeader
            eyebrow="Creative Portfolio"
            title="Solutions I've built"
            subtitle={
              <>
                Projects I've completed, demonstrating practical skills<br />
                and real-world problem solving
              </>
            }
          />
        </div>

        <div className="flex flex-wrap justify-center gap-[30px]">
          {displayProjects.map((proj, i) => (
            <PortfolioCard
              key={proj._id || i}
              proj={proj}
              animRef={(el) => (itemRefs.current[i] = el)}
            />
          ))}
        </div>

        {/* <div className="text-center mt-[40px]">
          <Button
            href="https://github.com/nasir-sarkar"
            target="_blank"
            rel="noreferrer"
            variant="outline"
          >
            View All Works <i className="fas fa-arrow-right ml-1" />
          </Button>
        </div> */}
      </div>
    </section>
  )
}