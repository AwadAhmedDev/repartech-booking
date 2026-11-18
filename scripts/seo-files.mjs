// Génère dist/sitemap.xml et dist/.htaccess après le build, à partir des services actifs en base :
// chaque service actif a sa page /services/<slug> listée dans le plan du site et servie par le serveur.
// Usage : VITE_SUPABASE_URL=… VITE_SUPABASE_ANON_KEY=… node scripts/seo-files.mjs
import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'

const SITE = 'https://repatek.fr'
const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key } = process.env
if (!url || !key) throw new Error('VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis')

// Même règle que src/lib/slug.ts
const slugify = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
assert.equal(slugify('Réinstallation de système (Windows / macOS)'), 'reinstallation-de-systeme-windows-macos')

// Échec = déploiement interrompu : mieux vaut garder l'ancien site qu'en publier un sans pages services.
const res = await fetch(`${url}/rest/v1/services?select=name&is_active=eq.true&order=name`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
})
if (!res.ok) throw new Error(`Supabase a répondu ${res.status}`)
const slugs = (await res.json()).map((s) => slugify(s.name)).filter(Boolean)
assert.ok(slugs.length > 0, 'aucun service actif trouvé')

const pages = [
  ['/', '1.0'],
  ...slugs.map((s) => [`/services/${s}`, '0.8']),
  ['/faq', '0.6'],
  ...['mentions-legales', 'confidentialite', 'cgu', 'cgv'].map((p) => [`/${p}`, '0.2']),
]
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, prio]) => `  <url><loc>${SITE}${p}</loc><priority>${prio}</priority></url>`).join('\n')}
</urlset>
`,
)

writeFileSync(
  'dist/.htaccess',
  `# Fichier généré par scripts/seo-files.mjs au déploiement
# Adresse inconnue : vraie réponse 404 (et non la page d'accueil) pour Google
ErrorDocument 404 /404.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  # Une seule adresse officielle : www.repatek.fr -> repatek.fr
  RewriteCond %{HTTP_HOST} ^www\\.repatek\\.fr$ [NC]
  RewriteRule ^(.*)$ https://repatek.fr/$1 [R=301,L]
  RewriteRule ^index\\.html$ - [L]
  # Seules les pages qui existent dans l'application sont servies par index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(faq|mentions-legales|confidentialite|cgu|cgv|services/(${slugs.join('|')})|admin(/.*)?)/?$ /index.html [L]
</IfModule>
# Pages HTML toujours revalidées (évite d'anciennes versions après un déploiement)
<FilesMatch "\\.html$">
  Header set Cache-Control "no-cache"
</FilesMatch>
# En-têtes de sécurité. Nouvelle source externe (images, API, script) : l'ajouter à la CSP.
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
  Header always set X-Frame-Options "DENY"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self'; connect-src 'self' ${url} ${url.replace('https://', 'wss://')}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
</IfModule>
`,
)

// Fichiers de /assets : leur nom change à chaque version, on peut les garder 1 an en cache.
writeFileSync(
  'dist/assets/.htaccess',
  `<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`,
)

console.log(`sitemap.xml (${pages.length} pages) et .htaccess générés ; services : ${slugs.join(', ')}`)
