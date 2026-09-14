import React, { useEffect, useRef, useState } from 'react'
import axios from '../api/axios'

import { useScrollAnimation } from '../hooks/useIntersectionObserver'
import SectionHeader from '../components/ui/SectionHeader'
import ServiceCard from '../components/ui/ServiceCard'
import { useLoading } from '../context/LoadingContext'

import {
  Code, Server, Monitor, Database, Layers,
  Wifi, Smartphone, Paintbrush, BarChart2, Cloud,
  Globe, Shield, Cpu, GitBranch, Terminal, Laptop,
} from 'lucide-react'

const iconMap = {
  Code, Server, Monitor, Database, Layers,
  Wifi, Smartphone, Paintbrush, BarChart2, Cloud,
  Globe, Shield, Cpu, GitBranch, Terminal, Laptop,
}



export default function Services() {

  const headerRef = useScrollAnimation('fade-up', { threshold: 0.12 })
  const cardRefs = useRef([])

  const [data, setData] = useState(null)
  const { markReady } = useLoading()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('/services/getServices')
        setData(res.data)
        markReady('services')
      } catch (err) {
        console.log("Services fetch error:", err)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    if (!data) return

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
      { threshold: 0.12 }
    )

    cardRefs.current.forEach((card, i) => {
      if (card) {
        card.classList.add('fade-up')
        card.dataset.delay = i * 80
        observer.observe(card)
      }
    })

    return () => observer.disconnect()
  }, [data])

  if (!data) return null


  // Newest first
  const displayServices = [...(data.services || [])].reverse()



  return (
    <section id="services" className="bg-[#f7f7f7] py-[100px]">
      <div className="max-w-[1200px] mx-auto px-5">

        <div ref={headerRef}>
          <SectionHeader
            eyebrow={data.eyebrow}
            title={data.sectionTitle}
            subtitle={data.subtitle}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-[30px]">
          {displayServices.map((svc, i) => {
            const Icon = iconMap[svc.icon] || Code
            return (
              <div
                key={i}
                className="w-full md:w-[calc(50%-15px)] lg:w-[calc(33.333%-20px)] h-full"
                ref={(el) => (cardRefs.current[i] = el)}
              >
                <ServiceCard
                  icon={<Icon size={24} />}
                  title={svc.title}
                  desc={svc.desc}
                />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}