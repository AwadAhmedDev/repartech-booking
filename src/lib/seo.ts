import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://repatek.fr'
const DEFAULT_TITLE = 'Réparation informatique Les Ulis (91) – Dépannage PC | RepaTek'

function setMeta(selector: string, create: () => HTMLElement, attr: string, value: string | null) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (value === null) return el?.remove()
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

// Titre, URL canonique et indexation propres à chaque page (le site est rendu côté navigateur).
export function usePageMeta(title?: string, options: { noindex?: boolean } = {}) {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = title ? `${title} | RepaTek` : DEFAULT_TITLE
    setMeta(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement('link'), { rel: 'canonical' }),
      'href',
      options.noindex ? null : `${SITE_URL}${pathname}`,
    )
    setMeta(
      'meta[name="robots"]',
      () => Object.assign(document.createElement('meta'), { name: 'robots' }),
      'content',
      options.noindex ? 'noindex, nofollow' : null,
    )
  }, [title, pathname, options.noindex])
}
