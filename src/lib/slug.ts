// Adresse lisible d'un service : « Passage au SSD & Clonage » -> « passage-au-ssd-clonage ».
// Même règle dans scripts/seo-files.mjs (génération du sitemap au déploiement).
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
