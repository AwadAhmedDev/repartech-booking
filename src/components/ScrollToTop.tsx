import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Haut de page à chaque changement de page, ou section visée (/#booking) si une ancre est donnée.
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (!target) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    target.scrollIntoView({ behavior: 'instant' })
    // Le contenu chargé ensuite (liste des services) décale la section : on la recale
    // pendant 2 s, sauf si le visiteur fait défiler lui-même.
    const observer = new ResizeObserver(() => target.scrollIntoView({ behavior: 'instant' }))
    observer.observe(document.body)
    const stop = () => observer.disconnect()
    const timer = setTimeout(stop, 2000)
    window.addEventListener('wheel', stop, { once: true })
    window.addEventListener('touchstart', stop, { once: true })
    return () => {
      clearTimeout(timer)
      stop()
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
    }
  }, [pathname, hash])

  return null
}
