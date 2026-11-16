import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/seo'

// Réponses tirées des CGV et des informations du site : à tenir à jour si elles changent.
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Où intervenez-vous ?',
    a: "RepaTek est basé aux Ulis (91940) : je me déplace à domicile ou dans vos locaux, aux Ulis et en Essonne. Il n'y a pas d'atelier où déposer votre appareil. Les petits problèmes logiciels peuvent aussi être réglés à distance.",
  },
  {
    q: "Quels sont vos horaires ?",
    a: 'Du lundi au vendredi de 9h à 18h, et le samedi de 10h à 15h.',
  },
  {
    q: 'Comment prendre rendez-vous ?',
    a: "Choisissez votre service et un créneau libre directement sur le site, ou appelez-nous. Un récapitulatif de votre demande s'affiche à la fin de la réservation.",
  },
  {
    q: 'Le devis est-il gratuit ?',
    a: "Oui. Un devis précis est établi après le diagnostic, sans frais ni engagement. Les travaux ne commencent qu'après votre accord.",
  },
  {
    q: 'Le diagnostic est-il payant ?',
    a: "Le premier diagnostic, qui sert à établir le devis, est offert. Pour une panne difficile, l'analyse approfondie (service « Diagnostic système & panne ») est payante, mais son montant est déduit du prix de la réparation si vous acceptez le devis.",
  },
  {
    q: 'Les prix affichés sont-ils définitifs ?',
    a: "Ce sont des tarifs forfaitaires indicatifs, TTC. Pour les réparations matérielles, les pièces (SSD, composants…) s'ajoutent à la main-d'œuvre ; le prix total figure dans le devis.",
  },
  {
    q: 'Comment payer ?',
    a: "Le paiement se fait à la fin de la prestation, en espèces, par carte bancaire (Visa, Mastercard) ou par virement pour un devis supérieur à 200 €. Aucun paiement n'est demandé en ligne.",
  },
  {
    q: 'Les réparations sont-elles garanties ?',
    a: "Oui, chaque réparation est garantie 30 jours, en plus des garanties légales. Les détails figurent dans nos CGV.",
  },
  {
    q: 'Puis-je annuler mon rendez-vous ?',
    a: "Oui. Prévenez-nous dès que possible par téléphone ou par e-mail. Les consommateurs disposent aussi d'un délai de rétractation de 14 jours (voir nos CGV).",
  },
  {
    q: 'Mes données sont-elles en sécurité pendant la réparation ?',
    a: "Nous n'accédons à vos fichiers que si l'intervention l'exige, et ils ne servent qu'à cela. Une sauvegarde avant intervention reste recommandée.",
  },
]

export function FaqPage() {
  usePageMeta('Questions fréquentes – Réparation informatique aux Ulis', {
    description:
      'Zone d\'intervention, horaires, devis gratuit, paiement, garantie 30 jours : les réponses aux questions fréquentes sur nos dépannages informatiques aux Ulis (91).',
  })

  return (
    <div className="bg-white pt-24 pb-28 lg:pt-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">FAQ</span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Questions fréquentes
        </h1>
        <p className="mt-3 text-slate-500">Tout ce qu'il faut savoir avant de faire réparer votre ordinateur.</p>

        <dl className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="py-5">
              <dt className="font-display font-semibold text-slate-900">{q}</dt>
              <dd className="mt-2 leading-relaxed text-slate-700">{a}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-slate-700">
          Une autre question ?{' '}
          <Link to="/#booking" className="font-medium text-blue-700 underline">
            Prenez rendez-vous
          </Link>{' '}
          ou consultez nos <Link to="/cgv" className="font-medium text-blue-700 underline">conditions générales de vente</Link>.
        </p>
      </div>
    </div>
  )
}
