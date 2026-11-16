// Contenu éditorial des pages services (référencement naturel).
// Clé = adresse de la page (slug du nom du service en base). Prix et durée viennent de la base.
// Règle : uniquement des faits vrais, déjà présents sur le site — aucune promesse inventée.
// Un nouveau service créé dans l'admin a quand même sa page (description de la base).

export interface ServiceContent {
  /** titre de page avec la ville, pour Google */
  seoTitle: string
  intro: string
  /** situations où faire appel au service */
  whenToCall: string[]
  faq: { q: string; a: string }[]
}

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  'diagnostic-systeme-panne': {
    seoTitle: 'Diagnostic PC et recherche de panne aux Ulis',
    intro:
      "Votre ordinateur rame, plante ou affiche un écran bleu ? Le diagnostic permet d'identifier la cause exacte du problème, matérielle ou logicielle, avant toute réparation. Vous savez ce qui ne va pas et combien coûte la réparation avant de décider.",
    whenToCall: [
      'Ordinateur très lent ou qui se fige',
      'Écrans bleus ou redémarrages inattendus',
      "PC qui ne démarre plus ou s'éteint tout seul",
      'Messages d\'erreur à répétition',
    ],
    faq: [
      {
        q: 'Le diagnostic est-il remboursé si je fais réparer ?',
        a: 'Oui : le montant du diagnostic est déduit du prix de la réparation si vous acceptez le devis.',
      },
      {
        q: 'Suis-je obligé de faire la réparation après le diagnostic ?',
        a: 'Non. Le devis est sans engagement : vous décidez après avoir connu la panne et le prix.',
      },
    ],
  },
  'desinfection-suppression-de-virus': {
    seoTitle: 'Suppression de virus et malwares aux Ulis',
    intro:
      "Publicités qui s'ouvrent seules, navigateur détourné, fichiers bloqués par un rançongiciel : nous éliminons les virus, malwares et logiciels espions, puis nous renforçons la sécurité de l'ordinateur pour éviter une nouvelle infection.",
    whenToCall: [
      "Fenêtres publicitaires ou pages qui s'ouvrent toutes seules",
      'Page d\'accueil ou moteur de recherche modifiés sans votre accord',
      'Antivirus désactivé ou alertes de sécurité',
      'Fichiers chiffrés ou demande de rançon',
    ],
    faq: [
      {
        q: 'Est-ce que je perds mes fichiers ?',
        a: "La désinfection vise à supprimer les logiciels malveillants sans toucher à vos documents. Si une réinstallation s'avère nécessaire, nous vous le disons avant.",
      },
      {
        q: 'Installez-vous un antivirus ?',
        a: "Oui, la prestation inclut le renforcement de la sécurité et le paramétrage d'un antivirus.",
      },
    ],
  },
  'passage-au-ssd-clonage': {
    seoTitle: 'Passage au SSD et clonage de disque aux Ulis',
    intro:
      "Remplacer un vieux disque dur par un SSD est l'une des améliorations les plus efficaces pour un ordinateur lent : démarrage et ouverture des logiciels beaucoup plus rapides. Votre système est cloné à l'identique, vous retrouvez vos fichiers et logiciels.",
    whenToCall: [
      'Ordinateur qui met plusieurs minutes à démarrer',
      'Disque dur bruyant ou très lent',
      'PC encore bon mais devenu poussif',
    ],
    faq: [
      {
        q: 'Le prix comprend-il le SSD ?',
        a: 'Non, le tarif affiché couvre la main-d\'œuvre et le clonage ; le SSD est en plus, selon la capacité choisie.',
      },
      {
        q: 'Vais-je devoir réinstaller mes logiciels ?',
        a: "Non : le clonage copie votre système à l'identique sur le nouveau disque, sans perte de données.",
      },
    ],
  },
  'recuperation-de-donnees-sauvegarde': {
    seoTitle: 'Récupération de données et sauvegarde aux Ulis',
    intro:
      "Photos, documents, fichiers de travail : quand un disque devient défaillant ou qu'un système ne démarre plus, nous extrayons vos fichiers importants puis mettons en place une sauvegarde automatique pour ne plus risquer de les perdre.",
    whenToCall: [
      'Disque dur qui fait des bruits anormaux',
      "Ordinateur qui ne démarre plus mais dont vous voulez les fichiers",
      'Fichiers supprimés ou inaccessibles',
      "Vous n'avez aucune sauvegarde de vos documents",
    ],
    faq: [
      {
        q: 'Que faire en attendant le rendez-vous ?',
        a: "Évitez d'utiliser le disque concerné : chaque utilisation peut aggraver une panne matérielle.",
      },
      {
        q: 'Mes données restent-elles confidentielles ?',
        a: 'Oui. Elles servent uniquement à la prestation, voir notre politique de confidentialité.',
      },
    ],
  },
  'reinstallation-de-systeme-windows-macos': {
    seoTitle: 'Réinstallation Windows et macOS aux Ulis',
    intro:
      "Quand un système est trop instable ou encombré, une réinstallation propre redonne un ordinateur sain : système d'exploitation, pilotes, vos logiciels et le transfert de vos données.",
    whenToCall: [
      'Windows ou macOS instable malgré les réparations',
      'Ordinateur reçu d\'occasion à remettre à zéro',
      'Changement de disque ou de système',
    ],
    faq: [
      {
        q: 'Mes données sont-elles conservées ?',
        a: 'Oui, la prestation inclut le transfert complet de vos données.',
      },
      {
        q: 'Réinstallez-vous mes logiciels ?',
        a: 'Oui, la réinstallation de vos logiciels est comprise.',
      },
    ],
  },
  'reparation-remplacement-de-composants': {
    seoTitle: 'Réparation et changement de pièces PC aux Ulis',
    intro:
      "Alimentation, mémoire RAM, carte graphique, carte mère, écran ou batterie de portable : nous remplaçons les pièces défectueuses ou dépassées pour remettre votre ordinateur en état.",
    whenToCall: [
      "Ordinateur qui ne s'allume plus",
      'Écran de portable cassé ou batterie qui ne tient plus',
      'Besoin de plus de mémoire ou d\'une meilleure carte graphique',
    ],
    faq: [
      {
        q: 'Les pièces sont-elles comprises dans le prix ?',
        a: 'Non, le tarif affiché est hors pièces. Le prix total vous est donné dans le devis, avant intervention.',
      },
      {
        q: 'La réparation est-elle garantie ?',
        a: 'Oui, nos réparations sont garanties 30 jours, en plus des garanties légales (voir nos CGV).',
      },
    ],
  },
  'maintenance-preventive': {
    seoTitle: 'Nettoyage et maintenance de PC aux Ulis',
    intro:
      "La poussière et une pâte thermique usée font chauffer l'ordinateur, qui ralentit et s'use plus vite. La maintenance préventive comprend un dépoussiérage interne, le remplacement de la pâte thermique, des tests de charge et la mise à jour des pilotes.",
    whenToCall: [
      'Ventilateur bruyant en permanence',
      'Ordinateur qui chauffe ou ralentit en jeu ou en montage',
      "PC jamais nettoyé depuis plusieurs années",
    ],
    faq: [
      {
        q: 'À quelle fréquence faire une maintenance ?',
        a: "Cela dépend de l'environnement (poussière, animaux) et de l'usage ; un ventilateur bruyant ou une chauffe inhabituelle sont de bons signaux.",
      },
    ],
  },
  'optimisation-nettoyage-systeme': {
    seoTitle: 'Optimisation et accélération de PC aux Ulis',
    intro:
      "Fichiers inutiles, programmes qui se lancent au démarrage, réglages par défaut : nous nettoyons et optimisons le système pour retrouver un ordinateur plus réactif, sans changer de matériel.",
    whenToCall: [
      'Démarrage de plus en plus long',
      'Disque presque plein',
      'Nombreux logiciels inconnus installés',
    ],
    faq: [
      {
        q: "Et si l'optimisation ne suffit pas ?",
        a: "Si le ralentissement vient du matériel (vieux disque dur par exemple), nous vous le disons ; le passage au SSD est alors souvent la meilleure solution.",
      },
    ],
  },
  'configuration-reseau-wi-fi': {
    seoTitle: 'Installation Wi-Fi et réseau informatique aux Ulis',
    intro:
      "Wi-Fi qui ne couvre pas toute la maison, imprimante introuvable, partage de fichiers à mettre en place : nous installons et configurons routeurs, répéteurs, imprimantes réseau et stockage partagé (NAS) en toute sécurité.",
    whenToCall: [
      'Zones sans Wi-Fi dans le logement ou le bureau',
      "Imprimante qui ne s'affiche pas sur les ordinateurs",
      'Besoin de partager des fichiers entre plusieurs postes',
    ],
    faq: [
      {
        q: 'Intervenez-vous pour les petites entreprises ?',
        a: 'Oui, nous intervenons pour les particuliers comme pour les entreprises.',
      },
    ],
  },
  'assistance-depannage-a-distance': {
    seoTitle: 'Dépannage informatique à distance',
    intro:
      "Pour un bug logiciel, une messagerie à configurer ou un blocage simple, une prise en main à distance règle souvent le problème rapidement, sans déplacement. Le tarif s'entend par tranche de 30 minutes.",
    whenToCall: [
      'Messagerie ou logiciel à configurer',
      'Message d\'erreur bloquant',
      'Question pratique sur votre ordinateur',
    ],
    faq: [
      {
        q: 'Comment se passe une intervention à distance ?',
        a: 'Avec votre accord, le technicien se connecte à votre ordinateur via un logiciel de prise en main à distance et intervient pendant que vous suivez à l\'écran.',
      },
    ],
  },
  'assemblage-pc-sur-mesure': {
    seoTitle: 'Montage de PC sur mesure aux Ulis',
    intro:
      "PC de bureau, gaming ou création : nous vous conseillons sur le choix des composants, assemblons la machine, soignons le rangement des câbles, réglons le BIOS et installons le système.",
    whenToCall: [
      'Vous avez acheté vos composants et voulez un montage propre',
      'Vous hésitez sur la configuration adaptée à votre usage',
    ],
    faq: [
      {
        q: 'Les composants sont-ils inclus ?',
        a: "Non, la prestation couvre le conseil, le montage et l'installation ; les composants sont à part.",
      },
    ],
  },
}
