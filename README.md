# RepaTek — réservation de dépannage informatique à domicile

**Site en ligne : https://repatek.fr**

Site vitrine et système de réservation pour un technicien informatique qui se déplace chez ses clients (dépannage, réinstallation, récupération de données, assistance). Le client choisit une prestation et un créneau, indique son adresse, et le technicien valide le rendez-vous depuis un back-office sécurisé.

## Fonctionnalités

**Côté client**
- Présentation des prestations, avec une page dédiée par service (`/services/<service>`) et une FAQ.
- Réservation en 4 étapes : prestation → date et créneau → coordonnées et adresse d'intervention → confirmation.
- Créneaux calculés selon les horaires, les jours fermés, la durée de la prestation, le délai de prévenance et une **marge de trajet** entre deux rendez-vous.
- E-mail de réception de la demande, puis e-mail de confirmation quand le technicien valide.
- Pages légales : mentions légales, confidentialité, CGU, CGV.

**Back-office** (`/admin`)
- Tableau de bord, rendez-vous (validation, annulation, adresse avec lien Google Maps).
- Prestations (prix, durée, activation), horaires d'ouverture, jours fermés, réglages (délai de prévenance, intervalle des créneaux, marge de trajet).

## Qualité

| Lighthouse (site en ligne, 22/11/2026) | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| Ordinateur | 97 | 100 | 100 | 100 |
| Mobile | 87 | 100 | 100 | 100 |

- **Référencement local** : balises title/description et données structurées (JSON-LD) par page, plan du site généré à chaque déploiement à partir des prestations actives.
- **Sécurité** : Row Level Security sur toutes les tables, réservation uniquement via une fonction serveur qui revalide tout, en-têtes HTTP (HSTS, CSP, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options), champ piège anti-robots, limites de demandes.
- **Tests automatisés** : 17 tests (`npm test`, lanceur intégré à Node.js, aucune dépendance) sur le calcul des créneaux (horaires, jours fermés, délai de prévenance, chevauchements, marge de trajet, rendez-vous annulés) et les fonctions utilitaires. Ils tournent dans la CI avant chaque déploiement : un test en échec bloque la mise en ligne. Côté base, la règle anti-chevauchement reste garantie par une contrainte PostgreSQL.

## Stack technique

| Couche | Technologies |
|---|---|
| Front-end | React 19, TypeScript, Vite 8, React Router 7, Tailwind CSS 4 |
| Back-end | Supabase : PostgreSQL, Auth, Row Level Security, fonctions SQL, Edge Functions |
| E-mails | [Resend](https://resend.com), envoyés par les Edge Functions |
| Déploiement | GitHub Actions → Hostinger (site statique), à chaque push sur `main` |

## Comment fonctionne la réservation

`src/lib/availability.ts` calcule les créneaux **affichés** au visiteur à partir de :

- `business_hours` pour le jour choisi (jour fermé : aucun créneau) ;
- `blocked_dates` (jour bloqué : aucun créneau) ;
- la durée de la prestation (`duration_minutes`) ;
- `business_settings` : intervalle entre créneaux, délai de prévenance, marge de trajet ;
- les créneaux déjà pris, lus par la fonction `get_busy_slots()` qui ne renvoie que des heures, jamais de données client.

Ce calcul sert seulement à proposer des créneaux cohérents : **ce n'est pas lui qui protège**. La réservation passe par la fonction SQL `book_appointment()` (`security definer`), seul moyen pour un visiteur de créer un rendez-vous. Elle :

- recalcule l'heure de fin à partir de la vraie durée ;
- revérifie horaires, jours fermés, délai de prévenance et marge de trajet ;
- valide chaque champ ;
- limite les demandes : 3 par e-mail sur 24 h, 10 par heure au total.

La contrainte d'exclusion `appointments_no_overlap` est la dernière barrière : la base refuse tout rendez-vous qui en chevauche un autre, quel que soit le code qui l'insère. L'interface l'affiche comme `SlotConflictError` (codes PostgreSQL `23505` / `23P01`).

Aucune politique publique ne permet de lire `appointments` : l'écran de confirmation est construit à partir des données saisies, sans relecture.

## Installation

### 1. Variables d'environnement

Copier `.env.example` en `.env.local` et renseigner le projet Supabase :

```
VITE_SUPABASE_URL=https://VOTRE_PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-publique
```

`VITE_SUPABASE_URL` est l'URL de base du projet, sans `/rest/v1`. Ces deux valeurs sont publiques par nature (elles sont dans le JavaScript livré au navigateur) : la protection repose entièrement sur la Row Level Security.

### 2. Base de données

Dans le SQL Editor de Supabase, exécuter dans l'ordre :

1. [`supabase/schema.sql`](./supabase/schema.sql) : tables (`services`, `appointments`, `business_hours`, `blocked_dates`, `business_settings`, `admin_users`), politiques RLS, fonction `is_admin()`, contrainte anti-chevauchement, fonction `book_appointment()`, données de départ (horaires, réglages, catalogue de prestations) ;
2. [`supabase/migrations/0006_home_service_booking.sql`](./supabase/migrations/0006_home_service_booking.sql) : adresse d'intervention, marge de trajet, `get_busy_slots()` et limite horaire. Cette migration n'est pas encore intégrée à `schema.sql`.

Les migrations `0001` à `0005` sont déjà comprises dans `schema.sql` : elles restent comme historique.

### 3. Edge Functions et e-mails

```bash
supabase functions deploy send-booking-confirmation
supabase functions deploy send-appointment-confirmed
```

Créer un compte Resend, vérifier le domaine d'envoi, puis définir dans Supabase → Edge Functions → Secrets :

| Secret | Obligatoire | Rôle |
|---|---|---|
| `RESEND_API_KEY` | Oui | Sans elle, les fonctions répondent `500` et aucun e-mail ne part. |
| `ADMIN_NOTIFICATION_EMAIL` | Conseillé | Reçoit une copie de chaque nouvelle demande. |
| `FROM_EMAIL` | Non | Par défaut `noreply@repatek.fr`. |
| `BUSINESS_NAME` | Non | Par défaut `RepaTek`. |

`send-appointment-confirmed` vérifie elle-même que l'appelant est administrateur et ne fait jamais confiance au destinataire envoyé dans la requête.

### 4. Premier administrateur

1. Supabase → Authentication → Users → **Add user** (e-mail et mot de passe).
2. Copier l'identifiant (UUID) du compte, puis exécuter :

   ```sql
   insert into public.admin_users (user_id) values ('UUID_DU_COMPTE');
   ```

3. Se connecter sur `/admin/login`.

Le statut d'administrateur dépend uniquement de la table `admin_users`, jamais de l'adresse e-mail.

### 5. Lancer en local

```bash
npm install
npm run dev      # développement
npm run lint     # oxlint
npm test         # tests automatisés (Node.js 22 ou plus)
npm run build    # vérification TypeScript + build de production
npm run preview  # prévisualiser le build
```

## Déploiement

Chaque push sur `main` lance [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) :

1. tests automatisés, puis build de l'application ;
2. génération de `sitemap.xml` et `.htaccess` par `scripts/seo-files.mjs`, à partir des prestations actives (redirections des routes de l'application, en-têtes de sécurité, cache) ;
3. envoi de l'archive à Hostinger par son API.

Le secret GitHub `HOSTINGER_API_TOKEN` est requis (hPanel → API). Le site est statique : aucun serveur Node.js n'est nécessaire chez l'hébergeur.

## Structure

```
src/
  lib/          client Supabase, appels typés, calcul des créneaux, SEO, nouvelle tentative réseau
  types/        types des tables, identiques à supabase/schema.sql
  contexts/     session administrateur, réglages de l'entreprise
  components/   layout, accueil, réservation (4 étapes), back-office
  pages/        accueil, page service, FAQ, pages légales, back-office
supabase/
  schema.sql    schéma complet, RLS, fonctions et données de départ
  migrations/   historique des évolutions (0006 à exécuter après schema.sql)
  functions/    e-mails (Resend)
scripts/
  seo-files.mjs plan du site et règles serveur, générés au déploiement
tests/          tests automatisés (node --test)
```

## Auteur

**Awad Ahmed** — Développeur Full Stack · [LinkedIn](https://www.linkedin.com/in/awad-dev) · [GitHub](https://github.com/AwadAhmedDev)
