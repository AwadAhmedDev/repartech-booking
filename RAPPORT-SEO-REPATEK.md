# Rapport SEO – repatek.fr

**Date :** 16 novembre 2026. **Objectif :** apparaître dans Google comme sur la capture envoyée (fiche locale avec nom, catégorie, adresse, horaires, note et avis, photos, boutons « Site Web », « Nous appeler », « Itinéraire »).

## 1. Ce qu'il faut savoir sur la capture

L'encadré de la capture n'est **pas** fabriqué par le site web. C'est la **fiche Google Business Profile** (ancien « Google My Business ») de l'entreprise :

| Élément de la capture | D'où il vient |
|---|---|
| Nom, catégorie (« Magasin d'informatique »), adresse | Fiche Google Business Profile |
| Horaires (« Fermé · Ouvre à… ») | Fiche Google Business Profile |
| Note 4,2 ★ et 893 avis | Avis Google laissés par de vrais clients |
| Photos de l'atelier | Photos ajoutées sur la fiche |
| Boutons Appeler / Itinéraire / Site Web | Téléphone, adresse et site de la fiche |
| Titre bleu « Réparation écran 2h sans RDV » | Balise `<title>` du site web |

Le site aide la fiche, mais **sans fiche Google Business Profile, ce type de résultat n'apparaîtra jamais**. C'est l'action n° 1, et elle ne peut être faite que par le propriétaire (vérification par Google).

## 2. État avant intervention

Mesures Lighthouse sur le site en ligne. L'ordre des notes est : Performance / Accessibilité / Bonnes pratiques / SEO.
- **Mobile** : 79 / 95 / 100 / 92
- **Ordinateur** : 94 / 93 / 100 / 92

Problèmes trouvés :
- **Titre de page** : « RepaTek » seulement, sans métier ni ville.
- **Balises absentes** :
  - aucune URL canonique ;
  - aucune balise de partage (Facebook, WhatsApp, LinkedIn) ni image d'aperçu ;
  - aucune « fiche entreprise » lisible par Google (données structurées schema.org).
- **`robots.txt` et `sitemap.xml` inexistants** : le site renvoyait la page d'accueil à leur place, d'où 18 erreurs signalées par Lighthouse.
- **Fausse page 404** : une adresse inexistante affichait l'accueil avec le code 200, ce que Google voit comme du contenu en double.
- **`www.repatek.fr` non redirigé** vers `repatek.fr` : deux adresses pour le même site.
- **Horaires différents à trois endroits**, alors que Google pénalise les informations incohérentes :
  - bandeau et accueil : « Lun – Sam 9h – 18h » ;
  - pied de page : samedi 10h – 16h ;
  - réservation (la vraie valeur) : samedi 10h – 15h.
- **Google Fonts** :
  - il bloquait l'affichage pendant 1,3 s sur mobile ;
  - il envoyait l'adresse IP des visiteurs à Google sans consentement, ce qui pose un risque RGPD.
- **Images trop lourdes** : environ 600 Ko de trop sur mobile.
- **Contrastes de texte** insuffisants à plusieurs endroits.
- **Textes alternatifs trompeurs** : des photos de banque d'images (Unsplash) étaient décrites comme « Technicien RepaTek ».

## 3. Ce qui a été fait (dans le code, pas encore en ligne)

| Point | Détail |
|---|---|
| Titre et description | « Réparation informatique Les Ulis (91) – Dépannage PC \| RepaTek », avec une description qui cite les services et l'Essonne |
| URL canonique | Une par page, réglée automatiquement |
| Titre propre à chaque page | Accueil, mentions légales, CGU, CGV, confidentialité |
| Admin exclu de Google | `noindex` sur l'administration et la connexion, `/admin` interdit dans `robots.txt` |
| Fiche entreprise schema.org (LocalBusiness) | Nom, adresse, téléphone, email, horaires, zone desservie (Les Ulis, Essonne), fourchette de prix. **Aucune fausse note ni faux avis.** |
| Réseaux sociaux | Balises Open Graph et Twitter, image d'aperçu 1200 × 630 créée |
| Icônes | Favicon SVG + PNG 32 px + icône Apple 180 px |
| `robots.txt` et `sitemap.xml` | Créés (5 pages) |
| Vraie page 404 | Page personnalisée avec réponse 404 pour les adresses inconnues |
| `www` → sans `www` | Redirection 301 vers `repatek.fr` |
| Horaires harmonisés | Lun – Ven 9h – 18h, Sam 10h – 15h, partout (= horaires de la réservation) |
| Polices | Hébergées avec le site : plus de Google Fonts, plus rapide, conforme RGPD |
| Images | Taille réduite (800 px au lieu de 1200, 1280 au lieu de 1600), image principale chargée en priorité |
| Accessibilité | Contrastes corrigés, numéros décoratifs ignorés par les lecteurs d'écran |
| Textes alternatifs | Les photos de banque d'images ne sont plus présentées comme l'équipe RepaTek |

**Résultat mesuré** sur la version corrigée, sur mon PC :
- **Mobile** : **87 / 100 / 100 / 100**
- **Ordinateur** : **97 / 100 / 100 / 100**

En ligne, la performance devrait être un peu meilleure, car Hostinger compresse les fichiers.

## 4. Ce qui manque encore (par priorité)

### Priorité 1 – à faire par toi (pas du code)

1. **Créer et vérifier la fiche Google Business Profile** sur https://business.google.com :
   - catégorie principale « Service de réparation d'ordinateurs », catégorie secondaire « Assistance informatique » ;
   - nom, adresse, téléphone et horaires **exactement** comme sur le site (Lun – Ven 9h – 18h, Sam 10h – 15h) ;
   - si tu n'accueilles pas de clients à l'adresse (service à domicile seulement), masque l'adresse et indique une **zone desservie** (Les Ulis, Orsay, Palaiseau, Gif-sur-Yvette…) ;
   - site web : https://repatek.fr ; ajoute tes services et leurs prix ;
   - **de vraies photos** : atelier, outils, toi au travail, logo. Pas de photos de banque d'images ;
   - envoie-moi ensuite le lien de la fiche, je l'ajouterai à la fiche entreprise du site (champ `sameAs`).
2. **Obtenir des avis Google** :
   - demande-les aux clients satisfaits, avec le lien « Demander des avis » de la fiche ;
   - réponds à chaque avis ;
   - ne jamais acheter ni inventer d'avis : c'est interdit (pratique commerciale trompeuse) et Google sanctionne.
3. **Google Search Console** (https://search.google.com/search-console) :
   - vérifie le domaine `repatek.fr` ;
   - envoie le plan du site `https://repatek.fr/sitemap.xml` ;
   - demande l'indexation de l'accueil.
4. **Mêmes coordonnées partout** : PagesJaunes, Bing Places, Apple Business Connect (Plans), page Facebook. Nom, adresse, téléphone et horaires doivent être identiques au caractère près.

### Priorité 2 – contenu (le plus gros levier pour le référencement naturel)

5. **Le site n'a qu'une page de contenu.** Google classe des pages, pas des sites. Il faut :
   - **une page par service** : « Récupération de données », « Suppression de virus », « Passage au SSD », « Réparation PC portable »… avec prix, déroulé et questions fréquentes ;
   - **des pages par ville proche**, à condition d'y intervenir vraiment : « Dépannage informatique à Orsay », « … à Palaiseau » ;
   - **une FAQ** avec les vraies questions des clients.
6. **Une promesse claire dans le titre**, comme le concurrent (« Réparation écran 2h sans RDV »), à choisir parmi ce que tu tiens vraiment. Par exemple « Diagnostic offert, intervention sous 24 h aux Ulis ».
7. **Un email professionnel** (`contact@repatek.fr` au lieu d'une adresse Gmail) : plus de confiance pour les clients et pour Google.

### Priorité 3 – technique (à moyen terme)

8. **Pré-rendu des pages** : aujourd'hui, le contenu est affiché par JavaScript. Google sait le lire, mais plus lentement et moins bien que du HTML déjà prêt. Quand il y aura plusieurs pages, il faudra générer du HTML statique par page.
9. **Horaires écrits en dur** dans le site (bandeau, accueil, pied de page) et dans la fiche entreprise : si tu les changes dans l'admin, il faut aussi les changer dans le code. On pourra les lire depuis la base plus tard.
10. **Découpage du code** : la partie admin est chargée par tous les visiteurs (environ 90 Ko inutiles). On peut la charger seulement quand on va dans l'admin.

## 5. Vérifications à faire après la mise en ligne

Ces points ne peuvent être testés que sur le serveur Hostinger :
- `https://www.repatek.fr` redirige vers `https://repatek.fr` (code 301) ;
- `https://repatek.fr/nimporte-quoi` répond 404 avec la page personnalisée ;
- `https://repatek.fr/robots.txt` et `/sitemap.xml` s'affichent ;
- l'aperçu de partage est correct dans le validateur Facebook (https://developers.facebook.com/tools/debug/) ;
- la fiche entreprise est reconnue par l'outil de test des résultats enrichis (https://search.google.com/test/rich-results).

## 6. Mise en ligne (16 novembre 2026, commit 392cba0)

Vérifié sur le site en ligne après déploiement :
- `www.repatek.fr` → `repatek.fr` (301) et `http` → `https` (301) : OK
- adresse inconnue → page « Page introuvable » avec code 404 : OK
- `robots.txt` (après vidage du cache Hostinger) et `sitemap.xml` : OK
- titre, URL canonique, image de partage et fiche entreprise présents dans la page : OK
- plus aucun appel à Google Fonts : OK

Lighthouse sur https://repatek.fr (Performance / Accessibilité / Bonnes pratiques / SEO) :
- **Mobile** : **89 / 100 / 100 / 100** (avant : 79 / 95 / 100 / 92)
- **Ordinateur** : **96 / 100 / 100 / 100** (avant : 94 / 93 / 100 / 92)

## 7. Pages de contenu (16 novembre 2026, pas encore en ligne)

Le point 5 de la priorité 2 est fait, sauf les pages par ville :

| Ajout | Détail |
|---|---|
| **11 pages services** | `/services/<nom-du-service>`, une par service actif. Elles reprennent le prix et la durée de la base, ajoutent un texte d'introduction qui cite Les Ulis, les situations où faire appel au service, le déroulé et des questions fréquentes. Bouton « Réserver ce service » qui ouvre la réservation avec le service déjà choisi. |
| **Page FAQ** | `/faq` : 10 questions (zone, horaires, devis, diagnostic, prix, paiement, garantie, annulation, données). Les réponses viennent des CGV et du site. |
| **Données structurées** | Chaque page service déclare un « Service » schema.org rattaché à la fiche entreprise, avec la fourchette de prix. |
| **Liens** | « En savoir plus » sur chaque carte service de l'accueil ; FAQ dans le menu et le pied de page. Les liens du menu fonctionnent désormais aussi depuis les autres pages. |
| **Plan du site automatique** | Au déploiement, `scripts/seo-files.mjs` lit les services actifs en base et génère `sitemap.xml` (17 pages) et les règles serveur. Un service ajouté ou désactivé dans l'admin est pris en compte au déploiement suivant. |

**Lighthouse mobile, sur mon PC** (Performance / Accessibilité / Bonnes pratiques / SEO) :
- page service : **97 / 100 / 100 / 100**
- FAQ : **100 / 100 / 100 / 100**
- accueil : **97 / 100 / 100 / 100**

**À relire par toi :** les textes de `src/data/serviceContent.ts` et la FAQ (`src/pages/FaqPage.tsx`). Je n'ai rien promis qui ne soit déjà dans le site ou les CGV, mais c'est toi qui connais ton métier.

**Pas fait :** les pages par ville. Dis-moi dans quelles villes tu interviens vraiment et je les ajoute. Une page pour une ville où tu ne vas pas serait trompeuse et peut être pénalisée par Google.

**Après la mise en ligne :** dans Google Search Console, renvoie le plan du site `https://repatek.fr/sitemap.xml`.
