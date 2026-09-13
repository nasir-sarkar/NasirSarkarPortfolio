import { useEffect, useRef } from 'react'


export function useIntersectionObserver(items, options = { threshold: 0.1 }) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10)
          setTimeout(() => entry.target.classList.add('visible'), delay)
          observer.unobserve(entry.target)
        }
      })
    }, options)

    

    items.forEach(({ ref, animClass, delay }) => {
      const el = ref.current
      if (!el) return
      el.classList.add(animClass)
      if (delay !== undefined) el.dataset.delay = delay
      observer.observe(el)
    })


    return () => observer.disconnect()
 
  }, [])
}



export function useScrollAnimation(animClass = 'fade-up', options = { threshold: 0.1 }) {
  const ref = useRef(null)
  useIntersectionObserver([{ ref, animClass }], options)
  return ref
}
