import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'


// Tiny helpers

function b64Src(base64, mime) {
  if (!base64) return null
  return `data:${mime || 'image/jpeg'};base64,${base64}`
}

function Tag({ children }) {
  return (
    <span className="inline-block px-3 py-1 text-[11px] font-[700] uppercase tracking-[1.5px] text-[#f9004d] border border-[#f9004d22] bg-[#f9004d0d] rounded-full">
      {children}
    </span>
  )
}



// Main component
export default function ProjectDetail() {
  const { projectId } = useParams()
  const navigate      = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgActive, setImgActive] = useState(0)   

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    const fetch = async () => {
      try {
        const res = await api.get(`/portfolio/getProject/${projectId}`)
        setProject(res.data)
      } catch (err) {
        console.error('Project fetch error:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [projectId])



  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="w-10 h-10 rounded-full border-4 border-[#f9004d] border-t-transparent animate-spin" />
      </div>
    )
  }



  /* Not found */
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f8f8] gap-4">
        <h2 className="text-2xl font-bold text-[#0d0d0d]">Project not found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-[#f9004d] font-semibold underline"
        >
          ← Back to Home
        </button>
      </div>
    )
  }



  const thumbSrc      = b64Src(project.imgBase64, project.imgMime)
  const detailImg1Src = b64Src(project.detailImage1Base64, project.detailImage1Mime)
  const detailImg2Src = b64Src(project.detailImage2Base64, project.detailImage2Mime)

  const galleryImages = [detailImg1Src, detailImg2Src].filter(Boolean)
  const activeImgSrc  = galleryImages[imgActive] || thumbSrc



  return (
    <div className="bg-[#f8f8f8] min-h-screen">


      {/* Hero banner */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f9004d, #c0003a)',
          minHeight: '320px',
        }}
      >
        {/* blurred bg image for depth */}
        {thumbSrc && (
          <img
            src={thumbSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105"
            aria-hidden
          />
        )}



        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />



        {/* back button */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 pt-8">
          <button
            onClick={() => { navigate('/'); setTimeout(() => { document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' }) }, 100) }}
            className="flex items-center gap-2 text-white/80 hover:text-white text-[13px] font-[600] uppercase tracking-[1.5px] transition-colors duration-200"
          >
            <i className="fas fa-arrow-left" /> Back
          </button>
        </div>



        {/* title area */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 pb-14 pt-6">
          <Tag>{project.cat}</Tag>
          <h1 className="text-white text-[32px] md:text-[44px] font-[800] leading-tight mt-3 mb-2">
            {project.detailTitle || project.title}
          </h1>
          <p className="text-white/60 text-[14px] font-[500]">{project.tech}</p>
        </div>
      </div>



      {/*  Content card */}
      <div className="max-w-[1100px] mx-auto px-5 -mt-10 pb-20 relative z-10">
        <div className="bg-white rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.10)] overflow-hidden">

          {/*  Gallery */}
          {galleryImages.length > 0 && (
            <div className="p-6 md:p-10 border-b border-[#f0f0f0]">
              {/* Main viewer */}
              <div
                className="w-full rounded-[8px] overflow-hidden mb-4"
                style={{
                  background: 'linear-gradient(135deg, #f9004d, #c0003a)',
                  maxHeight: '480px',
                }}
              >
                <img
                  src={activeImgSrc}
                  alt={`${project.title} screenshot`}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '480px' }}
                />
              </div>


              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-3">
                  {galleryImages.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImgActive(idx)}
                      className={`w-20 h-14 rounded-[6px] overflow-hidden border-2 transition-all duration-200 ${
                        imgActive === idx
                          ? 'border-[#f9004d] scale-105'
                          : 'border-transparent opacity-60 hover:opacity-90'
                      }`}
                      style={{ background: 'linear-gradient(135deg, #f9004d, #c0003a)' }}
                    >
                      <img src={src} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}



          {/* Description */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">


            {/* Description — takes 2 cols */}
            <div className="lg:col-span-2">
              <h2 className="text-[20px] font-[800] text-[#0d0d0d] mb-4">About this project</h2>

              {project.description ? (
                <p className="text-[#555] text-[15px] leading-[1.85]">{project.description}</p>
              ) : (
                <p className="text-[#aaa] italic text-[14px]">No description provided yet.</p>
              )}


              {/* Features list */}
              {project.features && project.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-[15px] font-[700] text-[#0d0d0d] mb-3 uppercase tracking-[1px]">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {project.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-[#555]">
                        <span className="mt-[5px] w-[6px] h-[6px] rounded-full bg-[#f9004d] flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>



            {/* Sidebar meta */}
            <div className="border-l-0 lg:border-l border-[#f0f0f0] lg:pl-10">
              <h3 className="text-[13px] font-[700] uppercase tracking-[1.5px] text-[#aaa] mb-5">
                Project Info
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[1px] text-[#aaa] mb-1">Category</p>
                  <p className="text-[14px] font-[600] text-[#0d0d0d]">{project.cat}</p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[1px] text-[#aaa] mb-1">Technologies</p>
                  <p className="text-[14px] font-[600] text-[#0d0d0d]">{project.tech}</p>
                </div>
              </div>



              {/* CTA buttons */}
              <div className="mt-8 flex flex-col gap-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0d0d0d] text-white text-[13px] font-[700] rounded-[6px] hover:bg-[#f9004d] transition-colors duration-300"
                  >
                    <i className="fab fa-github" /> View on GitHub
                  </a>
                )}
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-[#f9004d] text-[#f9004d] text-[13px] font-[700] rounded-[6px] hover:bg-[#f9004d] hover:text-white transition-all duration-300"
                  >
                    <i className="fas fa-external-link-alt" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}