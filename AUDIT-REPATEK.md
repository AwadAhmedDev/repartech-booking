# Audit complet – repatek.fr

**Date :** 17 novembre 2026.
**Périmètre :**
- site en ligne : https://repatek.fr ;
- code du dépôt `repartech-booking` ;
- base Supabase ;
- e-mails automatiques.

**Légende :** 🔴 à corriger vite · 🟠 important · 🟢 amélioration · ✅ conforme

## Résumé

Le site est **rapide, accessible et bien référencé techniquement** (voir les scores Lighthouse plus bas). La base de données est correctement protégée.

Les vrais manques sont **juridiques** (SIRET absent, médiateur non désigné) et **métier** : le formulaire de réservation ne demande pas **l'adresse du client**, alors que le technicien se déplace chez lui.

| Domaine | Note | En bref |
|---|---|---|
| Performance | 🟢 | 78–100 selon les pages ; le JavaScript ralentit un peu les mobiles |
| Accessibilité | ✅ | 100 sur toutes les pages testées |
| Référencement technique | ✅ | Titres, plan du site, fiche entreprise, pages services, vraie 404 |
| Référencement local | 🟠 | Fiche Google Business Profile et avis à créer par le client |
| Juridique | 🔴 | SIRET vide, médiateur non nommé, lien européen obsolète |
| Réservation (métier) | 🔴 | Pas d'adresse d'intervention demandée |
| Sécurité | 🟠 | Base bien protégée ; en-têtes de sécurité et anti-spam à ajouter |
| Maintenance | 🟢 | Dépendances à mettre à jour, code admin chargé par tous les visiteurs |

## 1. Performance et qualité (Lighthouse, site en ligne)

Ordre des notes : Performance / Accessibilité / Bonnes pratiques / SEO.

| Page | Mobile | Ordinateur |
|---|---|---|
| Accueil | 78 / 100 / 100 / 100 | 87 / 100 / 100 / 100 |
| Page service (SSD) | 85 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| FAQ | 83 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |
| CGV | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

Ces mesures ont été faites depuis mon PC. La note de performance varie de ±10 points d'une mesure à l'autre : la veille, l'accueil mobile était à 89.

**Accessibilité, bonnes pratiques et SEO sont à 100 partout.** L'affichage du contenu principal (LCP) est rapide, entre 0,2 et 2,4 s, et le décalage de mise en page est quasi nul.

🟠 **Ce qui fait baisser la performance mobile : le JavaScript.** Le téléphone met jusqu'à 1 s à exécuter le code avant que la page réagisse (TBT de 990 ms sur l'accueil). Deux corrections possibles :
- charger l'admin à part (voir plus bas) ;
- servir les photos à la bonne taille : environ 280 Ko économisables sur ordinateur.

Points forts :
- fichiers compressés (Brotli) ;
- polices hébergées sur le site ;
- images redimensionnées ;
- pas de décalage de mise en page ;
- réponses du serveur en environ 0,1 s.

🟢 **Code de l'administration chargé par tous les visiteurs.** Le site envoie un seul fichier JavaScript de 580 Ko (150 Ko compressé), qui contient tout l'espace admin. Le charger seulement sur `/admin` réduirait d'environ 100 Ko ce que télécharge chaque visiteur.

🟢 **Durée de cache des fichiers trop courte.** Ces fichiers ne sont gardés que 7 jours en cache. Comme leur nom change à chaque version, on peut les mettre en cache 1 an.

## 2. Référencement (SEO)

✅ Ce qui est en place :
- titre et description avec « Les Ulis (91) » ;
- URL canonique sur chaque page ;
- 11 pages services et une FAQ ;
- `sitemap.xml` (17 pages) généré à chaque déploiement, et `robots.txt` ;
- fiche entreprise et services décrits pour Google (schema.org) ;
- image de partage pour les réseaux sociaux ;
- redirections `www` et `http` vers `https://repatek.fr` ;
- vraie page 404 ;
- administration exclue de Google.

🟠 **Fiche Google Business Profile inexistante.** C'est elle qui produit l'encadré avec la note, les avis, les horaires et le bouton « Appeler ». Elle est à créer par le client, avec les avis (voir la procédure déjà donnée).

🟠 **Google Search Console.** Vérifier que le domaine y est ajouté et que le plan du site a été envoyé.

🟢 **Pages par ville.** À créer pour les villes où le technicien se déplace vraiment. Liste à fournir par le client.

🟢 **Site affiché par JavaScript.** Google lit le contenu, mais plus lentement que du HTML déjà prêt. Générer une page HTML par adresse au moment du build (pré-rendu) accélérerait l'indexation des pages services.

🟢 **Double redirection.** `http://www.repatek.fr` passe par `https://www…` avant `https://repatek.fr`, soit deux redirections au lieu d'une. Impact faible.

## 3. Juridique (obligations légales)

🔴 **Mentions légales : SIRET vide.** La ligne « SIRET : » n'a pas de numéro.
- La mention est obligatoire pour un auto-entrepreneur (loi LCEN et Code de commerce).
- Le nom de l'entrepreneur doit aussi être suivi de **« EI »** ou « Entrepreneur individuel » (obligatoire depuis mai 2022).

🔴 **CGV : médiateur de la consommation non désigné.** Le texte renvoie au « médiateur compétent » sans le nommer.
- La loi impose d'indiquer **le nom et l'adresse du site** du médiateur auquel l'entrepreneur a adhéré (article L.616-1 du Code de la consommation).
- L'adhésion à un médiateur est payante, à partir de quelques dizaines d'euros par an. Elle est à faire par le client.

🟠 **CGV : lien vers la plateforme européenne des litiges.** Les CGV citent `ec.europa.eu/consumers/odr`, une plateforme **fermée depuis le 20 juillet 2025**. La mention est à retirer.

🟠 **Adresse e-mail Gmail.** `repatekcontact@gmail.com` n'est pas illégal, mais une adresse `contact@repatek.fr` inspire plus confiance aux clients et à Google. Hostinger la fournit avec le domaine.

✅ Conformes :
- **politique de confidentialité** : prestataires cités, pas de cookie publicitaire, donc pas de bandeau cookies nécessaire ;
- **CGU et CGV** : paiement sur place, garantie 30 jours, rétractation de 14 jours ;
- **hébergeurs** cités.

## 4. Réservation et métier

🔴 **L'adresse d'intervention n'est pas demandée.** Le formulaire demande seulement :
- le nom ;
- l'e-mail ;
- le téléphone ;
- une description du problème.

Le technicien se déplace chez le client et doit donc l'appeler à chaque fois pour savoir où aller. Il faut un champ **« Adresse d'intervention »** (ou au moins « Ville »), affiché ensuite dans l'admin et dans les e-mails.

🟠 **Le créneau ne tient pas compte du trajet.** Deux rendez-vous peuvent s'enchaîner sans temps de trajet, par exemple 10 h à Orsay puis 10 h 45 à Massy. Une marge entre deux rendez-vous serait à ajouter, réglable dans l'admin.

🟠 **Demandes non traitées.** 4 rendez-vous sont « en attente » depuis juin–septembre 2026. Ce sont probablement des tests : à confirmer, annuler ou supprimer dans l'admin.

🟢 **Aucune réservation ces 30 derniers jours.** Normal tant que la fiche Google n'existe pas : c'est elle qui apportera les visites.

🟢 **Pas de demande d'avis automatique.** Un e-mail « Merci, laissez-nous un avis » pourrait partir quand un rendez-vous est marqué « terminé ». Le lien est à récupérer une fois la fiche Google créée.

## 5. Sécurité

✅ Ce qui est bien fait :
- **protection d'accès à la base (RLS)** active sur toutes les tables : un visiteur ne peut lire ni les rendez-vous ni les coordonnées des clients ;
- **réservation contrôlée côté serveur** : horaires d'ouverture, jours bloqués, délai minimum, pas de chevauchement de créneaux, 3 demandes maximum par e-mail et par 24 h ;
- l'e-mail « rendez-vous confirmé » n'est envoyable que par l'administrateur connecté ;
- aucune clé secrète dans le code ;
- HTTPS forcé ;
- `/.env` et `/.git` inaccessibles.

🟠 **En-têtes de sécurité absents.** Ce sont des instructions envoyées au navigateur. Il manque :
- `Strict-Transport-Security` : impose HTTPS ;
- `X-Content-Type-Options` ;
- `Referrer-Policy` ;
- `Permissions-Policy` ;
- la protection contre l'affichage du site dans une page étrangère (`frame-ancestors`).

Elles s'ajoutent en quelques lignes dans les règles du serveur générées au déploiement.

🟠 **Pas d'anti-spam sur le formulaire.** Il n'y a ni champ piège ni vérification anti-robot. Un robot qui change d'adresse e-mail peut contourner la limite de 3 demandes et remplir l'agenda de fausses réservations. Recommandé :
- un champ piège invisible ;
- Cloudflare Turnstile (gratuit, sans cookie).

🟠 **Champs non limités côté serveur.** La fonction de réservation ne vérifie ni la longueur des champs (nom, description) ni le format de l'e-mail et du téléphone. Le contrôle n'existe que dans le navigateur, qu'on peut contourner. À ajouter dans la fonction `book_appointment`.

🟠 **E-mail de demande reçue appelable par n'importe qui.** Cette fonction n'exige pas de connexion. Elle vérifie que le rendez-vous existe, mais pas qu'elle n'a pas déjà été appelée. Quelqu'un qui connaît un numéro de rendez-vous peut la rappeler et faire renvoyer l'e-mail plusieurs fois. Correctif : n'envoyer qu'une fois par rendez-vous.

🟢 **Protection contre les mots de passe divulgués désactivée** (Supabase Auth). Elle concerne le compte administrateur. À activer dans Supabase, si l'offre le permet.

🟢 **Remarques Supabase sans risque immédiat :**
- l'extension `btree_gist` est dans le schéma public ;
- les règles d'accès appellent `auth.uid()` d'une façon peu optimisée ;
- il manque un index sur `appointments.service_id`.

Sans effet visible avec peu de données, mais correctifs simples.

## 6. Code et maintenance

✅ La compilation TypeScript passe sans erreur. Le linter ne relève que 2 avertissements mineurs. Aucun `console.log` ne traîne.

🟠 **2 failles « élevées » et quelques « modérées » signalées par `npm audit`.** Elles concernent :
- les outils de build : vite, postcss, browserslist ;
- un mode de React Router (RSC) que le site n'utilise pas.

Le risque réel pour les visiteurs est faible, mais un `npm audit fix` les corrige toutes.

🟢 **Dépendances un peu en retard.** Ce sont des mises à jour mineures : React 19.3, Vite 8.3, Supabase 2.119, lucide-react.

🟢 **Horaires écrits en dur** dans le bandeau, l'accueil, le pied de page et la fiche entreprise. Si le client les change dans l'admin, il faut aussi modifier le code.

## 7. Plan d'action proposé

| # | Action | Qui | Priorité |
|---|---|---|---|
| 1 | Fournir le SIRET, ajouter « EI » au nom | Client, puis moi | 🔴 |
| 2 | Adhérer à un médiateur de la consommation et me donner ses coordonnées | Client, puis moi | 🔴 |
| 3 | Ajouter l'adresse d'intervention au formulaire, à l'admin et aux e-mails | Moi | 🔴 |
| 4 | Retirer le lien vers la plateforme européenne des litiges (ODR) | Moi | 🟠 |
| 5 | Créer la fiche Google Business Profile et demander des avis | Client | 🟠 |
| 6 | Ajouter les en-têtes de sécurité, l'anti-spam et la validation serveur | Moi | 🟠 |
| 7 | E-mail de demande reçue envoyé une seule fois par rendez-vous | Moi | 🟠 |
| 8 | Lancer `npm audit fix` et mettre à jour les dépendances | Moi | 🟠 |
| 9 | Traiter les 4 rendez-vous en attente | Client | 🟠 |
| 10 | Prévoir une marge de trajet entre deux rendez-vous | Moi | 🟢 |
| 11 | Créer les pages par ville (liste à fournir) | Client, puis moi | 🟢 |
| 12 | Créer l'adresse `contact@repatek.fr` | Client | 🟢 |
| 13 | Charger l'admin à part, allonger le cache, pré-rendre les pages | Moi | 🟢 |

**Non testé :** je n'ai pas fait de vraie réservation sur le site en ligne, pour ne pas créer de faux rendez-vous ni envoyer d'e-mails. Le parcours a été vérifié en local jusqu'au choix du créneau.

## 8. Corrections faites le 18 novembre 2026

| # | Point de l'audit | Ce qui a été fait | Où |
|---|---|---|---|
| 3 | Adresse d'intervention | Nouveau champ obligatoire dans le formulaire. L'adresse apparaît dans l'admin (lien Google Maps), dans les e-mails et dans le récapitulatif. | Site, base, e-mails |
| — | **Bug trouvé pendant les corrections** | Les visiteurs ne voyaient jamais les créneaux déjà pris : la protection de la base les cachait, donc tout paraissait libre et le refus n'arrivait qu'à l'envoi. Les créneaux occupés sont maintenant lus par une fonction qui ne renvoie que les heures, sans aucune donnée client. | Base, site |
| 10 | Temps de trajet | Marge de 30 minutes entre deux rendez-vous, réglable dans Admin → Paramètres. Le site et le serveur appliquent la même règle. | Base, site, admin |
| 6 | Validation côté serveur | Contrôle du nom, de l'e-mail, du téléphone, de la longueur de l'adresse et des remarques. Plafond de 10 demandes par heure en plus de la limite de 3 par e-mail. | Base |
| 6 | Anti-spam | Champ piège invisible : un robot qui le remplit voit un faux succès, rien n'est enregistré. | Site |
| 7 | E-mail « demande reçue » | Envoyé une seule fois par rendez-vous, et seulement dans l'heure qui suit la demande. | Fonction Supabase |
| 6 | En-têtes de sécurité | HSTS, nosniff, Referrer-Policy, Permissions-Policy, interdiction d'affichage dans une autre page, et politique de contenu (CSP) limitée au site, à Supabase et aux images Unsplash. | Règles serveur |
| 13 | Cache | Fichiers `/assets` gardés 1 an en cache (leur nom change à chaque version). | Règles serveur |
| 13 | Admin chargé à part | Les pages admin ne sont plus téléchargées par les visiteurs. Gain modeste : le reste du fichier principal, ce sont React et Supabase, qui sont nécessaires. | Site |
| 4 | Plateforme européenne des litiges | Mention retirée des CGV. | CGV |
| 8 | `npm audit` | 0 faille restante. | Dépendances |

**Déjà en ligne :**
- la migration de la base (`0006_home_service_booking.sql`) ;
- les deux fonctions d'e-mail.

Les deux sont compatibles avec la version actuelle du site. Le reste sera en ligne après la publication.

**Vérifié :**
- dans une transaction annulée, sans aucune donnée réelle créée : refus des champs invalides, de la marge de trajet non respectée et des plages de dates trop longues ;
- test automatique du calcul des créneaux avec la marge ;
- parcours de réservation en local, sous la même politique de sécurité que le serveur : services, images, polices, créneaux, erreurs du formulaire et piège à robots, sans aucune erreur dans la console ;
- page de connexion admin.

**Non vérifié :**
- l'envoi réel d'un e-mail ;
- les pages admin une fois connecté (je ne me connecte pas avec le compte réel).

**Restent à faire, avec des informations du client :**
- SIRET et mention « EI » (point 1) ;
- médiateur de la consommation (point 2) ;
- pages par ville (point 11) ;
- e-mail professionnel (point 12) ;
- clés Cloudflare Turnstile, si on veut un anti-robot plus fort que le champ piège.
