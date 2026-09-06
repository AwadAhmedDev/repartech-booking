import { LegalLayout, P, Section, Ul } from '../../components/layout/LegalLayout'

export function MentionsLegalesPage() {
  return (
    <LegalLayout
      subtitle="Informations légales"
      title="Mentions Légales"
      updated="29 juin 2026"
    >
      <Section title="1. Éditeur du site">
        <P>
          Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la Confiance
          dans l'Économie Numérique (LCEN), les présentes mentions légales concernent le site web
          accessible à l'adresse du présent service.
        </P>
        <Ul
          items={[
            'Raison sociale : RepaTek',
            'Forme juridique : Auto-entrepreneur',
            'SIRET :',
            'Siège social : 1 avenue de Saintonge, 91940 Les Ulis',
            'Email : repatekcontact@gmail.com',
            'Téléphone : +33 7 49 87 16 52',
            'Directeur de la publication : Aden DAHER OKIEH',
          ]}
        />
      </Section>

      <Section title="2. Hébergement">
        <P>
          Le site est hébergé par les prestataires suivants :
        </P>
        <Ul
          items={[
            'Hébergement web : Hostinger International Limited, 61 Lordou Vironos str., 6023 Larnaca, Chypre — hostinger.com',
            'Base de données et authentification : Supabase Inc. (infrastructure hébergée sur des serveurs AWS situés en Irlande, Union Européenne) — supabase.com',
          ]}
        />
      </Section>

      <Section title="3. Propriété intellectuelle">
        <P>
          L'ensemble du contenu publié sur ce site (textes, graphiques, logos, images, icônes)
          est la propriété exclusive de RepaTek ou fait l'objet d'une autorisation d'utilisation.
          Toute reproduction, distribution, modification ou utilisation à des fins commerciales sans
          autorisation écrite préalable est strictement interdite.
        </P>
      </Section>

      <Section title="4. Responsabilité">
        <P>
          RepaTek s'efforce de maintenir les informations publiées sur ce site aussi exactes et
          à jour que possible. Toutefois, la société ne peut garantir l'exactitude, la complétude
          ou l'actualité des informations diffusées. En conséquence, l'utilisateur reconnaît utiliser
          ces informations sous sa seule responsabilité.
        </P>
        <P>
          RepaTek ne saurait être tenu responsable des dommages directs ou indirects résultant
          de l'utilisation du site ou de l'impossibilité d'y accéder.
        </P>
      </Section>

      <Section title="5. Liens hypertextes">
        <P>
          Le site peut contenir des liens vers des sites tiers. RepaTek n'exerce aucun contrôle
          sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques
          en matière de protection des données personnelles.
        </P>
      </Section>

      <Section title="6. Droit applicable">
        <P>
          Les présentes mentions légales sont soumises au droit français. En cas de litige, les
          tribunaux compétents de Paris seront seuls habilités à connaître du différend.
        </P>
      </Section>
    </LegalLayout>
  )
}
