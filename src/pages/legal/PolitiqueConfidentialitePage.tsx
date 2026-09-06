import { LegalLayout, P, Section, Ul } from '../../components/layout/LegalLayout'

export function PolitiqueConfidentialitePage() {
  return (
    <LegalLayout
      subtitle="Protection des données"
      title="Politique de Confidentialité & RGPD"
      updated="29 juin 2026"
    >
      <Section title="1. Responsable du traitement">
        <P>
          Le responsable du traitement des données personnelles collectées via ce site est :
          RepaTek, dont le siège social est situé à Les Ulis, France (coordonnées complètes
          disponibles dans les Mentions Légales).
        </P>
        <P>
          Pour toute question relative à la protection de vos données, vous pouvez nous contacter
          à l'adresse : <strong>repatekcontact@gmail.com</strong>
        </P>
      </Section>

      <Section title="2. Données collectées">
        <P>
          Dans le cadre de la prise de rendez-vous en ligne, nous collectons les données suivantes :
        </P>
        <Ul
          items={[
            "Nom et prénom",
            "Adresse e-mail",
            "Numéro de téléphone",
            "Description du problème technique (champ « Notes »)",
            "Service sélectionné, date et heure du rendez-vous",
          ]}
        />
        <P>
          Ces données sont fournies volontairement par l'utilisateur lors du remplissage du
          formulaire de réservation. Aucune donnée sensible au sens de l'article 9 du RGPD
          n'est collectée.
        </P>
      </Section>

      <Section title="3. Finalités et bases légales">
        <P>
          Vos données sont traitées pour les finalités suivantes :
        </P>
        <Ul
          items={[
            "Gestion et confirmation des rendez-vous — base légale : exécution d'un contrat (Art. 6.1.b RGPD)",
            "Envoi d'e-mails de confirmation et de rappel — base légale : exécution d'un contrat (Art. 6.1.b RGPD)",
            "Gestion des litiges et obligations comptables — base légale : obligation légale (Art. 6.1.c RGPD)",
            "Amélioration de la qualité du service — base légale : intérêt légitime (Art. 6.1.f RGPD)",
          ]}
        />
      </Section>

      <Section title="4. Durée de conservation">
        <P>
          Vos données personnelles sont conservées pendant les durées suivantes :
        </P>
        <Ul
          items={[
            "Données de réservation (client actif) : 3 ans à compter du dernier contact",
            "Données de facturation et pièces comptables : 10 ans (obligation légale)",
            "Données supprimées sur demande : effacement dans un délai de 30 jours ouvrés",
          ]}
        />
      </Section>

      <Section title="5. Destinataires des données">
        <P>
          Vos données sont accessibles uniquement aux personnes habilitées de RepaTek et aux
          sous-traitants techniques suivants, dans le strict cadre de leurs missions :
        </P>
        <Ul
          items={[
            "Supabase Inc. (PostgreSQL hébergé sur AWS en Irlande, Union Européenne) — stockage sécurisé des données de réservation",
            "Resend (envoi via infrastructure basée en Irlande, Union Européenne) — envoi des confirmations et rappels par e-mail",
            "Hostinger International Limited (Chypre, Union Européenne) — hébergement du site web",
          ]}
        />
        <P>
          Aucune donnée n'est vendue, louée ou cédée à des tiers à des fins commerciales.
        </P>
      </Section>

      <Section title="6. Transferts hors Union Européenne">
        <P>
          Vos données de réservation sont stockées sur des serveurs AWS situés en{' '}
          <strong>Irlande</strong>, et le site est hébergé par Hostinger International Limited,
          basée à <strong>Chypre</strong> — deux États membres de l'Union Européenne. Aucun
          transfert de vos données hors UE n'a lieu dans le cadre normal du fonctionnement du
          service.
        </P>
        <P>
          Certains de nos prestataires techniques (Supabase Inc., Resend) sont des sociétés dont
          le siège social est situé hors de l'Union Européenne. Dans la mesure où un accès
          résiduel à vos données resterait possible depuis un pays tiers dans le cadre du support
          technique de ces prestataires, un tel accès est encadré par les{' '}
          <strong>Clauses Contractuelles Types (CCT)</strong> adoptées par la Commission
          européenne (décision d'exécution 2021/914), garantissant un niveau de protection
          adéquat de vos données.
        </P>
      </Section>

      <Section title="7. Sécurité des données">
        <P>
          RepaTek met en œuvre les mesures techniques et organisationnelles appropriées pour
          protéger vos données contre tout accès non autorisé, perte, altération ou divulgation :
        </P>
        <Ul
          items={[
            "Chiffrement des données en transit (HTTPS / TLS 1.3)",
            "Chiffrement des données au repos (AES-256 via Supabase/AWS)",
            "Contrôle d'accès par Row Level Security (RLS) sur la base de données",
            "Authentification sécurisée pour l'accès à l'interface d'administration",
          ]}
        />
      </Section>

      <Section title="8. Vos droits">
        <P>
          Conformément au RGPD (Articles 15 à 22), vous disposez des droits suivants sur vos
          données personnelles :
        </P>
        <Ul
          items={[
            "Droit d'accès : obtenir une copie des données vous concernant",
            "Droit de rectification : corriger des données inexactes ou incomplètes",
            "Droit à l'effacement (« droit à l'oubli ») : demander la suppression de vos données",
            "Droit à la limitation du traitement : restreindre temporairement l'utilisation de vos données",
            "Droit d'opposition : vous opposer à un traitement basé sur l'intérêt légitime",
            "Droit à la portabilité : recevoir vos données dans un format structuré et lisible par machine",
          ]}
        />
        <P>
          Pour exercer ces droits, contactez-nous par e-mail à{' '}
          <strong>repatekcontact@gmail.com</strong> en précisant votre demande et en joignant une
          copie d'un justificatif d'identité. Nous répondons dans un délai maximum de{' '}
          <strong>30 jours calendaires</strong>.
        </P>
      </Section>

      <Section title="9. Droit de réclamation auprès de la CNIL">
        <P>
          Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d'introduire
          une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés
          (CNIL), autorité de contrôle française :
        </P>
        <Ul
          items={[
            "Site web : www.cnil.fr",
            "Adresse postale : CNIL, 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07",
          ]}
        />
      </Section>

      <Section title="10. Cookies">
        <P>
          Ce site n'utilise <strong>aucun cookie publicitaire ni cookie de traçage tiers</strong>.
          Seuls des cookies techniques strictement nécessaires au fonctionnement du service
          (session d'authentification administrateur) peuvent être utilisés. Ces cookies ne
          nécessitent pas de consentement au sens de l'article 82 de la loi Informatique et
          Libertés.
        </P>
      </Section>

      <Section title="11. Modifications">
        <P>
          RepaTek se réserve le droit de modifier la présente politique de confidentialité
          à tout moment. La date de dernière mise à jour est indiquée en haut de cette page.
          En cas de modification substantielle, les utilisateurs seront informés par tout moyen
          approprié.
        </P>
      </Section>
    </LegalLayout>
  )
}
