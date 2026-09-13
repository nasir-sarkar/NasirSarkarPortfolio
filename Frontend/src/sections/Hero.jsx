import React, { useState, useEffect, useRef } from 'react'
import homeBg from '../assets/images/home.jpg'
import axios from '../api/axios'
import { useCounter } from '../hooks/useCounter'
import Button from '../components/ui/Button'
import { smoothScrollTo } from '../utils/scroll'


// TYPING ANIMATION HOOK
function useTypingAnimation(roles) {
  const [displayed, setDisplayed] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!roles || roles.length === 0) return

    const current = roles[roleIndex]

    if (!deleting && charIndex < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1))
        setCharIndex(i => i + 1)
      }, 100)
    } else if (!deleting && charIndex === current.length) {
      if (roles.length === 1) {
        timeoutRef.current = setTimeout(() => {
          setCharIndex(0)
          setDisplayed('')
        }, 2200)
      } else {
        timeoutRef.current = setTimeout(() => setDeleting(true), 2200)
      }
    } else if (deleting && charIndex > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        setCharIndex(i => i - 1)
      }, 35)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setRoleIndex(i => (i + 1) % roles.length)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [charIndex, deleting, roleIndex, roles])

  return { displayed, roleIndex }
}



// STAT COMPONENT
function StatCounter({ target, label, started }) {
  const isDecimal = !Number.isInteger(target)
  const value = useCounter(target, isDecimal, started)

  if (!label || !target || target === 0) return null

  return (
    <div>
      <h3 className="text-[36px] font-[800] text-white">{value}</h3>
      <p className="text-[#ccc] text-[13px] uppercase tracking-wide">
        {label}
      </p>
    </div>
  )
}


// ROLE COLORS
const roleColors = ['#f9004d', '#ff6b00']


// HERO COMPONENT
export default function Hero() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await axios.get('/home/getHome')
        setData(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const roles = data
    ? [data.role, data.role2].filter(r => r && r.trim() !== '')
    : []

  const { displayed, roleIndex } = useTypingAnimation(roles)
  const currentColor = roleColors[roleIndex % roleColors.length]

  const handleReadMore = (e) => {
    e.preventDefault()
    smoothScrollTo('#about')
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }



  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center"
      style={{
        background: `url(${homeBg}) no-repeat center center / cover`,
        height: '100vh',
      }}
    >
      <div className="hero-text-block relative w-full max-w-[1200px] mx-auto px-10 pt-[120px] pb-[80px] flex items-center justify-between gap-10">
        <div className="flex-1 max-w-[800px]">


          {/* NAME */}
          <h1
            className="font-[800] text-white leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(42px, 6vw, 72px)' }}
          >
            I'm {data?.name}
          </h1>



          {/* ROLE — typing animation */}
          <h1
            className="font-[800] leading-[1.1] mb-4 whitespace-nowrap flex items-center"
            style={{ fontSize: 'clamp(42px, 6vw, 72px)', minHeight: '1.1em' }}
          >
            <span style={{ color: currentColor, transition: 'color 0.4s ease' }}>
              {displayed}
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '0.85em',
                backgroundColor: currentColor,
                marginLeft: '3px',
                verticalAlign: 'middle',
                opacity: 1,
                transition: 'background-color 0.4s ease',
                animation: 'caretBlink 1s step-start infinite',
              }}
            />
          </h1>



          {/* CARET KEYFRAME */}
          <style>{`
            @keyframes caretBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }

            /* Mobile-only fix: reframe hero photo so the face/upper body
               shows fully instead of being cropped awkwardly at half-body.
               Desktop/tablet layout is untouched. */
            @media (max-width: 767px) {
              #home {
                background-position: 78% 15% !important;
              }
            }
          `}</style>



          {/* TAGLINE */}
          <h4 className="text-white text-[18px] mb-[30px]">
            {data?.tagline}
          </h4>



          {/* BUTTON */}
          <Button
            href="#about"
            onClick={handleReadMore}
            variant="filled"
            style={{ boxShadow: 'none' }}
            className="hover:bg-[#c41020] hover:border-[#c41020] hover:-translate-y-0.5"
          >
            Read More
          </Button>



          {/* STATS */}
          <div className="flex gap-10 mt-[50px] flex-wrap">
            <StatCounter target={Number(data?.target_number1 || 0)} label={data?.label1} started={started} />
            <StatCounter target={Number(data?.target_number2 || 0)} label={data?.label2} started={started} />
            <StatCounter target={Number(data?.target_number3 || 0)} label={data?.label3} started={started} />
          </div>

        </div>
      </div>
    </section>
  )
}