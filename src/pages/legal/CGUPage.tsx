import { LegalLayout, P, Section, Ul } from '../../components/layout/LegalLayout'

export function CGUPage() {
  return (
    <LegalLayout
      subtitle="Conditions d'utilisation"
      title="Conditions Générales d'Utilisation"
      updated="29 juin 2026"
    >
      <Section title="1. Objet">
        <P>
          Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les
          modalités et conditions d'utilisation du site web de RéparTech (ci-après « le Site »),
          ainsi que les droits et obligations des utilisateurs.
        </P>
        <P>
          Tout accès et toute utilisation du Site impliquent l'acceptation sans réserve des
          présentes CGU. RéparTech se réserve le droit de les modifier à tout moment ; les CGU
          applicables sont celles en vigueur au moment de la visite.
        </P>
      </Section>

      <Section title="2. Accès au service">
        <P>
          Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet.
          RéparTech s'efforce de maintenir le service accessible 24h/24 et 7j/7, mais ne peut
          garantir une disponibilité continue en raison d'opérations de maintenance, de mises à
          jour ou de pannes techniques indépendantes de sa volonté.
        </P>
        <P>
          RéparTech se réserve le droit de suspendre, limiter ou interrompre l'accès au Site
          à tout moment et sans préavis, notamment pour des raisons de maintenance ou de sécurité.
        </P>
      </Section>

      <Section title="3. Utilisation du service de réservation">
        <P>
          Le formulaire de réservation en ligne est mis à disposition à titre de service de
          commodité. L'utilisateur s'engage à :
        </P>
        <Ul
          items={[
            "Fournir des informations exactes, complètes et à jour lors de la prise de rendez-vous",
            "Ne pas utiliser le service à des fins frauduleuses ou illicites",
            "Ne pas perturber le fonctionnement normal du service (tentatives d'intrusion, soumissions automatisées, etc.)",
            "Prévenir RéparTech le plus tôt possible en cas d'annulation ou de modification souhaitée",
          ]}
        />
      </Section>

      <Section title="4. Propriété intellectuelle">
        <P>
          L'ensemble des éléments constituant le Site (textes, images, logos, charte graphique,
          code source, architecture) est la propriété exclusive de RéparTech ou fait l'objet d'une
          licence d'utilisation accordée à RéparTech.
        </P>
        <P>
          Toute reproduction, représentation, modification, publication, transmission ou
          utilisation de tout ou partie des éléments du Site, par quelque procédé que ce soit,
          sans l'autorisation écrite préalable de RéparTech, est strictement interdite et
          constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code
          de la propriété intellectuelle.
        </P>
      </Section>

      <Section title="5. Responsabilité de l'utilisateur">
        <P>
          L'utilisateur est seul responsable de l'utilisation qu'il fait du Site et des
          informations qu'il y renseigne. Il s'engage à ne pas publier de contenu illicite,
          diffamatoire, trompeur ou portant atteinte aux droits de tiers.
        </P>
      </Section>

      <Section title="6. Limitation de responsabilité de RéparTech">
        <P>
          RéparTech ne saurait être tenu responsable :
        </P>
        <Ul
          items={[
            "Des dommages résultant d'une interruption ou d'un dysfonctionnement du Site",
            "Des erreurs ou omissions dans les informations publiées sur le Site",
            "Des dommages indirects résultant de l'utilisation du Site",
            "De l'utilisation frauduleuse par des tiers des informations transmises via le formulaire",
          ]}
        />
      </Section>

      <Section title="7. Liens vers des sites tiers">
        <P>
          Le Site peut contenir des liens hypertextes vers des sites tiers. Ces liens sont
          fournis à titre informatif uniquement. RéparTech n'exerce aucun contrôle sur le contenu
          de ces sites et décline toute responsabilité quant à leur disponibilité, leur contenu
          ou leurs pratiques.
        </P>
      </Section>

      <Section title="8. Modifications des CGU">
        <P>
          RéparTech se réserve le droit de modifier les présentes CGU à tout moment. Les
          modifications prennent effet dès leur publication sur le Site. L'utilisation continue
          du Site après modification vaut acceptation des nouvelles CGU.
        </P>
      </Section>

      <Section title="9. Droit applicable et juridiction compétente">
        <P>
          Les présentes CGU sont régies par le droit français. En cas de litige relatif à leur
          interprétation ou à leur exécution, et à défaut de résolution amiable dans un délai
          de 30 jours, les tribunaux compétents de Paris seront seuls habilités à connaître
          du différend.
        </P>
      </Section>
    </LegalLayout>
  )
}
