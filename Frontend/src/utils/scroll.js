export function smoothScrollTo(href, offset = 80) {
  const target = document.querySelector(href)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

export function makeSmoothClickHandler(href, onDone) {
  return (e) => {
    e.preventDefault()
    smoothScrollTo(href)
    if (onDone) onDone()
  }
}
