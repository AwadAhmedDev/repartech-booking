import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const SITE_URL = 'https://repatek.fr'
const DEFAULT_TITLE = 'Réparation informatique Les Ulis (91) – Dépannage PC | RepaTek'
const DEFAULT_DESCRIPTION =
  "Réparation d'ordinateurs et dépannage informatique aux Ulis (Essonne) : diagnostic, suppression de virus, passage au SSD, récupération de données. Service à domicile et devis gratuit."

function setMeta(selector: string, create: () => HTMLElement, attr: string, value: string | null) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (value === null) return el?.remove()
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

// Titre, description, URL canonique et indexation propres à chaque page
// (le site est rendu côté navigateur, ces balises sont donc mises à jour ici).
export function usePageMeta(
  title?: string,
  options: { noindex?: boolean; description?: string } = {},
) {
  const { pathname } = useLocation()
  const { noindex, description } = options
  useEffect(() => {
    document.title = title ? `${title} | RepaTek` : DEFAULT_TITLE
    setMeta(
      'meta[name="description"]',
      () => Object.assign(document.createElement('meta'), { name: 'description' }),
      'content',
      description ?? DEFAULT_DESCRIPTION,
    )
    setMeta(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement('link'), { rel: 'canonical' }),
      'href',
      noindex ? null : `${SITE_URL}${pathname}`,
    )
    setMeta(
      'meta[name="robots"]',
      () => Object.assign(document.createElement('meta'), { name: 'robots' }),
      'content',
      noindex ? 'noindex, nofollow' : null,
    )
  }, [title, pathname, noindex, description])
}

// Données structurées propres à une page (retirées quand on la quitte).
export function useJsonLd(data: object | null) {
  const json = data ? JSON.stringify(data) : null
  useEffect(() => {
    if (!json) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = json
    document.head.appendChild(script)
    return () => script.remove()
  }, [json])
}
